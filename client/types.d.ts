interface session {
    email: string,
    id: string,
    name: String,
    image: string
}


interface FullUser {
    name:string,
    email:string,
    image:string,
    connections?: [
        {
            RoomConnectionId:string,
            TheirID: string,
            TheirImage: string,
            TheirName: string,
            TheirEmail: string,

            messages: [
                {
                    from: string,
                    message: string,
                    time:string
                }
            ]
        }
    ],
    PrivateAccount?: boolean,
    notification?:boolean
    status?:boolean
    stories?:boolean
    password?: string,
    description?:string
    age?:number
    phoneNumber?: number,
    gender?: string
    Country?:string
}