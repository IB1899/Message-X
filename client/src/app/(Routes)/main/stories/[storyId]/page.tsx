import Image from "next/image"
import Background from "./background"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { Lobster } from "next/font/google"

const lobster = Lobster({ subsets: ["latin"], weight: ["400"] })

export default async function Story({ params: { storyId } }: { params: { storyId: string } }) {

    let response = await fetch(`http://localhost:3000/api/stories/${storyId}`)

    let result: { story: story, failed: string } = await response.json()

    if (result.failed) return <h1> {result.failed} </h1>

    return (
        <div className='Story'>
            <Background />

                <div className="user-header">
                    <Image className="userImage" src={result.story.userImage} alt="user image" width={90} height={90} />
                    <h3 className={lobster.className}> {result.story.username} </h3>

                    <span> { formatDistanceToNow(new Date(result.story.createdAt)) } ago </span>
                </div>

                <Image className="story" src={result.story.story} alt="user image" width={600} height={470} />
        </div>
    )
}
