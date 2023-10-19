"use client"
import { LineWobble } from '@uiball/loaders'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BiTrash } from 'react-icons/bi'

export default function DeleteChat({ email, connectionId }: { email: string, connectionId: string }) {

    let { replace, refresh } = useRouter()

    let [loading, setLoading] = useState(false)

    let DeleteContact = async () => {

        setLoading(true)
        let response = await fetch("http://localhost:3000/api/messages", {
            method: "Delete", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, connectionId })
        })

        let result = await response.json()

        if (result?.failed) console.log(result.failed);
        
        else {
            replace("/main/messages")
            refresh()
        }
        setLoading(false)
    }

    return (
        <button className='delete' onClick={() => DeleteContact()} disabled={loading} >
            <i> <BiTrash /> </i>
            {loading ? <LineWobble size={80} lineWeight={5} speed={1.75} color="red" /> :
                <span>Delete This Contact</span>
            }
        </button>
    )
}
