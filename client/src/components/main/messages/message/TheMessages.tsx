"use client"
import Image from "next/image";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { IoImages } from "react-icons/io5"
import { FaLeaf, FaMicrophone } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "@/toolkit/store";
import { useTheMessage } from "@/hooks/theMessage";
import { AiFillCloseCircle } from "react-icons/ai";


export default function TheMessages({ user, connection, haveMe }: { user: FullUser, connection: Connection, haveMe: "yes" | "no" }) {

    //! Accessing the socket from a global state
    let { socket, searchChat } = useAppSelector((state => state.SocketSlice))

    //! The message & Image
    let MessageRef = useRef<HTMLInputElement>(null)
    const ImageRef = useRef<HTMLInputElement>(null);
    let [error, setError] = useState("")

    //! The Main Messages Control
    let [messages, setMessage] = useState<Message[]>(connection.messages)

    //! Listening for messages(we put it in a useEffect because we don't want it to run with every rerender)
    useEffect(() => {
        socket.on("Messages-BackEndSends-FrontEndReceives", ({ _id, message, MessageType, time, from }: Message) => {
            setMessage((prev) => [...prev, { message, time, from, MessageType, _id }])
        })
    }, [socket])

    //! Scroll down by default
    let ContainerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ContainerRef.current) ContainerRef.current.scrollTop = ContainerRef.current.scrollHeight

        if (messages[messages.length - 1]?.from === "them") {
            let audio = new Audio('/MessageTone.mp3')
            audio.play()
        }
    }, [messages])

    //! to check that if the other user has deleted the current user from their connections
    let [hasMe, setHasMe] = useState(haveMe === "yes" ? false : true)

    //! The custom Hook for this page
    let { sendMessage } = useTheMessage(MessageRef, socket, connection, user, setMessage, ImageRef, setError)

    return (
        <div className="TheMessages" ref={ContainerRef}>

            {
                hasMe ? <div className="HasMe">
                    <p>This user has deleted you from their contacts and they will no longer receive messages in this chat.
                        If you wish to contact them again delete them and re add them to your contact. Please note if this your
                        blocked you, you can not contact them again
                    </p>
                    <i onClick={() => setHasMe(false)} > <AiFillCloseCircle /> </i>
                </div> : null
            }

            {/* The Messages  */}
            <div className="msgs">

                {error ? <div className="error"> <p>{error}</p> </div> : null}

                {messages && messages.map(message => (

                    <div className="msg" id={message.from === "me" ? "me" : "them"} key={message._id}>

                        <Image id="userImage" src={message.from === "me" ? user.image : connection.image} alt="senderImage" width={50} height={50} />

                        {message.from === "me" ?
                            <div className="text">

                                <div className="msg-head">
                                    <span> {formatDistanceToNow(new Date(message.time))} </span>
                                    <h3> you </h3>
                                </div>

                                {message.MessageType === "message" ?
                                    searchChat === message.message ? <p id="TheFoundWord" style={{ background: "red", fontWeight: "bold" }}>
                                        {message.message} </p> : <p> {message.message} </p>
                                    :
                                    <Image id="messageImage" src={message.message} alt="image" width={200} height={200} />
                                }
                            </div>
                            :
                            <div className="text">

                                <div className="msg-head">
                                    <h3> {connection.name} </h3>
                                    <span> {formatDistanceToNow(new Date(message.time))} </span>
                                </div>

                                {message.MessageType === "message" ?
                                    searchChat === message.message ? <p id="TheFoundWord" style={{ background: "red", fontWeight: "bold" }}>
                                        {message.message} </p> : <p> {message.message} </p>
                                    :
                                    <Image id="messageImage" src={message.message} alt="image" width={200} height={200} />
                                }

                            </div>
                        }
                    </div>
                ))}
            </div>

            {/* The send Message Form */}
            <form className="sendMessage" onSubmit={(e) => sendMessage(e)}>

                <div className="i">

                    <input type="file" id="imageInput" ref={ImageRef} />
                    <label htmlFor="imageInput" > <IoImages /> </label>

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
