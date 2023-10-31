"use client"

import { setIsBigBar } from "@/toolkit/slices/PhoneSizeSlice"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"
import { useDispatch } from "react-redux"

export default function ShowBigBar() {

    let { isBigBar } = useAppSelector((state => state.PhoneSizeSlice))
    let dispatch = useDispatch<AppDispatch>()


    return isBigBar ?
    <i className="show-hide-BigBar" onClick={() => dispatch(setIsBigBar(!isBigBar))} > <AiFillCaretLeft /> </i>
    :
    <i className="show-hide-BigBar" onClick={() => dispatch(setIsBigBar(!isBigBar))} > <AiFillCaretRight /> </i>

}
