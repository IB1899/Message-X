"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectToDB = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
let UserSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("user", UserSchema);
//! Accessing the env file
dotenv_1.default.config();
let ConnectToDB = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let uri = process.env.MONGODB_URI;
        if (!uri)
            throw Error(" The mongoDB uri wasn't found ");
        yield (0, mongoose_1.connect)(uri);
        console.log("connected to DB");
        callback();
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.ConnectToDB = ConnectToDB;
