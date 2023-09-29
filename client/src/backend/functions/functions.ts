
import UserModel from "@/backend/database/model"

//! Update Images everywhere
export let updateImageEveryWhere = async (email:string , image:string)=>{
    //* 1- Get the connections of the current user
    let connections: { connections: Connection[], _id: String } | null = await UserModel.findOne({ email }, { connections: 1 })

    //* 2- The connections contain the data of the users that the current user is connected with. O(n) and not O(n^3)
    connections?.connections.forEach(async (connection) => {

        let { email: OtherUserEmail } = connection

        //* 3- Update the current user's details in the connections of the other user
        let update = await UserModel.updateOne({ email: OtherUserEmail, 'connections.email': email },
            { $set: { "connections.$.image": image } }
        )

        if (update.modifiedCount !== 1) throw Error("Can't update your data to the other users")
    })
}