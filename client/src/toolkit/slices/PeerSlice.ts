import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface Types {
    Operation: "TextMessaging" | "VideoCalling" | "VoiceCalling",
    // peer: Peer,
    amIBeingCalled: { isCalling: boolean, name: string, image: string, room: string, connectionId: string, userId: string }
}

let PeerSlice = createSlice({

    name: "PeerSlice for the peers calls",


    initialState: {
        Operation: "TextMessaging",
        amIBeingCalled: { isCalling: false },
        // peer: new Peer(uuid(), { host: "localhost", port: 3002, path: "/calls-peer" }),

    } as Types,

    reducers: {
        setOperation: (state, action: PayloadAction<"TextMessaging" | "VideoCalling" | "VoiceCalling">) => {
            return { ...state, Operation: action.payload };
        },

        setAmIBeingCalled: (state, action: PayloadAction<{ isCalling: boolean, name: string, image: string, room: string, connectionId: string, userId: string }>) => {
            return { ...state, amIBeingCalled: action.payload }
        }


    }
})

export const { setOperation, setAmIBeingCalled } = PeerSlice.actions;
export default PeerSlice.reducer