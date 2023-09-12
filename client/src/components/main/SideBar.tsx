"use client"

import { FaMicrosoft, FaRegCommentDots, FaXing } from "react-icons/fa"
import { MdOutlineWebStories, MdLogout } from "react-icons/md"
import { IoIosCreate } from "react-icons/io"
import { RiSettings5Fill } from "react-icons/ri"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { setIsProfile, setIsSettings } from "@/toolkit/slices/MainSlice"

export default function SideBar() {

    let pathname = usePathname()
    let { data: session } = useSession()

    let dispatch = useDispatch<AppDispatch>()

    let { isSettings, isProfile } = useAppSelector((state => state.MainSlice))

    return (
        <nav>

            <div className="logo">
                <i> <FaXing /> </i>
            </div>

            <div className="links">

                <Link onClick={() => dispatch(setIsSettings(false))} href={"/main"} id="A1" className={pathname === "/main" ? "active" : ""} >
                    <FaRegCommentDots />
                </Link>

                <Link onClick={() => dispatch(setIsSettings(false))} href={"/main/groups"} id="A2" className={pathname === "/main/groups" ? "active" : ""} >
                    <FaMicrosoft />
                </Link>

                <span></span>

                <Link onClick={() => dispatch(setIsSettings(false))} href={"/main/stories"} id="A3" className={pathname === "/main/stories" ? "active" : ""} >
                    <MdOutlineWebStories />
                </Link>

                <button id="A4" className={pathname === "" ? "active" : ""} > <IoIosCreate /> </button>
                <span></span>

                <button id="A5" onClick={() => null}> <MdLogout /> </button>
                <button id="A6" onClick={() => dispatch(setIsSettings(!isSettings))} > <RiSettings5Fill /> </button>
            </div>

            {session ?
                <button className="profile" onClick={() => dispatch(setIsProfile(!isProfile))}>
                    <Image src={session.user.image} alt="profile image" width={45} quality={100} height={45} priority />
                </button> :
                null
            }
        </nav>
    )
}
