import { setOperation } from "@/toolkit/slices/PeerSlice"
import { AppDispatch } from "@/toolkit/store"
import { Dispatch, RefObject, SetStateAction } from "react"
import { useDispatch } from "react-redux"
import { Socket } from "socket.io-client"

export let useAudioCall = (
    socket: Socket,
    adjustments: { microphone: boolean; soundOff: boolean; },
    setAdjustments: Dispatch<SetStateAction<{ microphone: boolean; soundOff: boolean; }>>,
    connection: Connection,
    remoteAudioRef: RefObject<HTMLVideoElement>

) => {

    let dispatch = useDispatch<AppDispatch>()

    let endCall = () => {

        socket.emit("EndCall-FrontendSends-BackendReceives", { room: connection.RoomConnectionId })
        dispatch(setOperation("TextMessaging"))
    }

    let localSwitches = async (operation: "SOUND" | "MICROPHONE") => {

        switch (operation) {

            case "MICROPHONE":

                //! I don't mute their voice I mute mine
                socket.emit("Signal-MICROPHONE", { room: connection.RoomConnectionId, turnOff: adjustments.microphone })
                setAdjustments({ ...adjustments, microphone: !adjustments.microphone });
                break;

            case "SOUND":

                //! I don't mute my voice I mute theirs
                adjustments.soundOff ? remoteAudioRef.current!.volume = 0 : remoteAudioRef.current!.volume = 1;
                setAdjustments({ ...adjustments, soundOff: !adjustments.soundOff });

                break;

        }
    }

    return { endCall, localSwitches }
}

