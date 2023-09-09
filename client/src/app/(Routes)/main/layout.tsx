import SideBar from "@/components/main/SideBar"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Messages",
    description: "This is the messages dashboard"
}

export default function Main({ children }: { children: React.ReactNode }) {


    return (
        <div className="Main">
            <SideBar />

            {children}
        </div>
    )
}
