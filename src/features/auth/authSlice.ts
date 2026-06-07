import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Customer } from '../../types'
import { readCustomer, getAllCustomers } from '../../api/api'

interface AuthState {
    currentUser: Customer | null
    loading: boolean
    error: string | null
}

const initialState: AuthState = {
    currentUser: null,
    loading: false,
    error: null,
}

// ── Async Thunks ──────────────────────────────────────

export const loginThunk = createAsyncThunk<
    Customer,
    { identifier: string; password: string },
    { rejectValue: string }
>(
    'auth/login',
    async ({ identifier, password }, { rejectWithValue }) => {
        try {
            let found: Customer | undefined

            if (identifier.includes('@')) {
                const { customer } = await readCustomer(identifier)
                found = customer[0]
            } else {
                const { allCustomers } = await getAllCustomers()
                found = Object.values(allCustomers).find(
                    c => c.companyname === identifier
                )
            }

            if (!found || found.password !== password) {
                return rejectWithValue('Benutzername/E-Mail oder Passwort ist falsch.')
            }

            return found
        } catch {
            return rejectWithValue('Anmeldung fehlgeschlagen. Bitte versuche es erneut.')
        }
    }
)

export const registerThunk = createAsyncThunk<
    Customer,
    Customer,
    { rejectValue: string }
>(
    'auth/register',
    async (newCustomer, { rejectWithValue }) => {
        try {
            const { saveCustomer } = await import('../../api/api')
            await saveCustomer(newCustomer)
            const { customer } = await readCustomer(newCustomer.email)
            const created = customer[0]
            if (!created) return rejectWithValue('Registrierung fehlgeschlagen.')
            return created
        } catch {
            return rejectWithValue('Registrierung fehlgeschlagen. Bitte versuche es erneut.')
        }
    }
)

// ── Slice ─────────────────────────────────────────────
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.currentUser = null
            state.error = null
        },
        clearError(state) {
            state.error = null
        },
    },
    extraReducers: builder => {
        // login
        builder
            .addCase(loginThunk.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false
                state.currentUser = action.payload
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? 'Unbekannter Fehler.'
            })
        // register
        builder
            .addCase(registerThunk.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.loading = false
                state.currentUser = action.payload
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? 'Unbekannter Fehler.'
            })
    },
})

export const { logout, clearError } = authSlice.actions

// ── Selectors ─────────────────────────────────────────
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.currentUser
export const selectAuthLoading  = (state: { auth: AuthState }) => state.auth.loading
export const selectAuthError    = (state: { auth: AuthState }) => state.auth.error
export const selectIsLoggedIn   = (state: { auth: AuthState }) => state.auth.currentUser !== null

export default authSlice.reducer
