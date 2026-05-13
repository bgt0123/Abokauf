// ── Re-exports aus der API-Schicht ────────────────────────────────────────
import type {
    Address,
    Customer,
    NewCustomer,
    Abo,
    NewAbo,
    LocalPaperVersion,
    LocalVersionsResult,
    DistanceResult,
} from '../api/api'

export type {
    Address,
    Customer,
    NewCustomer,
    Abo,
    NewAbo,
    LocalPaperVersion,
    LocalVersionsResult,
    DistanceResult,
}

// ── Strikte Union-Types ────────────────────────────────────────────────────
// Die DB-Typen erlauben | string; hier erzwingen wir die gültigen Werte.

/** Gedruckte Zeitung, E-Paper oder Web-Zugang */
export type AboTyp = 'Printed' | 'E-paper' | 'Website'

/** Zustellung per lokalem Austräger oder per Post */
export type Zustellungsart = 'Delivery man' | 'Post'

/** Tägliche Belieferung oder nur am Wochenende (Fr+Sa) */
export type Belieferungsintervall = 'Daily' | 'Weekend'

/** Monatliche oder jährliche Zahlung – jährlich gibt es einen Rabatt */
export type Zahlungsintervall = 'Monthly' | 'Annual'

/** Zahlung per Lastschrift oder per Rechnung */
export type Zahlungsart = 'Direct debit' | 'Credit Card'

// ── Konfigurator-State ─────────────────────────────────────────────────────
/** Zwischenspeicher für den aktuell konfigurierten Abo-Entwurf */
export interface KonfiguratorState {
    aboTyp:               AboTyp | null
    lieferPlz:            string
    lieferCity:           string
    lokalausgabeId:       number | null
    zustellungsart:       Zustellungsart | null
    belieferungsintervall: Belieferungsintervall | null
    zahlungsintervall:    Zahlungsintervall | null
    zahlungsart:          Zahlungsart | null
    startDatum:           string
    austraegerHinweis:    string
    berechneterPreis:     number | null
}

// ── App-State ──────────────────────────────────────────────────────────────
/** Eingeloggter User zur Laufzeit */
export interface AuthState {
    currentUser: import('./index').Customer | null
    isLoggedIn:  boolean
}
