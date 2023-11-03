import Peer from "peerjs"
import { Dispatch, SetStateAction, useEffect } from "react"
import { Socket } from "socket.io-client"

export let useVideoCall = (
    socket: Socket,
    peer: Peer,
    connection: Connection,
    now: "now" | null,
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>,
    setRemoteStream: Dispatch<SetStateAction<MediaStream | null>>,
    setHasAnswered: Dispatch<SetStateAction<{ hasAnswered: boolean; TheAnswer: string; message: string; }>>,
    setSignals: Dispatch<SetStateAction<{ cameraOFF: boolean; microphoneOff: boolean; }>>,
    setPeerId: Dispatch<SetStateAction<string | null>>
) => {

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
}