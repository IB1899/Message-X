import LeftSide from "@/components/signup/leftSide"
import RightSide from "@/components/auth/rightSide"
import { Metadata } from "next"
import Link from "next/link"
import { FaXing, FaUsers, FaArrowLeft, FaAngleLeft, FaAngleDoubleLeft } from "react-icons/fa"

export const metadata: Metadata = {
    title: "New User - Messages",
    description: "This page to sign up new users to our website"
}

export default function SignUp() {


    return (
        <div className="SignUp">

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
                        <Link href={"login"}> Log In </Link>
                        <Link href={"/"}> Join Us </Link>
                    </nav>
                </div>
            </header>

            <div className="body">

                {/* Contains the Sign up logic */}
                <LeftSide />

                {/* Contains the swiper effects */}
                <RightSide />
            </div>

        </div>
    )
}
