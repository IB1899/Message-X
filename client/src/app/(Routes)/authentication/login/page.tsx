import LeftSide from "@/components/login/leftSide"
import RightSide from "@/components/auth/rightSide"
import Link from "next/link"
import { FaAngleDoubleLeft, FaUsers, FaXing } from "react-icons/fa"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Messages X - Log in",
    description: "This page is for users to log-in the website"
}

export default function LogIn() {

    return (
        <div className="LogIn">

            <header>
                <Link className="phoneYes" href={"/authentication"}> <FaAngleDoubleLeft /> </Link>

                <div className="logo">
                    <i> <FaXing /> </i>
                    <span> Messages </span>
                </div>

                <div className="showOff">

                    <div className="icon">
                        <i> <FaUsers /> </i>
                        <span>Largest Social Community</span>
                    </div>

                    <nav>
                        <Link href={"signup"}>Sign up </Link>
                        <Link href={"/"}> Join Us </Link>
                    </nav>
                </div>
            </header>

            <div className="body">

                {/* Contains the Sign up logic */}
                <LeftSide>
                    <h1>Welcome Back</h1>
                    <h4>Log in to your account, and continue connecting with your friends</h4>
                </LeftSide>

                {/* Contains the swiper effects */}
                <RightSide />

            </div>
        </div>
    )
}
