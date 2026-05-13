import { Link } from 'react-router-dom'
import '../pages/Header.css'

export function Header() {
    return (
        <header className="header">
            <Link to="/" className="header__brand">AboShop</Link>
            <nav className="header__nav">
                <Link to="/login" className="header__link">Anmelden</Link>
                <Link to="/registrierung" className="header__link btn btn--primary">Registrieren</Link>
            </nav>
        </header>
    )
}