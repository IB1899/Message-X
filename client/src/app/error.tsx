"use client"
import Link from "next/link";
import { useEffect } from "react"

export default function Error({ error, reset }:{ error:Error , reset:()=> void }) {

    useEffect(()=>{
        console.log(error);
    })

    return(
        <div className="Error">
            <h2> Sorry something went wrong </h2>

            <button onClick={()=> reset() } > Try again </button>
            <h5> or </h5>
            <Link href={"/"} > Back To Home Page</Link>
        </div>
    )

}