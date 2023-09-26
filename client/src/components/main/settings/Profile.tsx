import Image from "next/image";
import { ChangeEvent, FormEvent, MutableRefObject, useRef, useState } from "react";
import { BiPencil } from "react-icons/bi"
import { BsShieldLockFill } from "react-icons/bs"
import { HiMiniShieldCheck } from "react-icons/hi2"

export default function Profile({ user }: { user: FullUser }) {

    let [image, setImage] = useState<File | string>("")
    let [imageURL, setImageURL] = useState<string>("")

    let [loading, setLoading] = useState(false)
    let [message, setMessage] = useState("")


    //! To immediately show the selected image on the page
    let handelImageChange = (e: ChangeEvent<HTMLInputElement>) => {

        let file = e.target.files![0]
        const fileUrl = URL.createObjectURL(file);

        setImage(file)
        setImageURL(fileUrl)
    }

    let usernameRef = useRef<HTMLInputElement>(null)
    let descriptionRef = useRef<HTMLInputElement>(null)
    let genderRef = useRef<HTMLInputElement>(null)
    let countryRef = useRef<HTMLInputElement>(null)
    let phoneRef = useRef<HTMLInputElement>(null)
    let ageRef = useRef<HTMLInputElement>(null)

    //! submit the changes to the backend
    let handelSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        let username = usernameRef.current!.value
        let description = descriptionRef.current!.value
        let gender = genderRef.current!.value
        let country = countryRef.current!.value
        let phoneNumber = phoneRef.current!.value
        let age = ageRef.current!.value

        //! if the value isn't set, set it to empty strings instead of undefined 
        user.username = user.username ? user.username : ""
        user.description = user.description ? user.description : ""
        user.gender = user.gender ? user.gender : ""
        user.Country = user.Country ? user.Country : ""
        user.phoneNumber = user.phoneNumber ? user.phoneNumber : ""
        user.age = user.age ? user.age : ""

        //! If the user didn't change any thing
        if (
            username === user.username &&
            description === user.description &&
            gender === user.gender &&
            country === user.Country &&
            phoneNumber === user.phoneNumber?.toString() &&
            age === user.age?.toString() &&
            !image && !imageURL
        ) {
            return setMessage(" you didn't change anything ")
        }


        // send the changes to the backend

        setTimeout(()=>{
            setMessage("")
        },5000)
        return setMessage(" you changed something ")

    }

    return (
        <form className="Profile" onSubmit={(e) => handelSubmit(e)} >

            <div className="top">
                <Image src={image ? imageURL : user.image} alt="personal profile" priority width={120} height={120} />

                <label htmlFor="file"> <BiPencil /> </label>
                <input type="file" id="file" onChange={(e) => handelImageChange(e)} />

                <div className="user-details">
                    <h3> {user.name} </h3>
                    <p> {user.username} </p>
                    <p> {user.description} </p>
                </div>
            </div>

            <div className="middle">

                <div>
                    <label> Username </label>
                    <input type="text" ref={usernameRef} defaultValue={user.username} placeholder="username..." />
                </div>


                <div>
                    <label> Description </label>
                    <input type="text" ref={descriptionRef} defaultValue={user.description} maxLength={70} placeholder="description..." />
                </div>


                <div>
                    <label> Gender </label>
                    <input type="text" ref={genderRef} defaultValue={user.gender} placeholder="gender..." />
                </div>


                <div>
                    <label> Country </label>
                    <input type="text" ref={countryRef} defaultValue={user.Country} placeholder="country..." />
                </div>


                <div>
                    <label> Phone number </label>
                    <input type="number" ref={phoneRef} defaultValue={user.phoneNumber} placeholder="phone number..." />
                </div>

                <div>
                    <label> Age </label>
                    <input type="number" ref={ageRef} defaultValue={user.age} maxLength={2} placeholder="age..." />
                </div>

            </div>

            <div className="bottom">
                <button type="button" > <i> <BsShieldLockFill /> </i> <span>Change Password</span></button>
                <button type="submit" > <i> <HiMiniShieldCheck /> </i> <span>Save Changes</span></button>
            </div>

            {message &&
                <div className="message">
                    <p> {message} </p>
                </div>
            }


        </form>
    )
}
