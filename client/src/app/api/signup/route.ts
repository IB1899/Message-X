import MongoDbConnection from "@/backend/database/connect"
import UserModel from "@/backend/database/model"
import { NextResponse } from "next/server"

MongoDbConnection()

export let POST = async (request: Request) => {
    try {

        let data = await request.json()

        if (!data?.email) throw Error("The data wasn't provided")

        let user = await UserModel.create(data)

        return NextResponse.json(user)
    }
    catch (err: any) {
        console.log(err.message);

        let Errors = { error: "" }

        if(err.code === 11000){
            Errors.error = "validation"
        }
        else{
            Errors.error = err.message
        }

        return NextResponse.json(Errors)
    }
}