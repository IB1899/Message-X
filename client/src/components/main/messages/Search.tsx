import { setSearchMessage, setSearchedUser } from "@/toolkit/slices/MainSlice";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { useRef } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { ThreeBody } from '@uiball/loaders'
import { AiFillCloseCircle } from "react-icons/ai"
import useSearch from "@/hooks/search";

export default function Search({ user }: { user: FullUser }) {

    let SearchWord = useRef<HTMLInputElement>(null)

    //! Redux: Only the MainSlice is used in the 'main' route
    let dispatch = useDispatch<AppDispatch>()

    let { searchedUser, searchMessage, loading } = useAppSelector((state => state.MainSlice))

    //! Searching for a user
    let { SearchUsers, AddUser } = useSearch(user)

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
                    </div>
                    :
                    searchMessage ?
                        <div className="error">
                            <p> {searchMessage} </p>
                            <i className="x" onClick={() => { dispatch(setSearchedUser({})); dispatch(setSearchMessage("")) }} ><AiFillCloseCircle /> </i>
                        </div>
                        :
                        <form onSubmit={(e) => SearchUsers(e, SearchWord.current!.value)}>
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
