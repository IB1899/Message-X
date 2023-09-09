"use client"

import Search from "./Search"
import Stories from "../Stories"
import { FaGlassCheers } from "react-icons/fa"
import { MessagesUser } from "@/app/(Routes)/main/page"
import Contacts from "./Contacts"

export default function MessagesBigBar({ user }: { user: MessagesUser }) {


    /** 
    *todo    README!!!!!!!!!!!!!!!!!!!!!
    *! Make the settings & profile page as popups conditional rendered components.
      
    */

    return (
        <div className="BigBar" >

            <Stories />

            <div className="title">
                <h2>Messages   </h2>
                <span>22 new</span>
                <i> <FaGlassCheers /> </i>
            </div>

            <Search user={user} />

            <h2 className="h2">Contacts</h2>
            <Contacts connections={user.connections} />


        </div>
    )
}
