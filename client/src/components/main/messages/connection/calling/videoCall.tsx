"use client"

import { useState } from "react"
import ShowStream from "./showStream"
import { useAppSelector } from "@/toolkit/store"
import Peer from "peerjs"
import { v4 as uuid } from "uuid"
import { useVideoCall } from "@/hooks/videoCall"

//! This Component starts rendering when the current user calls the other user
export default function VideoCall({ connection, now = null }: { connection: Connection, now: "now" | null }) {

    //! This cannot be used in ssr nor in redux that uses ssr.
    let [peer] = useState(new Peer(uuid(), { host: "localhost", port: 3002, path: "/calls-peer" }))

    let { socket } = useAppSelector((state => state.SocketSlice))

    let [localStream, setLocalStream] = useState<MediaStream | null>(null)
    let [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
    let [hasAnswered, setHasAnswered] = useState({ hasAnswered: false, TheAnswer: "", message: "" })

    let [signals, setSignals] = useState({ cameraOFF: false, microphoneOff: false })

    let [peerId, setPeerId] = useState<string | null>(null)

    //! Starting the webRTC video-call
    useVideoCall(socket, peer, connection, now, setLocalStream, setRemoteStream, setHasAnswered, setSignals, setPeerId)

    return <ShowStream localStream={localStream!} remoteStream={remoteStream} setLocalStream={setLocalStream} hasAnswered={hasAnswered}
        setHasAnswered={setHasAnswered} connection={connection} signals={signals} peer={peer} peerId={peerId!} setRemoteStream={setRemoteStream} />
}
