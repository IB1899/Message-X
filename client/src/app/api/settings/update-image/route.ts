import MongoDbConnection from "@/backend/database/connect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/backend/database/model"
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/backend/config/firebase"
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { v4 as uuid } from "uuid"
import { updateImageEveryWhere } from "@/backend/functions/functions";

MongoDbConnection()
const firebaseApp = initializeApp(firebaseConfig);

//! Updating the user's image
export async function POST(request: NextRequest) {

    try {
        const formData = await request.formData()
        const email = formData.get('email') as string

        const image: any = formData.get('image')
        const buffer = Buffer.from(await image.arrayBuffer());

        let storage = getStorage()

        let result = await UserModel.findOne({ email }, { image: 1, imageName: 1 })

        //! The user has their image saved in our firebase database
        if (result.image && result.imageName) {

            //* delete the existing image from firebase
            await deleteObject(ref(storage, `user-images/${result.imageName}`))

            //* add the new one to firebase
            let snapshot = await uploadBytesResumable(ref(storage, `user-images/${result.imageName}`), buffer, { contentType: image.type })

            // updateImageEveryWhere(email , result.image) //! not needed here because I don't change the value 'image'
        }

        //! The user doesn't have their image stored in our firebase database
        else {

            //* Images are saved in firebase under this [imageName] therefore I must keep track of it in mongodb as well
            let imageName = uuid() + image.name

            //* add the new one to firebase
            let snapshot = await uploadBytesResumable(ref(storage, `user-images/${imageName}`), buffer, { contentType: image.type })
            let downloadURL = await getDownloadURL(snapshot.ref)

            //*  Update the user's information in their document
            let update = await UserModel.updateOne({ email }, { image: downloadURL, imageName })

            updateImageEveryWhere(email , downloadURL)
        }

        return NextResponse.json({ success: "image uploaded" })

    }
    catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ failed: err.message })
    }

}