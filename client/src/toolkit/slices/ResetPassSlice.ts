import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Types {
    Loading: boolean,
    message: string
}

let ResetPasswordSlice = createSlice({

    name: "ResetPassword page slice",

    initialState: { Loading: false, message: "" } as Types,

    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            return { ...state, Loading: action.payload };
        },
        setMessage: (state, action: PayloadAction<string>) => {
            return { ...state, message: action.payload };
        }

    }
})

export const { setLoading, setMessage } = ResetPasswordSlice.actions;
export default ResetPasswordSlice.reducer