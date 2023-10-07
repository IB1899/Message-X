import Image from "next/image";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiFillCaretDown } from "react-icons/ai"
import { GoCopy } from "react-icons/go"
import TheMessages from "./TheMessages";
import { Socket } from "socket.io-client";

export default function Left({ user, connection }: { user: FullUser, connection: Connection }) {

    return (
        <div className="Left">

            <header>

                <div className="i">
                    <Image src={connection.image} alt="userImage" width={60} height={60} />
                    <i> <AiFillCaretDown /> </i>
                </div>

                <div className="ii">
                    <h3> {connection.username} </h3>
                    <h5> online </h5>
                </div>

                <div className="iii">
                    <i> <GoCopy /> </i>
                    <i> <BiDotsVerticalRounded /> </i>
                </div>

            </header>

            <TheMessages user={user} connection={connection} />


        </div>
    )
}
