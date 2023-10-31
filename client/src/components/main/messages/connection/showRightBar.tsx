"use client"

import { setIsRightBar } from "@/toolkit/slices/PhoneSizeSlice"
import { AppDispatch } from "@/toolkit/store"
import { RiShieldUserLine } from "react-icons/ri"
import { useDispatch } from "react-redux"

export default function ShowRightBar() {

    let dispatch = useDispatch<AppDispatch>()


    return <i onClick={() => dispatch(setIsRightBar(true))} > <RiShieldUserLine /> </i>

}
