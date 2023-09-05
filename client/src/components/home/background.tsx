"use client"

import Image from "next/image"
import BgLight from "@/../public/images/home-light.jpg"

export default function Background() {

    return (
        <Image
            className="homeBackground"
            src={BgLight}
            alt="background light"
            quality={100}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "cover", zIndex: -10 }}
        />
    )
}