import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UserModel } from "../model/UserModel";
import { v4 as uuid } from "uuid"
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

export let SocketCode = (socket: Socket, io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {

    let JoinRoom = ({ room }: { room: string }) => {

        socket.join(room)

        //! Notify the other user that a new user has joined
        socket.to(room).emit("UserJoined", { room })

        socket.on("disconnect", () => {
            socket.leave(room)
        })

    }

    //? Exchanging messages process
    let Messages = async ({ message, room, email, otherUserEmail }: { [key: string]: string }) => {
        try {
            let _id = uuid()

            socket.to(room).emit("Messages-BackEndSends-FrontEndReceives", { _id, message, MessageType: "message", time: Date.now(), from: "them" })

            let time = Date.now()

            //! Add the message to the current user O(n)
            let result1 = await UserModel.updateOne({ email, "connections.RoomConnectionId": room },
                { $push: { "connections.$.messages": { message, MessageType: "message", time, from: "me" } } }
            )

            //! Add the message to the other user O(n)
            let result2 = await UserModel.updateOne({ email: otherUserEmail, "connections.RoomConnectionId": room },
                { $push: { "connections.$.messages": { message, MessageType: "message", time, from: "them" } } }
            )
        }
        catch (err: any) {
            console.log(err.message);
        }
    }

    //? Exchanging Images process
    let Images = async ({ email, room, otherUserEmail, type, buffer }:
        { email: string, room: string, otherUserEmail: string, type: string, buffer: ArrayBuffer }) => {
        try {

            const firebaseApp = initializeApp(firebaseConfig);
            let storage = getStorage()

            let imageName = uuid()

            //* Save the user's image to firebase
            let snapshot = await uploadBytesResumable(ref(storage, `conversation/${imageName}`), buffer, { contentType: type })
            let downloadURL = await getDownloadURL(snapshot.ref)

            //! Send the message immediately to the other user
            socket.to(room).emit("Messages-BackEndSends-FrontEndReceives", { _id: imageName, message: downloadURL, MessageType: "image", time: Date.now(), from: "them" })

            let time = Date.now()

            //! Add the message to the current user O(n)
            let result1 = await UserModel.updateOne({ email, "connections.RoomConnectionId": room },
                { $push: { "connections.$.messages": { message: downloadURL, MessageType: "image", MessageImageName: imageName, time, from: "me" } } }
            )

            //! Add the message to the other user O(n)
            let result2 = await UserModel.updateOne({ email: otherUserEmail, "connections.RoomConnectionId": room },
                { $push: { "connections.$.messages": { message: downloadURL, MessageType: "image", MessageImageName: imageName, time, from: "them" } } }
            )

        }
        catch (err: any) {
            console.log(err.message);
        }
    }


    socket.on("JoinRoom", JoinRoom)
    socket.on("Messages-FrontEndSends-BackEndReceives", Messages)
    socket.on("Images-FrontEndSends-BackEndReceives", Images)
}