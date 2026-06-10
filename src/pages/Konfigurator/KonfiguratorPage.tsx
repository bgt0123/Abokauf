import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, Globe, Tablet } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
    setField, reset, submitAboThunk,
    fetchLocalVersionsThunk, fetchDistanceThunk,
    selectKonfigurator, selectLocalVersions, selectDistanceKm,
    selectPlzLoading, selectSubmitLoading, selectKonfiguratorError,
} from '../../features/konfigurator/konfiguratorSlice'
import { selectCurrentUser, selectIsLoggedIn } from '../../features/auth/authSlice'
import type { AboTyp, KonfiguratorState } from '../../types'
import { calcMonthlyPrice, calcFinalPrice, calcYearlyPrice, calcDistanceSurcharge, formatPrice } from '../../utils/priceUtils'
import { StepIndicator }       from './components/StepIndicator'
import { OptionCard }          from './components/OptionCard'
import { DeliveryAddressForm } from './components/DeliveryAddressForm'
import type { PlzStatus } from './components/DeliveryAddressForm'
import { LocalPaperSelect }    from './components/LocalPaperSelect'
import { PaymentForm }         from './components/PaymentForm'
import { OrderSummary }        from './components/OrderSummary'
import './KonfiguratorPage.css'

type StepId = 'aboTyp' | 'region' | 'zustellung' | 'zahlung' | 'zusammenfassung'

const STEP_LABELS: Record<StepId, string> = {
    aboTyp:          'Abo-Typ',
    region:          'Region',
    zustellung:      'Lieferung',
    zahlung:         'Zahlung',
    zusammenfassung: 'Zusammenfassung',
}

function getFlow(aboTyp: AboTyp | null): StepId[] {
    if (aboTyp === 'Printed') {
        return ['aboTyp', 'region', 'zustellung', 'zahlung', 'zusammenfassung']
    }
    return ['aboTyp', 'region', 'zahlung', 'zusammenfassung']
}

