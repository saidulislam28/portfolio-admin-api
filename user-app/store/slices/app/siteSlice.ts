import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SiteState = {
    activeProjectId?: string | number
}

const initialState: SiteState = {
    activeProjectId: 0
}

const siteSlice = createSlice({
    name: `site`,
    initialState,
    reducers: {
        setActiveProject(state, action: PayloadAction<SiteState>) {
            console.log(action);
            state.activeProjectId = Number(action.payload?.activeProjectId)
        },
    },
})

export const { setActiveProject } = siteSlice.actions
export default siteSlice.reducer
