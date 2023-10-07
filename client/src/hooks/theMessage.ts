import { Dispatch, FormEvent, RefObject, SetStateAction } from "react"
import { Socket } from "socket.io-client"
import { v4 as uuid } from "uuid"

export let useTheMessage = (
    MessageRef: RefObject<HTMLInputElement>,
    socket: Socket,
    connection: Connection,
    user: FullUser,
    setMessage: Dispatch<SetStateAction<Message[]>>
) => {

    let sendMessage = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        let msg = MessageRef.current?.value
        if (!msg) return

        socket.emit("Messages-FrontEndSends-BackEndReceives",
            {
                message: msg,
                room: connection.RoomConnectionId,
                email: user.email,
                otherUserEmail: connection.email,
            }
        )
        setMessage((prev) => [...prev, { message: msg!, time: Date.now(), from: "me", MessageType: "message", _id: uuid() }])

        MessageRef.current!.value = ""
    }

    return { sendMessage }
}