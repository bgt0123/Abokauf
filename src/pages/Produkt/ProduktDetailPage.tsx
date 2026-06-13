import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
    Clock, Calendar, Truck, MapPin, MessageSquare,
    Smartphone, WifiOff, BookOpen, Archive,
    Globe, Star, Rss, MessageCircle, Mail,
} from 'lucide-react'
import { useAppDispatch } from '../../app/hooks'
import { setField } from '../../features/konfigurator/konfiguratorSlice'
import type { AboTyp } from '../../types'
import { ABO_TYPES, ABO_URL, ABO_META } from '../../data/produkte'
import './ProduktDetailPage.css'

interface Feature {
    Icon:   LucideIcon
    label:  string
    detail: string
}

interface ProduktDetail {
    features: Feature[]
    pricing:  React.ReactNode
}

function StandardPricing({ monthly, annual, savings }: { monthly: string; annual: string; savings: string }) {
    return (
        <>
            <div className="detail-price-hero">
                <span className="detail-price-hero__value">{monthly} €</span>
                <span className="detail-price-hero__period">/ Monat</span>
            </div>
            <div className="detail-price-row detail-price-row--muted">
                <span className="detail-price-label">Jährlich</span>
                <span className="detail-price-value">{annual} €<span className="detail-price-period">/Jahr</span></span>
            </div>
            <p className="detail-price-hint">10 % Jahresrabatt — Sie sparen {savings} € pro Jahr</p>
        </>
    )
}

const PRODUKT_DETAIL: Record<AboTyp, ProduktDetail> = {
    Printed: {
        features: [
            { Icon: Clock,         label: 'Frühe Zustellung',    detail: 'Täglich zwischen 4 und 6 Uhr morgens an Ihrer Tür' },
            { Icon: Calendar,      label: 'Flexibles Intervall', detail: 'Täglich (Mo–Sa) oder nur am Wochenende (Fr+Sa)' },
            { Icon: Truck,         label: 'Zwei Zustellwege',    detail: 'Austräger oder Post' },
            { Icon: MapPin,        label: 'Regionale Ausgaben',  detail: 'Lokale Ausgaben verfügbar je nach Ihrer PLZ' },
            { Icon: MessageSquare, label: 'Austräger-Hinweis',   detail: 'Hinterlassen Sie individuelle Hinweise für Ihren Zusteller' },
        ],
        pricing: (
            <>
                <div className="detail-price-row">
                    <span className="detail-price-label">Wochenende · Austräger</span>
                    <span className="detail-price-value">19,90 €<span className="detail-price-period">/Mo</span></span>
                </div>
                <div className="detail-price-row">
                    <span className="detail-price-label">Wochenende · Post</span>
                    <span className="detail-price-value">22,90 €<span className="detail-price-period">/Mo</span></span>
                </div>
                <div className="detail-price-divider" />
                <div className="detail-price-row">
                    <span className="detail-price-label">Täglich · Austräger</span>
                    <span className="detail-price-value">34,90 €<span className="detail-price-period">/Mo</span></span>
                </div>
                <div className="detail-price-row">
                    <span className="detail-price-label">Täglich · Post</span>
                    <span className="detail-price-value">37,90 €<span className="detail-price-period">/Mo</span></span>
                </div>
                <p className="detail-price-hint">Zzgl. Entfernungszuschlag bei Austräger (max. 5,00 €/Monat)</p>
            </>
        ),
    },

    'E-paper': {
        features: [
            { Icon: Clock,      label: 'Ab 5 Uhr verfügbar', detail: 'Früher online als die gedruckte Ausgabe am Kiosk' },
            { Icon: Smartphone, label: 'Alle Geräte',        detail: 'iOS, Android, Windows und Mac — ein Abo, alle Geräte' },
            { Icon: WifiOff,    label: 'Offline-Lesemodus',  detail: 'Ausgabe vorher speichern und ohne WLAN lesen' },
            { Icon: Archive,    label: '30-Tage-Archiv',     detail: 'Frühere Ausgaben der letzten 30 Tage jederzeit abrufbar' },
            { Icon: BookOpen,   label: 'Gewohntes Layout',   detail: 'Identische Optik wie die Printausgabe — kein Umgewöhnen' },
        ],
        pricing: <StandardPricing monthly="12,90" annual="139,32" savings="15,48" />,
    },

    Website: {
        features: [
            { Icon: Globe,         label: 'Alle Artikel frei',    detail: 'Kein Paywall — jeder Artikel, jederzeit, ohne Limit' },
            { Icon: Star,          label: 'Exklusive Inhalte',    detail: 'Online-Reportagen und Hintergrundberichte nur für Abonnenten' },
            { Icon: Rss,           label: 'Echtzeit-Meldungen',   detail: 'Breaking News sofort auf der Startseite und per Push' },
            { Icon: MessageCircle, label: 'Kommentarfunktion',    detail: 'Diskutieren Sie direkt unter den Artikeln mit der Community' },
            { Icon: Mail,          label: 'Täglicher Newsletter', detail: 'Die wichtigsten Themen des Tages um 7 Uhr in Ihr Postfach' },
        ],
        pricing: <StandardPricing monthly="7,90" annual="85,32" savings="9,48" />,
    },
}

