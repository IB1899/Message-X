"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { BiTrash } from 'react-icons/bi'

export default function DeleteChat({ email, connectionId }: { email: string, connectionId: string }) {

    let { replace, refresh } = useRouter()

    let DeleteContact = async () => {

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
    }

    return <button className='delete' onClick={() => DeleteContact()} > <i> <BiTrash /> </i> <span>Delete This Contact</span> </button>
}
