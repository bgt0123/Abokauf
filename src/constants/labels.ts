// Lookup tables für labels
export const ABO_LABELS: Record<string, string> = {
    Printed:   'Gedruckte Zeitung',
    'E-paper': 'E-Paper',
    Website:   'Website-Zugang',
}

export const PAYMENT_LABELS: Record<string, string> = {
    Monthly: 'Monatlich',
    Annual:  'Jährlich (10% Rabatt)',
}

export const ZAHLUNGSART_LABELS: Record<string, string> = {
    'Direct debit': 'Lastschrift',
    Invoice:        'Rechnung',
}

export const DELIVERY_LABELS: Record<string, string> = {
    'Delivery man': 'Austräger',
    Post:           'Post',
}

export const INTERVAL_LABELS: Record<string, string> = {
    Daily:   'Täglich (Mo–Sa)',
    Weekend: 'Wochenende (Fr–Sa)',
}