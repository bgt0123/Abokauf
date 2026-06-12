import { Info } from 'lucide-react'
import { OptionCard } from './OptionCard'
import type { KonfiguratorState, Zahlungsintervall, Zahlungsart } from '../../../types'
import { calcDistanceSurcharge, calcYearlyPrice, formatPrice } from '../../../utils/priceUtils'

interface Props {
    zahlungsintervall:         Zahlungsintervall | null
    zahlungsart:               Zahlungsart | null
    monthlyPrice:              number
    distanceKm:                number | null
    state:                     KonfiguratorState
    onZahlungsintervallChange: (v: Zahlungsintervall) => void
    onZahlungsartChange:       (v: Zahlungsart) => void
}

export function PaymentForm({
    zahlungsintervall,
    zahlungsart,
    monthlyPrice,
    distanceKm,
    state,
    onZahlungsintervallChange,
    onZahlungsartChange,
}: Props) {
    const annualPrice = calcYearlyPrice(monthlyPrice)

    return (
        <div className="payment-form">
            <div className="konfig-section">
                <h3 className="konfig-section__title">Zahlungsintervall</h3>
                <div className="option-cards">
                    <OptionCard
                        label="Monatlich"
                        description={`${formatPrice(monthlyPrice)} € / Monat`}
                        selected={zahlungsintervall === 'Monthly'}
                        onClick={() => onZahlungsintervallChange('Monthly')}
                    />
                    <OptionCard
                        label="Jährlich"
                        description={`${formatPrice(annualPrice)} € / Jahr · 10% Rabatt`}
                        selected={zahlungsintervall === 'Annual'}
                        onClick={() => onZahlungsintervallChange('Annual')}
                    />
                </div>

                <PriceInfo
                    state={state}
                    distanceKm={distanceKm}
                    zahlungsintervall={zahlungsintervall}
                    monthlyPrice={monthlyPrice}
                />
            </div>

            <div className="konfig-section">
                <h3 className="konfig-section__title">Zahlungsart</h3>
                <div className="option-cards">
                    <OptionCard
                        label="Lastschrift"
                        description="Automatischer Einzug, keine Gebühren"
                        selected={zahlungsart === 'Direct debit'}
                        onClick={() => onZahlungsartChange('Direct debit')}
                    />
                    <OptionCard
                        label="Rechnung"
                        description="Zahlung per Rechnung"
                        selected={zahlungsart === 'Invoice'}
                        onClick={() => onZahlungsartChange('Invoice')}
                    />
                </div>
            </div>
        </div>
    )
}

// ── Price info with hover breakdown ──────────────────

function PriceInfo({
    state, distanceKm, zahlungsintervall, monthlyPrice,
}: {
    state:             KonfiguratorState
    distanceKm:        number | null
    zahlungsintervall: Zahlungsintervall | null
    monthlyPrice:      number
}) {
    const isPrinted  = state.aboTyp === 'Printed'
    const isAnnual   = zahlungsintervall === 'Annual'
    const base       = isPrinted
        ? (state.belieferungsintervall === 'Weekend' ? 19.90 : 34.90)
        : state.aboTyp === 'E-paper' ? 12.90 : 7.90
    const post       = isPrinted && state.zustellungsart === 'Post' ? 3.00 : 0
    const distance   = isPrinted ? calcDistanceSurcharge(distanceKm, state.zustellungsart) : 0
    const annualPrice = calcYearlyPrice(monthlyPrice)
    const discount   = Math.round((monthlyPrice * 12 - annualPrice) * 100) / 100

    return (
        <div className="price-info-row">
            <span className="price-info-row__label">
                Wie setzt sich der Preis zusammen?
            </span>
            <span className="price-info">
                <Info size={15} strokeWidth={2} className="price-info__icon" />
                <span className="price-info__popup">
                    <div className="price-breakdown">
                        <div className="price-breakdown__title">Preisaufschlüsselung</div>
                        <div className="price-breakdown__row">
                            <span>Basispreis</span>
                            <span>{formatPrice(base)} €/Monat</span>
                        </div>
                        {post > 0 && (
                            <div className="price-breakdown__row">
                                <span>Postzuschlag</span>
                                <span>+{formatPrice(post)} €/Monat</span>
                            </div>
                        )}
                        {distance > 0 && (
                            <div className="price-breakdown__row">
                                <span>Entfernungszuschlag</span>
                                <span>+{formatPrice(distance)} €/Monat</span>
                            </div>
                        )}
                        <div className="price-breakdown__divider" />
                        <div className="price-breakdown__row">
                            <span>Monatspreis</span>
                            <span>{formatPrice(monthlyPrice)} €</span>
                        </div>
                        {isAnnual && (
                            <>
                                <div className="price-breakdown__row">
                                    <span>× 12 Monate</span>
                                    <span>{formatPrice(monthlyPrice * 12)} €</span>
                                </div>
                                <div className="price-breakdown__row price-breakdown__row--discount">
                                    <span>Jahresrabatt (10%)</span>
                                    <span>−{formatPrice(discount)} €</span>
                                </div>
                                <div className="price-breakdown__divider" />
                                <div className="price-breakdown__row price-breakdown__row--total">
                                    <span>Jahrespreis</span>
                                    <span>{formatPrice(annualPrice)} €</span>
                                </div>
                            </>
                        )}
                    </div>
                </span>
            </span>
        </div>
    )
}
