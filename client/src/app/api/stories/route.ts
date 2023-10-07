import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/backend/database/model"
import StoryModel from "@/backend/database/storyModel"
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/backend/config/firebase";
import MongoDbConnection from "@/backend/database/connect";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { v4 as uuid } from "uuid"

const firebaseApp = initializeApp(firebaseConfig);
MongoDbConnection()


//! Get the user and the stories of his contacts.
export async function GET(request: NextRequest) {
    try {

        let email: string | null = request.nextUrl.searchParams.get("email")

        if (!email) throw Error(" Email wasn't provided ");

        let user: FullUser | null = await UserModel.findOne({ email })

        let emails: string[] = [email]

        //! Get the emails of the user's contacts O(n)
        user?.connections?.forEach(async (connection) => {
            emails.push(connection.email)
        })

        //! O(n) get me the stories based on the list of emails provided
        let stories: { email: string, image: string, _id: string }[] | null = await StoryModel.find({ user: { $in: emails } })

        return NextResponse.json({ user, stories })
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
        const userImage = formData.get('userImage') as string
        const username = formData.get('username') as string
        const story = formData.get('story') as File

        let storyName = uuid()
        const buffer = Buffer.from(await story.arrayBuffer());

        let find = await StoryModel.findOne({ user: email })

        //! If there is an existing story associated with this email 
        if (find?.user) throw Error(" You can only share one story everyday ")

        let storage = getStorage()

        //* Save the user's image to firebase
        let snapshot = await uploadBytesResumable(ref(storage, `stories/${storyName}`), buffer, { contentType: story.type })
        let downloadURL = await getDownloadURL(snapshot.ref)

        let result = await StoryModel.create({ user: email, story: downloadURL, storyName, userImage, username })

        return NextResponse.json({ success: "Story uploaded successfully" })
    }
    catch (err: any) {
        return NextResponse.json({ failed: err.message })
    }
}


//! Delete expired stories. This API end-point is triggered by a cron job in the server section of this application
export async function DELETE(request: NextRequest) {
    try {

        //* Calculate the timestamp for 24 hours ago
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    
        let stories = await StoryModel.find({ createdAt:{ $lt:twentyFourHoursAgo } })

        if(!stories || stories.length === 0) throw Error("No stories to delete");

        let storage = getStorage()

        stories.forEach(async(story)=>{

            let deleted = await deleteObject(ref( storage , `stories/${story.storyName}` ))
        })

        let result = await StoryModel.deleteMany({ createdAt: { $lt: twentyFourHoursAgo } });

        return NextResponse.json({ success: "The expired stories has been deleted successfully" })
    }
    catch (err: any) {
        return NextResponse.json({ failed: err.message })
    }
}