"use client"
import { setSearchChat } from "@/toolkit/slices/SocketsSlice"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { ThreeBody } from "@uiball/loaders"
import { FormEvent, useRef, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useDispatch } from "react-redux"


export default function SearchChat() {

    let [loading, setLoading] = useState(false)

    let searchRef = useRef<HTMLInputElement>(null)

    let { searchChat } = useAppSelector((state => state.SocketSlice))

    let dispatch = useDispatch<AppDispatch>()


    let SearchChat = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch(setSearchChat(searchRef.current!.value))
    }


    return (
        <form className="SearchChat" onSubmit={(e) => SearchChat(e)}>
            <input type="text" required ref={searchRef} placeholder="Search by name or username" />

            {loading ?
                <ThreeBody size={30} speed={0.7} color="#9D00BB" />
                :
                <button disabled={loading}> <FaSearch /> </button>
            }
        </form>
    )
}
