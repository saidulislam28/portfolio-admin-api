import { combineReducers, CombinedState, AnyAction, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import app, { AppState } from './slices/app'
import base, { BaseState } from './slices/base'
// import RtkQueryService from '@/services/RtkQueryService'

export type RootState = CombinedState<{
    auth: CombinedState<AuthState>
    app: CombinedState<AppState>
    base: CombinedState<BaseState>
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // [RtkQueryService.reducerPath]: any
}>

export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
    auth,
    app,
    base,
    // [RtkQueryService.reducerPath]: RtkQueryService.reducer,
}

const rootReducer =
    (asyncReducers?: AsyncReducers) =>
    (state: RootState, action: AnyAction) => {
        const combinedReducer = combineReducers({
            ...staticReducers,
            ...asyncReducers,
        })
        return combinedReducer(state, action)
    }

export default rootReducer
