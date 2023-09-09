import UserModel from "@/backend/database/model"
import { NextResponse } from "next/server";
import MongoDbConnection from "@/backend/database/connect";

MongoDbConnection()


export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {

        
        let user = await UserModel.findById(params.userId,
            { _id: 1, image: 1, name: 1, username: 1, email: 1, story: 1, connections: 1, requests: 1, description: 1 });

        return NextResponse.json({ success: "success", user })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })

    }

}