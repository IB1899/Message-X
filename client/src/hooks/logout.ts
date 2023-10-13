import { signOut } from "next-auth/react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

let useSettings = (
    setNotification: Dispatch<SetStateAction<boolean>>,
    setStatus: Dispatch<SetStateAction<boolean>>,
    setPrivateAccount: Dispatch<SetStateAction<boolean>>,
    email: string,
    isDark: boolean,
    setIsDark: Dispatch<SetStateAction<boolean>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
) => {

    //! Switch between light & dark modes
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

    //! Log users out
    let SignOut = async () => {

        //! 1- Clear the Auth cookie
        let response = await fetch("http://localhost:3000/api/settings");
        let result = await response.json();

        //! 2- Clear the session 
        if (result?.success) {
            await signOut();
            window.location.reload()
        }
    }

    //! Delete a user
    let DeleteUser = async (imageName: string, _id: string) => {

        setLoading(true)

        let response = await fetch("http://localhost:3000/api/settings", {
            method: "Delete", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, imageName, _id })
        })

        let result = await response.json()
        console.log(`result:`, result)

        if (result?.success) {
            await signOut();
            window.location.reload()
        }
        setLoading(false)
    }

    //! update a setting by its name
    let updateSettings = async (e: ChangeEvent<HTMLInputElement>, value: "notification" | "privateAccount" | "status") => {

        if (value === "notification") setNotification(e.target.checked)
        else if (value === "status") setStatus(e.target.checked)
        else if (value === "privateAccount") setPrivateAccount(e.target.checked)

        let response = await fetch("http://localhost:3000/api/settings", {
            method: "PUT", headers: { "Content-Type": "application/jon" },
            body: JSON.stringify({ email, nameOfValue: value, theValue: e.target.checked })
        })

        let result = await response.json()
    }

    return { SignOut, updateSettings, switchMode, DeleteUser }
}
export default useSettings