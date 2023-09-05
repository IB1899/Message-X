import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Email verification - Messages",
    description: "This page is a status page"
}

//! The purpose of this page is only to show a message
export default function Status({ params, searchParams }: { params: {}, searchParams: { message: string} }) {
    const message = searchParams.message

    let Message: JSX.Element;
    if (message === "verified") {
        Message = <div className="success">
            <h1>You have verified your email successfully You may close this page</h1>
        </div>
    }
    else if (message === "passedTwoMinutes") {
        Message = <div className="failed">
            <h1>The alloyed 2 minutes has passed please close this page and try again</h1>
        </div>
    }
    else {
        Message = <div className="failed">
            <h1>Something went wrong please close this page try again</h1>
        </div>
    }

    return (
        <div className="Status">
            {Message}
        </div>
    )
}
