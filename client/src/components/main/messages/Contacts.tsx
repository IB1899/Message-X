import { usePotentialConnection } from "@/hooks/usePotentialConnection";
import { setNewMessage } from "@/toolkit/slices/MainSlice";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { ThreeBody } from "@uiball/loaders";
import formatDistanceToNow from "date-fns/formatDistanceToNowStrict";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { useDispatch } from "react-redux";

export default function Contacts({ user, connections, noConnections }: { user: FullUser, connections: Connection[], noConnections?: any[] }) {

    let { push, prefetch, refresh } = useRouter()

    //! The Socket global state
    let { socket } = useAppSelector((state => state.SocketSlice))

    //! The purpose of this global state is to rerender this component with the new data when sending a new message
    let { newMessage } = useAppSelector((state => state.MainSlice))
    let dispatch = useDispatch<AppDispatch>()

    //! Keep track of the cache manually
    let [NoConnections, setNoConnections] = useState(noConnections)

    let [loading, setLoading] = useState({ email: "" })

    //! A custom hook to add a user to your connections if you don't have any yet
    let { AddUser, CalculateMissedMessages } = usePotentialConnection(user, setLoading, setNoConnections, NoConnections!)

    //! Keep track of active users in the current user's contacts
    let [actives, setActives] = useState<string[]>([])
    console.log(`actives:`, actives)

    useEffect(() => {
        (async () => {

            //! Join the current user to all rooms 
            connections?.forEach(connection => {
                socket.emit("JoinRoom", { room: connection.RoomConnectionId, email: user.email })
            })

            //! Listen when a  contact user is active
            socket.on("UserJoined", ({ room, rooms }: { room: string, rooms: { [key: string]: string[] } }) => {

                //* in order for not saving the current user's email over and over. Only save the other user email 
                rooms[room] = rooms[room].filter(email => email !== user.email)
                setActives(prev => [...prev, ...rooms[room]])
            })

            //! Remove the user who left from the active state
            socket.on('UserLeft', ({ email }: { email: string }) => {
                setActives(actives.filter(one => one !== email))
            })

            let permeation = await Notification.requestPermission();

            //! The effect of receiving new message
            socket.on("Messages-BackEndSends-FrontEndReceives", async (message: Message) => {

                if (message.from === "them") {

                    //! 1- Make a sound alarm
                    let audio = new Audio('/MessageTone.mp3')
                    audio.play();

                    let theConnection = connections.filter(connection => connection.RoomConnectionId === message.room)

                    //! 2- Make a notification alarm
                    if (permeation === "granted") {
                        let notification = new Notification(theConnection[0].name, {
                            body: message.MessageType === "message" ? message.message : "New Message",
                            icon: theConnection[0].image
                        })
                    }

                    //! 3- Rerender this component with the new information
                    dispatch(setNewMessage(message))
                }
            })

        })()
    }, [])

    let missedMessagesRef = useRef<HTMLSpanElement>(null)

    //! This function is to join the current user with his/her connections (io rooms) and show those connection
    let JoinShow = () => {

        return connections?.map((connection) => {

            let active = false;
            if (actives.includes(connection.email)) active = true;

            return (
                <div key={connection._id}

                    //! To make a hard navigation when navigating between contacts
                    onClick={() => { push(`/main/messages/${connection._id}?id=${user._id}&active=${active}`); refresh() }}
                    onMouseOver={() => prefetch(`/main/messages/${connection._id}?id=${user._id}`)}

                    className={actives.includes(connection.email) ? "contact active" : "contact"}
                >
                    <Image src={connection.image} alt="user image" width={50} height={50} />
                    <div className="contactInfo">
                        <h3> {connection.name} </h3>
                        <h5> {connection.username} </h5>
                    </div>

                    <div className="messagesInfo">

                        <span className="missedMessages" ref={missedMessagesRef} style={{ background: missedMessagesRef.current?.textContent === "0" ? "limegreen" : "red" }} >
                            {
                                newMessage[connection.RoomConnectionId] ?
                                    CalculateMissedMessages([...connection.messages, newMessage[connection.RoomConnectionId]])
                                    :
                                    CalculateMissedMessages(connection.messages)
                            }
                        </span>

                        <span className="time" suppressHydrationWarning>
                            {connection?.messages.length ?

                                newMessage[connection.RoomConnectionId] ?
                                    formatDistanceToNow(new Date(newMessage[connection.RoomConnectionId].time))
                                    :
                                    formatDistanceToNow(new Date(connection.messages[connection.messages.length - 1].time))
                                :
                                null
                            }
                        </span>
                    </div>

                </div>
            )
        })
    }

    //! Only show the recommended connection because the user doesn't have any yet
    let Show = () => {

        return NoConnections?.map((potentialConnection) => (
            <div key={potentialConnection._id} className="searchResults"
            >
                <Image src={potentialConnection.image} alt="user image" width={55} height={55} />
                <div className="info">
                    <h3> {potentialConnection.name} </h3>
                    <h5> {potentialConnection.username} </h5>
                </div>

                {loading.email === potentialConnection.email ?
                    <div className="animation"> <ThreeBody size={30} speed={0.7} color="#9D00BB" /> </div>
                    :
                    <i onClick={() => AddUser(potentialConnection)}> <FaPlusSquare /> </i>
                }
            </div>
        ))
    }

    return <div className="Contacts"> {noConnections?.length ? Show() : JoinShow()} </div>
}
