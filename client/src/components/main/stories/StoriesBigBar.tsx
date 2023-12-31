"use client"

import { AppDispatch, useAppSelector } from "@/toolkit/store"
import { useDispatch } from "react-redux"
import AddNewStory from "./addNewStory"
import SettingsBigBar from "../messages/settings/SettingsBigBar"
import Stories from "../messages/leftBar/Stories"
import VerticalStories from "./verticalStory"


export default function StoriesBigBar({ user, stories }: { user: FullUser, stories: story[] }) {

    //! Redux: Only the MainSlice is used in the 'main' route
    let dispatch = useDispatch<AppDispatch>()

    let { isSettings, isAddStory } = useAppSelector((state => state.MainSlice))

    return (
        <div className="StoriesPage">
            {/* The Add story pop-up  rendered conditionally */}
            {isAddStory ? <AddNewStory email={user.email} userImage={user.image} username={user.username} /> : null}

            {/* Switching between the setting bar and the messages bar */}
            {isSettings ?
                <SettingsBigBar user={user} />
                :
                <VerticalStories stories={stories} />
            }
        </div>
    )
}
