"use client"

import {  FaMicrosoft, FaRegCommentDots, FaXing } from "react-icons/fa"
import { MdOutlineWebStories , MdLogout } from "react-icons/md"
import { IoIosCreate } from "react-icons/io"
import {RiSettings5Fill} from "react-icons/ri"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function SideBar() {

    let pathname = usePathname()
    let { data: session } = useSession()

    return (
        <nav>

            <div className="logo">
                <i> <FaXing /> </i>
            </div>

            <div className="links">
                <Link href={"/main"} id="A1" className={ pathname === "/main" ? "active" : "" } > <FaRegCommentDots /> </Link>
                <Link href={"/main/groups"} id="A2" className={ pathname === "/main/groups" ? "active" : "" } > <FaMicrosoft /> </Link>
                <span></span>

                <Link href={"/main/stories"} id="A3" className={ pathname === "/main/stories" ? "active" : "" } > <MdOutlineWebStories /> </Link>
                <button  id="A4" className={ pathname === "" ? "active" : "" } > <IoIosCreate /> </button>
                <span></span>

                <button id="A5" className={ pathname === "" ? "active" : "" } > <MdLogout /> </button>
                <Link href={"/main/settings"} id="A6" className={ pathname === "/main/settings" ? "active" : "" } > <RiSettings5Fill /> </Link>
            </div>

            <div className="profile">
                {session ?
                    <Link href={"/main/settings"}> <Image src={session.user.image} alt="profile image" width={45} quality={100} height={45} priority /> </Link> :
                    null
                }

            </div>

        </nav>
    )
}
