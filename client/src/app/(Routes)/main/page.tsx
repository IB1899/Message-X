import { getServerSession } from "next-auth"

export default async function Main() {

    let session = await getServerSession()
    console.log(`session:`, session)
    
    
    return (
        <div className="main">
            <h1>hi</h1>
        </div>
    )
}
