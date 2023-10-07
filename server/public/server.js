"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cron_jobs_1 = require("./controller/cron-jobs");
const http_1 = __importDefault(require("http"));
const UserModel_1 = require("./model/UserModel");
const socket_io_1 = require("socket.io");
const socket_1 = require("./controller/socket");
let app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
let server = http_1.default.createServer(app);
(0, UserModel_1.ConnectToDB)(() => server.listen(3001));
//! Run the cron job
(0, cron_jobs_1.job)();
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        allowedHeaders: ['GET', "PUT", "POST", "DELETE"]
    }
});
exports.io.on('connection', (socket) => (0, socket_1.SocketCode)(socket, exports.io));
