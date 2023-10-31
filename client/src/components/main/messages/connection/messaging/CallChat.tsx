"use client"
import { setOperation } from "@/toolkit/slices/PeerSlice";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { useDispatch } from "react-redux";

import { BsCameraVideo } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import { setIsRightBar } from "@/toolkit/slices/PhoneSizeSlice";

export default function CallChat({ connection, user }: { connection: Connection, user: FullUser }) {

    let { Operation } = useAppSelector((state => state.PeerSlice));
    let { socket } = useAppSelector((state => state.SocketSlice));

    let dispatch = useDispatch<AppDispatch>()

    //! Here we initiate the call between two users
    let StartVideoCall = () => {
        dispatch(setOperation("VideoCalling"))
        dispatch(setIsRightBar(false))

        socket.emit("StartVideoCall",
            { room: connection.RoomConnectionId, name: user.name, image: user.image, connectionId: connection.RoomConnectionId }
        )
    }

    //! Here we initiate the call between two users
    let StartVoiceCall = () => {
        dispatch(setOperation("VoiceCalling"))
        dispatch(setIsRightBar(false))

        socket.emit("StartVoiceCall",
            { room: connection.RoomConnectionId, name: user.name, image: user.image, connectionId: connection.RoomConnectionId }
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
                onClick={StartVoiceCall}
                className={Operation === "VideoCalling" || Operation === "VoiceCalling" ? "disable" : ""}

            >
                <i><FiPhoneCall /></i> <span>  Voice chat </span>
            </button>

        </div>
    )
}
