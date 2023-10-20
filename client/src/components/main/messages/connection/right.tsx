import Image from "next/image";
import { PiFolderOpen } from "react-icons/pi";
import CallChat from "./messaging/CallChat";
import SearchChat from "./messaging/searchChat";
import Options from "./messaging/options";
import img1 from "@/../public/images/right1.png"
import img2 from "@/../public/images/right2.png"
import img3 from "@/../public/images/right3.png"
import img4 from "@/../public/images/right4.png"
import img5 from "@/../public/images/right5.png"
import img6 from "@/../public/images/right6.png"
import img7 from "@/../public/images/right7.png"
import img8 from "@/../public/images/right8.png"
import img9 from "@/../public/images/right9.png"

import DeleteChat from "./messaging/deleteChat";
import Copy from "./messaging/copy";

export default function Right({ user, connection }: { user: FullUser, connection: Connection }) {


    return (
        <div className="Right">

            <div className="img">
                <Image className="profileImage" src={connection.image} alt="Contacts image" width={130} height={130} />
            </div>
            <h1> {connection.name} </h1>

            <Copy username={connection.username} />
            <p> {connection.description} </p>

            <CallChat />

            <SearchChat />

            <Options user={user} />


            <h3 className="sharedPhotos"> <i> <PiFolderOpen /> </i> <span>Shared Photos</span></h3>

            <div className="images">

                <Image src={img1} alt="shared" width={60} height={50} />
                <Image src={img2} alt="shared" width={60} height={50} />
                <Image src={img3} alt="shared" width={60} height={50} />
                <Image src={img4} alt="shared" width={60} height={50} />
                <Image src={img5} alt="shared" width={60} height={50} />
                <Image src={img6} alt="shared" width={60} height={50} />
                <Image src={img7} alt="shared" width={60} height={50} />
                <Image src={img8} alt="shared" width={60} height={50} />
                <Image src={img9} alt="shared" width={60} height={50} />

            </div>

            <DeleteChat email={user.email} connectionId={connection._id} />
        </div>
    )
}
