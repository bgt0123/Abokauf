import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import { Newspaper, Tablet, Globe } from 'lucide-react'
import { useAppDispatch } from '../../app/hooks'
import { setField } from '../../features/konfigurator/konfiguratorSlice'
import type { AboTyp } from '../../types'
import './ProduktDetailPage.css'

// ── Katalog ───────────────────────────────────────────

type AboKey = 'Printed' | 'E-paper' | 'Website'

const URL_TO_KEY: Record<string, AboKey> = {
    printed:  'Printed',
    'e-paper': 'E-paper',
    website:  'Website',
}

interface ProduktInfo {
    icon:       React.ReactNode
    iconColor:  string
    iconBg:     string
    title:      string
    subtitle:   string
    description: string
    features:   string[]
    extras:     string[]
    pricing:    React.ReactNode
}

const PRODUKT_INFO: Record<AboKey, ProduktInfo> = {
    Printed: {
        icon:      <Newspaper size={36} strokeWidth={1.5} />,
        iconColor: '#1d4ed8',
        iconBg:    '#eff6ff',
        title:     'Gedruckte Zeitung',
        subtitle:  'Die klassische Zeitung — täglich frisch an Ihrer Tür',
        description:
            'Mit dem Printabo erhalten Sie Ihre Tageszeitung bequem nach Hause geliefert — wahlweise täglich oder nur am Wochenende. Wählen Sie die für Sie passende Lokalausgabe, Zustellart und Häufigkeit.',
        features: [
            'Zustellung zwischen 4 und 6 Uhr morgens',
            'Wahl zwischen täglich (Mo–Sa) oder Wochenende (Fr+Sa)',
            'Austräger oder Deutsche Post',
            'Lokale Ausgaben je nach Postleitzahl',
            'Optionaler Hinweis für den Austräger',
        ],
        extras: [
            'Entfernungszuschlag bei Austräger: +0,01 € / km über 20 km (max. 5,00 €)',
            '10 % Rabatt bei jährlicher Zahlung',
        ],
        pricing: (
            <div className="detail-pricing">
                <h3 className="detail-pricing__title">Preisübersicht</h3>
                <table className="detail-pricing__table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Austräger</th>
                            <th>Post</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Wochenende (Fr+Sa)</td>
                            <td className="detail-pricing__price">19,90 € / Monat</td>
                            <td className="detail-pricing__price">22,90 € / Monat</td>
                        </tr>
                        <tr>
                            <td>Täglich (Mo–Sa)</td>
                            <td className="detail-pricing__price">34,90 € / Monat</td>
                            <td className="detail-pricing__price">37,90 € / Monat</td>
                        </tr>
                    </tbody>
                </table>
                <p className="detail-pricing__hint">
                    Zzgl. Entfernungszuschlag bei Austräger (max. 5,00 €) · 10 % Jahresrabatt möglich
                </p>
            </div>
        ),
    },
    'E-paper': {
        icon:      <Tablet size={36} strokeWidth={1.5} />,
        iconColor: '#0891b2',
        iconBg:    '#ecfeff',
        title:     'E-Paper',
        subtitle:  'Die komplette Zeitung — digital auf allen Geräten',
        description:
            'Das E-Paper ist die 1:1-Digitalausgabe der gedruckten Zeitung. Lesen Sie sie ab 5 Uhr morgens auf Smartphone, Tablet oder PC — online wie offline. Inklusive 30-tägigem Archivzugriff.',
        features: [
            'Verfügbar ab 5 Uhr morgens',
            'Auf iOS, Android, Windows und Mac nutzbar',
            'Offline-Lesemodus für unterwegs',
            '30 Tage Archivzugriff',
            'Identisches Layout wie die Printausgabe',
        ],
        extras: [
            '10 % Rabatt bei jährlicher Zahlung',
        ],
        pricing: (
            <div className="detail-pricing">
                <h3 className="detail-pricing__title">Preisübersicht</h3>
                <div className="detail-pricing__fixed">
                    <span className="detail-pricing__fixed-value">12,90 €</span>
                    <span className="detail-pricing__fixed-period">/ Monat</span>
                </div>
                <p className="detail-pricing__hint">
                    Oder 139,32 € / Jahr (10 % Jahresrabatt)
                </p>
            </div>
        ),
    },
    Website: {
        icon:      <Globe size={36} strokeWidth={1.5} />,
        iconColor: '#16a34a',
        iconBg:    '#f0fdf4',
        title:     'Website-Zugang',
        subtitle:  'Alle Artikel — unbegrenzt online lesen',
        description:
            'Mit dem Website-Zugang erhalten Sie vollen Zugriff auf alle Online-Artikel ohne Bezahlschranke. Exklusive Web-Inhalte, Echtzeit-Meldungen und der tagesaktuelle Newsletter sind inklusive.',
        features: [
            'Alle Artikel ohne Einschränkung lesen',
            'Exklusive Online-Inhalte',
            'Tagesaktuelle Meldungen in Echtzeit',
            'Kommentarfunktion',
            'Täglicher Newsletter inklusive',
        ],
        extras: [
            '10 % Rabatt bei jährlicher Zahlung',
        ],
        pricing: (
            <div className="detail-pricing">
                <h3 className="detail-pricing__title">Preisübersicht</h3>
                <div className="detail-pricing__fixed">
                    <span className="detail-pricing__fixed-value">7,90 €</span>
                    <span className="detail-pricing__fixed-period">/ Monat</span>
                </div>
                <p className="detail-pricing__hint">
                    Oder 85,32 € / Jahr (10 % Jahresrabatt)
                </p>
            </div>
        ),
    },
}

// ── Page ──────────────────────────────────────────────
export default function ProduktDetailPage() {
    const { type }   = useParams<{ type: string }>()
    const navigate   = useNavigate()
    const dispatch   = useAppDispatch()

    const aboKey = URL_TO_KEY[type ?? '']
    if (!aboKey) return <Navigate to="/" replace />

    const info = PRODUKT_INFO[aboKey]

    function handleBestellung() {
        dispatch(setField({ field: 'aboTyp', value: aboKey as AboTyp } as any))
        navigate('/konfigurator')
    }

    return (
        <div className="produkt-page">

            <button type="button" className="produkt-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} strokeWidth={2} />
                Zurück
            </button>

            {/* ── Hero ── */}
            <div className="produkt-hero">
                <span className="produkt-hero__icon" style={{ color: info.iconColor, background: info.iconBg }}>
                    {info.icon}
                </span>
                <div>
                    <h1 className="produkt-hero__title">{info.title}</h1>
                    <p className="produkt-hero__subtitle">{info.subtitle}</p>
                </div>
            </div>

            <p className="produkt-description">{info.description}</p>

            <div className="produkt-body">

                {/* ── Features ── */}
                <div className="produkt-features">
                    <h2 className="produkt-section-title">Was ist enthalten?</h2>
                    <ul className="produkt-feature-list">
                        {info.features.map(f => (
                            <li key={f} className="produkt-feature-item">
                                <CheckCircle2 size={17} strokeWidth={2} className="produkt-feature-icon" />
                                {f}
                            </li>
                        ))}
                    </ul>

                    {info.extras.length > 0 && (
                        <ul className="produkt-extras">
                            {info.extras.map(e => (
                                <li key={e} className="produkt-extra-item">{e}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ── Pricing ── */}
                <div className="produkt-pricing-wrap">
                    {info.pricing}

                    <button type="button" className="btn produkt-cta" onClick={handleBestellung}>
                        Jetzt Abo bestellen
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </button>
                </div>

            </div>
        </div>
    )
}
