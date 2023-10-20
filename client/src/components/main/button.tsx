"use client"

import { LineWobble } from '@uiball/loaders';
import { signOut } from 'next-auth/react';
import { Lobster } from 'next/font/google';
import React, { useState } from 'react'

const lobster = Lobster({
    subsets: ["latin"],
    weight: "400"
})

export default function Button() {

    let [loading, setLoading] = useState(false)

    //! Log users out
    let SignOut = async () => {

        setLoading(true)
        //! 1- Clear the Auth cookie
        let response = await fetch("http://localhost:3000/api/settings");
        let result = await response.json();

        //! 2- Clear the session 
        if (result?.success) {
            await signOut();
            window.location.reload()
        }
        setLoading(false)
    }

    return <button className={lobster.className} onClick={SignOut} >
        {loading ? <LineWobble size={80} lineWeight={5} speed={1.75} color="white" /> : "Go Back To Retry"}</button>

}
