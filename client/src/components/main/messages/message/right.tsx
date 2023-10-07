import Image from "next/image";
import { PiFolderOpen } from "react-icons/pi";
import CallChat from "./CallChat";
import SearchChat from "./searchChat";
import Options from "./options";
import img1 from "@/../public/test1.jpg"
import img2 from "@/../public/test2.png"
import img3 from "@/../public/test3.png"
import img4 from "@/../public/test3.png"
import DeleteChat from "./deleteChat";
import Copy from "./copy";

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


            <h3 className="sharedPhotos"> <i> <PiFolderOpen /> </i> <span>Shared Photos  </span></h3>

            <div className="images">

                <Image src={img1} alt="shared" width={60} height={50} />
                <Image src={img2} alt="shared" width={60} height={50} />
                <Image src={img3} alt="shared" width={60} height={50} />
                <Image src={img4} alt="shared" width={60} height={50} />
                <Image src={img1} alt="shared" width={60} height={50} />
                <Image src={img2} alt="shared" width={60} height={50} />
                <Image src={img3} alt="shared" width={60} height={50} />
                <Image src={img4} alt="shared" width={60} height={50} />
                <Image src={img2} alt="shared" width={60} height={50} />

            </div>

            <DeleteChat />
        </div>
    )
}