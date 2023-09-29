import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Types = {
    searchedUser: { name: string, email: string, _id: string, image: string, story: string, description: string, username: string, phoneNumber: number },
    searchMessage: string,
    loading: boolean,
    isSettings: boolean,
    isProfile: boolean,
    isAddStory: boolean
}

let MainSlice = createSlice({

    name: "Main page slice",

    initialState: { searchedUser: {}, searchMessage: "", loading: false, isAddStory: false, isSettings: false, isProfile: false } as Types,

    reducers: {

        setSearchedUser: (state, action: PayloadAction<any>) => {
            return { ...state, searchedUser: action.payload };
        },
        setSearchMessage: (state, action: PayloadAction<string>) => {
            return { ...state, searchMessage: action.payload }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            return { ...state, loading: action.payload }
        },
        setIsSettings: (state, action: PayloadAction<boolean>) => {
            return { ...state, isSettings: action.payload }
        },
        setIsProfile: (state, action: PayloadAction<boolean>) => {
            return { ...state, isProfile: action.payload }
        },
        setIsAddStory: (state, action: PayloadAction<boolean>) => {
            return { ...state, isAddStory: action.payload }
        },
    }
})

export const { setSearchedUser, setSearchMessage, setLoading, setIsSettings, setIsProfile, setIsAddStory } = MainSlice.actions;
export default MainSlice.reducer