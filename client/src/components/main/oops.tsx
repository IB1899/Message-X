import Image from "next/image"
import BgLight from "@/../public/images/oops.jpg"
import Link from "next/link"
import Button from "./button"
import { FaXing } from "react-icons/fa"

export default function Oops({ error, message }: { error: string, message: string }) {

    return (
        <div className="Oops">
            <Image
                className="oopsBackground"
                src={BgLight}
                alt="background light"
                quality={100}
                fill
                sizes="100vw"
                priority
                style={{ objectFit: "cover", zIndex: -10 }}
            />

            <header>
                <i> <FaXing /> </i>
                <h3> Messages </h3>
            </header>

            <h1> Oops! </h1>

            <h3> {error} </h3>

            <p> {message} </p>

            <Button />
        </div>
    )
}
