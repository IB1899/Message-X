import Image from "next/image";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { IoImages } from "react-icons/io5"
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/toolkit/store";
import { useTheMessage } from "@/hooks/theMessage";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaMicrophone } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import { usePhoneSizeChat } from "@/hooks/phoneSizeChat";

type props = { user: FullUser, connection: Connection, haveMe: "yes" | "no" }

export default function TextMessaging({ user, connection, haveMe }: props) {

    //! Accessing the socket from a global state
    let { socket, searchChat } = useAppSelector((state => state.SocketSlice))
    let { isRightBar } = useAppSelector((state => state.PhoneSizeSlice))

    //! The message & Image
    let MessageRef = useRef<HTMLInputElement>(null)
    const ImageRef = useRef<HTMLInputElement>(null);
    let [error, setError] = useState("")

    //! The Main Messages Control
    let [messages, setMessage] = useState<Message[]>(connection.messages)

    //! Listening for messages(we put it in a useEffect because we don't want it to run with every rerender)
    useEffect(() => {
        socket.on("Messages-BackEndSends-FrontEndReceives", ({ email, _id, message, MessageType, time, from }: Message) => {
            if (connection.email === email) setMessage((prev) => [...prev, { message, time, from, MessageType, _id }])
        })
    }, [socket])

    //! Scroll down by default and with each new message
    let msgsRef = useRef<HTMLDivElement>(null)
    let ContainerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }, [messages])

    usePhoneSizeChat(ContainerRef, isRightBar)

    //! to check that if the other user has deleted the current user from their connections
    let [hasMe, setHasMe] = useState(haveMe === "yes" ? false : true)

    //! The custom Hook for this page
    let { sendMessage } = useTheMessage(MessageRef, socket, connection, user, setMessage, ImageRef, setError)

    return (
        <div className={isRightBar ? "TheMessages hide" : "TheMessages"} ref={ContainerRef}>

            {
                hasMe ? <div className="HasMe">
                    <p>This user has deleted you from their contacts and they will no longer receive messages in this chat.
                        If you wish to contact them again delete them and re add them to your contact. <br/> Please note if this user
                        blocked you, you cannot contact them again.
                    </p>
                    <i onClick={() => setHasMe(false)} > <AiFillCloseCircle /> </i>
                </div> : null
            }

            {/* The Messages  */}
            <div className="msgs" ref={msgsRef}>

                {<div className={error ? "error" : "error hide"}> <p>{error}</p> </div>}

                {messages && messages.map(message => (

                    <div className="msg" id={message.from === "me" ? "me" : "them"} key={message._id}>

                        <Image id="userImage" src={message.from === "me" ? user.image : connection.image} alt="senderImage" width={50} height={50} />

                        {message.from === "me" ?
                            <div className="text">

                                <div className="msg-head">
                                    <span suppressHydrationWarning> {formatDistanceToNow(new Date(message.time), { addSuffix: true })} </span>
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
                                    <span suppressHydrationWarning> {formatDistanceToNow(new Date(message.time), { addSuffix: true })} </span>
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
