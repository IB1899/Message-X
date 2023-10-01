import Image from "next/image"
import Background from "./[storyId]/background"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { Lobster } from "next/font/google"
import { getServerSession } from "next-auth"
import authOptions from "@/app/api/auth/[...nextauth]/options"

const lobster = Lobster({ subsets: ["latin"], weight: ["400"] })

//! Show the first story
export default async function Page() {

    let session = await getServerSession(authOptions)
    if (!session?.user) return <h1>error the session was not found </h1>

    let response = await fetch(`http://localhost:3000/api/stories?email=${session.user.email}`, { cache: "no-store" })
    let result: { failed?: string, user: FullUser, stories: story[] } = await response.json()

    if (result.failed) return <h1>error {result.failed} </h1>

    return (
        <div className='Story'>
            <Background />

            <div className="user-header">
                <Image className="userImage" src={result.stories[0].userImage} alt="user image" width={90} height={90} />
                <h3 className={lobster.className}> {result.stories[0].username} </h3>

                <span> {formatDistanceToNow(new Date(result.stories[0].createdAt))} ago </span>
            </div>

            <Image className="story" src={result.stories[0].story} alt="user image" width={600} height={470} />
        </div>
    )
}