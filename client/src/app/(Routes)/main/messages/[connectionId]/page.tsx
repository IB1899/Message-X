import Left from "@/components/main/messages/message/left";
import Right from "@/components/main/messages/message/right";
import { Metadata } from "next";
import { io } from "socket.io-client";


type params = { connectionId: string }
type searchParams = { id: string , active:"true" | "false" }

export const metadata: Metadata = {
    title: "Message X - page",
    description: "This is the messages dashboard"
}

export default async function Message({ params: { connectionId }, searchParams: { id , active } }: { params: params, searchParams: searchParams }) {

    let response = await fetch(`http://localhost:3000/api/message?userId=${id}&connectionId=${connectionId}`, { cache: "no-store" })
    let result: { failed?: string, user: FullUser, connection: Connection, yes: boolean } = await response.json()

    if (result.failed) return <h1>error {result.failed} </h1>

    return (
        <div className="Message">

            <Left user={result.user} connection={result.connection} haveMe={result.yes ? "yes" : "no"} active={active} />
            <Right user={result.user} connection={result.connection} />

        </div>
    )
}