export default function ProduktDetailPage() {
    const { type } = useParams<{ type: string }>()
    const navigate  = useNavigate()
    const dispatch  = useAppDispatch()

    const aboKey = ABO_TYPES.find(t => ABO_URL[t].endsWith(`/${type}`))
    if (!aboKey) return <Navigate to="/" replace />

    const base   = ABO_META[aboKey]
    const detail = PRODUKT_DETAIL[aboKey]

    function handleBestellung() {
        dispatch(setField({ field: 'aboTyp', value: aboKey } as any))
        navigate('/konfigurator')
    }

    return (
        <div className="produkt-page">
            <div className="produkt-hero" style={{ background: base.heroBg }}>
                <div className="produkt-hero__left">
                    <span className="produkt-hero__icon" style={{ color: base.iconColor, background: '#fff' }}>
                        <base.Icon size={40} strokeWidth={1.5} />
                    </span>
                    <div>
                        <p className="produkt-hero__category">Abo-Produkt</p>
                        <h1 className="produkt-hero__title">{base.title}</h1>
                        <p className="produkt-hero__tagline">{base.tagline}</p>
                        <p className="produkt-hero__desc">{base.description}</p>
                    </div>
                </div>
                <div className="produkt-hero__cta">
                    <button type="button" className="btn produkt-cta" onClick={handleBestellung}>
                        Jetzt Abo bestellen <ArrowRight size={16} strokeWidth={2.5} />
                    </button>
                    <div className="produkt-trust">
                        <span><CheckCircle2 size={13} strokeWidth={2.5} /> Keine Mindestlaufzeit</span>
                        <span><CheckCircle2 size={13} strokeWidth={2.5} /> Monatlich kündbar</span>
                    </div>
                </div>
            </div>

            <div className="produkt-body">
                <div className="produkt-left">
                    <div className="produkt-feature-grid">
                        {detail.features.map(f => (
                            <div key={f.label} className="produkt-feature-card">
                                <span className="produkt-feature-card__icon" style={{ color: base.iconColor }}>
                                    <f.Icon size={20} strokeWidth={1.8} />
                                </span>
                                <div>
                                    <p className="produkt-feature-card__label">{f.label}</p>
                                    <p className="produkt-feature-card__detail">{f.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="produkt-pricing-wrap">
                    <div className="detail-pricing" style={{ borderColor: base.iconColor + '40' }}>
                        <div className="detail-pricing__header" style={{ background: base.heroBg }}>
                            <ShieldCheck size={16} strokeWidth={2} style={{ color: base.iconColor }} />
                            <span>Preisübersicht</span>
                        </div>
                        <div className="detail-pricing__body">
                            {detail.pricing}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
