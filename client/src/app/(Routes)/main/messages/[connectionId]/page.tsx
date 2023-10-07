import Left from "@/components/main/messages/message/left";
import Right from "@/components/main/messages/message/right";
import { io } from "socket.io-client";


type params = { connectionId: string }
type searchParams = { id: string }

export default async function Message({ params: { connectionId }, searchParams: { id } }: { params: params, searchParams: searchParams }) {

    let response = await fetch(`http://localhost:3000/api/messages/${id}`, { cache: "no-store" })
    let result: { failed?: string, success?: string, user: FullUser } = await response.json()

    if (result.failed) return <h1>error {result.failed} </h1>

    let connection: Connection[] = result.user.connections?.filter((connection) => {
        if (connection._id === connectionId) return connection
    })!

    return (
        <div className="Message">

            <Left user={result.user} connection={connection[0]}/>
            <Right user={result.user} connection={connection[0]}  />

        </div>
    )
}
