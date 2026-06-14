import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
    setField,
    selectKonfigurator, selectDistanceKm,
} from '../../features/konfigurator/konfiguratorSlice'
import { selectIsLoggedIn } from '../../features/auth/authSlice'
import type { KonfiguratorState } from '../../types'
import { calcMonthlyPrice, calcFinalPrice } from '../../utils/priceUtils'
import { StepIndicator }  from './components/StepIndicator'
import { RegionStep }     from './components/region/RegionStep'
import { ZustellungStep } from './components/ZustellungStep'
import { ZahlungStep }    from './components/payment/ZahlungStep'
import { OrderSummary }   from './components/OrderSummary'
import './KonfiguratorPage.css'

type StepId = 'region' | 'zustellung' | 'zahlung' | 'zusammenfassung'

const STEP_LABELS: Record<StepId, string> = {
    region:          'Region',
    zustellung:      'Lieferung',
    zahlung:         'Zahlung',
    zusammenfassung: 'Zusammenfassung',
}

function getFlow(aboTyp: KonfiguratorState['aboTyp']): StepId[] {
    if (aboTyp === 'Printed') return ['region', 'zustellung', 'zahlung', 'zusammenfassung']
    return ['region', 'zahlung', 'zusammenfassung']
}

// ── Page ─────────────────────────────────────────────
export default function KonfiguratorPage() {
    const dispatch   = useAppDispatch()
    const navigate   = useNavigate()
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const konfig     = useAppSelector(selectKonfigurator)
    const distanceKm = useAppSelector(selectDistanceKm)

    const [stepIndex, setStepIndex] = useState(0)

    const flow = getFlow(konfig.aboTyp)
    const step = flow[stepIndex]

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
    }, [isLoggedIn, navigate])

    if (!isLoggedIn) return null
    if (konfig.aboTyp === null) return <Navigate to="/" replace />

    const monthly = calcMonthlyPrice(konfig, distanceKm)
    const isLast  = stepIndex === flow.length - 1

    function set<K extends keyof KonfiguratorState>(field: K, value: KonfiguratorState[K]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setField({ field, value } as any))
    }

    function canProceed(): boolean {
        switch (step) {
            case 'region':          return konfig.lokalausgabeId !== null
            case 'zustellung':      return konfig.zustellungsart !== null && konfig.belieferungsintervall !== null
            case 'zahlung':         return konfig.zahlungsintervall !== null && konfig.zahlungsart !== null && !!konfig.startDatum
            case 'zusammenfassung': return true
        }
    }

    function handleNext() {
        if (flow[stepIndex + 1] === 'zusammenfassung') {
            set('berechneterPreis', calcFinalPrice(monthly, konfig.zahlungsintervall))
        }
        setStepIndex(i => i + 1)
    }

    return (
        <div className="page konfig-page">
            <div className="konfig-container">
                <div className="konfig-header">
                    <h1 className="page__title">Abo konfigurieren</h1>
                    <p className="page__subtitle">Stell dein Abonnement nach deinen Wünschen zusammen.</p>
                </div>

                <StepIndicator labels={flow.map(s => STEP_LABELS[s])} currentIndex={stepIndex} />

                <div className="konfig-content">
                    {step === 'region'     && <RegionStep />}
                    {step === 'zustellung' && <ZustellungStep />}
                    {step === 'zahlung'    && <ZahlungStep />}
                    {step === 'zusammenfassung' && (
                        <div className="konfig-step">
                            <h2 className="konfig-step__title">Bestellübersicht</h2>
                            <OrderSummary />
                        </div>
                    )}
                </div>

                <div className="konfig-nav">
                    <button type="button" className="btn btn--secondary"
                        onClick={() => setStepIndex(i => i - 1)} disabled={stepIndex === 0}>
                        Zurück
                    </button>
                    {!isLast && (
                        <button type="button" className="btn btn--primary"
                            onClick={handleNext} disabled={!canProceed()}>
                            {stepIndex === flow.length - 2 ? 'Zur Übersicht' : 'Weiter'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
