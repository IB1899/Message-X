import authOptions from "@/app/api/auth/[...nextauth]/options"
import Error from "@/app/error"
import BigBar from "@/components/main/messages/MessagesBigBar"
import { Metadata } from "next"
import { getServerSession } from "next-auth"


export const metadata: Metadata = {
    title: "Message X - Dashboard",
    description: "This is the messages dashboard"
}

export default async function layout({ children }: { children: React.ReactNode }) {

    let session = await getServerSession(authOptions)
    if (!session?.user) return <h1>error the session was not found </h1>

    let response = await fetch(`http://localhost:3000/api/stories?email=${session.user.email}`, { cache: "no-store" })
    let result: { failed?: string, user: FullUser, stories: story[] } = await response.json()

    if (result.failed) return <h1>error {result.failed} </h1>

    //! If the user doesn't have connections yet show them a list of recommended users
    if (!result.user?.connections || result.user?.connections.length < 1) {
        let response2 = await fetch(`http://localhost:3000/api/getAllUsers?email=${session.user.email}`, { cache: "no-store" })
        let result2: { failed?: string, users: any[] } = await response2.json()

        if (result.failed) return <h1>error {result.failed} </h1>

        return (
            <div className="Messages">
                <BigBar user={result.user} stories={result.stories} noConnections={result2.users} />
                {children}
            </div>
        )
    }
    else {
        return (
            <div className="Messages">
                <BigBar user={result.user} stories={result.stories} />
                {children}
            </div>
        )
    }
}
