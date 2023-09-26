import { signOut } from "next-auth/react";

let useLogOut = () => {

    let SignOut = async () => {

        //! 1- Clear the Auth cookie
        let response = await fetch("http://localhost:3000/api/settings");
        let result = await response.json();
        console.log(`result:`, result)

        //! 2- Clear the session 
        await signOut()
        window.location.reload()
    }

    return { SignOut }
}

export default useLogOut