import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    CheckCircle2,
    Truck, Zap, Shield, CalendarCheck, ArrowRight,
    PackageCheck, Sparkles,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectCurrentUser, selectIsLoggedIn } from '../../features/auth/authSlice'
import { setField } from '../../features/konfigurator/konfiguratorSlice'
import { readAllAbosForCustomer } from '../../api/api'
import type { Abo, AboTyp } from '../../types'
import { PAYMENT_LABELS, ZAHLUNGSART_LABELS, DELIVERY_LABELS, INTERVAL_LABELS } from '../../constants/labels'
import { ABO_TYPES, ABO_URL, ABO_META } from '../../data/produkte'
import './Home.css'

const FEATURES = [
    { icon: <Truck        size={22} strokeWidth={1.5} />, title: 'Zuverlässige Zustellung',  text: 'Pünktlich zum Frühstück — täglich zwischen 4 und 6 Uhr morgens an Ihrer Tür.' },
    { icon: <Zap          size={22} strokeWidth={1.5} />, title: 'Sofort verfügbar',          text: 'E-Paper und Web-Zugang sind ab 5 Uhr morgens abrufbar — noch vor der Druckausgabe.' },
    { icon: <CalendarCheck size={22} strokeWidth={1.5} />, title: 'Monatlich kündbar',        text: 'Keine langen Vertragslaufzeiten. Kündigung jederzeit zum Monatsende möglich.' },
    { icon: <Shield       size={22} strokeWidth={1.5} />, title: 'Keine Einrichtungsgebühr',  text: 'Starten Sie direkt ohne versteckte Kosten. Nur der monatliche Abopreis.' },
]

const fmt = (n: number) => n.toFixed(2).replace('.', ',')

