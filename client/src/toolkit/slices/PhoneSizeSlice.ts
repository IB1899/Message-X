import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Types = {

    isBigBar: boolean,
    isProfile: boolean,
    isRightBar: boolean
}

let PhoneSizeSlice = createSlice({

    name: "Phone sizes states",

    initialState: { isBigBar: false, isProfile: false, isRightBar:false } as Types,

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