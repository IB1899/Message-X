import { Dispatch, RefObject, SetStateAction } from "react";

export const useShowStream = (
    adjustments: { camera: boolean, screenSharing: boolean, switchCamera: boolean, microphone: boolean },
    setAdjustments: Dispatch<SetStateAction<{ camera: boolean, screenSharing: boolean, switchCamera: boolean, microphone: boolean; }>>,
    localStream: MediaStream,
    setLocalStream: Dispatch<SetStateAction<MediaStream | null>>,
    localVideoRef: RefObject<HTMLVideoElement>
) => {


    //! These are the changes that the local user make in his/her instance on the other user's stream.
    let localSwitches = async (operation: "ONOFF" | "SWITCH-CAMERA" | "SCREEN-SHARING" | "MICROPHONE") => {

        switch (operation) {
            case "ONOFF":

                adjustments.camera ? localVideoRef.current!.srcObject = null :
                    localVideoRef.current!.srcObject = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true })

                setAdjustments({ ...adjustments, camera: !adjustments.camera });
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
                setAdjustments({ ...adjustments, screenSharing: !adjustments.screenSharing })
                break;

            case "MICROPHONE":
                adjustments.microphone ? localVideoRef.current!.volume = 0 : localVideoRef.current!.volume = 1

                setAdjustments({ ...adjustments, microphone: !adjustments.microphone });
                break;

        }
    }

    return { localSwitches }
}