"use client"

import { useEffect, useState } from "react"
import ShowStream from "./showStream"

export default function VideoCall() {

    let [localStream , setLocalStream] = useState<MediaStream | null>(null)

    useEffect(() => {

        (async () => {

            let LocalStream = await navigator.mediaDevices.getUserMedia({ video:true , audio:true })

            setLocalStream(LocalStream)


        })()

    }, [])

    return <ShowStream localStream={localStream!} remoteStream={null} />
}
