
import UserModel from "@/backend/database/model"
import { NextResponse } from "next/server"
import MongoDbConnection from "@/backend/database/connect"
import { v4 as uuid } from "uuid"

MongoDbConnection()

//! Searching for a user. for the '/main' page
export async function GET(request: Request) {
    try {
        let url = new URL(request.url)

        let searchWord: string | null = url.searchParams.get("searchWord")

        //* the email of the current user
        let email: string | null = url.searchParams.get("email")

        if (!searchWord || !email) return NextResponse.json({ failed: "No search word provided" })

        //* Check that the user we're searching for doesn't already exist in the current user's connection
        let currentUserConnections: null | { connections: any[] } = await UserModel.findOne({ email }, { connections: 1 })

        let cancel = false
        currentUserConnections?.connections.forEach(connection => {
            if (searchWord === connection.name || searchWord === connection.username) {
                cancel = true
                return
            }
        })
        if (cancel) return NextResponse.json({ no: "The user is already in your contacts" })

        //* Find by name
        let user = await UserModel.findOne({ name: searchWord }, { _id: 1, name: 1, image: 1, story: 1, email: 1, description: 1, username: 1, phoneNumber: 1 })

        //* find by username if name not found
        searchWord = searchWord?.toLowerCase()
        if (!user?.name) user = await UserModel.findOne({ username: searchWord }, { _id: 1, name: 1, image: 1, story: 1, email: 1, description: 1, username: 1, phoneNumber: 1 })

        if (!user?.name) return NextResponse.json({ failed: "user not found" })

        return NextResponse.json({ success: "yes", user })
    }
    catch (err: any) {
        return NextResponse.json({ failed: err.message })
    }
}

//! Adding users to the contact of each other
export async function PUT(request: Request) {
    try {

        //* The current user's data
        let { name, email, id, image, description, phoneNumber, username, story, ...rest } = await request.json()

        //* The other user's data
        let { OName, OEmail, O_id, OImage, ODescription, OPhoneNumber, OUsername, OStroy } = rest

        //! Before adding each user to the contacts of each other we check first if the current user does exist in the other user's contacts
        //! And if they do exist we only add the other user to the current user contacts.
        //! since this current user can't add a user that is already in their contacts, so it's one way problem.

        //* This query returns the entire parent document with all the connections if both criteria are met
        // let check = await UserModel.findOne({ email: OEmail, "connections.email": email }) 

        //* This query returns the parent's _id and the request connection
        let check: { _id: string, connections: Connection[] } | null = await UserModel.findOne({ email: OEmail, "connections.email": email }, { "connections.$": 1 })

        //! If the current user already exists in the other user's contacts
        if (check?._id) {

            //? Adding the other user to the current user's connections
            let x = await UserModel.updateOne({ email }, {
                $push: {
                    connections: {
                        RoomConnectionId: check.connections[0].RoomConnectionId,
                        notification: true,
                        name: OName,
                        email: OEmail,
                        id: O_id,
                        image: OImage,
                        description: ODescription,
                        username: OUsername,
                        story: OStroy,
                        phoneNumber: OPhoneNumber,
                    }
                }
            })

            return NextResponse.json({ success: "Only the other user was added to the contacts of the current user" })
        }
        else {

            //* Generating a unique RoomConnectionId
            let RoomConnectionId = uuid()

            //? Adding the other user to the current user's connections
            let x = await UserModel.updateOne({ email }, {
                $push: {
                    connections: {
                        RoomConnectionId,
                        notification: true,
                        name: OName,
                        email: OEmail,
                        id: O_id,
                        image: OImage,
                        description: ODescription,
                        username: OUsername,
                        story: OStroy,
                        phoneNumber: OPhoneNumber
                    }
                }
            })

            if (x.modifiedCount !== 1) throw Error("failed")

            //? Adding the current user o the other user's connections
            let y = await UserModel.updateOne({ email: OEmail }, {
                $push: {
                    connections: {
                        RoomConnectionId,
                        notification: true,
                        name,
                        username,
                        email,
                        id,
                        image,
                        description,
                        story,
                        phoneNumber
                    }
                }
            })

            if (y.modifiedCount !== 1) throw Error("failed")

            return NextResponse.json({ success: "both users are added to the contacts of each others" })
        }
    }
    catch (err: any) {
        return NextResponse.json({ failed: err.message })
    }
}

//! Deleting a contact
export async function DELETE(request: Request) {
    try {

        let { email, connectionId } = await request.json()
        if (!email || !connectionId) throw Error("The email wasn't provided")

        //* deleting a nested document by Id
        let result = await UserModel.updateOne({ email }, { $pull: { connections: { _id: connectionId } } })

        if (result.modifiedCount !== 1) throw Error("Couldn't delete the contact")

        return NextResponse.json({ success: result })
    }
    catch (err: any) {
        return NextResponse.json({ failed: err.message })
    }
}