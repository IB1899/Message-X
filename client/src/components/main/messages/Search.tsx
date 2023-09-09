import { setLoading, setSearchMessage, setSearchedUser } from "@/toolkit/slices/MainSlice";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { FormEvent, useRef } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { ThreeBody } from '@uiball/loaders'
import { MessagesUser } from "@/app/(Routes)/main/page"
import { AiFillCloseCircle } from "react-icons/ai"

export default function Search({ user }: { user: MessagesUser }) {

    let SearchWord = useRef<HTMLInputElement>(null)

    //! Redux: Only the MainSlice is used in the 'main' route
    let dispatch = useDispatch<AppDispatch>()

    let { searchedUser, searchMessage, loading } = useAppSelector((state => state.MainSlice))

    //! Searching for a user
    let SearchUsers = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let searchWord = SearchWord.current?.value;

        //* Check that the user we're searching for doesn't already exist in the current user's connection
        let toReturn = false
        user.connections.forEach(connection => {
            if (searchWord === connection.name || searchWord === connection.username) {
                dispatch(setSearchMessage("The user already exists in your contacts"))
                dispatch(setSearchedUser({}))

                toReturn = true
                return
            }
        })
        if (toReturn) return

        dispatch(setLoading(true))

        let response = await fetch(`http://localhost:3000/api/messages?searchWord=${searchWord}&email=${user.email}`)

        let result = await response.json()
        console.log(`result:`, result)

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

    let AddUser = async () => {

        dispatch(setLoading(true))

        //! The data of the current user
        let { name, email, _id, image, description, username, story } = user;

        //! The data of the other -O- user
        let { _id: O_id, email: OEmail, name: OName, image: OImage, description: ODescription, username: OUsername, story: OStroy } = searchedUser

        let response = await fetch("http://localhost:3000/api/messages", {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name, email, id: _id, image, description, username, story,
                OName, OEmail, O_id, OImage, ODescription, OUsername, OStroy
            })
        })

        let result = await response.json()
        console.log(`result:`, result)
        dispatch(setSearchedUser({}));
        dispatch(setLoading(false))
    }

    return (
        <>
            {
                searchedUser?.name ?
                    <div className="searchResults">
                        <Image src={searchedUser.image} alt="user image" width={55} height={55} />
                        <div className="info">
                            <h3> {searchedUser.name} </h3>
                            <h5> {searchedUser.username} </h5>
                        </div>

                        {loading ?
                            <ThreeBody size={30} speed={0.7} color="#9D00BB" />
                            :
                            <i onClick={() => AddUser()}> <FaPlusSquare /> </i>
                        }

                        <i className="x" onClick={() => { dispatch(setSearchedUser({})); dispatch(setSearchMessage("")) }} ><AiFillCloseCircle /> </i>
                    </div> :
                    searchMessage ?
                        <div className="error">
                            <p> {searchMessage} </p>
                            <i className="x" onClick={() => { dispatch(setSearchedUser({})); dispatch(setSearchMessage("")) }} ><AiFillCloseCircle /> </i>
                        </div>
                        :
                        <form onSubmit={(e) => SearchUsers(e)}>
                            <input type="text" ref={SearchWord} required placeholder="Search by name or username" />
                            {loading ?
                                <ThreeBody size={30} speed={0.7} color="#9D00BB" />
                                :
                                <button disabled={loading}> <FaSearch /> </button>
                            }
                        </form>
            }
        </>
    )
}
