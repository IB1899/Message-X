import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import AuthSlice from "./slices/AuthSlice";
import ResetPasswordSlice from "./slices/ResetPassSlice";
import MainSlice from "./slices/MainSlice";
import SocketSlice from "./slices/SocketsSlice"

/*
! NOTE: The states that are declared using Redux are global states, and when a global state
! changes every component that uses that state will be rerendered.
*/
export let store = configureStore({

    reducer: {
        AuthSlice,
        ResetPasswordSlice,
        MainSlice,
        SocketSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export let useAppSelector: TypedUseSelectorHook<RootState> = useSelector;