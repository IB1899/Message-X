import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Types {
    Operation: "TextMessaging" | "VideoCalling" | "VoiceCalling"
}

let PeerSlice = createSlice({

    name: "PeerSlice for the peers calls",

    initialState: { Operation: "TextMessaging" } as Types,

    reducers: {
        setOperation: (state, action: PayloadAction<"TextMessaging" | "VideoCalling" | "VoiceCalling">) => {
            return { ...state, Operation: action.payload };
        },


    }
})

export const { setOperation } = PeerSlice.actions;
export default PeerSlice.reducer