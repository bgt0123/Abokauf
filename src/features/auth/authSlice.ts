import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Customer, NewCustomer } from '../../types'
import { readCustomer, getAllCustomers, saveCustomer, updateCustomer } from '../../api/api'

interface AuthState {
    currentUser: Customer | null
    loading:     boolean
    error:       string | null
}

const initialState: AuthState = {
    currentUser: null,
    loading:     false,
    error:       null,
}

// ── Thunks ────────────────────────────────────────────

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
                found = Object.values(allCustomers).find(c => c.companyname === identifier)
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
    NewCustomer,
    { rejectValue: string }
>(
    'auth/register',
    async (newCustomer, { rejectWithValue }) => {
        try {
            const { success } = await saveCustomer(newCustomer)
            if (success[0] === false) {
                return rejectWithValue('Diese E-Mail-Adresse ist bereits vergeben.')
            }
            const { customer } = await readCustomer(newCustomer.email)
            const created = customer[0]
            if (!created) return rejectWithValue('Registrierung fehlgeschlagen.')
            return created
        } catch {
            return rejectWithValue('Registrierung fehlgeschlagen. Bitte versuche es erneut.')
        }
    }
)

export const updateCustomerThunk = createAsyncThunk<
    Customer,
    Customer,
    { rejectValue: string }
>(
    'auth/updateCustomer',
    async (customer, { rejectWithValue }) => {
        try {
            const { success } = await updateCustomer(customer)
            if (!success[0]) return rejectWithValue('Aktualisierung fehlgeschlagen.')
            return customer
        } catch {
            return rejectWithValue('Aktualisierung fehlgeschlagen. Bitte versuche es erneut.')
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
            state.error       = null
        },
        clearError(state) {
            state.error = null
        },
    },
    extraReducers: builder => {
        const pending   = (state: AuthState) => { state.loading = true;  state.error = null }
        const rejected  = (state: AuthState, action: { payload?: string }) => {
            state.loading = false
            state.error   = action.payload ?? 'Unbekannter Fehler.'
        }

        builder
            .addCase(loginThunk.pending,   pending)
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading      = false
                state.currentUser  = action.payload
            })
            .addCase(loginThunk.rejected,  rejected)

        builder
            .addCase(registerThunk.pending,   pending)
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.loading     = false
                state.currentUser = action.payload
            })
            .addCase(registerThunk.rejected,  rejected)

        builder
            .addCase(updateCustomerThunk.pending,   pending)
            .addCase(updateCustomerThunk.fulfilled, (state, action) => {
                state.loading     = false
                state.currentUser = action.payload
            })
            .addCase(updateCustomerThunk.rejected,  rejected)
    },
})

export const { logout, clearError } = authSlice.actions

// ── Selectors ─────────────────────────────────────────
type S = { auth: AuthState }
export const selectCurrentUser = (s: S) => s.auth.currentUser
export const selectAuthLoading  = (s: S) => s.auth.loading
export const selectAuthError    = (s: S) => s.auth.error
export const selectIsLoggedIn   = (s: S) => s.auth.currentUser !== null

export default authSlice.reducer
