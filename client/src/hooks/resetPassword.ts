import { setLoading, setMessage } from "@/toolkit/slices/ResetPassSlice"
import { AppDispatch } from "@/toolkit/store";
import { useRouter } from "next/navigation";
import { FormEvent, MutableRefObject } from "react";
import { useDispatch } from "react-redux";

export let useResetPassword = (
    passwordRef: MutableRefObject<HTMLInputElement>,
    confirmRef: MutableRefObject<HTMLInputElement>,
    email: string
) => {

    let dispatch = useDispatch<AppDispatch>()
    let { replace } = useRouter()

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

    return { ResetPassword }
}