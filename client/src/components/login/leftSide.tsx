"use client"

import { FaGoogle, FaGithub, FaImage } from "react-icons/fa"
import { MutableRefObject, useRef } from "react";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { LineWobble } from '@uiball/loaders'
import useLogIn from "@/hooks/login";
import { signIn } from "next-auth/react";
import { setIsForgotPassword, setLoading } from "@/toolkit/slices/AuthSlice";
import { useRouter } from "next/navigation";

//! Lazily load this component 
let Message = dynamic(() => import("../auth/Message"))
let ForgotPassword = dynamic(() => import("../auth/forgotPassword"))

//! NOTE: We Don't need Zod in this page
export default function LeftSide({ children }: { children: React.ReactNode }) {

    let dispatch = useDispatch<AppDispatch>()

    let { push, prefetch } = useRouter()

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

                {children}

                <button type="button" disabled={Loading} onClick={() => { signIn("google"); dispatch(setLoading(true)) }}>
                    <span><FaGoogle /></span>  <span>Continue with Google</span>
                </button>

                <button type="button" disabled={Loading} onClick={() => { signIn("github"); dispatch(setLoading(true)) }}>
                    <span><FaGithub /></span>  <span>Continue with GitHub</span>
                </button>

                <p className="or"> or continue with email </p>

                <input disabled={Loading} type="email" required placeholder="Email*" ref={emailRef} />

                <input disabled={Loading} type="password" required placeholder="password*" ref={passwordRef} />

                <div className="links">
                    <span style={{ pointerEvents: Loading ? "none" : "painted" }} onClick={() => dispatch(setIsForgotPassword(true))} > Forgot Your Password? </span>
                </div>

                <button className="lastButton" disabled={Loading} type="submit" onMouseOver={() => prefetch("/main")} >
                    {isForgotPassword ? "Log in" :
                        Loading ? <LineWobble size={80} lineWeight={5} speed={1.75} color="white" /> : "Log in"
                    }
                </button>

                <p className="already"> Don`t have an account yet?
                    <span style={{ pointerEvents: Loading ? "none" : "painted" }} onClick={() => push("/authentication/signup")} >Signup</span>
                </p>
            </form>
        </>
    )
}