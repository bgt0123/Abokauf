import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'
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
>( //THUNK: Gibt den aktuell angemeldeten Kunden zurück. Akzeptiert als "identifier" entweder die E-Mail-Adresse oder username (companyname).
    'auth/login',
    async ({ identifier, password }, { rejectWithValue }) => {
        try {
            let found: Customer | undefined

            if (identifier.includes('@')) {
                const { customer } = await readCustomer(identifier)
                found = customer[0] // Mehrere Kunden mit gleicher E-Mail sind laut Anforderung nicht erlaubt — erster Treffer reicht.
            } else {
                // Das DB-Schema (vorgegeben) verwendet `companyname` als Username-Feld.
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
        builder
            .addMatcher(
                isAnyOf(loginThunk.pending, registerThunk.pending, updateCustomerThunk.pending),
                state => { state.loading = true; state.error = null }
            )
            .addMatcher(
                isAnyOf(loginThunk.fulfilled, registerThunk.fulfilled, updateCustomerThunk.fulfilled),
                (state, action) => { state.loading = false; state.currentUser = action.payload }
            )
            .addMatcher(
                isAnyOf(loginThunk.rejected, registerThunk.rejected, updateCustomerThunk.rejected),
                (state, action) => { state.loading = false; state.error = action.payload ?? 'Unbekannter Fehler.' }
            )
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
