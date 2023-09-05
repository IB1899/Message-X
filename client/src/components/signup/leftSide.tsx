"use client"

import { FaGoogle, FaGithub, FaImage } from "react-icons/fa"
import googleImage from "@/../public/icons/google.png"
import Image from "next/image";
import { useState } from "react";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { useDispatch } from "react-redux";
import { setSuccess, setFailed, setLoading } from "@/toolkit/slices/AuthSlice";
import dynamic from "next/dynamic";
import { LineWobble } from '@uiball/loaders'
import useSignUp from "@/hooks/signup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

//! Lazily load this component 
let Message = dynamic(() => import("../auth/Message"))

export type Form = { name: string, email: string, password: string, confirmPassword: string, image?: any }
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/svg"];

export default function LeftSide() {

    let {push} = useRouter()

    //! Redux: Only the SignUpSlice is used in the 'signup' route
    let dispatch = useDispatch<AppDispatch>()

    let { Success, Failed, Loading } = useAppSelector((state => state.AuthSlice))

    //! Zod Validation
    let schema: ZodType<Form> = z.object({
        name: z.string().min(3).max(20),
        email: z.string().email(),
        password: z.string().min(10),
        confirmPassword: z.string(),
        image: z.any().refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Please enter an image of type png-svg-jpg-jpeg"
        )
    }).refine((data) => data.password === data.confirmPassword, {
        message: "The passwords you entered don't match",
        path: ['confirmPassword']
    })

    let { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })

    //* To show only one message at a time
    let ZodErrors = () => {
        if (errors.name) return <h4 className="error"> Please Enter your name, and must be for than 3 characters less & than 30 </h4>
        else if (errors.email) return <h4 className="error"> {errors.email.message} </h4>
        else if (errors.password) return <h4 className="error"> Password must be at least 10 characters </h4>
        else if (errors.confirmPassword) return <h4 className="error"> {errors.confirmPassword.message} </h4>
        else if (errors.image) return <h4 className="error"> {errors.image.message as any} </h4>
        else { return null }
    }

    let [data, setData] = useState({ email: "", image: "" })

    //! All SignUp page methods are in the 'useSignUp' hook
    let { SendData } = useSignUp(data, setData)

    return (
        <>
            {Success ? (<Message data={data} type={"success"} />) : Failed ? (<Message data={data} type={"failed"} />) : null}
            <form className="LeftSide" onSubmit={handleSubmit(SendData)} >


                <h1>create account!</h1>
                <h4>Become a member and unlock a realm of interactive conversations</h4>

                <button type="button" disabled={Loading} onClick={() => { signIn("google"); dispatch(setLoading(true)) }}>
                    <span><Image src={googleImage} alt="google" /></span> <span>Continue with Google</span>
                </button>

                <button type="button" disabled={Loading} onClick={() => { signIn("github"); dispatch(setLoading(true)) }}>
                    <span><FaGithub /></span>  <span>Continue with GitHub</span>
                </button>
                <p className="or"> or continue with email </p>

                <label className="PhoneSizeOnly">Name</label>
                <input disabled={Loading} type="text" placeholder="name*" {...register("name")} />

                <label className="PhoneSizeOnly">Email</label>
                <input disabled={Loading} type="email" placeholder="Email*" {...register("email")} />

                <div className="passwords">
                    <label className="PhoneSizeOnly">password</label>
                    <label className="PhoneSizeOnly">Confirm</label>
                    <input disabled={Loading} type="password" placeholder="password*"{...register("password")} />
                    <input disabled={Loading} type="password" placeholder="confirm password*"{...register("confirmPassword")} />
                </div>
                {ZodErrors()}

                <div className="links">
                    <label htmlFor="image"> <i><FaImage /></i> Select your profile portrait </label>
                    <input disabled={Loading} className="file" type="file" id="image" {...register("image")} />

                </div>

                <button className="lastButton" disabled={Loading} type="submit">
                    {Success ? "Create Account" :
                        Loading ? <LineWobble size={80} lineWeight={5} speed={1.75} color="white" /> : "Create Account"
                    }
                </button>

                <p className="already"> Already have an account?
                    <span onClick={()=> push("/authentication/login") } >Log in</span>
                </p>
            </form>
        </>
    )
}