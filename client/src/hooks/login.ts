import { setFailed, setIsForgotPassword, setLoading, setVerifyEmail } from "@/toolkit/slices/AuthSlice";
import { AppDispatch } from "@/toolkit/store";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { useDispatch } from "react-redux";

//! This is a custom hook for login page
export default function useLogIn() {

    let dispatch = useDispatch<AppDispatch>()
    let router = useRouter()

    //! To log in to the application
    let LogIn = async (e: FormEvent<HTMLFormElement>, email: string, password: string) => {

        e.preventDefault()
        dispatch(setLoading(true))

        if(!email || !password){ 
            dispatch(setVerifyEmail("How the hell did you manage to do tha"))
            return
        }

        let response = await fetch("http://localhost:3000/api/login", {
            method: "POST", body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "Application/json" }
        })

        let result = await response.json();

        if (result?.failed) {
            dispatch(setFailed(result?.failed))
            dispatch(setLoading(false))
        }

        //! Now Authenticate the user
        else if (result?.success) {

            let { name, email, image, _id: id } = result.user

            await signIn("credentials", {
                operation: "LOGIN", name, email, image, id,
                redirect: false,
                callbackUrl: "/"
            })
            
            window.location.reload()
        }
        else {
            dispatch(setFailed("Something went wrong"))
            dispatch(setLoading(false))
        }
    }

    //! To reset the user's password
    let ResetPassword = async (e: FormEvent<HTMLFormElement>, email: string,) => {
        e.preventDefault()
        dispatch(setLoading(true))

        if(!email){ 
            dispatch(setVerifyEmail("How the hell did you manage to do that"))
            return
        }

        let response = await fetch("http://localhost:3000/api/resetPassword", {
            method: "POST", body: JSON.stringify({ email }),
            headers: { "Content-Type": "Application/json" }
        })

        let result = await response.json();

        dispatch(setLoading(false))

        if (result?.failed) {
            dispatch(setVerifyEmail(result.failed))
        }
        else if (result?.success) {
            dispatch(setVerifyEmail(result.success))

            setTimeout(()=>{
                dispatch(setVerifyEmail(""));
                dispatch( setIsForgotPassword(false) )
            },4000)
        }
    }

    return { LogIn , ResetPassword}
}