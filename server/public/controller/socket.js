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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketCode = void 0;
const UserModel_1 = require("../model/UserModel");
const uuid_1 = require("uuid");
const app_1 = require("firebase/app");
const firebase_1 = require("../config/firebase");
const storage_1 = require("firebase/storage");
let rooms = {};
let SocketCode = (socket, io) => {
    let HandelDisconnect = (room, email) => {
        socket.leave(room);
        //! remove the disconnected user from the main backend track
        rooms[room] = rooms[room].filter(userEmail => userEmail !== email);
        //! remove the disconnected user from the frontend track => to show that the user is not active
        socket.to(room).emit("UserLeft", { email });
    };
    //? When a user Opens the website join them with their each contact
    let JoinRoom = ({ room, email }) => {
        socket.join(room);
        if (!rooms[room])
            rooms[room] = [];
        rooms[room].push(email);
        //! Notify both users that a new user has joined
        io.to(room).emit("UserJoined", { room, rooms });
        //! Notify the other user that a new user has joined
        // socket.to(room).emit("UserJoined", { room })
        socket.on("disconnect", () => HandelDisconnect(room, email));
    };
    //? Exchanging messages process
    let Messages = ({ message, room, email, otherUserEmail }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let _id = (0, uuid_1.v4)();
            socket.to(room).emit("Messages-BackEndSends-FrontEndReceives", { _id, message, MessageType: "message", time: Date.now(), from: "them", room });
            let time = Date.now();
            //! Add the message to the current user O(n)
            let result1 = yield UserModel_1.UserModel.updateOne({ email, "connections.RoomConnectionId": room }, { $push: { "connections.$.messages": { message, MessageType: "message", time, from: "me" } } });
            //! Add the message to the other user O(n)
            let result2 = yield UserModel_1.UserModel.updateOne({ email: otherUserEmail, "connections.RoomConnectionId": room }, { $push: { "connections.$.messages": { message, MessageType: "message", time, from: "them" } } });
        }
        catch (err) {
            console.log(err.message);
        }
    });
    //? Exchanging Images process
    let Images = ({ email, room, otherUserEmail, type, buffer }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const firebaseApp = (0, app_1.initializeApp)(firebase_1.firebaseConfig);
            let storage = (0, storage_1.getStorage)();
            let imageName = (0, uuid_1.v4)();
            //* Save the user's image to firebase
            let snapshot = yield (0, storage_1.uploadBytesResumable)((0, storage_1.ref)(storage, `conversation/${imageName}`), buffer, { contentType: type });
            let downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
            //! Send the message immediately to the other user
            socket.to(room).emit("Messages-BackEndSends-FrontEndReceives", { _id: imageName, message: downloadURL, MessageType: "image", time: Date.now(), from: "them" });
            let time = Date.now();
            //! Add the message to the current user O(n)
            let result1 = yield UserModel_1.UserModel.updateOne({ email, "connections.RoomConnectionId": room }, { $push: { "connections.$.messages": { message: downloadURL, MessageType: "image", MessageImageName: imageName, time, from: "me" } } });
            //! Add the message to the other user O(n)
            let result2 = yield UserModel_1.UserModel.updateOne({ email: otherUserEmail, "connections.RoomConnectionId": room }, { $push: { "connections.$.messages": { message: downloadURL, MessageType: "image", MessageImageName: imageName, time, from: "them" } } });
        }
        catch (err) {
            console.log(err.message);
        }
    });
    //? Initiate the call between two peers -1- the current users initiates
    let StartVideoCall = ({ room, name, image, connectionId, userId }) => {
        //? Show the other user that the current user is calling him -2-
        socket.to(room).emit("ShowThereIsVideoCall", { name, image, room, connectionId, userId });
    };
    //? The other user has answer the call of the current user with either a yes or no
    let VideoCallAnswer = ({ answer, room, peerId }) => {
        if (answer === "no") {
            socket.to(room).emit("VideoCallAnswer-BackendSends-FrontendReceives", { answer });
        }
        else {
            socket.to(room).emit("VideoCallAnswer-BackendSends-FrontendReceives", { answer, peerId });
        }
    };
    //? End the call between two peers
    let EndCall = ({ room }) => {
        console.log(room);
        socket.to(room).emit("user-disconnected", { room });
    };
    socket.on("EndCall-FrontendSends-BackendReceives", EndCall);
    socket.on("VideoCallAnswer-FrontendSends-BackendReceives", VideoCallAnswer);
    socket.on("StartVideoCall", StartVideoCall);
    socket.on("JoinRoom", JoinRoom);
    socket.on("Messages-FrontEndSends-BackEndReceives", Messages);
    socket.on("Images-FrontEndSends-BackEndReceives", Images);
};
exports.SocketCode = SocketCode;
