import React from 'react'
import jwt from "jsonwebtoken"
import ResetPasswordForm from '@/components/reset-password/reset-password-form';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from "next/image"
import { FaXing } from "react-icons/fa"
import ResetPasswordImage from "@/../public/images/resetPassword 2.svg"

//todo Check The low level design to understand the password resting & email verification approaches

export const metadata: Metadata = {
    title: "Messages X - Reset password",
    description: "This page is for users to reset their passwords"
}

//! When Getting the params & searchParams in server components, it must only be the parent component
export default function ResetPassword({ params, searchParams }: { params: {}, searchParams: { token: string } }) {

    let { token } = searchParams;
    if (!token) redirect("http://localhost:3000")

    //* verifying the jwt
    try {
        //* if not valid this throws an error
        let Verified = jwt.verify(token, process.env.JWT_SECRET!) as { email: string }

        return <div className="ResetPassword">
            <div className="logo">
                <i> <FaXing /> </i>
                <span> Messages </span>
            </div>
            <div className="left">
                <Image src={ResetPasswordImage} alt="image" priority />
            </div>
            
            <ResetPasswordForm email={Verified.email} />
        </div>
    }
    catch (err: any) {
        return <h1> Error </h1>
    }
}
