"use client"

import Search from "./Search"
import Stories from "./Stories"
import { FaGlassCheers } from "react-icons/fa"
import Contacts from "./Contacts"
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import SettingsBigBar from "./settings/SettingsBigBar"
import Profile from "./settings/Profile"
import AddNewStory from "@/components/main/stories/addNewStory"
import { setIsAddStory } from "@/toolkit/slices/MainSlice"

export default function MessagesBigBar({ user }: { user: FullUser }) {

    //! Redux: Only the MainSlice is used in the 'main' route
    let dispatch = useDispatch<AppDispatch>()

    let { isSettings, isProfile, isAddStory } = useAppSelector((state => state.MainSlice))

    return (
        <>
            {/* The Add story pop-up  rendered conditionally */}
            {isAddStory ? <AddNewStory email={user.email} /> : null}

            {/* Switching between the setting bar and the messages bar */}
            {isSettings ?
                <SettingsBigBar user={user} />
                :
                <div className="BigBar" >
                    <Stories />
                    <div className="title">
                        <h2>Messages   </h2>
                        <span>22 new</span>
                        <i onClick={() => dispatch(setIsAddStory(true))} > <FaGlassCheers /> </i>
                    </div>

                    <Search user={user} />

                    <h2 className="h2">Contacts</h2>
                    <Contacts connections={user.connections} />
                </div>
            }

            {/* The profile pop-up  rendered conditionally */}
            {isProfile ?
                <Profile user={user} /> : null
            }
        </>
    )
}
