import authOptions from "@/app/api/auth/[...nextauth]/options"
import SideBar from "@/components/main/SideBar"
import StoriesBigBar from "@/components/main/stories/StoriesBigBar"
import AddNewStory from "@/components/main/stories/addNewStory"
import { Metadata } from "next"
import { getServerSession } from "next-auth"

export const metadata: Metadata = {
    title: "Messages | Stories",
    description: "This is the users stories dashboard"
}

export default async function Stories({ children }: { children: React.ReactNode }) {

    //TODO Fetch only the stories of the users that we're connected with

    let session = await getServerSession(authOptions)
    if (!session?.user) return <h1>error the session was not found </h1>

    let response = await fetch(`http://localhost:3000/api/messages/${session.user.id}`, { cache: "no-store" })
    let result: { failed?: string, success?: string, user: FullUser } = await response.json()

    if (result.failed) return <h1>error {result.failed} </h1>

    return (
        <div className="StoriesPage">

            <StoriesBigBar user={result.user} />
            {children}
        </div>
    )
}
