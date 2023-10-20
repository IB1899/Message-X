"use client"
import dynamic from "next/dynamic";
import { JellyTriangle } from "@uiball/loaders";
import { useAppSelector } from "@/toolkit/store";
import TextMessaging from "./messaging/messaging";

//! This is the component that is responsible for video calling
let VideoCall = dynamic(() => import("@/components/main/messages/connection/calling/videoCall"),
    {
        ssr: false, loading: () =>
            <div className="Loading-Page"
                style={{ width: '100%', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <JellyTriangle size={100} speed={1} color="#9D00BB" />
            </div>
    }
)

//! This is the component that is responsible for video calling
let VoiceCall = dynamic(() => import("@/components/main/messages/connection/calling/voiceCall"),
    {
        ssr: false, loading: () =>
            <div className="Loading-Page"
                style={{ width: '100%', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <JellyTriangle size={100} speed={1} color="#9D00BB" />
            </div>
    }
)
type props = { user: FullUser, connection: Connection, haveMe: "yes" | "no" }

export default function Operation({ user, connection, haveMe }: props) {

    let { Operation } = useAppSelector((state => state.PeerSlice))

    return (Operation === "TextMessaging" ?

        <TextMessaging user={user} connection={connection} haveMe={haveMe} />
        :
        Operation === "VideoCalling" ?
            <VideoCall />
            :
            <VoiceCall />
    )
}