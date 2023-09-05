import MongoDbConnection from "@/backend/database/connect"
import UserModel from "@/backend/database/model"
import AccountModel from "@/backend/database/accountsModel"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { ObjectId } from "mongodb"

MongoDbConnection()

export let POST = async (request: Request) => {
    try {

        let { email, password } = await request.json()
        if (!email || !password) throw Error("The data wasn't provided")

        let user = await UserModel.findOne({ email }, { name: 1, password: 1 })
        if (!user?.name) throw Error("There's no such a user. please create account if you don't have one")

        //! If the user has an account, but was created through OAuth
        if (!user?.password) {
            let users = await AccountModel.find()

            let result = users.filter(one => one.userId === user._id.toString() ? one : null)

            throw Error(`This user account was created using ${result[0].provider} . please log in through ${result[0].provider} `)
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) throw Error("The password you entered is incorrect")

        return NextResponse.json({ success: "success", user })
    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }
}