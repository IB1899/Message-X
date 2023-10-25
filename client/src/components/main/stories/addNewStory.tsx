"use client"

import Image from "next/image";
import chooseImage from "@/../public/images/chooseImage.svg"
import { BsFillImageFill } from "react-icons/bs"
import { MdPublishedWithChanges } from "react-icons/md"
import { useState } from "react";
import { AiFillBackward, AiFillCloseCircle } from "react-icons/ai";
import { Lobster } from "next/font/google";
import { LineWobble } from "@uiball/loaders";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/toolkit/store";
import { setIsAddStory } from "@/toolkit/slices/MainSlice";
import useStories from "@/hooks/stories";

const lobster = Lobster({ subsets: ["latin"], weight: ["400"] })

export default function AddNewStory({ email, userImage, username }: { email: string, userImage: string, username: string }) {

    let [message, setMessage] = useState("");
    let [image, setImage] = useState<File | string>("");
    let [imageURL, setImageURL] = useState<string>("");
    let [loading, setLoading] = useState(false)


    let dispatch = useDispatch<AppDispatch>()

    let { SubmitStory, handelImageChange } = useStories(setImage, setMessage, setLoading, setImageURL, image, email, userImage, username)

    return (
        <div className="BackGround-AddStory">

            {/*//! One Of these two component will appear the hide-show effect is in the css */}
            <div className={imageURL ? "HideComponent" : "SelectImage"}  >

                <header>
                    <h3>Choose Your Story</h3>
                    <i onClick={() => dispatch(setIsAddStory(false))} > <AiFillCloseCircle /> </i>
                </header>

                <Image src={chooseImage} alt="choose an image" priority />

                <label htmlFor="story" className={lobster.className}>  <i> <BsFillImageFill /> </i> <span> Select Image </span> </label>

                <input type="file" id="story" required onChange={(e) => handelImageChange(e)} />

            </div>

            {/*//! One Of these two component will appear the hide-show effect is in the css */}
            <form className={imageURL ? "ShareStory" : "HideComponent"} onSubmit={(e) => SubmitStory(e)}>

                <header>
                    <i className="go-back" onClick={() => { setImage(""); setImageURL("") }} > <AiFillBackward /> </i>
                    <h3>Share Your Story</h3>
                    <i className="close" onClick={() => dispatch(setIsAddStory(false))} > <AiFillCloseCircle /> </i>
                </header>

                {imageURL && <Image src={imageURL} alt="selected image" width={280} height={220} />}

                {message ? <p> {message} </p> :
                    <button type="submit" className={lobster.className} disabled={loading} >
                        {loading ?
                            <LineWobble size={80} lineWeight={5} speed={1.75} color="white" />
                            :
                            <><i> <MdPublishedWithChanges /> </i> <span> Share story </span></>
                        }
                    </button>
                }
            </form>
        </div>
    )
}