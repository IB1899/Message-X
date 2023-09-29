import { setSearchMessage, setSearchedUser , setLoading } from "@/toolkit/slices/MainSlice";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { FormEvent } from "react";
import { useDispatch } from "react-redux";

let useSearch = (user:FullUser) => {

    let dispatch = useDispatch<AppDispatch>()
    let { searchedUser } = useAppSelector((state => state.MainSlice))

    //! Searching for a user
    let SearchUsers = async (e: FormEvent<HTMLFormElement> , searchWord:string) => {
        e.preventDefault()


        //* Check that the user we're searching for doesn't already exist in the current user's connection
        let toReturn = false
        user.connections?.forEach(connection => {
            if (searchWord === connection.name || searchWord === connection.username) {
                dispatch(setSearchMessage("The user already exists in your contacts"))

                toReturn = true
                return
            }
        })
        if (toReturn) return

        if (searchWord === user.name || searchWord === user.username) return dispatch(setSearchMessage("You can't search for yourself"))

        dispatch(setLoading(true))

        let response = await fetch(`http://localhost:3000/api/messages?searchWord=${searchWord}&email=${user.email}`)

        let result = await response.json()

        if (result.success) {
            dispatch(setSearchedUser(result.user))
        }
        else if (result.no) {
            dispatch(setSearchMessage(result.no))
            dispatch(setSearchedUser({}))
        }
        else {
            dispatch(setSearchMessage(result.failed))
            dispatch(setSearchedUser({}))
        }
        dispatch(setLoading(false))
    }

    //! Add the user we searched for to the connections
    let AddUser = async () => {

        dispatch(setLoading(true))

        //! The data of the current user
        let { name, email, _id, image, description, username, story, phoneNumber } = user;

        //! The data of the other -O- user
        let { _id: O_id, email: OEmail, name: OName, image: OImage, description: ODescription, username: OUsername, story: OStroy, phoneNumber: OPhoneNumber } = searchedUser

        let response = await fetch("http://localhost:3000/api/messages", {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name, email, id: _id, image, description, username, story, phoneNumber, OPhoneNumber,
                OName, OEmail, O_id, OImage, ODescription, OUsername, OStroy
            })
        })

        let result = await response.json()
        dispatch(setSearchedUser({}));
        dispatch(setLoading(false))
    }


    return {SearchUsers , AddUser}
}

export default useSearch