import Image from "next/image";
import { BiDotsVerticalRounded, BiMailSend } from "react-icons/bi";
import { AiFillCaretDown } from "react-icons/ai"
import { GoCopy } from "react-icons/go"
import Operation from "./operation";
import { FaMicrophone } from "react-icons/fa";

type props = {
    user: FullUser, connection: Connection, haveMe: "yes" | "no", active: "true" | "false", now: "now"|null
}

export default function Left({ user, connection, haveMe, active, now=null }: props) {

    return (
        <div className="Left">

            <header>

                <div className="i">
                    <Image src={connection.image} alt="userImage" width={60} height={60} quality={100} />
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

            <Operation user={user} connection={connection} haveMe={haveMe} now={now} />

        </div>
    )
}
