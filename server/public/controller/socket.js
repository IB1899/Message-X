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
let SocketCode = (socket, io) => {
    let JoinRoom = ({ room }) => {
        socket.join(room);
        //! Notify the other user that a new user has joined
        socket.to(room).emit("UserJoined", { room });
        socket.on("disconnect", () => {
            socket.leave(room);
        });
    };
    //? Exchanging messages process
    let Messages = ({ message, room, email, otherUserEmail }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let _id = (0, uuid_1.v4)();
            socket.to(room).emit("Messages-BackEndSends-FrontEndReceives", { _id, message, MessageType: "Messages", time: Date.now(), from: "them" });
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
    socket.on("JoinRoom", JoinRoom);
    socket.on("Messages-FrontEndSends-BackEndReceives", Messages);
};
exports.SocketCode = SocketCode;
