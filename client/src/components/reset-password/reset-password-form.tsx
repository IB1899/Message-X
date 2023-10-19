"use client"

import { setLoading, setMessage } from "@/toolkit/slices/ResetPassSlice"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { LineWobble } from "@uiball/loaders"
import { useRouter } from "next/navigation"
import { FormEvent, MutableRefObject, useRef } from "react"
import { useDispatch } from "react-redux"
import Link from "next/link"

export default function ResetPasswordForm({ email }: { email: string }) {

    let dispatch = useDispatch<AppDispatch>()
    let { message, Loading } = useAppSelector((state => state.ResetPasswordSlice))

    let { replace } = useRouter()

    let passwordRef = useRef() as MutableRefObject<HTMLInputElement>
    let confirmRef = useRef() as MutableRefObject<HTMLInputElement>

    let ResetPassword = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        let password = passwordRef.current.value;
        let confirm = confirmRef.current.value

        if (!password || !confirm) {
            dispatch(setMessage("Please enter the password the the confirm password"))
            return
        }

        if (password.length < 10) {
            dispatch(setMessage("The password must be at least 10 characters"))
            return
        }

        if (password !== confirm) {
            dispatch(setMessage("The passwords you entered don`t match"))
            return
        }
        dispatch(setLoading(true))

        let response = await fetch("http://localhost:3000/api/resetPassword", {
            method: "PUT", body: JSON.stringify({ email, newPassword: password }),
            headers: { "Content-Type": "Application/json" }
        })

        let result = await response.json();

        dispatch(setLoading(false))
        if (result.success) {
            dispatch(setMessage(result.success))

            setTimeout(() => {
                replace("/authentication/login")
            }, 6000)
        } else {
            dispatch(setMessage(result.failed))
        }
    }

    return (
        <>
            <form className="right" onSubmit={(e) => ResetPassword(e)}>

                <h1>Reset Password</h1>
                <p>Please provide the following details to reset your password. </p>


                <input type="password" required ref={passwordRef} placeholder="Password" />

                <input type="password" required ref={confirmRef} placeholder="Re-enter Password" />

                <button type="submit" disabled={Loading} >
                    {Loading ? <LineWobble size={80} lineWeight={5} speed={1.75} color="white" /> : "Reset Password"}
                </button>

                <Link style={{ pointerEvents: Loading ? "none" : "painted" }} href={"/authentication/login"}>Go back to login?</Link>
                <h4> {message} </h4>
            </form>
        </>
    )
}
