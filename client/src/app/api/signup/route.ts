import MongoDbConnection from "@/backend/database/connect"
import UserModel from "@/backend/database/model"
import { NextRequest, NextResponse } from "next/server"
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { firebaseConfig } from "@/backend/config/firebase"
import { initializeApp } from "firebase/app";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid"

MongoDbConnection()
const firebaseApp = initializeApp(firebaseConfig);

//! NOTE: please open the Low-Level Design to understand the signup process

//! Step 1 Validating The Users's information
export let POST = async (request: NextRequest) => {
    try {
        //* The signup data that we receive from the frontend 
        let { name, email, password, username }: { name: string, email: string, password: string, username: string } = await request.json()

        if (!name || !email || !password || !username) { return NextResponse.json({ failed: "The user's information wasn't provided" }) }

        username = username.toLowerCase()

        //? Verify that the email is not taken. O(n)
        let isEmailExists = await UserModel.findOne({ email }, { name: 1 })
        if (isEmailExists?.name) throw Error("The email already exists please login, or use another email")

        //? Verify that the name is not taken. O(n)
        let isNameExists = await UserModel.findOne({ name }, { name: 1 })
        if (isNameExists?.name) throw Error("The name already exists, please use another one")

        //? Verify that the username is not taken. O(n)
        let isUsernameExists = await UserModel.findOne({ username }, { name: 1 })
        if (isUsernameExists?.name) throw Error("The username already exists, please use another one")

        //* The user's information is valid, and they continue to step -2-
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_AUTHENTICATIONER!,
                pass: process.env.EMAIL_AUTHENTICATIONER_PASS! //! To allow nodemailer to send emails from this account
            }
        })

        //? Creating a JWT to secure the operation
        let token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: 60 * 2 })

        let result = await transporter.sendMail({
            from: process.env.EMAIL_AUTHENTICATIONER!,
            to: email,
            sender: "Messages App",
            subject: "Verify Your Email",

            //! Be carful the link must be in the same fucking line
            html: `<!DOCTYPE html><html lang="en"><head><title>Verify Your Email</title><style>body{ text-align:
                center; background: black; color: white; display: flex; flex-direction: column; align-items:
                center;} body p{ width: 50%;} body a{ text-decoration: none; color: limegreen; border: 1.5px
                solid limegreen; padding: 6px 12px; border-radius: 10px; margin-top: 15px;} </style></head>
                <body><h1>This is an email from the Messages app</h1><p>it is sent to you because you are 
                trying to create an account in our application. please click the link down blow to verify 
                your email. If you are not trying to create an account in the Messages app, just ignore 
                this email. </p><a href="http://localhost:3000/api/signup?&token=${token}&email=${email}&password=${password}&name=${name}&username=${username}" >Verify Your Email </a></body></html>
            `
        })

        //! Step 2 Sending a verification email to the user
        if (result.messageId) {
            return NextResponse.json({ success: "A verification email has been sent to your email. Please verify your email and click verify" })
        }
        else {
            return NextResponse.json({ failed: "something went wrong" })
        }

    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }
}

//! Step 3: Runs when the user verifies their email Creating the user in the database
export let GET = async (request: Request) => {

    let origin = request.headers.get("origin")!
    //* To allow everyone to access this route
    let headers = {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
    try {
        let url = new URL(request.url)
        let name = url.searchParams.get("name")
        let username = url.searchParams.get("username")
        let email = url.searchParams.get("email")
        let password = url.searchParams.get("password")
        let token = url.searchParams.get("token")

        if (token && name && email && password) {

            //* verifying the jwt
            let isVerified = jwt.verify(token, process.env.JWT_SECRET!)

            //* The user has verified their email successfully under the 2 minute
            if (isVerified) {

                //* O(1)
                let result = await UserModel.create({ name, username, email, password, notification: true, status: true, privateAccount: false, publicStories: true })

                return NextResponse.redirect("http://localhost:3000/status?message=verified", { status: 302, headers })
            }
            return NextResponse.redirect("http://localhost:3000/status?message=passedTwoMinutes", { status: 302, headers })
        }
        return NextResponse.redirect("http://localhost:3000/status?message=wentWrong", { status: 302, headers })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.redirect("http://localhost:3000/status?message=passedTwoMinutes", { status: 302, headers })
    }
}

//! Step 4. Checking The user Verified their email & Uploading the image & Authenticating the user
export let PUT = async (request: NextRequest) => {

    try {
        const formData = await request.formData()
        const email = formData.get('email') as string

        //? Verify that the user has verified his/her email. O(n)
        let result = await UserModel.findOne({ email })

        //? Verify that the user has verified his/her email
        if (!result?.name) {
            return NextResponse.json({ failed: "Please verify your email first" })
        }

        const image: any = formData.get('image')
        const buffer = Buffer.from(await image.arrayBuffer());

        //* Images are saved in firebase under this [name] therefore I must save it in mongodb as well
        let imageName = uuid() + image.name

        let storage = getStorage()

        //* Save the user's image to firebase
        let snapshot = await uploadBytesResumable(ref(storage, `user-images/${imageName}`), buffer, { contentType: image.type })
        let downloadURL = await getDownloadURL(snapshot.ref)

        let user = await UserModel.findOneAndUpdate({ email }, { image: downloadURL, imageName })

        return NextResponse.json({ success: "success", user: { name: user.name, email: user.email, _id: user._id, image: downloadURL } })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }
}