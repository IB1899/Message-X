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
        unique: true,
    },

    imageName:{
        type: String,
        unique: true,
    },
    username:{
        unique: true,
        type:String
    },

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
            phoneNumber:Number,

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
        max:[1e3],
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