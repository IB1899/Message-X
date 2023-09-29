import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/backend/database/model"
import StoryModel from "@/backend/database/storyModel"
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/backend/config/firebase";
import MongoDbConnection from "@/backend/database/connect";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid"

const firebaseApp = initializeApp(firebaseConfig);
MongoDbConnection()


export async function GET(request: NextRequest) {

    try {

        return NextResponse.json({ success: "yes" })
    }
    catch (err: any) {
        return NextResponse.json({ failed: err.message })
    }
}


//! The user creates a new story
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        const email = formData.get('email') as string
        const story = formData.get('story') as File

        let storyName = uuid()
        const buffer = Buffer.from(await story.arrayBuffer());

        let find = await StoryModel.findOne({ user:email })

        //! If there is an existing story associated with this email 
        if (find?.user) throw Error(" You can only share one story everyday ")

        let storage = getStorage()

        //* Save the user's image to firebase
        let snapshot = await uploadBytesResumable(ref(storage, `user-images/${storyName}`), buffer, { contentType: story.type })
        let downloadURL = await getDownloadURL(snapshot.ref)

        let result = await StoryModel.create({ user:email, story: downloadURL, storyName })

        return NextResponse.json({ success: "Story uploaded successfully" })
    }
    catch (err: any) {
        return NextResponse.json({ failed: err.message })
    }
}
