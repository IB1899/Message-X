import { usePotentialConnection } from "@/hooks/usePotentialConnection";
import { useAppSelector } from "@/toolkit/store";
import { ThreeBody } from "@uiball/loaders";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";

export default function Contacts({ user, connections, noConnections }: { user: FullUser, connections: Connection[], noConnections?: any[] }) {

    let { push, prefetch } = useRouter()

    //! The Socket global state
    let { socket } = useAppSelector((state => state.SocketSlice))

    //! Keep track of the cache manually
    let [NoConnections, setNoConnections] = useState(noConnections)

    let [loading, setLoading] = useState({ email: "" })

    //! A custom hook to add a user to your connections if you don't have any yet
    let { AddUser } = usePotentialConnection(user, setLoading, setNoConnections, NoConnections!)

    //! This function is to join the current user with his/her connections (io rooms) and show those connection
    let JoinShow = () => {

        return connections!.map((connection) => {
            socket.emit("JoinRoom", { room: connection.RoomConnectionId })

            return (
                <div key={connection._id} onClick={() => push(`/main/messages/${connection._id}?id=${user._id}`)}
                    onMouseOver={() => prefetch(`/main/messages/${connection._id}?id=${user._id}`)}

                    className={"contact"}
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

    //! Only show the recommended connection because the user doesn't have any yet
    let Show = () => {

        return NoConnections!.filter(potentialConnection => {
            if (potentialConnection.email !== user.email) return potentialConnection
        })
            .map((potentialConnection) => (
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

    return <div className="Contacts"> {connections?.length > 0 ? JoinShow() : Show()} </div>
}
