import UserModel from "@/backend/database/model"
import { NextResponse } from "next/server";
import MongoDbConnection from "@/backend/database/connect";
import { ObjectId } from "mongodb";

MongoDbConnection()

//! To prevent dynamic-server-error that is caused by getServerSession
export const dynamic = "force-dynamic"

//! This route to get the user's full information & check if the clicked contact didn't delete this user from their contacts
export async function GET(request: Request) {
    try {

        let url = new URL(request.url)
        let userId: string | null = url.searchParams.get("userId")
        let connectionId: any | null = url.searchParams.get("connectionId") // refers to the RoomConnectionId

        if (!connectionId || !userId) throw Error("The data wasn't provided")

        let user: FullUser | null = await UserModel.findById(userId);

        if (!user?.name) throw Error("user not found from development prospective this is impossible")

        //! to check that if the other user has deleted the current user from their connections
        let connection: Connection[] = user.connections.filter(connection => {
            let id: string = connection.RoomConnectionId
            if (connectionId === id) return connection
        })

        if(!connection[0]?.email) throw Error("The connection doesn't seem to be found")
        let TheirEmail = connection[0].email;

        let result = await UserModel.findOne({ email: TheirEmail, "connections.email": user.email }, { email: 1 })

        //! to check that if the other user has deleted the current user from their connections
        if (result?.email) return NextResponse.json({ user, connection: connection[0], yes: true })

        return NextResponse.json({ user, connection: connection[0], yes: false })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })

    }
}
