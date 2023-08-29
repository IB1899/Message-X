import { connect } from "mongoose";

export default async function MongoDbConnection(): Promise<boolean> {

    try {
        let uri = process.env.MONGODB_URI as string

        if (!uri) throw Error("You didn't provide the mongodb uri")

        await connect(uri)

        console.log("Connected to mongoDb");

        //* To make sure that only if we connected run the route handler
        return true

    }
    catch (err: any) {
        console.log(err.message);
        return false
    }
}