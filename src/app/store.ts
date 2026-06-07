import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import konfiguratorReducer from '../features/konfigurator/konfiguratorSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        konfigurator: konfiguratorReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
