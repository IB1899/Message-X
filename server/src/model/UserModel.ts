import { Schema, connect, model } from "mongoose";
import dotenv from "dotenv"

let UserSchema = new Schema({

    //! Required
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
    },

    imageName: {
        type: String,
    },
    username: {
        unique: true,
        type: String
    },

    requests: [
        {
            name: String,
            email: String,
            id: String,
            image: String,

        }
    ],

    //! Necessary but not required
    connections: [
        {
            //! The connection's settings
            RoomConnectionId: String,
            notification: Boolean,

            //! The other user's info
            id: String,
            image: String,
            username: String,
            name: String,
            email: String,
            description: String,
            phoneNumber: Number,

            //! The messages
            messages: [
                {
                    from: String,
                    message: String,
                    time: String,
                    MessageType: String
                }
            ]
        }
    ],

    //! Optional
    privateAccount: Boolean,
    notification: {
        type: Boolean
    },
    status: {
        type: Boolean
    },
    publicStories: {
        type: Boolean
    },
    password: {
        type: String,
        minlength: 10
    },
    description: {
        type: String
    },
    age: {
        max: [1e3],
        type: Number
    },
    phoneNumber: {
        type: Number,
        min: [1e6]
    },
    gender: {
        type: String
    },
    country: {
        type: String
    }


}, { timestamps: true })

export let UserModel = model("user", UserSchema)

//! Accessing the env file
dotenv.config();

export let ConnectToDB = async (callback:Function) => {

    try {
        let uri = process.env.MONGODB_URI

        if (!uri) throw Error(" The mongoDB uri wasn't found ")

        await connect(uri)

        console.log("connected to DB");
        callback()
    }
    catch (err: any) {
        console.log(err.message);
    }
}