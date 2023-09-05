import express, { Request, Response, json } from "express"
import cors from "cors"


let server = express()

server.use(express.json())

server.use(cors())

server.listen(3001, () => {
    console.log("listening");

})
