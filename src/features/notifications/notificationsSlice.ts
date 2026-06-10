import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Toast {
    id:      string
    message: string
    type:    'success' | 'error'
}

interface NotificationsState {
    toasts: Toast[]
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: { toasts: [] } as NotificationsState,
    reducers: {
        addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
            state.toasts.push({ ...action.payload, id: Date.now().toString() })
        },
        removeToast(state, action: PayloadAction<string>) {
            state.toasts = state.toasts.filter(t => t.id !== action.payload)
        },
    },
})

export const { addToast, removeToast } = notificationsSlice.actions

export const selectToasts = (s: { notifications: NotificationsState }) => s.notifications.toasts

export default notificationsSlice.reducer
