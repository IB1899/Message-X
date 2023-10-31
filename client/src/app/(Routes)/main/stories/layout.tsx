import { Metadata } from "next"
import { getServerSession } from "next-auth"
import AddNewStory from "@/components/main/stories/addNewStory"
import StoriesBigBar from "@/components/main/stories/StoriesBigBar"
import SideBar from "@/components/main/SideBar"
import authOptions from "@/app/api/auth/[...nextauth]/options"


export const metadata: Metadata = {
    title: "Messages X - Stories",
    description: "This is the users stories dashboard"
}

export default async function StoriesLayout({ children }: { children: React.ReactNode }) {

    let session = await getServerSession(authOptions)
    if (!session?.user) return <h1>error the session was not found </h1>

    let response = await fetch(`http://localhost:3000/api/stories?email=${session.user.email}`, { cache: "no-store" })
    let result: { failed?: string, user: FullUser, stories: story[] } = await response.json()

    if (result.failed) return <h1>error {result.failed} </h1>
    if(result.stories.length === 0) return <div className="Error"> <h1> There Are no Stories </h1> </div>
    
    return (
        <>
            <>

                <StoriesBigBar user={result.user} stories={result.stories} />

            </>
            {children}

        </>
    )
}
