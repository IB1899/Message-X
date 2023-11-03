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
import { usePhoneSizeChat } from "@/hooks/phoneSizeChat"
import { useVoiceCall } from "@/hooks/voiceCall"

export default function VoiceCall({ connection, now = null }: { connection: Connection, now: "now" | null }) {

    //! This cannot be used in ssr nor in redux that uses ssr.
    let [peer] = useState(new Peer(uuid(), { host: "localhost", port: 3002, path: "/calls-peer" }))
    let { socket } = useAppSelector((state => state.SocketSlice))
    let { isRightBar } = useAppSelector((state => state.PhoneSizeSlice))

    let [remoteStream, setRemoteStream] = useState<null | MediaStream>(null)
    let [adjustments, setAdjustments] = useState({ microphone: true, soundOff: false })
    let [signals, setSignals] = useState({ microphoneOff: false })
    let [hasAnswered, setHasAnswered] = useState({ hasAnswered: false, TheAnswer: "", message: "" })

    let remoteAudioRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream
    }, [remoteStream])


    //! Start The webRTC voice-call
    useVoiceCall(socket, peer, connection, now, setRemoteStream, setHasAnswered, setSignals)

    //! Switches and end the call
    let { endCall, localSwitches } = useAudioCall(socket, adjustments, setAdjustments, connection, remoteAudioRef)

    let ContainerRef = useRef<HTMLDivElement>(null)
    usePhoneSizeChat(ContainerRef, isRightBar)

    return (
        <div className={isRightBar ? 'VoiceCall hide' : 'VoiceCall'} ref={ContainerRef}>

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
                        remoteAudioRef.current ? remoteAudioRef.current.volume = Number(e.target.value) / 10 : null

                    }} />
                </motion.div>

                <div className="xx">
                    <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                        onClick={() => localSwitches("MICROPHONE")}>
                        {adjustments.microphone ? <BiMicrophone /> : <BiMicrophoneOff />}
                    </motion.i>
                    <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                        onClick={() => remoteAudioRef.current ? localSwitches("SOUND") : null} >
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
