
import { model, models, Schema } from "mongoose";

let StorySchema = new Schema({

    story: {
        type: String,
        unique: true,
    },
    storyName: {
        type: String,
        unique: true,
    },
    user: {
        type: String,
        unique: true,
    },
    userImage: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
    }

}, { timestamps: true })

export default models.story || model("story", StorySchema)
