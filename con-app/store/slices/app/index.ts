import { combineReducers } from '@reduxjs/toolkit'
import site, { SiteState } from './siteSlice'

const reducer = combineReducers({
    site,
})

export type AppState = {
    site: SiteState
}

export * from './siteSlice'

export default reducer
