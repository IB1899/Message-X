"use client"

import { FaGoogle, FaGithub, FaImage } from "react-icons/fa"
import googleImage from "@/../public/icons/google.png"
import Image from "next/image";
import { MutableRefObject, useRef, useState } from "react";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { LineWobble } from '@uiball/loaders'
import useLogIn from "@/hooks/login";
import { signIn } from "next-auth/react";
import { setIsForgotPassword, setLoading } from "@/toolkit/slices/AuthSlice";
import { useRouter } from "next/navigation";
import ForgotPassword from "../auth/forgotPassword";

//! Lazily load this component 
let Message = dynamic(() => import("../auth/Message"))

//! NOTE: We Don't need Zod in this page
export default function LeftSide() {

    let dispatch = useDispatch<AppDispatch>()

    let { push } = useRouter()

    let { Success, Failed, Loading, isForgotPassword } = useAppSelector((state => state.AuthSlice))

    let emailRef = useRef() as MutableRefObject<HTMLInputElement>
    let passwordRef = useRef() as MutableRefObject<HTMLInputElement>

    //! All LogIn page methods are in the 'useLogIn' hook
    let { LogIn } = useLogIn()

    return (
        <>
            {/* //! The Response of the user logging in */}
            {Failed ? (<Message data={{ email: "", image: "" }} type={"failed"} />) : null}
            
            {/* //! The rest password popup container */}
            {isForgotPassword ? (<ForgotPassword />) : null}

            <form className="LeftSide" onSubmit={(e) => LogIn(e, emailRef.current.value, passwordRef.current.value)} >

                <h1>Welcome Back</h1>
                <h4>Log in to your account, and continue connecting with your friends</h4>

                <button type="button" disabled={Loading} onClick={() => { signIn("google"); dispatch(setLoading(true)) }}>
                    <span><Image src={googleImage} alt="google" /></span> <span>Continue with Google</span>
                </button>

                <button type="button" disabled={Loading} onClick={() => { signIn("github"); dispatch(setLoading(true)) }}>
                    <span><FaGithub /></span>  <span>Continue with GitHub</span>
                </button>

                <p className="or"> or continue with email </p>

                <input disabled={Loading} type="email" required placeholder="Email*" ref={emailRef} />

                <input disabled={Loading} type="password" required placeholder="password*" ref={passwordRef} />

                <div className="links">
                    <span onClick={() => dispatch(setIsForgotPassword(true))} > Forgot Your Password? </span>
                </div>

                <button className="lastButton" disabled={Loading} type="submit">
                    {isForgotPassword ? "Log in" :
                        Loading ? <LineWobble size={80} lineWeight={5} speed={1.75} color="white" /> : "Log in"
                    }
                </button>

                <p className="already"> Don`t have an account yet?
                    <span onClick={() => push("/authentication/signup")} >Signup</span>
                </p>
            </form>
        </>
    )
}