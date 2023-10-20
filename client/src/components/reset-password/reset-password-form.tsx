"use client"

import { useResetPassword } from "@/hooks/resetPassword"
import { useAppSelector } from "@/toolkit/store"
import { LineWobble } from "@uiball/loaders"
import { MutableRefObject, useRef } from "react"

export default function ResetPasswordForm({ children, email }: { children: React.ReactNode, email: string }) {

    let { message, Loading } = useAppSelector((state => state.ResetPasswordSlice))

    let passwordRef = useRef() as MutableRefObject<HTMLInputElement>
    let confirmRef = useRef() as MutableRefObject<HTMLInputElement>

    let { ResetPassword } = useResetPassword(passwordRef, confirmRef, email)

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

                {children}

                <h4> {message} </h4>
            </form>
        </>
    )
}
