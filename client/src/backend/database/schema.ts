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
        required: true
    },

    //! Necessary but not required
    connections: [
        {
            //! The other user's info
            TheirID: String,
            TheirImage: String,
            TheirName: String,
            TheirEmail: String,

            //! The messages
            messages: [
                {
                    from: String,
                    message: String,
                }
            ]
        }
    ],

    //! Optional
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
    Country: {
        type: String
    }


}, { timestamps: true })



export default UserSchema