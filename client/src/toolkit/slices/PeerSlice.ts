import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface Types {
    Operation: "TextMessaging" | "VideoCalling" | "VoiceCalling",
    amIBeingCalled: { isCalling: boolean, name: string, image: string, room: string, connectionId: string, type: "voice" | "video" }
}

let PeerSlice = createSlice({

    name: "PeerSlice for the peers calls",


    initialState: {
        Operation: "TextMessaging",
        amIBeingCalled: { isCalling: false },

    } as Types,

    reducers: {
        setOperation: (state, action: PayloadAction<"TextMessaging" | "VideoCalling" | "VoiceCalling">) => {
            return { ...state, Operation: action.payload };
        },

        setAmIBeingCalled: (state, action: PayloadAction<{
            isCalling: boolean, name: string, image: string,
            room: string, connectionId: string, type: "voice" | "video"
        }>) => {
            return { ...state, amIBeingCalled: action.payload }
        }


    }
})

export const { setOperation, setAmIBeingCalled } = PeerSlice.actions;
export default PeerSlice.reducer