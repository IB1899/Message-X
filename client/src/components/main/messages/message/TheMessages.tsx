"use client"
import Image from "next/image";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { IoImages } from "react-icons/io5"
import { FaMicrophone } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "@/toolkit/store";
import { useTheMessage } from "@/hooks/theMessage";


export default function TheMessages({ user, connection }: { user: FullUser, connection: Connection }) {

    //! Accessing the socket from a global state
    let { socket } = useAppSelector((state => state.SocketSlice))

    //! Send the message
    let MessageRef = useRef<HTMLInputElement>(null)

    //! The Main Messages Control
    let [messages, setMessage] = useState<Message[]>(connection.messages)

    //! The custom Hook for this page
    let { sendMessage } = useTheMessage(MessageRef, socket, connection, user, setMessage)

    useEffect(() => {
        socket.on("Messages-BackEndSends-FrontEndReceives", ({ _id, message, MessageType, time, from }: Message) => {
            setMessage((prev) => [...prev, { message, time, from, MessageType, _id }])
        })
    }, [socket])

    //! Scroll down by default
    let ContainerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ContainerRef.current) ContainerRef.current.scrollTop = ContainerRef.current.scrollHeight

        if (messages[messages.length - 1].from === "them") {
            let audio = new Audio('/MessageTone.mp3')
            audio.play()
        }
    }, [messages])

    return (
        <div className="TheMessages" ref={ContainerRef}>

            {/* The Messages  */}
            <div className="msgs">
                {messages && messages.map(message => (

                    <div className="msg" id={message.from === "me" ? "me" : "them"} key={message._id}>

                        <Image src={message.from === "me" ? user.image : connection.image} alt="senderImage" width={50} height={50} />

                        {message.from === "me" ?
                            <div className="text">
                                <div className="msg-head">
                                    <span> {formatDistanceToNow(new Date(message.time))} </span>
                                    <h3> you </h3>
                                </div>
                                <p> {message.message} </p>
                            </div>
                            :
                            <div className="text">
                                <div className="msg-head">
                                    <h3> {connection.name} </h3>
                                    <span> {formatDistanceToNow(new Date(message.time))} </span>
                                </div>
                                <p> {message.message} </p>
                            </div>
                        }

                    </div>
                ))}
            </div>

            {/* The send Message Form */}
            <form className="sendMessage" onSubmit={(e) => sendMessage(e)}>

                <div className="i">
                    <i onClick={() => {
                        let audio = new Audio('/MessageTone.mp3')
                        audio.play()
                    }} > <IoImages /> </i>
                    <input type="text" ref={MessageRef} placeholder="Type Something..." />
                </div>

                <div className="ii">
                    <i> <FaMicrophone /> </i>
                    <span></span>
                    <button type="submit" > <BiMailSend /> </button>
                </div>

            </form>

        </div>
    )
}
