"use client"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { AiOutlineClose, AiOutlineSound } from "react-icons/ai"
import { BiMicrophone, BiMicrophoneOff, BiSolidHelpCircle } from "react-icons/bi"
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs"
import { LuCameraOff, LuSwitchCamera } from "react-icons/lu"
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from "react-icons/md"
import { FiPhoneMissed } from "react-icons/fi"
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { setOperation } from "@/toolkit/slices/PeerSlice"
import { useShowStream } from "@/hooks/showStream"
import { FaXRay } from "react-icons/fa";
import { motion } from "framer-motion"
import Image from "next/image"
import declined from "@/../public/images/declined.svg"

type props = {
    localStream: MediaStream,
    remoteStream: MediaStream | null,
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>,
    hasAnswered: { hasAnswered: boolean; TheAnswer: string; message:string },
    setHasAnswered: Dispatch<SetStateAction<{ hasAnswered: boolean; TheAnswer: string; message:string  }>>,
    connection: Connection
}

export default function ShowStream({ localStream, remoteStream, setLocalStream, hasAnswered, setHasAnswered, connection }: props) {

    let localVideoRef = useRef<HTMLVideoElement>(null)
    let remoteVideoRef = useRef<HTMLVideoElement>(null)

    let dispatch = useDispatch<AppDispatch>()
    let { socket } = useAppSelector((state => state.SocketSlice))


    let [adjustments, setAdjustments] = useState({
        camera: true, screenSharing: false, switchCamera: false, microphone: true
    })

    let DoesBrowserSupport = navigator.mediaDevices.getSupportedConstraints();
    if (!DoesBrowserSupport['facingMode']) alert("This browser doesn't support switching the camera!")

    useEffect(() => {
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    }, [localStream, remoteStream])

    const [CameraSwitchInstruction, setCameraSwitchInstruction] = useState(false)

    let { localSwitches } = useShowStream(adjustments, setAdjustments, localStream, setLocalStream, localVideoRef);

    let endCall = () => {
        
        socket.emit("EndCall-FrontendSends-BackendReceives", { room: connection.RoomConnectionId })
        dispatch(setOperation("TextMessaging"))
        setLocalStream(null)
    }

    return (
        <div className="VideoCall">

            <div className={CameraSwitchInstruction ? "instructions" : "instructions hide"}>
                <div className="content">

                    <i className="i" onClick={() => setCameraSwitchInstruction(false)} > <AiOutlineClose /> </i>

                    <h3> In order to switch the camera please follow these instructions: </h3>

                    <ol>
                        <li>Click the camera icon in the url.</li>
                        <li>Click on manage. It will take you to the browser settings.</li>
                        <li>Choose the camera option.</li>
                        <li> At the top of the page there is toggle switch, and go back to the app and click <i><LuSwitchCamera /></i>  </li>

                    </ol>
                </div>
            </div>

            <div className="remote">
                <motion.video
                    ref={localVideoRef} className="remoteVideo" autoPlay drag

                    initial={{ y: -200 }}
                    animate={{ y: -10 }}
                    transition={{ stiffness: 100, type: "spring", delay: 1.5 }}
                    whileDrag={{ opacity: .6 }}
                    dragConstraints={{ left: -10, right: 450, bottom: 450, top: -10 }}
                >
                </motion.video>
            </div>

            <div className="local">

                <i className="help" onClick={() => setCameraSwitchInstruction(true)} > <BiSolidHelpCircle /> </i>

                {hasAnswered.hasAnswered ?
                    hasAnswered.TheAnswer === "yes" ?
                        <video ref={remoteVideoRef} className="localVideo" playsInline autoPlay  ></video>
                        :
                        <div className="userHasAnswered">

                            <Image id="decline" src={declined} alt="user refused to answer image" height={300} priority />
                            <h3> {connection.name} has declined your call </h3>

                        </div>
                    :
                    <div className="userHasNotAnswered">

                        <Image src={connection.image} alt="user image" width={300} height={300} quality={100} />
                        <h1> {connection.name} </h1>
                        <h3> Calling... </h3>

                    </div>
                }

                <div className="localOptions">

                    <motion.div className="x"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <i> <AiOutlineSound /> </i>
                        <input type="range" min={1} defaultValue={10} max={10} onChange={(e) => {
                            localVideoRef.current!.volume = Number(e.target.value) / 10;
                        }} />
                    </motion.div>

                    <div className="xx">
                        <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                            onClick={() => localSwitches("MICROPHONE")}>
                            {adjustments.microphone ? <BiMicrophone /> : <BiMicrophoneOff />}
                        </motion.i>
                        <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                            onClick={() => localSwitches("SWITCH-CAMERA")} >
                            {adjustments.switchCamera ? <LuCameraOff /> : <LuSwitchCamera />}
                        </motion.i>
                        <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
                            onClick={() => localSwitches("ONOFF")} >
                            {adjustments.camera ? <BsCameraVideo /> : <BsCameraVideoOff />}
                        </motion.i>
                        <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
                            onClick={() => localSwitches("SCREEN-SHARING")} >
                            {adjustments.screenSharing ? <MdOutlineScreenShare /> : <MdOutlineStopScreenShare />}
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

        </div>
    )
}