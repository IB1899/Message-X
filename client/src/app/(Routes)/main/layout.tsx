import authOptions from "@/app/api/auth/[...nextauth]/options"
import SideBar from "@/components/main/SideBar"
import Oops from "@/components/main/oops"
import { Metadata } from "next"
import { getServerSession } from "next-auth"

export default async function Main({ children }: { children: React.ReactNode }) {

    let session = await getServerSession(authOptions)
    if (!session?.user) {
        return <Oops error={"The session was not found"}
            message={"That is probably because you have not signed in correctly. Either you used the O-Auth and your account was created using credentials, or there might be an error with our databases."}
        />
    }

    let response = await fetch(`http://localhost:3000/api/messages/${session.user.id}`, { cache: "no-store" })
    let result: { failed?: string, success?: string, user: FullUser } = await response.json()

    if (result.failed) {
        return <Oops error={"The user does not exists or was deleted"}
            message={"That is probably because you have not deleted your account form a different platform, and you are trying to access it here, or there is a problem finding your account."}
        />
    }

    return (
        <div className="Main">
            <SideBar user={result.user} />

            {children}
        </div>
    )
}
