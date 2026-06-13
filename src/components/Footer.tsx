import { Link } from 'react-router-dom'
import { Newspaper } from 'lucide-react'
import './Footer.css'

export function Footer() {
    return (
        <footer className="footer">
            <Link to="/" className="footer__brand">
                <span className="footer__brand-icon">
                    <Newspaper size={15} strokeWidth={2} />
                </span>
                <span className="footer__brand-text">Abokauf</span>
            </Link>

            <nav className="footer__links">
                <Link to="/impressum" className="footer__link">Impressum</Link>
                <Link to="/datenschutz" className="footer__link">Datenschutz</Link>
                <Link to="/agb" className="footer__link">AGB</Link>
            </nav>
        </footer>
    )
}