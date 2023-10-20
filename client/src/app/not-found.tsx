
import Image from "next/image"
import left from "@/../public/images/404 1.png"
import right from "@/../public/images/404 2.png"
import { FaXing } from "react-icons/fa"
import { AiOutlineGithub, AiOutlineInstagram } from "react-icons/ai"
import { FiLinkedin } from "react-icons/fi"
import Link from "next/link"
import { Metadata } from "next"
import { Lobster } from "next/font/google"

export const metadata: Metadata = {
    title: "Messages X - 404",
    description: "This is the 404 page. NotFound"
}

const lobster = Lobster({
    subsets: ["latin"],
    weight: "400"
})


export default function NotFound() {



    return (
        <div className="NotFound">

            <div className="left">
                <Image src={left} alt="left 404 image" priority />
            </div>

            <div className="center">
                <header>
                    <i> <FaXing /> </i>
                    <h3> Messages </h3>
                </header>

                <div className="body">
                    <h1>4<span>0</span>4</h1>

                    <h3> lost in CyberSpace </h3>
                    <p>Lost in the digital wilderness, this page has gone astray. You have reached a 404 error - the path you seek is hidden.</p>

                    <button className={lobster.className} >Back To Where You Were</button>
                    <Link className={lobster.className} href={"/"} >Return To Home</Link>
                </div>

                <footer>
                    <div className="icons">
                        <i> <AiOutlineGithub /> </i>
                        <i> <AiOutlineInstagram /> </i>
                        <i> <FiLinkedin /> </i>
                    </div>
                    <p className={lobster.className} > Keep in touch with us </p>
                </footer>

            </div>

            <div className="right">
                <Image src={right} alt="right 404 image" priority />
            </div>
        </div>
    )
}