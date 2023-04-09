import { configureStore, ThunkAction, Action, MiddlewareArray } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import { AuthService } from './services/authService';

export function makeStore() {
    return configureStore({
        reducer: {
            [AuthService.reducerPath]: AuthService.reducer,
            "authReducer": authReducer,

        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(AuthService.middleware)
    })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>

export default store