import { Schema } from "mongoose";

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
    username:String,

    requests:[
        {
            name:String,
            email:String,
            id:String,
            image:String,
        
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
            username:String,
            name: String,
            email: String,
            description: String,
            story:String,

            //! The messages
            messages: [
                {
                    from: String,
                    message: String,
                    time: String
                }
            ]
        }
    ],

    //! Optional
    story: String,
    PrivateAccount: Boolean,
    notification: {
        type: Boolean
    },
    status: {
        type: Boolean
    },
    stories: {
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



export default UserSchema