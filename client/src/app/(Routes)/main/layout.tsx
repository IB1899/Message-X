import authOptions from "@/app/api/auth/[...nextauth]/options"
import SideBar from "@/components/main/SideBar"
import { Metadata } from "next"
import { getServerSession } from "next-auth"



export default async function Main({ children }: { children: React.ReactNode }) {

    let session = await getServerSession(authOptions)
    if (!session?.user) return <h1>error the session was not found </h1>

    let response = await fetch(`http://localhost:3000/api/messages/${session.user.id}`, { cache: "no-store" })
    let result: { failed?: string, success?: string, user: FullUser } = await response.json()

    if (result.failed) return <h1>error {result.failed} </h1>

    return (
        <div className="Main">
            <SideBar user={result.user} />

            {children}
        </div>
    )
}
