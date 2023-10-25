import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UserModel } from "../model/UserModel";
import { v4 as uuid } from "uuid"
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

let rooms: { [key: string]: string[] } = {}

export let SocketCode = (socket: Socket, io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {

    let HandelDisconnect = (room: string, email: string) => {
        socket.leave(room);

        //! remove the disconnected user from the main backend track
        rooms[room] = rooms[room].filter(userEmail => userEmail !== email)

        //! remove the disconnected user from the frontend track => to show that the user is not active

        socket.to(room).emit("UserLeft", { email })
    }

    //? When a user Opens the website join them with their each contact
    let JoinRoom = ({ room, email }: { room: string, email: string }) => {
        socket.join(room)

        if (!rooms[room]) rooms[room] = []
        rooms[room].push(email)

        //! Notify both users that a new user has joined
        io.to(room).emit("UserJoined", { room, rooms })

        //! Notify the other user that a new user has joined
        // socket.to(room).emit("UserJoined", { room })

        socket.on("disconnect", () => HandelDisconnect(room, email))
    }

    //? Exchanging messages process
    let Messages = async ({ message, room, email, otherUserEmail }: { [key: string]: string }) => {
        try {
            let _id = uuid()

            socket.to(room).emit("Messages-BackEndSends-FrontEndReceives", { _id, message, MessageType: "message", time: Date.now(), from: "them", room })

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

    //? Initiate the call between two peers -1- the current users initiates
    let StartVideoCall = ({ room, name, image, connectionId, userId }: { [key: string]: string }) => {

        //? Show the other user that the current user is calling him -2-
        socket.to(room).emit("ShowThereIsVideoCall", { name, image, room, connectionId, userId })
    }

    //? The other user has answer the call of the current user with either a yes or no
    let VideoCallAnswer = ({ answer, room, peerId }: { answer: "no" | "yes", room: string, peerId: string }) => {

        if (answer === "no") {

            socket.to(room).emit("VideoCallAnswer-BackendSends-FrontendReceives", { answer })
        } else {
            socket.to(room).emit("VideoCallAnswer-BackendSends-FrontendReceives", { answer, peerId })
        }
    }

    //? End the call between two peers
    let EndCall = ({ room }: { room: string }) => {

        console.log(room);
        
        socket.to(room).emit("user-disconnected", { room })
    }

    socket.on("EndCall-FrontendSends-BackendReceives", EndCall)
    socket.on("VideoCallAnswer-FrontendSends-BackendReceives", VideoCallAnswer)
    socket.on("StartVideoCall", StartVideoCall)
    socket.on("JoinRoom", JoinRoom)
    socket.on("Messages-FrontEndSends-BackEndReceives", Messages)
    socket.on("Images-FrontEndSends-BackEndReceives", Images)
}