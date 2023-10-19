import Image from "next/image";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiFillCaretDown } from "react-icons/ai"
import { GoCopy } from "react-icons/go"
import TheMessages from "./TheMessages";
import { Socket } from "socket.io-client";

type props = {
    user: FullUser, connection: Connection, haveMe: "yes" | "no", active: "true" | "false"
}

export default function Left({ user, connection, haveMe, active }: props) {

    return (
        <div className="Left">

            <header>

                <div className="i">
                    <Image src={connection.image} alt="userImage" width={60} height={60} />
                    <i> <AiFillCaretDown /> </i>
                </div>

                <div className="ii">
                    <h3> {connection.name} </h3>
                    {active === "true" ? <h5 style={{ color: "limegreen" }}> online </h5> : <h5 style={{ color: "red" }}> offline </h5>}
                </div>

                <div className="iii">
                    <i> <GoCopy /> </i>
                    <i> <BiDotsVerticalRounded /> </i>
                </div>

            </header>

            <TheMessages user={user} connection={connection} haveMe={haveMe} />

        </div>
    )
}
