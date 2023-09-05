"use client"

import { setFailed, setSuccess, setVerifyEmail } from "@/toolkit/slices/AuthSlice"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { FaCheckSquare, FaExclamationTriangle, FaWindowClose } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { LineWobble } from '@uiball/loaders'
import useSignUp from "@/hooks/signup"
import { MutableRefObject, useMemo, useRef } from "react"

export default function Message({ data, type }: { data: { email: string, image: any }, type: "success" | "failed" }) {

    let dispatch = useDispatch<AppDispatch>()
    let { Success, Failed, verifyMessage, Loading } = useAppSelector((state => state.AuthSlice))

    let { Validate } = useSignUp(data)

    let spanRef = useRef<HTMLSpanElement>(null);
    let interval = useMemo(() => {
        let timer = 110

        //! 1- This is an async function.
        //! 2- This function must be stopped using the clearInterval() only.
        //! 3- This function will still run even if the component isn't rendering.
        return setInterval(() => { 
            timer = timer - 1
            if (spanRef.current) spanRef.current.textContent = timer.toString()
            if(timer === 0 || timer < 1 ) close()
        }, 1000)
    }, [])

    let close = () => {
        dispatch(setSuccess(""));
        dispatch(setVerifyEmail(""));
        clearInterval(interval)
    }
    return (
        <div className="BackGround">
            {type === "success" ?
                <div className="Message success">

                    <i className="close" onClick={close}> <FaWindowClose /> </i>
                    <i> <FaCheckSquare /> </i>
                    <h3> {Success} </h3>

                    <button onClick={Validate} disabled={Loading} >
                        {Loading ? <LineWobble size={80} lineWeight={5} speed={1.75} color="white" /> : "verify"}
                    </button>

                    <h4 className="error"> {verifyMessage} </h4>
                    <span className="timer" ref={spanRef} > 110 </span>

                </div>
                :
                <div className="Message failed">
                    <i> <FaExclamationTriangle /> </i>
                    <h3> {Failed} </h3>
                    <button onClick={() => dispatch(setFailed(""))} > close </button>
                </div>
            }
        </div>
    )
}
