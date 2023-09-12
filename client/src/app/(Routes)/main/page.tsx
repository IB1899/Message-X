import authOptions from "@/app/api/auth/[...nextauth]/options"
import Error from "@/app/error"
import BigBar from "@/components/main/messages/MessagesBigBar"
import { getServerSession } from "next-auth"

export default async function Messages() {

    let session = await getServerSession(authOptions)
    if (!session?.user) return <h1>error the session wasn't found </h1>

    let response = await fetch(`http://localhost:3000/api/messages/${session.user.id}`, { cache: "no-store" })
    let result: { failed?: string, success?: string, user: FullUser } = await response.json()

    if (result.failed) return <h1>error {result.failed} </h1>

    return (
        <div className="Messages">
            <BigBar user={result.user} />
        </div>
    )
}
