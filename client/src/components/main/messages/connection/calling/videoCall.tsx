"use client"

import { useEffect, useState } from "react"
import ShowStream from "./showStream"
import { useAppSelector } from "@/toolkit/store"
import Peer from "peerjs"
import { v4 as uuid } from "uuid"

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

    useEffect(() => {


        (async () => {
            let stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true })
            setLocalStream(stream)

            socket.on("CallAnswer-BackendSends-FrontendReceives", ({ answer, peerId }: { answer: "no" | "yes", peerId: string | null }) => {

                setPeerId(peerId)
                if (answer === "no") setHasAnswered({
                    hasAnswered: true,
                    TheAnswer: answer,
                    message: `${connection.name} has declined the call.`
                })


                if (answer === "yes" && peerId && stream) {

                    //? -1- The local user is calling the remote user through the 'peerId' and sending his/her stream
                    let call = peer.call(peerId, stream) //? peerId= is the peer id of the remote user. localStream= is the stream of the local user


                    //? -4- The local user is receiving the remote's user stream
                    call.on("stream", (remoteUserStream) => {
                        setHasAnswered({ hasAnswered: true, TheAnswer: answer, message: "accepted call" })
                        setRemoteStream(remoteUserStream);
                    })
                }
            })

            //! When the remote user ends the call.
            socket.on("user-disconnected", ({ room }: { room: string }) => {
                setRemoteStream(null);
                setHasAnswered({
                    hasAnswered: true,
                    TheAnswer: "no",
                    message: `${connection.name} has ended the call.`
                })
            })

            //! We make answering/refusing the call through socket.io. This code is just to start exchanging streams(The user already answered the call).
            peer.on("call", (call) => {

                //? -2- The remote user is answering the local's user cal and sends his/her stream.
                call.answer(stream) //? localStream= is the stream of the remote user.


                //? -3- The remote user is receiving the local's user stream.
                call.on("stream", (localUserStream) => {
                    setRemoteStream(localUserStream)
                    setHasAnswered({ hasAnswered: true, TheAnswer: "yes", message: "accepted call" })
                })
            })

            //TODO SIGNALS

            //TODO 1- The remote user turned off-on his/her camera, so we need to do the effect for the local user.
            socket.on("ONOFF", ({ turnOff }: { turnOff: boolean }) => {
                setSignals((prev) => { return { microphoneOff: prev.microphoneOff, cameraOFF: turnOff } })
            })

            //TODO 2- The remote user turned off-on his/her microphone, so we need to do the effect for the local user.
            socket.on("MICROPHONE", ({ turnOff }: { turnOff: boolean }) => {
                setSignals((prev) => { return { microphoneOff: turnOff, cameraOFF: prev.cameraOFF } })
            })

            //! To make fucking sure that when they answer the call they are listening.
            if (now === "now") {
                socket.emit("CallAnswer-FrontendSends-BackendReceives", { answer: "yes", peerId: peer.id, room: connection.RoomConnectionId })
            }

        })()

    }, [peer, socket])

    return <ShowStream localStream={localStream!} remoteStream={remoteStream} setLocalStream={setLocalStream} hasAnswered={hasAnswered}
        setHasAnswered={setHasAnswered} connection={connection} signals={signals} peer={peer} peerId={peerId!} setRemoteStream={setRemoteStream} />
}
