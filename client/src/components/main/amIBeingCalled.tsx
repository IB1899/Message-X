import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { Lobster } from "next/font/google"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { setAmIBeingCalled, setOperation } from "@/toolkit/slices/PeerSlice"
import { useEffect } from "react"
import { Socket } from "socket.io-client"
import { useRouter } from "next/navigation"

const lobster = Lobster({
    subsets: ["latin"],
    weight: "400"
})

//! This is a pop up component that is shown when the current user receives a call from one of his/her connections
export default function AmIBeingCalled({ userId }: { userId: string }) {
    let audio = new Audio()

    useEffect(() => {
        audio.src = '/CallTone.mp3'
        audio.loop = true
        audio.play();
    }, [])

    let { push } = useRouter()

    let { amIBeingCalled } = useAppSelector((state => state.PeerSlice))
    let { socket } = useAppSelector((state => state.SocketSlice))

    let dispatch = useDispatch<AppDispatch>()

    //! Whether to reject or accept the call
    let callResponse = (answer: "yes" | "no") => {
        audio.pause()
        audio.volume = 0

        dispatch(setAmIBeingCalled({ isCalling: false, name: "", image: "", connectionId:"" ,  room: "",type: "video" }));

        if (answer === "no") {

            socket.emit("CallAnswer-FrontendSends-BackendReceives", { answer, room: amIBeingCalled.room })
        }
        else {
            amIBeingCalled.type === "video" ? dispatch(setOperation("VideoCalling")) : dispatch(setOperation("VoiceCalling"))
            push(`/main/messages/${amIBeingCalled.connectionId}?id=${userId}&active=true&now=now`)
        }
    }

    return (
        <div className="bg">

            <div className="IamBeingCalled">
                <Image src={amIBeingCalled.image} alt="caller image" width={230} height={230} />

                <h3> {amIBeingCalled.name} is <span>{amIBeingCalled.type === "video" ? "video" : "voice"}</span> calling you </h3>

                <div className="buttons">
                    <button id="ID0" className={lobster.className} onClick={() => callResponse("yes")} >
                        Answer
                    </button>

                    <button id="ID1" className={lobster.className} onClick={() => callResponse("no")} >
                        Decline
                    </button>
                </div>

            </div>
        </div>
    )
}
