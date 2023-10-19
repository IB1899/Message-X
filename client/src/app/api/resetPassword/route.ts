import MongoDbConnection from "@/backend/database/connect"
import UserModel from "@/backend/database/model"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import AccountModel from "@/backend/database/accountsModel"
import { ObjectId } from "mongodb"

MongoDbConnection()

export let POST = async (request: Request) => {
    try {
        let { email } = await request.json()
        if (!email) throw Error("The data wasn't provided")

        let user: { email: string, _id: ObjectId, password?: string } | null = await UserModel.findOne({ email }, { password: 1, _id: 1, email: 1 })
        if (!user) throw Error("There's no such a user associated with this email ")

        //! If the user has an account, but was created through OAuth
        if (!user?.password) {
            let users = await AccountModel.find()

            let result = users.filter(one => one.userId.toString() === user!._id.toString() ? one : null)
            console.log(`result:`, result)

            throw Error(`This user account was created using ${result[0].provider} . please log in through ${result[0].provider} `)
        }

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
            subject: "Rest your password",

            html: `<!DOCTYPE html><html lang="en"><head><title>Reset your Password </title><style>body{ text-align:center;
                background:black; color:white; display:flex; flex-direction:column; align-items:center;} body p{ width:50%;}
                body a{ text-decoration:none; color:limegreen; border:1.5px solid limegreen; padding:6px 12px; border-radius:10px;
                margin-top:15px;} </style></head><body><h1>This is an email from the Messages app </h1><p>it is sent to you
                because you are trying to reset your account password in our application. please click the link down blow to
                rest your password. If you are not trying to reset your password, just ignore this email. </p><a 
                href="http://localhost:3000/reset-password?&token=${token}" >Reset Your Password </a></body></html>
            `
        })

        if (result.messageId) {
            return NextResponse.json({ success: "We sent you an email to reset your password" })
        }
        else {
            return NextResponse.json({ failed: "something went wrong" })
        }

        return NextResponse.json({ success: "success" })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }
}

export async function PUT(request: Request) {
    try {
        let { email, newPassword } = await request.json()
        if (!email || !newPassword) throw Error("The data wasn't provided")

        //! Hashing the new password before updating it
        let salt = await bcrypt.genSalt();
        let HashedPassword = await bcrypt.hash(newPassword, salt)

        let result = await UserModel.updateOne({ email }, { password: HashedPassword })

        if (result.modifiedCount === 1) {
            return NextResponse.json({ success: "Your password has been updated." })
        }
        return NextResponse.json({ failed: "Something went wrong" })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }

}