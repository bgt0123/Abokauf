import { useState } from 'react'
import './OrderSummary.css'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
    submitAboThunk, reset,
    selectKonfigurator, selectLocalVersions, selectDistanceKm,
    selectSubmitLoading, selectKonfiguratorError,
} from '../../../features/konfigurator/konfiguratorSlice'
import { selectCurrentUser } from '../../../features/auth/authSlice'
import { calcMonthlyPrice, calcYearlyPrice } from '../../../utils/priceUtils'
import { ABO_LABELS, PAYMENT_LABELS, ZAHLUNGSART_LABELS, DELIVERY_LABELS, INTERVAL_LABELS } from '../../../constants/labels'

export function OrderSummary() {
    const dispatch      = useAppDispatch()
    const navigate      = useNavigate()
    const currentUser   = useAppSelector(selectCurrentUser)
    const konfig        = useAppSelector(selectKonfigurator)
    const localVersions = useAppSelector(selectLocalVersions)
    const distanceKm    = useAppSelector(selectDistanceKm)
    const loading       = useAppSelector(selectSubmitLoading)
    const error         = useAppSelector(selectKonfiguratorError)

    const [dataprivacy, setDataprivacy] = useState(false)
    const [touched, setTouched]         = useState(false)

    const monthly        = calcMonthlyPrice(konfig, distanceKm)
    const localPaperName = konfig.lokalausgabeId
        ? (localVersions as Record<number, { name: string }>)[konfig.lokalausgabeId]?.name ?? ''
        : ''

    const fmt        = (n: number) => n.toFixed(2).replace('.', ',')
    const price      = konfig.berechneterPreis ?? 0
    const isAnnual   = konfig.zahlungsintervall === 'Annual'
    const priceLabel = isAnnual ? `${fmt(price)} € / Jahr` : `${fmt(price)} € / Monat`

    function handleSubmitClick() {
        setTouched(true)
        if (!dataprivacy) return
        handleSubmit()
    }

    async function handleSubmit() {
        if (!currentUser) return
        const result = await dispatch(submitAboThunk({
            cid:                 currentUser.id,
            created:             new Date().toISOString(),
            startabodate:        konfig.startDatum,
            endabodate:          '',
            dataprivacyaccepted: dataprivacy,
            abotype:             konfig.aboTyp ?? 'E-paper',
            deliverymethod:      konfig.zustellungsart ?? 'Post',
            paymenttype:         konfig.zahlungsart ?? 'Invoice',
            payment:             konfig.zahlungsintervall ?? 'Monthly',
            subscriptiontype:    konfig.belieferungsintervall ?? 'Daily',
            calculatedprice:     monthly,
            calculatedyearprice: calcYearlyPrice(monthly),
            localpaperversions:  konfig.lokalausgabeId ?? 0,
        }))
        if (submitAboThunk.fulfilled.match(result)) {
            const reference = `ABO-${Date.now().toString(36).toUpperCase()}`
            const lieferAdresse = konfig.aboTyp === 'Printed'
                ? [konfig.lieferStreet, `${konfig.lieferPlz} ${konfig.lieferCity}`].filter(Boolean).join(', ')
                : `${konfig.lieferPlz} ${konfig.lieferCity}`.trim()
            const rechnungsAdresse = konfig.rechnungsAbweichend
                ? [konfig.rechnungsStreet, `${konfig.rechnungsPlz} ${konfig.rechnungsCity}`].filter(Boolean).join(', ')
                : undefined
            navigate('/bestellung/bestaetigung', {
                state: {
                    reference,
                    aboTyp:            konfig.aboTyp,
                    lokalausgabe:      localPaperName,
                    lieferAdresse,
                    rechnungsAdresse,
                    startDatum:        konfig.startDatum,
                    zahlungsintervall: konfig.zahlungsintervall,
                    zahlungsart:       konfig.zahlungsart,
                    preis:             konfig.berechneterPreis ?? 0,
                },
            })
            dispatch(reset())
        }
    }

    return (
        <div className="order-summary">
            <div className="order-summary__table">
                <SummaryRow label="Abo-Typ"      value={ABO_LABELS[konfig.aboTyp ?? ''] ?? '–'} />
                <SummaryRow label="Lokalausgabe" value={localPaperName || '–'} />
                <SummaryRow label="Region"       value={[konfig.lieferPlz, konfig.lieferCity].filter(Boolean).join(' ') || '–'} />
                {konfig.aboTyp === 'Printed' && (
                    <>
                        <SummaryRow label="Zustellung"  value={DELIVERY_LABELS[konfig.zustellungsart ?? ''] ?? '–'} />
                        <SummaryRow label="Belieferung" value={INTERVAL_LABELS[konfig.belieferungsintervall ?? ''] ?? '–'} />
                    </>
                )}
                <SummaryRow label="Zahlung"     value={PAYMENT_LABELS[konfig.zahlungsintervall ?? ''] ?? '–'} />
                <SummaryRow label="Zahlungsart" value={ZAHLUNGSART_LABELS[konfig.zahlungsart ?? ''] ?? '–'} />
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
                onClick={handleSubmitClick}
                disabled={loading || !konfig.startDatum}
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
