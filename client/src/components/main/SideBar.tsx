"use client"

import { FaMicrosoft, FaRegCommentDots, FaXing } from "react-icons/fa"
import { MdOutlineWebStories, MdLogout } from "react-icons/md"
import { IoIosCreate } from "react-icons/io"
import { RiSettings5Fill } from "react-icons/ri"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { setIsSettings } from "@/toolkit/slices/MainSlice"
import useLogOut from "@/hooks/logout"
import { useEffect } from "react"
import { setAmIBeingCalled } from "@/toolkit/slices/PeerSlice"
import dynamic from "next/dynamic"
import { setIsProfile } from "@/toolkit/slices/PhoneSizeSlice"

//! To lazily load this component
const AmIBeingCalled = dynamic(() => import("./amIBeingCalled"))


export default function SideBar({ user }: { user: FullUser }) {

    let pathname = usePathname()
    let router = useRouter()

    let dispatch = useDispatch<AppDispatch>()

    let { isSettings } = useAppSelector((state => state.MainSlice))
    let { Operation, amIBeingCalled } = useAppSelector((state => state.PeerSlice))
    let { socket } = useAppSelector((state => state.SocketSlice))
    let { isProfile } = useAppSelector((state => state.PhoneSizeSlice))

    let openProfile = () => {
        dispatch(setIsProfile(!isProfile))
        dispatch(setIsSettings(false))
        if (pathname !== "/main/messages") {
            router.push("/main/messages")
        }
    }

    //! Log users out
    let SignOut = async () => {

        //! 1- Clear the Auth cookie
        let response = await fetch("http://localhost:3000/api/settings");
        let result = await response.json();

        //! 2- Clear the session 
        if (result?.success) {
            await signOut();
            window.location.reload()
        }
    }

    //? I am writing the logic of listening for calls and showing the answer decline pop-up here in order to allow
    //? the user to get the call no matter where they are in our application
    //! Listening if any other user calls this user
    useEffect(() => {

        socket.on("ShowThereIsVideoCall", ({ name, image, room, connectionId }: { [key: string]: string }) => {
            if (!amIBeingCalled.isCalling) dispatch(setAmIBeingCalled({ isCalling: true, name, image, room, connectionId, type: "video" }))
        })

        socket.on("ShowThereIsVoiceCall", ({ name, image, room, connectionId }: { [key: string]: string }) => {
            if (!amIBeingCalled.isCalling) dispatch(setAmIBeingCalled({ isCalling: true, name, image, room, connectionId, type: "voice" }))
        })

    }, [])

    return (
        <>
            {amIBeingCalled.isCalling ? <AmIBeingCalled userId={user._id} /> : null}

            <nav>
                <div className="logo">
                    <i> <FaXing /> </i>
                </div>

                <div className="links">

                    <Link style={{ pointerEvents: Operation === "VideoCalling" || Operation === "VoiceCalling" ? "none" : "painted" }}
                        onClick={() =>{ dispatch(setIsProfile(false)); dispatch(setIsSettings(false))}} href={"/main/messages"} id="A1"
                        className={pathname === "/main/messages" && !isSettings ? "active" : ""}
                    >
                        <FaRegCommentDots />
                    </Link>
                    <span className="phoneOnly"></span>

                    <Link style={{ pointerEvents: Operation === "VideoCalling" || Operation === "VoiceCalling" ? "none" : "painted" }}
                        onClick={() => dispatch(setIsSettings(false))} href={"/main/groups"} id="A2"
                        className={pathname === "/main/groups" && !isSettings ? "active" : ""}
                    >
                        <FaMicrosoft />
                    </Link>

                    <span></span>

                    <Link style={{ pointerEvents: Operation === "VideoCalling" || Operation === "VoiceCalling" ? "none" : "painted" }}
                        onClick={() => dispatch(setIsSettings(false))} href={"/main/stories"} id="A3"
                        className={pathname === "/main/stories" && !isSettings ? "active" : ""}
                    >
                        <MdOutlineWebStories />
                    </Link>

                    <button id="A4" className={pathname === "" ? "active" : ""} > <IoIosCreate /> </button>
                    <span></span>

                    <button style={{ pointerEvents: Operation === "VideoCalling" || Operation === "VoiceCalling" ? "none" : "painted" }}
                        id="A5" onClick={SignOut}> <MdLogout /> </button>
                    <button style={{ pointerEvents: Operation === "VideoCalling" || Operation === "VoiceCalling" ? "none" : "painted" }}
                        id="A6" className={isSettings ? "active" : ""} onClick={() =>{ dispatch(setIsProfile(false)); dispatch(setIsSettings(!isSettings))}} >
                        <RiSettings5Fill />
                    </button>
                </div>
                <span className="phoneOnly"></span>

                {user?.image ?
                    <button style={{ pointerEvents: Operation === "VideoCalling" || Operation === "VoiceCalling" ? "none" : "painted" }}
                        className="profile" onClick={() => openProfile()}>
                        <Image src={user.image} alt="profile image" width={45} quality={100} height={45} priority />
                    </button> :
                    null
                }
            </nav>
        </>
    )
}
