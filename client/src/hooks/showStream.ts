import { setOperation } from "@/toolkit/slices/PeerSlice";
import { AppDispatch } from "@/toolkit/store";
import Peer from "peerjs";
import { Dispatch, RefObject, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";

//! For the Video Call
export const useShowStream = (
    adjustments: { camera: boolean, screenSharing: boolean, switchCamera: boolean, microphone: boolean },
    setAdjustments: Dispatch<SetStateAction<{ camera: boolean, screenSharing: boolean, switchCamera: boolean, microphone: boolean; }>>,
    localStream: MediaStream,
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>,
    localVideoRef: RefObject<HTMLVideoElement>,
    socket: Socket,
    room: string,
    peer: Peer,
    peerId: string,
    setHasAnswered: Dispatch<SetStateAction<{ hasAnswered: boolean; TheAnswer: string; message: string }>>,
    setRemoteStream: Dispatch<SetStateAction<MediaStream | null>>,

) => {

    let dispatch = useDispatch<AppDispatch>()


    //! These are the changes that the local user make in his/her instance on the other user's stream.
    let localSwitches = async (operation: "ONOFF" | "SWITCH-CAMERA" | "SCREEN-SHARING" | "MICROPHONE") => {

        switch (operation) {
            case "ONOFF":

                adjustments.camera ? localVideoRef.current!.srcObject = null :
                    localVideoRef.current!.srcObject = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true })

                setAdjustments({ ...adjustments, camera: !adjustments.camera });

                //! Because I don't know how to update the stream between the two users, I will accomplish that through making signals with socket. 
                socket.emit("Signal-ONOFF", { room, turnOff: adjustments.camera })
                break;


            case "SWITCH-CAMERA":
                try {

                    if (!adjustments.camera) return

                    if (localStream) {
                        localStream.getTracks().forEach(track => track.stop());
                    }

                    let newStream = adjustments.switchCamera ?
                        await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true }) :
                        await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true })

                    setLocalStream(newStream);
                    setAdjustments({ ...adjustments, switchCamera: !adjustments.switchCamera });

                } catch (err: any) {
                    console.log(err.message);
                }

                break;

            case "SCREEN-SHARING":

                let newStream = adjustments.screenSharing ?
                    await navigator.mediaDevices.getUserMedia({ video: true, audio: true }) :
                    await navigator.mediaDevices.getDisplayMedia({ audio: true })


                if (adjustments.screenSharing) {
                    localStream.getTracks().forEach(track => track.stop())
                }
                setLocalStream(newStream)
                // let call = peer.call(peerId, newStream) //! Update The stream

                // call.on("stream", (remoteUserStream) => {
                //     setHasAnswered({ hasAnswered: true, TheAnswer: "yes", message: "accepted call" })
                //     setRemoteStream(remoteUserStream);
                // })

                setAdjustments({ ...adjustments, screenSharing: !adjustments.screenSharing })
                break;

            case "MICROPHONE":
                // adjustments.microphone ? localVideoRef.current!.volume = 0 : localVideoRef.current!.volume = 1;

                //! I don't mute their voice I mute mine
                socket.emit("Signal-MICROPHONE", { room, turnOff: adjustments.microphone })
                setAdjustments({ ...adjustments, microphone: !adjustments.microphone });
                break;

        }
    }

    let endCall = () => {

        localStream.getTracks().forEach(track => { track.stop() })
        socket.emit("EndCall-FrontendSends-BackendReceives", { room })
        dispatch(setOperation("TextMessaging"))
        setLocalStream(null)
    }

    return { endCall, localSwitches }
}