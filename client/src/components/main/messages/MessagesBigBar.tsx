"use client"

import Search from "./Search"
import Stories from "../Stories"
import { FaGlassCheers } from "react-icons/fa"
import Contacts from "./Contacts"
import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "@/toolkit/store"
import SettingsBigBar from "../settings/SettingsBigBar"
import Profile from "../settings/Profile"

export default function MessagesBigBar({ user }: { user: FullUser }) {


    /** 
    *todo    README!!!!!!!!!!!!!!!!!!!!!
    *! Make the settings & profile page as popups conditional rendered components.
      
    */

    //! Redux: Only the MainSlice is used in the 'main' route
    let dispatch = useDispatch<AppDispatch>()

    let { isSettings, isProfile } = useAppSelector((state => state.MainSlice))

    return (
        <>
            {isSettings ?
                <SettingsBigBar user={user} />
                :
                <div className="BigBar" >

                    <>
                        <Stories />
                        <div className="title">
                            <h2>Messages   </h2>
                            <span>22 new</span>
                            <i> <FaGlassCheers /> </i>
                        </div>

                        <Search user={user} />

                        <h2 className="h2">Contacts</h2>
                        <Contacts connections={user.connections} />
                    </>

                </div>
            }

            {isProfile ?
                <Profile user={user} /> : null
            }
        </>
    )
}
