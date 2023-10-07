import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { io, Socket } from "socket.io-client";

type Types = {
    socket: Socket,
    searchChat:string
}

let SocketSlice = createSlice({

    name: "message page slice",

    initialState: { socket: io("http://localhost:3001") , searchChat:"" } as Types,

    reducers: {

        setSearchChat: (state, action: PayloadAction<string>)=>{
            return { ...state, searchChat: action.payload };
        }
        
    }
})

export const { setSearchChat } = SocketSlice.actions;
export default SocketSlice.reducer