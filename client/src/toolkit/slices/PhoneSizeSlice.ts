import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Types = {

    isBigBar: boolean, //! To show & hide the left big bar
    isProfile: boolean, //! To show & hide the profile
    isRightBar: boolean //! To hide the right bar while showing either the messages, voiceChat, or videoChat
}

let PhoneSizeSlice = createSlice({

    name: "Phone sizes states",

    initialState: { isBigBar: false, isProfile: false, isRightBar: false } as Types,

    reducers: {

        setIsBigBar: (state, action: PayloadAction<boolean>) => {
            return { ...state, isBigBar: action.payload }
        },
        setIsProfile: (state, action: PayloadAction<boolean>) => {
            return { ...state, isProfile: action.payload }
        },
        setIsRightBar: (state, action: PayloadAction<boolean>) => {
            return { ...state, isRightBar: action.payload }
        },

    }
})

export const { setIsBigBar, setIsProfile, setIsRightBar } = PhoneSizeSlice.actions;
export default PhoneSizeSlice.reducer