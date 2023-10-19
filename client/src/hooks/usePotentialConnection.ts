import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export let usePotentialConnection = (
    user: FullUser,
    setLoading: Dispatch<SetStateAction<{ email: string; }>>,
    setNoConnections: Dispatch<SetStateAction<any[] | undefined>>,
    NoConnections: any[]
) => {

    let { refresh } = useRouter()

    let AddUser = async (potentialConnection: any) => {

        setLoading({ email: potentialConnection.email })

        //! The data of the current user
        let { name, email, _id, image, description, username, story, phoneNumber } = user;

        //! The data of the other -O- user
        let { _id: O_id, email: OEmail, name: OName, image: OImage, description: ODescription,
            username: OUsername, story: OStroy, phoneNumber: OPhoneNumber
        } = potentialConnection

        let response = await fetch("http://localhost:3000/api/messages", {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name, email, id: _id, image, description, username, story, phoneNumber, OPhoneNumber,
                OName, OEmail, O_id, OImage, ODescription, OUsername, OStroy
            })
        })

        let result = await response.json()

        //! Keeping track of the cache manually by removing the added user form the list, as a sign of him has been added
        setNoConnections(prev => prev?.filter(con => con.email !== potentialConnection.email))
        setLoading({ email: "" })

        //! To give it the sense that we have updated the cache seamlessly
        if (NoConnections.length - 1 < 1) { refresh() }
    }

    let CalculateMissedMessages = (messages: Message[]): string => {

        if (messages.length === 0) return "0"

        let MissedMessages = 0

        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].from === "them") MissedMessages++
            else return MissedMessages.toString()
        }

        return MissedMessages.toString()
    }

    return { AddUser, CalculateMissedMessages }
}
