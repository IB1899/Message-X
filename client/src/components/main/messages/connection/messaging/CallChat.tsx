"use client"
import { setOperation } from "@/toolkit/slices/PeerSlice";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { useDispatch } from "react-redux";

import { BsCameraVideo } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";

export default function CallChat({ connection, user }: { connection: Connection, user: FullUser }) {

    let { Operation } = useAppSelector((state => state.PeerSlice));
    let { socket } = useAppSelector((state => state.SocketSlice));

    let dispatch = useDispatch<AppDispatch>()

    //! Here we initiate the call between two users
    let StartVideoCall = () => {
        dispatch(setOperation("VideoCalling"))

        socket.emit("StartVideoCall",
            { room: connection.RoomConnectionId, name: user.name, image: user.image, connectionId: connection._id, userId: user._id }
        )
    }

    return (

        <div className="CallChat">

            {/* //! Initiate the video call */}
            <button
                onClick={StartVideoCall}
                className={Operation === "VideoCalling" || Operation === "VoiceCalling" ? "disable" : ""}
            >
                <i><BsCameraVideo /></i> <span>  Video chat </span>
            </button>

            {/* //! Initiate the voice call */}
            <button
                onClick={() => dispatch(setOperation("VoiceCalling"))}
                className={Operation === "VideoCalling" || Operation === "VoiceCalling" ? "disable" : ""}

            >
                <i><FiPhoneCall /></i> <span>  Voice chat </span>
            </button>

        </div>
    )
}
