import { useEffect, useRef } from "react"
import { AiOutlineCamera, AiOutlineSound } from "react-icons/ai"
import { BiMicrophone } from "react-icons/bi"
import { BsCameraVideoOff, BsMicMute } from "react-icons/bs"
import { LuSwitchCamera } from "react-icons/lu"
import { MdOutlineScreenShare } from "react-icons/md"
import { FcEndCall } from "react-icons/fc"

type props = {
    localStream: MediaStream,
    remoteStream: MediaStream | null
}

export default function ShowStream({ localStream, remoteStream }: props) {

    let localVideoRef = useRef<HTMLVideoElement>(null)
    let remoteVideoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    }, [localStream])

    return (
        <div className="VideoCall">

            <div className="remote">
                <video ref={remoteVideoRef} className="remoteVideo" autoPlay muted  ></video>

                <div className="remoteOptions">
                    <i> <BsMicMute /> </i>
                    <i> <BsCameraVideoOff /> </i>
                </div>
            </div>

            <div className="local">
                <video ref={localVideoRef} className="localVideo" autoPlay muted  ></video>

                <div className="localOptions">

                    <div className="x">
                        <i> <AiOutlineSound /> </i>
                        <input type="range" />
                    </div>

                    <div className="xx">
                        <i> <BiMicrophone /> </i>
                        <i> <LuSwitchCamera /> </i>
                        <i> <BsCameraVideoOff /> </i>
                        <i> <MdOutlineScreenShare /> </i>
                    </div>

                    <button className="xxx">
                        <i> <FcEndCall /> </i>
                        <span>end call</span>
                    </button>

                </div>
            </div>
        </div>
    )

}