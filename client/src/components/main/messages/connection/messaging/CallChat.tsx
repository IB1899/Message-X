"use client"

import { setOperation } from "@/toolkit/slices/PeerSlice";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { useDispatch } from "react-redux";

import { BsCameraVideo } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";

export default function CallChat() {

    let { Operation } = useAppSelector((state => state.PeerSlice))
    let dispatch = useDispatch<AppDispatch>()

    return (

        <div className="CallChat">

            {/* //! Initiate the video call */}
            <button
                onClick={() => dispatch(setOperation("VideoCalling"))}
                className={Operation === "VideoCalling" || Operation === "VoiceCalling" ? "disable" : ""}
            >
                <i><BsCameraVideo /></i> <span>  Video chat </span>
            </button>

            {/* //! Initiate the voice call */}
            <button
                onClick={() => dispatch(setOperation("VideoCalling"))}
                className={Operation === "VideoCalling" || Operation === "VoiceCalling" ? "disable" : ""}

            >
                <i><FiPhoneCall /></i> <span>  Voice chat </span>
            </button>

        </div>
    )
}
