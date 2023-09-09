import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Types = {
    searchedUser: { name: string, email: string, _id: string, image: string, story: string, description: string, username: string },
    searchMessage: string,
    loading:boolean
}

let MainSlice = createSlice({

    name: "Main page slice",

    initialState: { searchedUser: {}, searchMessage: "" , loading:false } as Types,

    reducers: {

        setSearchedUser: (state, action: PayloadAction<any>) => {
            return { ...state, searchedUser: action.payload };
        },

        setSearchMessage: (state, action: PayloadAction<string>) => {
            return { ...state, searchMessage: action.payload }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            return { ...state, loading: action.payload }
        }

    }
})

export const { setSearchedUser, setSearchMessage , setLoading } = MainSlice.actions;
export default MainSlice.reducer