// ── Root ──────────────────────────────────────────────
export default function Home() {
    const isLoggedIn  = useAppSelector(selectIsLoggedIn)
    const currentUser = useAppSelector(selectCurrentUser)
    const [myAbos, setMyAbos] = useState<Abo[]>([])

    useEffect(() => {
        if (!currentUser) { setMyAbos([]); return }
        readAllAbosForCustomer(currentUser.id).then(({ allAbos }) => setMyAbos(allAbos))
    }, [currentUser?.id])

    if (isLoggedIn && currentUser) {
        const ownedTypes  = new Set(myAbos.map(a => a.abotype))
        const upsellTypes = ABO_TYPES.filter(t => !ownedTypes.has(t))

        return (
            <main className="home">

                <section className="home__hero home__hero--logged">
                    <p className="home__section-label">Willkommen zurück</p>
                    <h1 className="home__hero-title home__hero-title--sm">Hallo, {currentUser.firstname}!</h1>
                    <p className="home__hero-sub">Hier findest du deine aktiven Abonnements und weitere passende Angebote.</p>
                    <Link to="/konfigurator" className="btn home__cta-primary home__cta-primary--spaced">
                        Neues Abo konfigurieren <ArrowRight size={16} strokeWidth={2.5} />
                    </Link>
                </section>

                <section className="home__my-abos">
                    <div className="home__section-label">Deine Abonnements</div>
                    <h2 className="home__section-title">Meine Abos</h2>

                    {myAbos.length === 0 ? (
                        <div className="home__empty">
                            <PackageCheck size={36} strokeWidth={1.5} className="home__empty-icon" />
                            <p className="home__empty-text">Du hast noch kein aktives Abo.</p>
                            <Link to="/konfigurator" className="btn home__cta-primary">
                                Jetzt konfigurieren <ArrowRight size={15} strokeWidth={2.5} />
                            </Link>
                        </div>
                    ) : (
                        <div className="home__abo-grid">
                            {myAbos.map(abo => {
                                const meta     = ABO_META[abo.abotype as AboTyp]
                                const isAnnual = abo.payment === 'Annual'
                                const price    = isAnnual ? abo.calculatedyearprice : abo.calculatedprice
                                const startDate = new Date(abo.startabodate).toLocaleDateString('de-DE', {
                                    day: '2-digit', month: 'long', year: 'numeric',
                                })
                                return (
                                    <div key={abo.id} className="home__abo-card">
                                        <div className="home__abo-card-header">
                                            <span className="home__abo-icon" style={{ color: meta?.iconColor, background: meta?.iconBg }}>
                                                {meta && <meta.Icon size={28} strokeWidth={1.5} />}
                                            </span>
                                            <div className="home__abo-card-title-wrap">
                                                <span className="home__abo-card-title">{meta?.title ?? abo.abotype}</span>
                                                <span className="home__abo-badge">Aktiv</span>
                                            </div>
                                        </div>
                                        <div className="home__abo-details">
                                            <AboDetailRow label="Seit"        value={startDate} />
                                            <AboDetailRow label="Preis"       value={`${fmt(price)} € / ${isAnnual ? 'Jahr' : 'Monat'}`} highlight />
                                            <AboDetailRow label="Zahlung"     value={PAYMENT_LABELS[abo.payment] ?? abo.payment} />
                                            <AboDetailRow label="Zahlungsart" value={ZAHLUNGSART_LABELS[abo.paymenttype] ?? abo.paymenttype} />
                                            {abo.abotype === 'Printed' && <>
                                                <AboDetailRow label="Zustellung"  value={DELIVERY_LABELS[abo.deliverymethod] ?? abo.deliverymethod} />
                                                <AboDetailRow label="Belieferung" value={INTERVAL_LABELS[abo.subscriptiontype] ?? abo.subscriptiontype} />
                                            </>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {upsellTypes.length > 0 && (
                    <section className="home__abos">
                        <div className="home__section-label">
                            <Sparkles size={11} strokeWidth={2.5} className="home__sparkles" />
                            Empfohlen für dich
                        </div>
                        <h2 className="home__section-title">Das könnte dich auch interessieren</h2>
                        <p className="home__section-sub">Ergänze dein Leseerlebnis mit einem weiteren Abo-Format.</p>
                        <div className={`home__cards home__cards--${upsellTypes.length}`}>
                            {upsellTypes.map(type => <AboCard key={type} type={type} />)}
                        </div>
                    </section>
                )}

                <FeaturesSection />
            </main>
        )
    }

    return (
        <main className="home">
            <section className="home__hero">
                <h1 className="home__hero-title">Ihr Zeitungsabo: <br /> Einfach & flexibel</h1>
            </section>

            <section className="home__abos" id="abos">
                <div className="home__section-label">Unsere Angebote</div>
                <h2 className="home__section-title">Wählen Sie Ihr perfektes Zeitungs-Abo</h2>
                <div className="home__cards">
                    {ABO_TYPES.map(type => <AboCard key={type} type={type} />)}
                </div>
                <p className="home__cards-hint home__cards-hint--centered">
                    <CheckCircle2 size={13} strokeWidth={2} className="home__trust-icon" />
                    Keine Einrichtungsgebühr · Monatlich kündbar
                </p>
            </section>

            <FeaturesSection />
        </main>
    )
}

// ── Sub-components ────────────────────────────────────

function AboCard({ type }: { type: AboTyp }) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const m = ABO_META[type]

    function handleKonfigurieren() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setField({ field: 'aboTyp', value: type } as any))
        navigate('/konfigurator')
    }

    return (
        <article className={`home__card${m.badge ? ' home__card--featured' : ''}`}>
            {m.badge && <span className="home__card-badge">{m.badge}</span>}
            <div className="home__card-icon" style={{ color: m.iconColor, background: m.iconBg }}><m.Icon size={28} strokeWidth={1.5} /></div>
            <h3 className="home__card-title">{m.title}</h3>
            <div className="home__card-price">
                <span className="home__card-price-label">Ab</span>
                <span className="home__card-price-value">{m.priceFrom}€</span>
                <span className="home__card-price-period">/ Monat</span>
            </div>
            <div className="home__card-actions">
                <Link to={ABO_URL[type]} className="btn home__card-action--secondary">Abodetails</Link>
                <button type="button" className="btn home__card-action--primary" onClick={handleKonfigurieren}>
                    Konfigurieren <ArrowRight size={13} strokeWidth={2.5} />
                </button>
            </div>
        </article>
    )
}

function AboDetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`home__abo-detail${highlight ? ' home__abo-detail--highlight' : ''}`}>
            <span className="home__abo-detail-label">{label}</span>
            <span className="home__abo-detail-value">{value}</span>
        </div>
    )
}

function FeaturesSection() {
    return (
        <section className="home__features">
            <div className="home__section-label">Warum Abokauf?</div>
            <h2 className="home__section-title">Alles was Sie von einem Abo erwarten</h2>
            <div className="home__features-grid">
                {FEATURES.map(f => (
                    <div key={f.title} className="home__feature">
                        <span className="home__feature-icon">{f.icon}</span>
                        <h4 className="home__feature-title">{f.title}</h4>
                        <p className="home__feature-text">{f.text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
