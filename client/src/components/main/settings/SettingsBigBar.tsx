import { AiOutlineBell } from "react-icons/ai";
import { BiMoon } from "react-icons/bi";
import { HiUserGroup, HiOutlineStatusOnline } from "react-icons/hi";
import { BsShieldLock } from "react-icons/bs";
import { IoIosCreate } from "react-icons/io";
import { FaGlassCheers, FaTrashAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { LuRefreshCw } from "react-icons/lu";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SettingsBigBar({ user }: { user: FullUser }) {

    //! This code should be inside the redux middleware  
    let darkString = localStorage.getItem("dark")
    let test = false;
    if (darkString) {
        let dark = JSON.parse(darkString)
        test = dark.dark
    }
    let [isDark, setIsDark] = useState(test)

    let switchMode = () => {

        if (isDark) {
            localStorage.setItem("dark", JSON.stringify({ dark: false }))
            setIsDark(false)
        }
        else {
            localStorage.setItem("dark", JSON.stringify({ dark: true }))
            setIsDark(true)
        }
    }

    let router = useRouter()

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


    //! sign users out
    let SignOut = async () => {

        //! 1- Clear the Auth cookie
        let response = await fetch("http://localhost:3000/api/settings");
        let result = await response.json();
        console.log(`result:`, result)

        //! 2- Clear the session 
        await signOut()
        window.location.reload()
    }

    return (
        <div className="Settings">

            <h2>Settings</h2>

            <div className="setting">

                <i> <AiOutlineBell /> </i>
                <div className="description">
                    <h3>Notifications</h3>

                    <input onChange={(e) => updateSettings(e, "notification")} checked={notification} type="checkbox" name="checkbox" id="checkbox" />

                    <p>Mute all users notification</p>
                </div>

            </div>

            <div className="setting">

                <i> <BiMoon /> </i>
                <div className="description">
                    <h3>Dark mode</h3>

                    <input onChange={(e) => switchMode()} checked={isDark} type="checkbox" name="checkbox" id="checkbox" />

                    <p>switch between dark and light mode</p>
                </div>

            </div>

            <div className="setting">

                <i> <HiUserGroup /> </i>
                <div className="description">
                    <h3>Stories public</h3>

                    <input type="checkbox" name="checkbox" id="checkbox" />

                    <p>Whether you want your stories to appear only to your connections or everywhere</p>
                </div>

            </div>

            <div className="setting">

                <i> <BsShieldLock /> </i>
                <div className="description">
                    <h3>Private account</h3>

                    <input onChange={(e) => updateSettings(e, "privateAccount")} checked={privateAccount} type="checkbox" name="checkbox" id="checkbox" />

                    <p>Can every one reach you immediately or only after you accept</p>
                </div>

            </div>

            <div className="setting">

                <i> <HiOutlineStatusOnline /> </i>
                <div className="description">
                    <h3>Active status</h3>

                    <input onChange={(e) => updateSettings(e, "status")} checked={status} type="checkbox" name="checkbox" id="checkbox" />

                    <p>Do you want others to know you're connected</p>
                </div>

            </div>

            <span></span>

            <button> <IoIosCreate /> Create New Group</button>
            <button> <FaGlassCheers /> Add New Story</button>

            <div className="buttons">
                <button onClick={() => SignOut()} ><MdLogout /> Sign out</button>
                <button onClick={() => window.location.reload()} ><LuRefreshCw /> ReFresh</button>
            </div>

            <span></span>

            <button className="delete"> <FaTrashAlt /> Delete You Account</button>

        </div>
    )
}
