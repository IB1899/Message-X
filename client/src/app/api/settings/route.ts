import UserModel from "@/backend/database/model"
import { NextResponse } from "next/server";
import MongoDbConnection from "@/backend/database/connect";
import { cookies } from "next/dist/client/components/headers";

MongoDbConnection()


//! This route to log users out
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


//! This route to update the user settings
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