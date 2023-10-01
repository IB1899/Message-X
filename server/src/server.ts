import express, { Request, Response, json } from "express"
import cors from "cors"
import { job } from "./controller/cron-jobs"

let server = express()
server.use(express.json())
server.use(cors())


//! Run the cron job
job()

server.listen(3001, () => {
    console.log("listening");
})
