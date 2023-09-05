import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Types {
    Success: string,
    Failed: string,
    Loading: boolean,
    verifyMessage: string,
    isForgotPassword:boolean
}

let AuthSlice = createSlice({

    name: "SignUp page slice",

    initialState: { Success: "", Failed: "", Loading: false, verifyMessage: "", isForgotPassword:false } as Types,

    reducers: {

        setSuccess: (state, action: PayloadAction<string>) => {
            return { ...state, Failed: "", Success: action.payload };
        },

        setFailed: (state, action: PayloadAction<string>) => {
            return { ...state, Success: "", Failed: action.payload };
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            return { ...state, Loading: action.payload };
        },

        setVerifyEmail: (state, action: PayloadAction<string>) => {
            return { ...state, verifyMessage: action.payload };
        },

        setIsForgotPassword: (state, action: PayloadAction<boolean>) => {
            return { ...state, isForgotPassword: action.payload };
        },
    }
})

export const { setSuccess, setFailed, setLoading, setVerifyEmail , setIsForgotPassword} = AuthSlice.actions;
export default AuthSlice.reducer