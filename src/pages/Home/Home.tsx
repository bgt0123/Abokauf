import { Link } from 'react-router-dom'
import {
    Newspaper, Tablet, Globe, CheckCircle2,
    Truck, Zap, Shield, CalendarCheck, ArrowRight,
} from 'lucide-react'
import './Home.css'

// ── Abo-Produkte ──────────────────────────────────────
const ABOS = [
    {
        icon: <Newspaper size={28} strokeWidth={1.5} />,
        iconColor: '#1d4ed8',
        iconBg: '#eff6ff',
        badge: 'Beliebteste Wahl',
        title: 'Gedruckte Zeitung',
        subtitle: 'Die klassische Zeitung direkt in Ihren Briefkasten',
        features: [
            'Tägliche Zustellung zwischen 4–6 Uhr',
            'Stadtausgabe oder Umland',
            'Täglich oder nur Wochenende',
            'Individuelle Austrägerhinweise',
        ],
        price: '35,00',
    },
    {
        icon: <Tablet size={28} strokeWidth={1.5} />,
        iconColor: '#0891b2',
        iconBg: '#ecfeff',
        badge: null,
        title: 'E-Paper',
        subtitle: 'Die digitale Zeitung für Tablet und Smartphone',
        features: [
            'Verfügbar ab 5 Uhr morgens',
            'Offline-Lesemodus',
            'Auf allen Geräten nutzbar',
            'Archiv-Zugriff',
        ],
        price: '25,00',
    },
    {
        icon: <Globe size={28} strokeWidth={1.5} />,
        iconColor: '#16a34a',
        iconBg: '#f0fdf4',
        badge: null,
        title: 'Web-Zugang',
        subtitle: 'Unbegrenzter Zugriff auf alle Online-Inhalte',
        features: [
            'Alle Artikel online lesen',
            'Exklusive Web-Inhalte',
            'Kommentarfunktion',
            'Newsletter inklusive',
        ],
        price: '9,90',
    },
]

const FEATURES = [
    {
        icon: <Truck size={22} strokeWidth={1.5} />,
        title: 'Zuverlässige Zustellung',
        text: 'Pünktlich zum Frühstück — täglich zwischen 4 und 6 Uhr morgens an Ihrer Tür.',
    },
    {
        icon: <Zap size={22} strokeWidth={1.5} />,
        title: 'Sofort verfügbar',
        text: 'E-Paper und Web-Zugang sind ab 5 Uhr morgens abrufbar — noch vor der Druckausgabe.',
    },
    {
        icon: <CalendarCheck size={22} strokeWidth={1.5} />,
        title: 'Monatlich kündbar',
        text: 'Keine langen Vertragslaufzeiten. Kündigung jederzeit zum Monatsende möglich.',
    },
    {
        icon: <Shield size={22} strokeWidth={1.5} />,
        title: 'Keine Einrichtungsgebühr',
        text: 'Starten Sie direkt ohne versteckte Kosten. Nur der monatliche Abopreis.',
    },
]

export default function Home() {
    return (
        <main className="home">

            {/* ── Hero ── */}
            <section className="home__hero">
                <h1 className="home__hero-title">
                    Ihr Zeitungsabo —<br />einfach &amp; flexibel
                </h1>
                <p className="home__hero-sub">
                    Bleiben Sie informiert mit unserem flexiblen Abo-Angebot.<br />
                    Wählen Sie zwischen gedruckter Zeitung, E-Paper oder Web-Zugang.
                </p>
            </section>

            {/* ── Abo-Karten ── */}
            <section className="home__abos" id="abos">
                <div className="home__section-label">Unsere Angebote</div>
                <h2 className="home__section-title">Wählen Sie Ihr perfektes Zeitungs-Abo</h2>
                <p className="home__section-sub">
                    Alle Abos beinhalten den globalen Nachrichtenteil — nur die Lokalausgabe und Lieferart variieren.
                </p>

                <div className="home__cards">
                    {ABOS.map(abo => (
                        <article key={abo.title} className={`home__card${abo.badge ? ' home__card--featured' : ''}`}>
                            {abo.badge && <span className="home__card-badge">{abo.badge}</span>}
                            <div className="home__card-icon" style={{ color: abo.iconColor, background: abo.iconBg }}>
                                {abo.icon}
                            </div>
                            <h3 className="home__card-title">{abo.title}</h3>
                            <p className="home__card-sub">{abo.subtitle}</p>
                            <ul className="home__card-features">
                                {abo.features.map(f => (
                                    <li key={f}>
                                        <CheckCircle2 size={15} strokeWidth={2} className="home__check" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <div className="home__card-price">
                                <span className="home__card-price-label">Ab</span>
                                <span className="home__card-price-value">{abo.price}€</span>
                                <span className="home__card-price-period">/ Monat</span>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="home__cards-cta">
                    <Link to="/konfigurator" className="btn home__cta-primary">
                        Jetzt Abo bestellen <ArrowRight size={16} strokeWidth={2.5} />
                    </Link>
                    <p className="home__cards-hint">
                        <CheckCircle2 size={13} strokeWidth={2} className="home__trust-icon" />
                        Keine Einrichtungsgebühr · Monatlich kündbar
                    </p>
                </div>
            </section>

            {/* ── Features ── */}
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

        </main>
    )
}