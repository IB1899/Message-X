import { AiOutlineBell } from "react-icons/ai";
import { BiMoon } from "react-icons/bi";
import { HiUserGroup, HiOutlineStatusOnline } from "react-icons/hi";
import { BsShieldLock } from "react-icons/bs";
import { IoIosCreate } from "react-icons/io";
import { FaGlassCheers, FaTrashAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { LuRefreshCw } from "react-icons/lu";
import { useState } from "react";
import { AppDispatch, useAppSelector } from "@/toolkit/store";
import { useDispatch } from "react-redux";
import { setIsAddStory } from "@/toolkit/slices/MainSlice";
import useSettings from "@/hooks/logout";
import { LineWobble } from "@uiball/loaders";

export default function SettingsBigBar({ user }: { user: FullUser }) {

    //! This code should be inside the redux middleware  
    let darkString = localStorage.getItem("dark")
    let test = false;
    if (darkString) {
        let dark = JSON.parse(darkString)
        test = dark.dark
    }
    let [isDark, setIsDark] = useState(test)

    //! To get the values of the switched inputs
    let [notification, setNotification] = useState(user.notification ? user.notification : false)
    let [status, setStatus] = useState(user.status ? user.status : false)
    let [privateAccount, setPrivateAccount] = useState(user.privateAccount ? user.privateAccount : false)
    let [loading, setLoading] = useState(false)

    //! sign users out
    let { SignOut, updateSettings, switchMode, DeleteUser } = useSettings(setNotification, setStatus, setPrivateAccount, user.email, isDark, setIsDark, setLoading)

    //! Open and close the addStory pop-up
    let dispatch = useDispatch<AppDispatch>()

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

                    <p>Do you want others to know you are connected</p>
                </div>

            </div>

            <span></span>

            <button> <IoIosCreate /> Create New Group</button>
            <button onClick={() => dispatch(setIsAddStory(true))} > <FaGlassCheers /> Add New Story</button>

            <div className="buttons">
                <button onClick={() => SignOut()} ><MdLogout /> Sign out</button>
                <button onClick={() => window.location.reload()} ><LuRefreshCw /> Refresh</button>
            </div>

            <span></span>

            <button className="delete" onClick={() => DeleteUser(user.imageName, user._id)} disabled={loading} >
                {loading ? <LineWobble size={250} lineWeight={7} speed={1.75} color="white" /> : <><FaTrashAlt /> Delete Your Account</>}
            </button>
        </div>
    )
}
