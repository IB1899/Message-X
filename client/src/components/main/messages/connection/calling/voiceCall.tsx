import { useAudioCall } from "@/hooks/audioCall"
import { useAppSelector } from "@/toolkit/store"
import { motion } from "framer-motion"
import Peer from "peerjs"
import { useEffect, useRef, useState } from "react"
import { AiOutlineSound } from "react-icons/ai"
import { BiMicrophone, BiMicrophoneOff, BiVolumeMute } from "react-icons/bi"
import { FiPhoneMissed } from "react-icons/fi"
import { v4 as uuid } from "uuid"
import Image from "next/image"
import declined from "@/../public/images/declined.svg"

export default function VoiceCall({ connection, now = null }: { connection: Connection, now: "now" | null }) {

    //! This cannot be used in ssr nor in redux that uses ssr.
    let [peer] = useState(new Peer(uuid(), { host: "localhost", port: 3002, path: "/calls-peer" }))
    let { socket } = useAppSelector((state => state.SocketSlice))

    let [remoteStream, setRemoteStream] = useState<null | MediaStream>(null)
    let [adjustments, setAdjustments] = useState({ microphone: true, soundOff: false })
    let [signals, setSignals] = useState({ microphoneOff: false })
    let [hasAnswered, setHasAnswered] = useState({ hasAnswered: false, TheAnswer: "", message: "" })

    let remoteAudioRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream
    }, [remoteStream])

    useEffect(() => {

        (async () => {

            //! The audio that I send
            let stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })

            socket.on("CallAnswer-BackendSends-FrontendReceives", ({ answer, peerId }: { answer: "no" | "yes", peerId: string | null }) => {

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
                // remoteAudioRef.current!.srcObject = null;
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
                    setRemoteStream(localUserStream);

                    // remoteAudioRef.current!.srcObject = localUserStream;
                    setHasAnswered({ hasAnswered: true, TheAnswer: "yes", message: "accepted call" })
                })
            })

            //TODO SIGNALS
            //TODO 1- The remote user turned off-on his/her microphone, so we need to do the effect for the local user.
            socket.on("MICROPHONE", ({ turnOff }: { turnOff: boolean }) => {
                setSignals((prev) => { return { microphoneOff: turnOff } })
            })

            //! To make fucking sure that when they answer the call they are listening.
            if (now === "now") {
                socket.emit("CallAnswer-FrontendSends-BackendReceives", { answer: "yes", peerId: peer.id, room: connection.RoomConnectionId })
            }

        })()

    }, [peer, socket])

    let { endCall, localSwitches } = useAudioCall(socket, adjustments, setAdjustments, connection, remoteAudioRef)

    return (
        <div className='VoiceCall'>

            <div className="caller">

                {hasAnswered.hasAnswered ?
                    hasAnswered.TheAnswer === "yes" ? <>
                        <video ref={remoteAudioRef} autoPlay playsInline muted={signals.microphoneOff} ></video>
                        <Image src={connection.image} alt="The user image" width={400} height={400} quality={100} />
                        <h3> {connection.name} </h3>
                    </>
                        :
                        <div className="userHasAnswered">

                            <Image id="decline" src={declined} alt="user refused to answer image" height={300} priority />
                            <h3> {hasAnswered.message}  </h3>

                        </div>
                    :
                    <div className="userHasNotAnswered">

                        <Image src={connection.image} alt="user image" width={300} height={300} quality={100} />
                        <h1> {connection.name} </h1>
                        <h3> Calling... </h3>

                    </div>
                }
            </div>

            <div className="options">
                <motion.div className="x"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <i> <AiOutlineSound /> </i>
                    <input type="range" min={1} defaultValue={10} max={10} onChange={(e) => {
                        remoteAudioRef.current!.volume = Number(e.target.value) / 10;
                    }} />
                </motion.div>

                <div className="xx">
                    <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                        onClick={() => localSwitches("MICROPHONE")}>
                        {adjustments.microphone ? <BiMicrophone /> : <BiMicrophoneOff />}
                    </motion.i>
                    <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                        onClick={() => localSwitches("SOUND")} >
                        {adjustments.soundOff ? <BiVolumeMute /> : <AiOutlineSound />}
                    </motion.i>

                </div>

                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}
                    className="xxx" onClick={endCall}
                >
                    <i> <FiPhoneMissed /> </i>
                    <span>end call</span>
                </motion.button>
            </div>

        </div>
    )
}
