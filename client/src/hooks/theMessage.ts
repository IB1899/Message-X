import { Dispatch, FormEvent, RefObject, SetStateAction } from "react"
import { Socket } from "socket.io-client"
import { v4 as uuid } from "uuid"
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/svg"];
import pako from "pako"
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { setNewMessage } from "@/toolkit/slices/MainSlice";

export let useTheMessage = (
    MessageRef: RefObject<HTMLInputElement>,
    socket: Socket,
    connection: Connection,
    user: FullUser,
    setMessage: Dispatch<SetStateAction<Message[]>>,
    ImageRef: RefObject<HTMLInputElement>,
    setError: Dispatch<SetStateAction<string>>
) => {

    let dispatch = useDispatch<AppDispatch>()

    let sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let msg = MessageRef.current?.value;
        let img = ImageRef.current?.files![0]

        if (msg) {

            socket.emit("Messages-FrontEndSends-BackEndReceives",
                {
                    message: msg,
                    room: connection.RoomConnectionId,
                    email: user.email,
                    otherUserEmail: connection.email,
                }
            )
            setMessage((prev) => [...prev, { message: msg!, time: Date.now(), from: "me", MessageType: "message", _id: uuid() }])
            MessageRef.current!.value = "" //* clear the input

            //! To update the contacts component
            dispatch(setNewMessage(
                { message: msg!, time: Date.now(), from: "me", MessageType: "message", _id: uuid(), room: connection.RoomConnectionId }
            ))
        }
        if (img?.size) {

            if (!ACCEPTED_IMAGE_TYPES.includes(img.type)) {
                setError("We are sorry for that, but this file type is not supported. Various file types will be supported in the next maiger release")
                setTimeout(() => { setError("") }, 6500)
                ImageRef.current!.value = "" //* clear the input
            }

            else if (img.size > 1000000) {
                setError("We are sorry for that, but the size of the image is too big. Big files will be supported in the next maiger release ")
                setTimeout(() => { setError("") }, 6500)
                ImageRef.current!.value = "" //* clear the input
            }
            else {
                //! This is the only way to send images through socket.io and can't exceed the size 1,000,000
                let buffer = await img.arrayBuffer()
                const imageBuffer = Buffer.from(buffer);
                console.log(`imageBuffer:`, imageBuffer)

                const payload = {
                    email: user.email,
                    room: connection.RoomConnectionId,
                    otherUserEmail: connection.email,
                    type: img?.type,
                    buffer: imageBuffer
                };
                socket.emit('Images-FrontEndSends-BackEndReceives', payload);

                const fileUrl = URL.createObjectURL(img);

                setMessage((prev) => [...prev, { message: fileUrl, time: Date.now(), from: "me", MessageType: "image", _id: uuid() }])

                ImageRef.current!.value = "" //* clear the input

                dispatch(setNewMessage(
                    { message: fileUrl, time: Date.now(), from: "me", MessageType: "image", _id: uuid(), room: connection.RoomConnectionId }
                ))

            }
        }
    }
    return { sendMessage }
}