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
import { setIsProfile, setIsSettings } from "@/toolkit/slices/MainSlice"
import useLogOut from "@/hooks/logout"

export default function SideBar({ user }: { user: FullUser }) {

    let pathname = usePathname()
    let router = useRouter()

    let dispatch = useDispatch<AppDispatch>()

    let { isSettings, isProfile } = useAppSelector((state => state.MainSlice))

    //! Open the settings popup
    let openSettings = () => {

        dispatch(setIsSettings(!isSettings))
    }

    let openProfile = () => {
        if (pathname !== "/main") {
            router.push("/main")
        }
        dispatch(setIsProfile(!isProfile))
    }

    let { SignOut } = useLogOut()

    return (
        <nav>

            <div className="logo">
                <i> <FaXing /> </i>
            </div>

            <div className="links">

                <Link onClick={() => dispatch(setIsSettings(false))} href={"/main"} id="A1
                " className={pathname === "/main" && !isSettings ? "active" : ""}
                >
                    <FaRegCommentDots />
                </Link>

                <Link onClick={() => dispatch(setIsSettings(false))} href={"/main/groups"} id="A2"
                    className={pathname === "/main/groups" && !isSettings ? "active" : ""}
                >
                    <FaMicrosoft />
                </Link>

                <span></span>

                <Link onClick={() => dispatch(setIsSettings(false))} href={"/main/stories"} id="A3"
                    className={pathname === "/main/stories" ? "active" : ""}
                >
                    <MdOutlineWebStories />
                </Link>

                <button id="A4" className={pathname === "" ? "active" : ""} > <IoIosCreate /> </button>
                <span></span>

                <button id="A5" onClick={SignOut}> <MdLogout /> </button>
                <button id="A6" className={isSettings ? "active" : ""} onClick={() => dispatch(setIsSettings(!isSettings))} >
                    <RiSettings5Fill />
                </button>
            </div>

            {user?.image ?
                <button className="profile" onClick={() => openProfile()}>
                    <Image src={user.image} alt="profile image" width={45} quality={100} height={45} priority />
                </button> :
                null
            }
        </nav>
    )
}
