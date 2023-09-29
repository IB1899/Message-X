import { ObjectId } from "mongodb";
import { model, models, Schema } from "mongoose";

let AccountsSchema = new Schema({

    type: ObjectId,
    provider: String,
    userId: String,
    scope: String,
    id_token: String,
    expires_ar: Number,
    access_token: String,
    providerAccountId: String,
    token_type: String


}, { timestamps: true })

export default models.account || model("account", AccountsSchema)