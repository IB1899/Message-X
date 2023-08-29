
import mongoose, { model , models } from "mongoose";
import bcrypt from "bcrypt"
import UserSchema from "./schema";


//* Hashing the users passwords before saving them in the database
UserSchema.pre("save", async function (next) {

    let salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password!, salt)

    next()
})

export default models.user || model("user" , UserSchema)