import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type CommonState = {
    currentRouteKey: string
    resetPasswordEmail: string
}

export const initialState: CommonState = {
    currentRouteKey: '',
    resetPasswordEmail: ''
}

export const commonSlice = createSlice({
    name: `${SLICE_BASE_NAME}/common`,
    initialState,
    reducers: {
        setCurrentRouteKey: (state, action: PayloadAction<string>) => {
            state.currentRouteKey = action.payload
        },
        setResetPasswordEmail: (state, action: PayloadAction<string>) => {
            state.resetPasswordEmail = action.payload
        },
    },
})

export const { setCurrentRouteKey, setResetPasswordEmail } = commonSlice.actions

export default commonSlice.reducer
