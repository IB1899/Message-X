"use client"
import Link from "next/link";
import { useEffect } from "react"
import Image from "next/image"
import BgLight from "@/../public/images/oops.jpg"

export default function Error({ error, reset }: { error: Error, reset: () => void }) {

    useEffect(() => {
        console.log(error);
    })

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

            <h2> Sorry something went wrong </h2>

            <button onClick={() => reset()} > Try again </button>
            <h5> or </h5>
            <Link href={"/"} > Back To Home Page</Link>
        </div>
    )

}