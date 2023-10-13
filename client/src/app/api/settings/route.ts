import { NextResponse } from "next/server";
import { cookies } from "next/dist/client/components/headers";

import MongoDbConnection from "@/backend/database/connect";
import { ObjectId } from "mongodb";

import { deleteObject, getStorage, ref } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/backend/config/firebase";

import UserModel from "@/backend/database/model"
import storyModel from "@/backend/database/storyModel";
import accountsModel from "@/backend/database/accountsModel"

MongoDbConnection()
const firebaseApp = initializeApp(firebaseConfig);


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

//! Delete a user
export async function DELETE(request: Request) {
    try {

        let { email, imageName, _id }: { [key: string]: string } = await request.json()
        let storage = getStorage()

        //? Delete The user from mongoDB -1-
        let deletedUser = await UserModel.deleteOne({ email })

        if (deletedUser.deletedCount !== 1) throw Error("Couldn't delete the user")

        //! Check if the user has saved their image in our database or not 
        if (imageName) {
            //? Delete The Image from Firebase if existed -2-
            let deleted = await deleteObject(ref(storage, `user-images/${imageName}`))
        }

        //? Delete the story from the stories model if existed -3-
        let deletedStory = await storyModel.findOneAndDelete({ user: email }, { storyName: 1 })

        //? Delete the story's image from Firebase -4-
        if (deletedStory?.storyName) await deleteObject(ref(storage, `stories/${deletedStory.storyName}`))

        //TODO I tried very hard to delete the account immediately using the userId with _id but I couldn't.
        //TODO To solve it just find a way to delete the account using its userId value of type ObjectId
        //TODO That is way I am using this grotesque way of doing it
        let accounts = await accountsModel.find({}, { userId: 1, _id: 1 })

        let TheAccount: any[] = accounts.filter(account => {
            let id = String(account.userId)
            if (id === _id) return account
        })
        let deletedAccount = await accountsModel.deleteOne({ _id: String(TheAccount[0]._id) })

        //? Log them out after successful deletion -6-
        cookies().set("authToken", 'null', { maxAge: 1 })

        return NextResponse.json({ success: "user has been deleted successfully" })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }
}