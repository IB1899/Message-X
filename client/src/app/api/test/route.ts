import { NextRequest, NextResponse } from "next/server";
import MongoDbConnection from "@/backend/database/connect";
import UserModel from "@/backend/database/model"

MongoDbConnection()
export async function POST(request: Request) {

    try {
        let data = await request.json()
        
        if(!data) throw Error("no data provided")

        let user = await UserModel.create(data)

        console.log(user, "user");        
    
        return NextResponse.json({yes:"works"})
    }
    catch(err:any){
        console.log(err.message);
        return NextResponse.json({no:"failed"})
    }
}