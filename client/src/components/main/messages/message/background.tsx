"use client"

import Image from "next/image"
import BgLight from "@/../public/images/home-dark.jpg"

export default function Background() {

    return (
        <Image
            className="StoryBackground"
            src={BgLight}
            alt="background light"
            quality={100}
            fill
            sizes="inherent"
            priority
            style={{ objectFit: "cover", zIndex:0}}
        />
    )
}