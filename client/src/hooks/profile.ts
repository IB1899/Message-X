import { Dispatch, FormEvent, SetStateAction } from "react"


let useProfile = (
    setLoading: Dispatch<SetStateAction<boolean>>,
    setSuccess: Dispatch<SetStateAction<string>>,
    setFailed: Dispatch<SetStateAction<string>>,
    setIsEditing: Dispatch<SetStateAction<boolean>>,
    image: File | string,
    user: FullUser

) => {


    //! submit the changes to the backend
    let UpdateUserData = async (
        e: FormEvent<HTMLFormElement>,
        username: string,
        description: string,
        gender: string,
        country: string,
        phoneNumber: string | number,
        age: string | number
    ) => {

        e.preventDefault()


        //! validation
        if (age || phoneNumber) {
            age = Number(age)
            phoneNumber = Number(phoneNumber)
            if (age > 100 || age < 0) return setFailed("Please enter your true age")
            if (phoneNumber > 9999999999 || phoneNumber < 9999999) return setFailed("Please enter a valid phone number")
        }

        if (username.includes(" ")) return setFailed("the username cannot contain spaces")

        setFailed("")
        setLoading(true)
        setIsEditing(false)

        //! If the image is updated change it separately 
        if (image) {

            let formData = new FormData();
            formData.append("image", image);
            formData.append("email", user.email);

            let response = await fetch("http://localhost:3000/api/settings/update-image", {
                method: "POST", body: formData
            })
            let result = await response.json()
        }

        let response = await fetch("http://localhost:3000/api/settings", {
            method: "POST", headers: { "Content-Type": "Application/json" },
            body: JSON.stringify({ email: user.email, originalUsername: user.username, username, description, gender, country, phoneNumber, age })
        })

        let result = await response.json()

        setLoading(false)

        if (result.success) return setSuccess(result.success)
        if (result.failed) return setFailed(result.failed); setIsEditing(true)
    }


    return { UpdateUserData }

}

export default useProfile