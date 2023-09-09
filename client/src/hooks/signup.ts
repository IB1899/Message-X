import { setFailed, setLoading, setSuccess, setVerifyEmail } from "@/toolkit/slices/AuthSlice";
import { AppDispatch } from "@/toolkit/store";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Form } from "@/components/signup/leftSide";
import { Dispatch, SetStateAction } from "react";

//! This is a custom hook for signup page
export default function useSignUp(data: { email: string, image: any }, setData?: Dispatch<SetStateAction<{ email: string; image: string; }>>) {

    let dispatch = useDispatch<AppDispatch>()
    let router = useRouter()

    //! Send the user's data to the backend to check them
    let SendData = async ({ name, username, email, password, image }: Form) => {

        dispatch(setLoading(true))

        username = username.toLowerCase()

        let response = await fetch("http://localhost:3000/api/signup", {
            method: "POST", headers: { "Content-Type": "Application/json" },
            body: JSON.stringify({ name, username, email, password })
        })

        let result = await response.json();

        //! There is a validation error with the user`s information
        if (result?.failed) dispatch(setFailed(result?.failed))

        //! An email has been sent to the user
        else if (result?.success) dispatch(setSuccess(result?.success))

        setData!({ email, image })
        dispatch(setLoading(false))
    }

    //! Send the user's email to the backend to verify that he/she verified their email
    let Validate = async () => {

        setVerifyEmail('')
        dispatch(setLoading(true))
        let formData = new FormData();

        formData.append("image", data.image[0])
        formData.append("email", data.email)

        //* Debugging
        if (!data.image[0] || !data.email) {
            dispatch(setSuccess(""))
            return
        }

        let response = await fetch("http://localhost:3000/api/signup", {
            method: "PUT", body: formData
        })

        let result = await response.json();

        if (result?.failed) {
            dispatch(setVerifyEmail(result.failed))
        }

        //! Now Authenticate the user
        else if (result?.success) {

            let { name, email, image, _id: id } = result.user

            await signIn("credentials", {
                operation: "SIGNUP", name, email, image, id,
                redirect: false,
                callbackUrl: "/"
            })

            router.replace("/main")
            router.refresh()
        }
        else {
            dispatch(setVerifyEmail("Something went wrong"))
        }
        dispatch(setLoading(false))
    }

    return { Validate, SendData }
}
