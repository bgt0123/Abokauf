import { Info } from 'lucide-react'
import './PaymentForm.css'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
    setField,
    selectKonfigurator, selectDistanceKm,
} from '../../../../features/konfigurator/konfiguratorSlice'
import type { KonfiguratorState } from '../../../../types'
import { calcDistanceSurcharge, calcMonthlyPrice, calcYearlyPrice, formatPrice } from '../../../../utils/priceUtils'
import { OptionCard } from '../OptionCard'

export function PaymentForm() {
    const dispatch   = useAppDispatch()
    const konfig     = useAppSelector(selectKonfigurator)
    const distanceKm = useAppSelector(selectDistanceKm)
    const monthly    = calcMonthlyPrice(konfig, distanceKm)
    const annual     = calcYearlyPrice(monthly)

    function set<K extends keyof KonfiguratorState>(field: K, value: KonfiguratorState[K]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setField({ field, value } as any))
    }

    return (
        <div className="payment-form">
            <div className="konfig-section">
                <h3 className="konfig-section__title">Zahlungsintervall</h3>
                <div className="option-cards">
                    <OptionCard
                        label="Monatlich"
                        description={`${formatPrice(monthly)} € / Monat`}
                        selected={konfig.zahlungsintervall === 'Monthly'}
                        onClick={() => set('zahlungsintervall', 'Monthly')}
                    />
                    <OptionCard
                        label="Jährlich"
                        description={`${formatPrice(annual)} € / Jahr · 10% Rabatt`}
                        selected={konfig.zahlungsintervall === 'Annual'}
                        onClick={() => set('zahlungsintervall', 'Annual')}
                    />
                </div>
                <PriceInfo konfig={konfig} distanceKm={distanceKm} monthly={monthly} />
            </div>

            <div className="konfig-section">
                <h3 className="konfig-section__title">Zahlungsart</h3>
                <div className="option-cards">
                    <OptionCard
                        label="Lastschrift"
                        description="Automatischer Einzug, keine Gebühren"
                        selected={konfig.zahlungsart === 'Direct debit'}
                        onClick={() => set('zahlungsart', 'Direct debit')}
                    />
                    <OptionCard
                        label="Rechnung"
                        description="Zahlung per Rechnung"
                        selected={konfig.zahlungsart === 'Invoice'}
                        onClick={() => set('zahlungsart', 'Invoice')}
                    />
                </div>
            </div>
        </div>
    )
}

// ── Price info with hover breakdown ──────────────────

function PriceInfo({
    konfig, distanceKm, monthly,
}: {
    konfig:     KonfiguratorState
    distanceKm: number | null
    monthly:    number
}) {
    const isPrinted = konfig.aboTyp === 'Printed'
    const isAnnual  = konfig.zahlungsintervall === 'Annual'
    const base      = isPrinted
        ? (konfig.belieferungsintervall === 'Weekend' ? 19.90 : 34.90)
        : konfig.aboTyp === 'E-paper' ? 12.90 : 7.90
    const post     = isPrinted && konfig.zustellungsart === 'Post' ? 3.00 : 0
    const distance = isPrinted ? calcDistanceSurcharge(distanceKm, konfig.zustellungsart) : 0
    const annual   = calcYearlyPrice(monthly)
    const discount = Math.round((monthly * 12 - annual) * 100) / 100

    return (
        <div className="price-info-row">
            <span className="price-info-row__label">Wie setzt sich der Preis zusammen?</span>
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
                            <span>{formatPrice(monthly)} €</span>
                        </div>
                        {isAnnual && (
                            <>
                                <div className="price-breakdown__row">
                                    <span>× 12 Monate</span>
                                    <span>{formatPrice(monthly * 12)} €</span>
                                </div>
                                <div className="price-breakdown__row price-breakdown__row--discount">
                                    <span>Jahresrabatt (10%)</span>
                                    <span>−{formatPrice(discount)} €</span>
                                </div>
                                <div className="price-breakdown__divider" />
                                <div className="price-breakdown__row price-breakdown__row--total">
                                    <span>Jahrespreis</span>
                                    <span>{formatPrice(annual)} €</span>
                                </div>
                            </>
                        )}
                    </div>
                </span>
            </span>
        </div>
    )
}
