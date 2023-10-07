import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UserModel } from "../model/UserModel";
import { v4 as uuid } from "uuid"

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

            socket.to(room).emit("Messages-BackEndSends-FrontEndReceives", { _id, message, MessageType: "Messages", time: Date.now(), from: "them" })

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


    socket.on("JoinRoom", JoinRoom)
    socket.on("Messages-FrontEndSends-BackEndReceives", Messages)
}