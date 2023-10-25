import express, { Request, Response, json } from "express"
import cors from "cors"
import { job } from "./controller/cron-jobs"
import http from "http"
import { ConnectToDB, UserModel } from "./model/UserModel"
import { Server } from "socket.io"
import { SocketCode } from "./controller/socket"
import { PeerServer } from "peer"

const peerServer = PeerServer({ port:3002 , path:"/calls-peer" })

let app = express()
app.use(express.json())
app.use(cors())

let server = http.createServer(app)
ConnectToDB(() => server.listen(3001))

//! Run the cron job
// job()


export let io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        allowedHeaders: ['GET', "PUT", "POST", "DELETE"]
    }
})


io.on('connection', (socket)=> SocketCode(socket , io)  )