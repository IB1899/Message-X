
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

        //* Generating a unique RoomConnectionId
        let RoomConnectionId = uuid()
        let notification = true;

        //? Adding the other user to the current user's connections
        let x = await UserModel.updateOne({ email }, {
            $push: {
                connections: {
                    RoomConnectionId, notification,
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

        if (x.modifiedCount === 1) {

            //? Adding the current user o the other user's connections
            let y = await UserModel.updateOne({ email: OEmail }, {
                $push: {
                    connections: {
                        RoomConnectionId,
                        notification,
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

            if (y.modifiedCount === 1) {
                return NextResponse.json({ success: "user add" })
            }
            throw Error("failed")
        }
        throw Error("failed")
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