// ── Page ─────────────────────────────────────────────
export default function KonfiguratorPage() {
    const dispatch     = useAppDispatch()
    const navigate     = useNavigate()
    const isLoggedIn   = useAppSelector(selectIsLoggedIn)
    const currentUser  = useAppSelector(selectCurrentUser)
    const konfig       = useAppSelector(selectKonfigurator)
    const localVersions = useAppSelector(selectLocalVersions)
    const distanceKm    = useAppSelector(selectDistanceKm)
    const plzLoading    = useAppSelector(selectPlzLoading)
    const submitLoading = useAppSelector(selectSubmitLoading)
    const error         = useAppSelector(selectKonfiguratorError)

    const [stepIndex, setStepIndex]         = useState(0)
    const [plzSearchDone, setPlzSearchDone] = useState(false)
    const [useAltPlz, setUseAltPlz]         = useState(false)

    const flow = getFlow(konfig.aboTyp)
    const step = flow[stepIndex]

    useEffect(() => {
        if (!isLoggedIn) navigate('/login')
    }, [isLoggedIn, navigate])

    useEffect(() => {
        if (step !== 'region' || useAltPlz || !currentUser) return
        const { street1, plz, city } = currentUser.deliveryAddress
        dispatch(setField({ field: 'lieferStreet', value: street1 } as any))
        dispatch(setField({ field: 'lieferPlz',    value: plz    } as any))
        dispatch(setField({ field: 'lieferCity',   value: city   } as any))
        if (plz.length === 5) {
            dispatch(fetchLocalVersionsThunk(plz))
            dispatch(fetchDistanceThunk(plz))
            setPlzSearchDone(true)
        }
    }, [step, useAltPlz]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!isLoggedIn) return null
    const labels  = flow.map(s => STEP_LABELS[s])
    const monthly = calcMonthlyPrice(konfig, distanceKm)
    const isLast  = stepIndex === flow.length - 1

    function set<K extends keyof KonfiguratorState>(field: K, value: KonfiguratorState[K]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setField({ field, value } as any))
    }

    function canProceed(): boolean {
        switch (step) {
            case 'aboTyp':          return konfig.aboTyp !== null && !!konfig.startDatum
            case 'region':          return konfig.lokalausgabeId !== null
            case 'zustellung':      return konfig.zustellungsart !== null && konfig.belieferungsintervall !== null
            case 'zahlung':         return konfig.zahlungsintervall !== null && konfig.zahlungsart !== null
            case 'zusammenfassung': return true
        }
    }

    function handleNext() {
        const nextStep = flow[stepIndex + 1]
        if (nextStep === 'zusammenfassung') {
            set('berechneterPreis', calcFinalPrice(monthly, konfig.zahlungsintervall))
        }
        setStepIndex(i => i + 1)
    }

    function handleBack() {
        setStepIndex(i => i - 1)
    }

    function handlePlzSearch(plz: string) {
        dispatch(fetchLocalVersionsThunk(plz))
        dispatch(fetchDistanceThunk(plz))
        set('lokalausgabeId', null)
        setPlzSearchDone(true)
    }

    const versionCount  = Object.values(localVersions).length
    const plzStatus: PlzStatus = !plzSearchDone ? 'idle'
        : plzLoading              ? 'idle'
        : versionCount > 0        ? 'found'
        : 'not-found'

    const localPaperName = (() => {
        if (!konfig.lokalausgabeId) return ''
        const versions = localVersions as Record<number, { name: string }>
        return versions[konfig.lokalausgabeId]?.name ?? ''
    })()

    async function handleSubmit(dataprivacy: boolean) {
        if (!currentUser) return
        const result = await dispatch(submitAboThunk({
            cid:                 currentUser.id,
            created:             new Date().toISOString(),
            startabodate:        konfig.startDatum,
            endabodate:          '',
            dataprivacyaccepted: dataprivacy,
            abotype:             konfig.aboTyp ?? 'E-paper',
            deliverymethod:      konfig.zustellungsart ?? 'Post',
            paymenttype:         konfig.zahlungsart ?? 'Direct debit',
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
        <div className="page konfig-page">
            <div className="konfig-container">
                <div className="konfig-header">
                    <h1 className="page__title">Abo konfigurieren</h1>
                    <p className="page__subtitle">Stell dein Abonnement nach deinen Wünschen zusammen.</p>
                </div>

                <StepIndicator labels={labels} currentIndex={stepIndex} />

                <div className="konfig-content">

                    {/* Step 1 — Abo-Typ */}
                    {step === 'aboTyp' && (
                        <div className="konfig-step">
                            <h2 className="konfig-step__title">Welche Art von Abo möchtest du?</h2>
                            <div className="option-cards option-cards--3">
                                <OptionCard
                                    label="Gedruckte Zeitung"
                                    description="Täglich direkt zu dir nach Hause"
                                    icon={<Newspaper size={28} strokeWidth={1.5} />}
                                    selected={konfig.aboTyp === 'Printed'}
                                    onClick={() => set('aboTyp', 'Printed')}
                                />
                                <OptionCard
                                    label="E-Paper"
                                    description="Die digitale Zeitung auf allen Geräten"
                                    icon={<Tablet size={28} strokeWidth={1.5} />}
                                    selected={konfig.aboTyp === 'E-paper'}
                                    onClick={() => set('aboTyp', 'E-paper')}
                                />
                                <OptionCard
                                    label="Website-Zugang"
                                    description="Unbegrenzter Zugang zu allen Online-Artikeln"
                                    icon={<Globe size={28} strokeWidth={1.5} />}
                                    selected={konfig.aboTyp === 'Website'}
                                    onClick={() => set('aboTyp', 'Website')}
                                />
                            </div>
                            <div className="konfig-section">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="startDatum">Startdatum vom Abo*</label>
                                    <input
                                        id="startDatum"
                                        type="date"
                                        className="input"
                                        value={konfig.startDatum}
                                        min={new Date().toISOString().slice(0, 10)}
                                        onChange={e => set('startDatum', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Region */}
                    {step === 'region' && (
                        <div className="konfig-step">
                            <h2 className="konfig-step__title">In welcher Region wohnst du?</h2>

                            {/* Registered address display */}
                            <div className="user-address-box">
                                <span className="user-address-box__label">Deine Lieferadresse</span>
                                <span className="user-address-box__value">
                                    {konfig.aboTyp === 'Printed'
                                        ? `${currentUser?.deliveryAddress.street1}, ${currentUser?.deliveryAddress.plz} ${currentUser?.deliveryAddress.city}`
                                        : `${currentUser?.deliveryAddress.plz} ${currentUser?.deliveryAddress.city}`
                                    }
                                </span>
                            </div>

                            {/* Alternative address toggle */}
                            <label className="dataprivacy-check" style={{ marginTop: 8 }}>
                                <input
                                    type="checkbox"
                                    checked={useAltPlz}
                                    onChange={e => {
                                        setUseAltPlz(e.target.checked)
                                        setPlzSearchDone(false)
                                        set('lokalausgabeId', null)
                                    }}
                                />
                                <span>Andere Lieferadresse verwenden</span>
                            </label>

                            {useAltPlz && (
                                <DeliveryAddressForm
                                    street={konfig.lieferStreet}
                                    plz={konfig.lieferPlz}
                                    city={konfig.lieferCity}
                                    loading={plzLoading}
                                    plzStatus={plzStatus}
                                    showStreet={konfig.aboTyp === 'Printed'}
                                    onStreetChange={v => set('lieferStreet', v)}
                                    onPlzChange={v => { set('lieferPlz', v); setPlzSearchDone(false) }}
                                    onCityChange={v => set('lieferCity', v)}
                                    onSearch={handlePlzSearch}
                                />
                            )}

                            {plzStatus === 'found' && (
                                <LocalPaperSelect
                                    versions={localVersions}
                                    selectedId={konfig.lokalausgabeId}
                                    onSelect={(id) => set('lokalausgabeId', id)}
                                />
                            )}
                        </div>
                    )}

                    {/* Step 3 — Zustellung (nur Printed) */}
                    {step === 'zustellung' && (
                        <div className="konfig-step">
                            <h2 className="konfig-step__title">Wie soll geliefert werden?</h2>
                            <div className="konfig-section">
                                <h3 className="konfig-section__title">Zustellungsart</h3>
                                <div className="option-cards">
                                    <OptionCard
                                        label="Austräger"
                                        description="Wird morgens direkt an deine Tür gebracht"
                                        selected={konfig.zustellungsart === 'Delivery man'}
                                        onClick={() => set('zustellungsart', 'Delivery man')}
                                    />
                                    <OptionCard
                                        label="Post"
                                        description="Zustellung per Deutsche Post (+3,00 €/Monat)"
                                        selected={konfig.zustellungsart === 'Post'}
                                        onClick={() => set('zustellungsart', 'Post')}
                                    />
                                </div>
                            </div>
                            <div className="konfig-section">
                                <h3 className="konfig-section__title">Belieferungsintervall</h3>
                                <div className="option-cards">
                                    <OptionCard
                                        label="Täglich"
                                        description="Montag bis Samstag"
                                        selected={konfig.belieferungsintervall === 'Daily'}
                                        onClick={() => set('belieferungsintervall', 'Daily')}
                                    />
                                    <OptionCard
                                        label="Wochenende"
                                        description="Freitag und Samstag"
                                        selected={konfig.belieferungsintervall === 'Weekend'}
                                        onClick={() => set('belieferungsintervall', 'Weekend')}
                                    />
                                </div>
                            </div>

                            {konfig.zustellungsart === 'Delivery man' && (
                                <div className="konfig-section">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="hinweis">
                                            Hinweis für den Austräger{' '}
                                            <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span>
                                        </label>
                                        <textarea
                                            id="hinweis"
                                            className="input"
                                            rows={3}
                                            maxLength={200}
                                            value={konfig.austraegerHinweis}
                                            onChange={e => set('austraegerHinweis', e.target.value)}
                                            placeholder="z.B. Bitte in den Briefkasten links einwerfen"
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {distanceKm !== null && konfig.zustellungsart === 'Delivery man' && distanceKm > 20 && (
                                <p className="form-hint">
                                    Entfernungszuschlag für {Math.round(distanceKm)} km:{' '}
                                    +{formatPrice(calcDistanceSurcharge(distanceKm, 'Delivery man'))} €/Monat
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 4 — Zahlung */}
                    {step === 'zahlung' && (
                        <div className="konfig-step">
                            <h2 className="konfig-step__title">Wie möchtest du zahlen?</h2>
                            <PaymentForm
                                zahlungsintervall={konfig.zahlungsintervall}
                                zahlungsart={konfig.zahlungsart}
                                monthlyPrice={monthly}
                                distanceKm={distanceKm}
                                state={konfig}
                                onZahlungsintervallChange={v => set('zahlungsintervall', v)}
                                onZahlungsartChange={v => set('zahlungsart', v)}
                            />

                            <div className="konfig-section">
                                <h3 className="konfig-section__title">Rechnungsadresse</h3>
                                <label className="dataprivacy-check">
                                    <input
                                        type="checkbox"
                                        checked={konfig.rechnungsAbweichend}
                                        onChange={e => set('rechnungsAbweichend', e.target.checked)}
                                    />
                                    <span>Rechnungsadresse weicht von der Lieferadresse ab</span>
                                </label>

                                {konfig.rechnungsAbweichend && (
                                    <div className="billing-address-form">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="rechnungsStreet">Straße & Hausnummer</label>
                                            <input
                                                id="rechnungsStreet"
                                                type="text"
                                                className="input"
                                                value={konfig.rechnungsStreet}
                                                onChange={e => set('rechnungsStreet', e.target.value)}
                                                placeholder="z.B. Musterstraße 12"
                                            />
                                        </div>
                                        <div className="billing-address-form__row">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="rechnungsPlz">PLZ</label>
                                                <input
                                                    id="rechnungsPlz"
                                                    type="text"
                                                    className="input"
                                                    maxLength={5}
                                                    value={konfig.rechnungsPlz}
                                                    onChange={e => set('rechnungsPlz', e.target.value)}
                                                    placeholder="z.B. 70173"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="rechnungsCity">Ort</label>
                                                <input
                                                    id="rechnungsCity"
                                                    type="text"
                                                    className="input"
                                                    value={konfig.rechnungsCity}
                                                    onChange={e => set('rechnungsCity', e.target.value)}
                                                    placeholder="z.B. Stuttgart"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 5 — Zusammenfassung */}
                    {step === 'zusammenfassung' && (
                        <div className="konfig-step">
                            <h2 className="konfig-step__title">Bestellübersicht</h2>
                            <OrderSummary
                                state={konfig}
                                localPaperName={localPaperName}
                                onSubmit={handleSubmit}
                                loading={submitLoading}
                                error={error}
                            />
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="konfig-nav">
                    <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={handleBack}
                        disabled={stepIndex === 0}
                    >
                        Zurück
                    </button>
                    {!isLast && (
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={handleNext}
                            disabled={!canProceed()}
                        >
                            {stepIndex === flow.length - 2 ? 'Zur Übersicht' : 'Weiter'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
