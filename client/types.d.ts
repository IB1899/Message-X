interface session {
    email: string,
    id: string,
    name: String,
    image: string
}

interface FullUser {
    _id: string
    name: string,
    email: string,
    image: string,
    username: string,
    imageName: string,
    requests?: {
        name: String,
        email: String,
        id: String,
        image: String,
    }[],
    connections: [
        {
            RoomConnectionId: string,
            notification: boolean,

            _id: string,
            image: string,
            username: string,
            name: string,
            email: string,
            description: string,
            story: string,
            phoneNumber: string,

            messages: [
                {
                    _id: string,
                    from: string,
                    message: string,
                    time: Date,
                    MessageType: "message" | "image",
                    MessageImageName?: String
                }
            ]
        }
    ],
    story?: string,
    privateAccount?: boolean,
    notification?: boolean
    status?: boolean
    publicStories?: boolean
    password?: string,
    description?: string
    age?: string
    phoneNumber?: string,
    gender?: string
    country?: string
}

interface Connection {
    RoomConnectionId: string,
    notification: boolean,

    _id: string,
    image: string,
    username: string,
    name: string,
    email: string,
    description: string,
    story: string,
    phoneNumber: string,

    messages: [
        {
            _id: string,
            from: string,
            message: string,
            time: Date,
            MessageType: "message" | "image"
            MessageImageName?: String
        }
    ]
}

interface story {
    user: string,
    story: string,
    _id: string,
    storyName: string,
    createdAt: string,
    userImage: string,
    username: string
}

type Message = {
    from: string,
    message: string,
    _id: string,
    time: Date | number,
    MessageType: "message" | "image"
    MessageImageName?: String
}
