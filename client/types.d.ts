interface session {
    email: string,
    id: string,
    name: String,
    image: string
}

interface FullUser {
    _id:string
    name: string,
    email: string,
    image: string,
    username:string,
    requests?: {
        name: String,
        email: String,
        id: String,
        image: String,
    }[],
    connections?: [
        {
            RoomConnectionId: string,
            notification: boolean,

            id: string,
            image: string,
            username: string,
            name: string,
            email: string,
            description: string,
            story: string,

            messages: [
                {
                    from: string,
                    message: string,
                    time: string
                }
            ]
        }
    ],
    story?:string,
    privateAccount?: boolean,
    notification?: boolean
    status?: boolean
    publicStories?: boolean
    password?: string,
    description?: string
    age?: number
    phoneNumber?: number,
    gender?: string
    Country?: string
}