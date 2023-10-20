import { FaArrowRight, FaHome, FaXing } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import landingLight from "@/../public/images/astronaut2 light.png"
import { Lobster } from "next/font/google"
import Background from "@/components/home/background"

const lobster = Lobster({
    subsets: ["latin"],
    weight: "400"
})

export default function Home() {

    return (
        <div className="Home">
            <Background />
            <header>
                <div className="logo">
                    <i> <FaXing /> </i>
                    <span> Messages X </span>
                </div>
                <nav>
                    <Link href={"/"}> <FaHome /> Home </Link>
                    <Link className="phoneNone" href={"authentication/signup"}> Sign Up </Link>
                    <Link className="phoneNone" href={"authentication/login"}> Log In </Link>
                    <Link className="phoneYes" href={"authentication/"}> Start Now <FaArrowRight /> </Link>
                </nav>
            </header>

            <div className="landing">
                <div className="leftSide">
                    <h1> Welcome to a New <span>Horizon</span> - of Interactive Communication. </h1>

                    <p>

                        Step into a world of limitless communication possibilities. Our messaging
                        platform offers an immersive experience, empowering you to connect, share,
                        and engage effortlessly. Seamlessly designed for both casual
                        chats and profound exchanges, it is where your words find their true home.
                    </p>

                    <button className="phoneNone" > <Link href={"/authentication/signup"}> Start Your Journey </Link> </button>
                    <button className="phoneYes" > <Link href={"/authentication/"}> Start Your Journey </Link> </button>

                    <h4> Created By
                        <span className={lobster.className}>
                            Ibrahim Ali
                        </span>
                        - lya838021@gmail.com
                    </h4>
                </div>

                <div className="rightSide">
                    <Image src={landingLight} alt="landingLight" />
                </div>
            </div>

        </div>
    )
}

