import Left from "@/components/main/messages/connection/left";
import Right from "@/components/main/messages/connection/right";
import { Metadata } from "next";

type params = { connectionId: string }
type searchParams = { id: string, active: "true" | "false" }

//! Generating dynamic metaData
export async function generateMetadata({ params: { connectionId }, searchParams: { id } }: { params: params, searchParams: searchParams }) {

    let response = await fetch(`http://localhost:3000/api/message?userId=${id}&connectionId=${connectionId}`, { cache: "no-store" })
    let result: { failed?: string, user: FullUser, connection: Connection, yes: boolean } = await response.json()

    if (result.failed) {
        return {
            title: "Messages X - 404",
            description: "This page doesn't exist"
        }
    }

    return {
        title: `Messages X - ${result.connection.name}`,
        description: `This is the contact page of ${result.connection.name}`
    }
}

export default async function Message({ params: { connectionId }, searchParams: { id, active } }: { params: params, searchParams: searchParams }) {

    let response = await fetch(`http://localhost:3000/api/message?userId=${id}&connectionId=${connectionId}`, { cache: "no-store" })
    let result: { failed?: string, user: FullUser, connection: Connection, yes: boolean } = await response.json()

    if (result.failed) return <h1>error {result.failed} </h1>

    return (
        <div className="Connection">

            <Left user={result.user} connection={result.connection} haveMe={result.yes ? "yes" : "no"} active={active} />
            <Right user={result.user} connection={result.connection} />

        </div>
    )
}
