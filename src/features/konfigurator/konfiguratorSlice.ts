import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { KonfiguratorState, LocalVersionsResult, NewAbo } from '../../types'
import {
    saveAboForCustomer,
    getLocalVersionsForPlz,
    getDistanceFromCompanyToDestinationPlz,
} from '../../api/api'

interface KonfiguratorSliceState extends KonfiguratorState {
    localVersions: LocalVersionsResult
    distanceKm:    number | null
    plzLoading:    boolean
    submitLoading: boolean
    error:         string | null
}

const initialState: KonfiguratorSliceState = {
    aboTyp:                null,
    lieferStreet:          '',
    lieferPlz:             '',
    lieferCity:            '',
    lokalausgabeId:        null,
    zustellungsart:        null,
    belieferungsintervall: null,
    zahlungsintervall:     null,
    zahlungsart:           null,
    startDatum:            '',
    austraegerHinweis:     '',
    berechneterPreis:      null,
    rechnungsAbweichend:   false,
    rechnungsStreet:       '',
    rechnungsPlz:          '',
    rechnungsCity:         '',
    localVersions:         {},
    distanceKm:            null,
    plzLoading:            false,
    submitLoading:         false,
    error:                 null,
}

// ── Thunks ────────────────────────────────────────────

export const fetchLocalVersionsThunk = createAsyncThunk<
    LocalVersionsResult,
    string,
    { rejectValue: string }
>(
    'konfigurator/fetchLocalVersions',
    async (plz, { rejectWithValue }) => {
        try {
            const { localversions } = await getLocalVersionsForPlz(plz)
            return localversions
        } catch {
            return rejectWithValue('Lokalausgaben konnten nicht geladen werden.')
        }
    }
)

export const fetchDistanceThunk = createAsyncThunk<
    number,
    string,
    { rejectValue: string }
>(
    'konfigurator/fetchDistance',
    async (plz, { rejectWithValue }) => {
        try {
            const { distanceCalcObj } = await getDistanceFromCompanyToDestinationPlz(plz)
            return distanceCalcObj[0]?.distance ?? 0
        } catch {
            return rejectWithValue('Entfernungsberechnung fehlgeschlagen.')
        }
    }
)

export const submitAboThunk = createAsyncThunk<boolean, NewAbo, { rejectValue: string }>(
    'konfigurator/submitAbo',
    async (newAbo, { rejectWithValue }) => {
        try {
            await saveAboForCustomer(newAbo)
            return true
        } catch {
            return rejectWithValue('Bestellung fehlgeschlagen. Bitte versuche es erneut.')
        }
    }
)

// ── Slice ─────────────────────────────────────────────
const konfiguratorSlice = createSlice({
    name: 'konfigurator',
    initialState,
    reducers: {
        setField<K extends keyof KonfiguratorState>(
            state: KonfiguratorSliceState,
            action: PayloadAction<{ field: K; value: KonfiguratorState[K] }>
        ) {
            (state as KonfiguratorState)[action.payload.field] = action.payload.value
        },
        reset() {
            return initialState
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLocalVersionsThunk.pending, state => {
                state.plzLoading    = true
                state.error         = null
                state.localVersions = {}
            })
            .addCase(fetchLocalVersionsThunk.fulfilled, (state, action) => {
                state.plzLoading    = false
                state.localVersions = action.payload
            })
            .addCase(fetchLocalVersionsThunk.rejected, (state, action) => {
                state.plzLoading = false
                state.error      = action.payload ?? 'Unbekannter Fehler.'
            })

        builder
            .addCase(fetchDistanceThunk.pending, state => {
                state.distanceKm = null
            })
            .addCase(fetchDistanceThunk.fulfilled, (state, action) => {
                state.distanceKm = action.payload
            })
            .addCase(fetchDistanceThunk.rejected, state => {
                state.distanceKm = 0
            })

        builder
            .addCase(submitAboThunk.pending, state => {
                state.submitLoading = true
                state.error         = null
            })
            .addCase(submitAboThunk.fulfilled, state => {
                state.submitLoading = false
            })
            .addCase(submitAboThunk.rejected, (state, action) => {
                state.submitLoading = false
                state.error         = action.payload ?? 'Unbekannter Fehler.'
            })
    },
})

export const { setField, reset } = konfiguratorSlice.actions

// ── Selectors ─────────────────────────────────────────
type S = { konfigurator: KonfiguratorSliceState }
export const selectKonfigurator          = (s: S) => s.konfigurator
export const selectAboTyp                = (s: S) => s.konfigurator.aboTyp
export const selectLieferPlz             = (s: S) => s.konfigurator.lieferPlz
export const selectZustellungsart        = (s: S) => s.konfigurator.zustellungsart
export const selectBelieferungsintervall = (s: S) => s.konfigurator.belieferungsintervall
export const selectZahlungsintervall     = (s: S) => s.konfigurator.zahlungsintervall
export const selectZahlungsart           = (s: S) => s.konfigurator.zahlungsart
export const selectBerechneterPreis      = (s: S) => s.konfigurator.berechneterPreis
export const selectLocalVersions         = (s: S) => s.konfigurator.localVersions
export const selectDistanceKm            = (s: S) => s.konfigurator.distanceKm
export const selectPlzLoading            = (s: S) => s.konfigurator.plzLoading
export const selectSubmitLoading         = (s: S) => s.konfigurator.submitLoading
export const selectKonfiguratorError     = (s: S) => s.konfigurator.error

export default konfiguratorSlice.reducer
