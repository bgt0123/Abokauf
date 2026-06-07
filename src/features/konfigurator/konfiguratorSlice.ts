import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { KonfiguratorState } from '../../types'

const initialState: KonfiguratorState = {
    aboTyp:                null,
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
}

const konfiguratorSlice = createSlice({
    name: 'konfigurator',
    initialState,
    reducers: {
        setField<K extends keyof KonfiguratorState>(
            state: KonfiguratorState,
            action: PayloadAction<{ field: K; value: KonfiguratorState[K] }>
        ) {
            state[action.payload.field] = action.payload.value
        },
        reset() {
            return initialState
        },
    },
})

export const { setField, reset } = konfiguratorSlice.actions

// ── Selectors ─────────────────────────────────────────
export const selectKonfigurator        = (state: { konfigurator: KonfiguratorState }) => state.konfigurator
export const selectAboTyp              = (state: { konfigurator: KonfiguratorState }) => state.konfigurator.aboTyp
export const selectLieferPlz           = (state: { konfigurator: KonfiguratorState }) => state.konfigurator.lieferPlz
export const selectZustellungsart      = (state: { konfigurator: KonfiguratorState }) => state.konfigurator.zustellungsart
export const selectBelieferungsintervall = (state: { konfigurator: KonfiguratorState }) => state.konfigurator.belieferungsintervall
export const selectZahlungsintervall   = (state: { konfigurator: KonfiguratorState }) => state.konfigurator.zahlungsintervall
export const selectZahlungsart         = (state: { konfigurator: KonfiguratorState }) => state.konfigurator.zahlungsart
export const selectBerechneterPreis    = (state: { konfigurator: KonfiguratorState }) => state.konfigurator.berechneterPreis

export default konfiguratorSlice.reducer
