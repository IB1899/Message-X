import UserModel from "@/backend/database/model"
import { NextResponse } from "next/server";
import MongoDbConnection from "@/backend/database/connect";
import { cookies } from "next/dist/client/components/headers";
import { BsArrowReturnLeft } from "react-icons/bs";

MongoDbConnection()


//! This route is to log users out
export async function GET() {
    try {
        cookies().set("authToken", 'null', { maxAge: 1 })

        return NextResponse.json({ success: "yes" })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }
}


//! This route updates the user's settings
export async function PUT(request: Request) {
    try {
        let { email, nameOfValue, theValue } = await request.json()

        let result = await UserModel.updateOne({ email }, { [nameOfValue]: theValue })

        return NextResponse.json(result)
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }

}

//! This route updates the user's profile details
export async function POST(request: Request) {
    try {
        let { email, originalUsername, username, description, country, gender, age, phoneNumber }: { [key: string]: string } = await request.json()

        if (!email) throw Error("The email wasn't provided")

        username = username.toLowerCase()

        //? Verify that the name has actually changed
        if (username !== originalUsername) {

            //? Verify that the username is not taken. O(n)
            let isUsernameExists = await UserModel.findOne({ username }, { name: 1 })
            if (isUsernameExists?.name) throw Error("The username is already taken please use another one")
        }

        //* 1- Update the user's information in their document
        let update = await UserModel.updateOne({ email }, { username, country, gender, age, phoneNumber, description })

        if (update.modifiedCount === 1) {

            //* 2- Get the connections of the current user
            let connections: { connections: Connection[], _id: String } | null = await UserModel.findOne({ email }, { connections: 1 })

            //* 3- The connections contain the data of the users that the current user is connected with. O(n) and not O(n^3)
            connections?.connections.forEach(async (connection) => {

                let { email: OtherUserEmail } = connection

                //* 4- Update the current user's details in the connections of the other user
                let update = await UserModel.updateOne({ email: OtherUserEmail, 'connections.email': email },
                    { $set: { "connections.$.username": username, "connections.$.description": description, "connections.$.phoneNumber": phoneNumber } }
                )

                if (update.modifiedCount !== 1) throw Error("Can't update your data to the other users")
            })

            return NextResponse.json({ success: "The information has been updated successfully" })
        }
        else throw Error("Something went wrong")
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }

}