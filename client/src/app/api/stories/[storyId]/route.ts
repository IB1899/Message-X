import MongoDbConnection from "@/backend/database/connect";
import { NextRequest, NextResponse } from "next/server";
import StoryModel from "@/backend/database/storyModel"

MongoDbConnection()

export async function GET(request: NextRequest, { params }: { params: { storyId: string } }) {
    try {

        let story: story | null = await StoryModel.findById(params.storyId)

        if (!story) throw Error("The story wan't found")

        return NextResponse.json({story})

    }
    catch (err: any) {

        return NextResponse.json({ failed: err.message })
    }
}