import UserModel from "@/backend/database/model"
import { NextRequest, NextResponse } from "next/server";
import MongoDbConnection from "@/backend/database/connect";

MongoDbConnection()


//! This route to get the user's full information after they login 
export async function GET(request: NextRequest) {
    try {

        let url = new URL(request.url)

        let email: string | null = url.searchParams.get("email")

        if (!email) throw Error("no email provided")

        let users = await UserModel.find({}, { _id: 1, name: 1, image: 1, story: 1, email: 1, description: 1, username: 1, phoneNumber: 1 }).limit(7);

        //! To make sure that we don't send the user to him/her self
        users = users.filter(user => user.email !== email)

        return NextResponse.json({ success: "success", users })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })

    }
}
