import RightSide from "@/components/auth/rightSide"
import { Metadata } from "next"
import Link from "next/link"
import { FaXing, FaUsers } from "react-icons/fa"

export const metadata: Metadata = {
    title: "Message X - Authentication",
    description: "This page to introduce users to the page authentication"
}

//! This page only appears to the phone size website
export default function Authentication() {


    return (
        <div className="Authentication">

            <header>
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
                        <Link href={"/"}> Join Us </Link>
                    </nav>
                </div>
            </header>

            <div className="body">

                {/* Contains the Sign up logic */}
                <RightSide />


                <div className="phone">
                    <h1>create account!</h1>
                    <p>We are very glad to have test you back friend.We test you back friend. or to our new data.</p>

                    <div className="largeButton">
                        <Link href={"/authentication/login"}>Login</Link>
                        <Link href={"/authentication/signup"}>SignUp</Link>
                    </div>
                </div>

            </div>

        </div>
    )
}
