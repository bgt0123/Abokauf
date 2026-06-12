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

/** Gedruckte Zeitung, E-Paper oder Web-Zugang */
export type AboTyp = 'Printed' | 'E-paper' | 'Website'

/** Zustellung per lokalem Austräger oder per Post */
export type Zustellungsart = 'Delivery man' | 'Post'

/** Tägliche Belieferung oder nur am Wochenende (Fr+Sa) */
export type Belieferungsintervall = 'Daily' | 'Weekend'

/** Monatliche oder jährliche Zahlung – jährlich gibt es einen Rabatt */
export type Zahlungsintervall = 'Monthly' | 'Annual'

/** Zahlung per Lastschrift oder per Rechnung */
export type Zahlungsart = 'Direct debit' | 'Invoice'

// ── Konfigurator-State ─────────────────────────────────────────────────────
/** Zwischenspeicher für den aktuell konfigurierten Abo-Entwurf */
export interface KonfiguratorState {
    aboTyp:               AboTyp | null
    lieferStreet:         string
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
    rechnungsAbweichend:  boolean
    rechnungsStreet:      string
    rechnungsPlz:         string
    rechnungsCity:        string
}