"use client"

import { setIsForgotPassword, setVerifyEmail } from "@/toolkit/slices/AuthSlice"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { FaWindowClose } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { MutableRefObject, useRef } from "react"
import useLogIn from "@/hooks/login"
import { LineWobble } from "@uiball/loaders"

export default function ForgotPassword() {

    let dispatch = useDispatch<AppDispatch>()
    let { verifyMessage, Loading } = useAppSelector((state => state.AuthSlice))

    let emailRef = useRef() as MutableRefObject<HTMLInputElement>

    let { ResetPassword } = useLogIn()

    let close = () => {
        dispatch(setVerifyEmail(""));
        dispatch(setIsForgotPassword(false));
    }
    return (
        <div className="BackGround">

            <form className="Message Reset-Password" onSubmit={(e) => ResetPassword(e, emailRef.current.value)} >
                <i className="close" style={{ pointerEvents: Loading ? "none" : "painted" }} onClick={close}> <FaWindowClose /> </i>

                <h1> Password Reset </h1>

                <label htmlFor="email"> To reset your password enter the email you used to create your account </label>

                <input disabled={Loading} type="email" name="email" ref={emailRef} required placeholder="E-mail Address" />

                <button type="submit" disabled={Loading} >

                    {Loading ? <LineWobble size={80} lineWeight={5} speed={1.75} color="white" /> : "Send Reset Link"}
                </button>

                <h4 className="error"> {verifyMessage} </h4>
            </form>
        </div>
    )
}
