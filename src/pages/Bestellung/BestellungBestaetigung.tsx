import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { CheckCircle2, Copy } from 'lucide-react'
import { useState } from 'react'
import type { BestellungState } from '../../types'
import { ABO_LABELS, PAYMENT_LABELS, ZAHLUNGSART_LABELS } from '../../constants/labels'
import './BestellungBestaetigung.css'

export default function BestellungBestaetigung() {
    const location = useLocation()
    const navigate = useNavigate()
    const state    = location.state as BestellungState | null

    const [copied, setCopied] = useState(false)

    if (!state?.reference) return <Navigate to="/" replace />

    const fmt = (n: number) => n.toFixed(2).replace('.', ',')
    const isAnnual = state.zahlungsintervall === 'Annual'
    const priceLabel = isAnnual
        ? `${fmt(state.preis)} € / Jahr`
        : `${fmt(state.preis)} € / Monat`

    function handleCopy() {
        navigator.clipboard.writeText(state!.reference)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="bestaetigung-page">

            <div className="bestaetigung-icon">
                <CheckCircle2 size={42} strokeWidth={1.5} />
            </div>

            <div className="bestaetigung-heading">
                <h1 className="bestaetigung-title">Bestellung erfolgreich!</h1>
                <p className="bestaetigung-subtitle">
                    Vielen Dank für dein Abonnement. Du erhältst in Kürze eine Bestätigung.
                </p>
            </div>

            <div className="bestaetigung-reference-wrap">
                <span className="bestaetigung-reference-label">Bestellnummer</span>
                <div className="bestaetigung-reference">
                    <span>{state.reference}</span>
                    <button type="button" className="bestaetigung-copy" onClick={handleCopy} title="Kopieren">
                        {copied ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
                    </button>
                </div>
            </div>

            <div className="bestaetigung-summary">
                <Row label="Abo-Typ"        value={ABO_LABELS[state.aboTyp] ?? state.aboTyp} />
                <Row label="Lokalausgabe"   value={state.lokalausgabe || '–'} />
                <Row label="Lieferadresse"  value={state.lieferAdresse || '–'} />
                {state.rechnungsAdresse && (
                    <Row label="Rechnungsadresse" value={state.rechnungsAdresse} />
                )}
                <Row label="Startdatum"     value={new Date(state.startDatum).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })} />
                <Row label="Zahlung"        value={PAYMENT_LABELS[state.zahlungsintervall] ?? state.zahlungsintervall} />
                <Row label="Zahlungsart"    value={ZAHLUNGSART_LABELS[state.zahlungsart] ?? state.zahlungsart} />
                <Row label="Preis"          value={priceLabel} highlight />
            </div>

            <div className="bestaetigung-actions">
                <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => navigate('/')}
                >
                    Zur Startseite
                </button>
                <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => navigate('/konfigurator')}
                >
                    Weiteres Abo
                </button>
            </div>

        </div>
    )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`bestaetigung-row${highlight ? ' bestaetigung-row--highlight' : ''}`}>
            <span className="bestaetigung-row__label">{label}</span>
            <span className="bestaetigung-row__value">{value}</span>
        </div>
    )
}
