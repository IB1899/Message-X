import { AppDispatch, useAppSelector } from "@/toolkit/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Contacts({ user, connections }: { user: FullUser, connections: Connection[] }) {

    let { push, prefetch } = useRouter()

    let dispatch = useDispatch<AppDispatch>()

    //! The Socket global state
    let { socket } = useAppSelector((state => state.SocketSlice))

    let [activeUsers, setActiveUsers] = useState<string[]>([])

    // useEffect(() => {

    //     socket.on("UserJoined", ({ room }: { room: string }) => {

    //         setActiveUsers(prev => [...prev, room])
    //     })


    // }, [socket])


    let JoinShow = () => {

        return connections!.map((connection) => {
            socket.emit("JoinRoom", { room: connection.RoomConnectionId })

            return (
                <div key={connection._id} onClick={() => push(`/main/messages/${connection._id}?id=${user._id}`)}
                    onMouseOver={() => prefetch(`/main/messages/${connection._id}?id=${user._id}`)}

                    className={activeUsers?.includes(connection.RoomConnectionId) ? "contact active" : "contact"}
                >
                    <Image src={connection.image} alt="user image" width={50} height={50} />
                    <div className="contactInfo">
                        <h3> {connection.name} </h3>
                        <h5> {connection.username} </h5>
                    </div>

                    <div className="messagesInfo">
                        <span className="missedMessages">4</span>
                        <span className="time">12:33</span>
                    </div>

                </div>
            )
        })
    }

    return <div className="Contacts"> {connections?.length > 0 ? JoinShow() : null} </div>
}
