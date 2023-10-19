import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { io, Socket } from "socket.io-client";

type Types = {
    socket: Socket,
    searchChat: string
}

/* 
! I have paced the socket.io connection for the following reasons:
? 1. To establish one connection for each user.
? 2. To access this socket variable from every component that needs it.
? 3. We don't change/update this socket Global State therefore it doesn't cause any rerender to the components it was invoked in.
? 4. The best deign solution from my prospective at the time.
*/

let SocketSlice = createSlice({

    name: "message page slice",

    initialState: { socket: io("http://localhost:3001"), searchChat: "" } as Types,

    reducers: {

        setSearchChat: (state, action: PayloadAction<string>) => {
            return { ...state, searchChat: action.payload };
        }

    }
})

export const { setSearchChat } = SocketSlice.actions;
export default SocketSlice.reducer