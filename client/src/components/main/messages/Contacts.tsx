import Image from "next/image";

export default function Contacts({ connections }: { connections: any[] }) {



    return (
        <div className="Contacts">
            {connections.map(connection => (
                <div className="contact" key={connection._id}>

                    <Image src={connection.image} alt="user image" width={50} height={50} />
                    <div className="contactInfo">
                        <h3> {connection.name} </h3>
                        <h5> {connection.username} </h5>
                    </div>

                    <div className="messagesInfo">
                        <span className="missedMessages">4</span>
                        <span className="time">12:33</span>
                    </div>

                </div>
            ))}
        </div>
    )
}
