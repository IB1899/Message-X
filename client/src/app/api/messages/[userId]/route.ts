import UserModel from "@/backend/database/model"
import { NextResponse } from "next/server";
import MongoDbConnection from "@/backend/database/connect";

MongoDbConnection()


//! This route to get the user's full information after they login 
export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {
        let user = await UserModel.findById(params.userId);

        return NextResponse.json({ success: "success", user })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })

    }
}
