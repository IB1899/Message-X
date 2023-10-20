"use client"

import { ChangeEvent, useState } from "react";
import { AiOutlineBell } from "react-icons/ai";
import { BiMoon } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";


export default function Options({ user }: { user: FullUser }) {

    let [notification, setNotification] = useState(user.notification ? user.notification : false)
    let [privateAccount, setPrivateAccount] = useState(user.privateAccount ? user.privateAccount : false)
    let [status, setStatus] = useState(user.status ? user.status : false)


    //! update a setting by its name
    let updateSettings = async (e: ChangeEvent<HTMLInputElement>, value: "notification" | "privateAccount" | "status") => {

        if (value === "notification") setNotification(e.target.checked)
        else if (value === "status") setStatus(e.target.checked)
        else if (value === "privateAccount") setPrivateAccount(e.target.checked)

        let response = await fetch("http://localhost:3000/api/settings", {
            method: "PUT", headers: { "Content-Type": "application/jon" },
            body: JSON.stringify({ email: user.email, nameOfValue: value, theValue: e.target.checked })
        })

        let result = await response.json()
    }


    return (
        <div className="Options">

            <div className="setting">

                <i> <AiOutlineBell /> </i>
                <div className="description">
                    <h3>Notifications</h3>

                    <input onChange={(e) => updateSettings(e, "notification")} checked={notification} type="checkbox" name="checkbox" id="checkbox" />

                    <p>Mute the notification of this user</p>
                </div>

            </div>

            <div className="setting">

                <i> <HiOutlineStatusOnline /> </i>
                <div className="description">
                    <h3>Active status</h3>

                    <input onChange={(e) => updateSettings(e, "status")} checked={status} type="checkbox" name="checkbox" id="checkbox" />

                    <p>Do you want to appear connected</p>
                </div>

            </div>

        </div>
    )
}
