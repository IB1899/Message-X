import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/svg"];

export default function useStories(
    setImage: Dispatch<SetStateAction<File | string>>,
    setMessage: Dispatch<SetStateAction<string>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setImageURL: Dispatch<SetStateAction<string>>,
    image: File | string, email: string, userImage:string, username:string
) {

    //! To immediately show the selected image on the page
    let handelImageChange = (e: ChangeEvent<HTMLInputElement>) => {

        let file = e.target.files![0]

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return setMessage("The image type must only be jpeg-jpg-png-svg")

        const fileUrl = URL.createObjectURL(file);

        setImage(file)
        setImageURL(fileUrl)
    }

    //! Send The story to the backend to save it in the stories collection
    let SubmitStory = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        let formData = new FormData()

        formData.append("story", image)
        formData.append("email", email)
        formData.append("userImage", userImage)
        formData.append("username", username)

        let response = await fetch("http://localhost:3000/api/stories", {
            method: "POST", body: formData
        })

        let result = await response.json()
        setLoading(false)

        result.success ? setMessage(result.success) : setMessage(result.failed)
    }

    return { SubmitStory, handelImageChange }
}