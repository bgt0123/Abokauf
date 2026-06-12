import { useState } from 'react'
import type { KonfiguratorState } from '../../../types'

const ABO_LABELS: Record<string, string> = {
    'Printed': 'Gedruckte Zeitung',
    'E-paper': 'E-Paper',
    'Website': 'Website-Zugang',
}
const DELIVERY_LABELS: Record<string, string> = {
    'Delivery man': 'Austräger',
    'Post':         'Post',
}
const INTERVAL_LABELS: Record<string, string> = {
    'Daily':   'Täglich (Mo–Sa)',
    'Weekend': 'Wochenende (Fr–Sa)',
}
const ZAHLUNG_LABELS: Record<string, string> = {
    'Monthly': 'Monatlich',
    'Annual':  'Jährlich (10% Rabatt)',
}
const ZAHLUNGSART_LABELS: Record<string, string> = {
    'Direct debit': 'Lastschrift',
    'Invoice':      'Rechnung',
}

interface Props {
    state:          KonfiguratorState
    localPaperName: string
    onSubmit:       (dataprivacy: boolean) => void
    loading:        boolean
    error:          string | null
}

export function OrderSummary({
    state,
    localPaperName,
    onSubmit,
    loading,
    error,
}: Props) {
    const fmt = (n: number) => n.toFixed(2).replace('.', ',')
    const price    = state.berechneterPreis ?? 0
    const isAnnual = state.zahlungsintervall === 'Annual'
    const priceLabel = isAnnual ? `${fmt(price)} € / Jahr` : `${fmt(price)} € / Monat`

    const [dataprivacy, setDataprivacy] = useState(false)
    const [touched, setTouched]         = useState(false)

    function handleSubmit() {
        setTouched(true)
        if (!dataprivacy) return
        onSubmit(dataprivacy)
    }

    return (
        <div className="order-summary">
            <div className="order-summary__table">
                <SummaryRow label="Abo-Typ"      value={ABO_LABELS[state.aboTyp ?? ''] ?? '–'} />
                <SummaryRow label="Lokalausgabe" value={localPaperName || '–'} />
                <SummaryRow label="Region"       value={[state.lieferPlz, state.lieferCity].filter(Boolean).join(' ') || '–'} />
                {state.aboTyp === 'Printed' && (
                    <>
                        <SummaryRow label="Zustellung"  value={DELIVERY_LABELS[state.zustellungsart ?? ''] ?? '–'} />
                        <SummaryRow label="Belieferung" value={INTERVAL_LABELS[state.belieferungsintervall ?? ''] ?? '–'} />
                    </>
                )}
                <SummaryRow label="Zahlung"     value={ZAHLUNG_LABELS[state.zahlungsintervall ?? ''] ?? '–'} />
                <SummaryRow label="Zahlungsart" value={ZAHLUNGSART_LABELS[state.zahlungsart ?? ''] ?? '–'} />
                <SummaryRow label="Preis"       value={priceLabel} highlight />
            </div>

            <label className={`dataprivacy-check${touched && !dataprivacy ? ' dataprivacy-check--error' : ''}`}>
                <input
                    type="checkbox"
                    checked={dataprivacy}
                    onChange={e => { setDataprivacy(e.target.checked); setTouched(false) }}
                />
                <span>
                    Ich stimme der{' '}
                    <span className="dataprivacy-check__link">Datenschutzerklärung</span>
                    {' '}zu und bin damit einverstanden, dass meine Daten zur Vertragsabwicklung verarbeitet werden. *
                </span>
            </label>
            {touched && !dataprivacy && (
                <p className="form-error">Bitte stimme der Datenschutzerklärung zu.</p>
            )}

            {error && <p className="form-error">{error}</p>}

            <button
                type="button"
                className="btn btn--primary konfig-submit"
                onClick={handleSubmit}
                disabled={loading || !state.startDatum}
            >
                {loading ? 'Wird gespeichert…' : 'Jetzt verbindlich bestellen'}
            </button>
        </div>
    )
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`order-summary__row${highlight ? ' order-summary__row--highlight' : ''}`}>
            <span className="order-summary__label">{label}</span>
            <span className="order-summary__value">{value}</span>
        </div>
    )
}
