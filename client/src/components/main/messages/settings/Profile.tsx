"use client"

import ForgotPassword from "@/components/auth/forgotPassword";
import useProfile from "@/hooks/profile";
import { setIsForgotPassword } from "@/toolkit/slices/AuthSlice";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { LineWobble } from "@uiball/loaders";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { BiPencil } from "react-icons/bi"
import { BsShieldLockFill } from "react-icons/bs"
import { HiMiniShieldCheck } from "react-icons/hi2"
import { useDispatch } from "react-redux";

export default function Profile({ user }: { user: FullUser }) {

    let [image, setImage] = useState<File | string>("")
    let [imageURL, setImageURL] = useState<string>("")

    //! To immediately show the selected image on the page
    let handelImageChange = (e: ChangeEvent<HTMLInputElement>) => {

        let file = e.target.files![0]
        const fileUrl = URL.createObjectURL(file);

        setImage(file)
        setImageURL(fileUrl)
    }

    let [loading, setLoading] = useState(false)
    let [success, setSuccess] = useState("")
    let [failed, setFailed] = useState("")
    let [isEditing, setIsEditing] = useState(false)

    let dispatch = useDispatch<AppDispatch>()
    let { isForgotPassword } = useAppSelector((state => state.AuthSlice))

    let usernameRef = useRef<HTMLInputElement>(null)
    let descriptionRef = useRef<HTMLInputElement>(null)
    let genderRef = useRef<HTMLInputElement>(null)
    let countryRef = useRef<HTMLInputElement>(null)
    let phoneRef = useRef<HTMLInputElement>(null)
    let ageRef = useRef<HTMLInputElement>(null)


    let { UpdateUserData } = useProfile(setLoading, setSuccess, setFailed, setIsEditing, image, user)

    return (
        <>
            {isForgotPassword ? (<ForgotPassword />) : null}
            
            <form className="Profile" onSubmit={(e) => {
                UpdateUserData(e,
                    usernameRef.current!.value,
                    descriptionRef.current!.value,
                    genderRef.current!.value,
                    countryRef.current!.value,
                    phoneRef.current!.value,
                    ageRef.current!.value
                )
            }} >

                <div className="top">
                    <Image src={image ? imageURL : user.image} alt="personal profile" priority width={120} height={120} />

                    <label htmlFor="file"> <BiPencil /> </label>
                    <input type="file" disabled={isEditing ? false : true} id="file" onChange={(e) => handelImageChange(e)} />

                    <div className="user-details">
                        <h3> {user.name} </h3>
                        <p> {user.username} </p>
                        <p> {user.description} </p>
                    </div>
                </div>

                <div className="middle">

                    <div>
                        <label> Username </label>
                        <input type="text" disabled={isEditing ? false : true}
                            ref={usernameRef} defaultValue={user.username} placeholder="username..."
                        />
                    </div>

                    <div>
                        <label> Description </label>
                        <input type="text" disabled={isEditing ? false : true}
                            ref={descriptionRef} defaultValue={user.description} maxLength={70} placeholder="description..."
                        />
                    </div>

                    <div>
                        <label> Gender </label>
                        <input type="text" disabled={isEditing ? false : true}
                            ref={genderRef} defaultValue={user.gender} maxLength={10} placeholder="gender..."
                        />
                    </div>

                    <div>
                        <label> Country </label>
                        <input type="text" disabled={isEditing ? false : true}
                            ref={countryRef} defaultValue={user.country} maxLength={13} placeholder="country..."
                        />
                    </div>

                    <div>
                        <label> Phone number </label>
                        <input type="number" disabled={isEditing ? false : true}
                            ref={phoneRef} defaultValue={user.phoneNumber} minLength={8} maxLength={11} placeholder="phone number..."
                        />
                    </div>

                    <div>
                        <label> Age </label>
                        <input type="number" disabled={isEditing ? false : true}
                            ref={ageRef} defaultValue={user.age} maxLength={2} placeholder="age..."
                        />
                    </div>

                </div>

                <div className="bottom">

                    <button type="submit" disabled={isEditing ? false : true} >
                        {loading ?
                            <LineWobble size={80} lineWeight={5} speed={1.75} color="violet" /> :
                            <> <i> <HiMiniShieldCheck /> </i> <span>Save Changes</span> </>
                        }
                    </button>

                    <button type="button" onClick={() => dispatch(setIsForgotPassword(true))} > <i> <BsShieldLockFill /> </i> <span>Change Password</span></button>

                    <button type="button" onClick={() => { setIsEditing(!isEditing); setFailed(""); setSuccess("") }}>
                        <i> <BiPencil /> </i> <span> {isEditing ? "Cancel" : "Edit"} </span>
                    </button>

                </div>

                {success &&
                    <div className="message">
                        <p style={{ color: "limegreen" }} > {success} </p>
                    </div>
                }
                {failed &&
                    <div className="message">
                        <p style={{ color: "red" }}> {failed} </p>
                    </div>
                }
            </form>
        </>
    )
}
