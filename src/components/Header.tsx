import { Link, useNavigate } from 'react-router-dom'
import { Newspaper, User, LogOut, Sun, Moon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import { useTheme } from '../app/useTheme'
import './Header.css'

export function Header() {
    const currentUser = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()
    const { dark, toggle } = useTheme()
    const navigate = useNavigate()

    function handleLogout() {
        dispatch(logout())
        navigate('/')
    }

    return (
        <header className="header">
            <Link to="/" className="header__brand">
                <span className="header__brand-icon">
                    <Newspaper size={20} strokeWidth={2} />
                </span>
                <span className="header__brand-text">Abokauf</span>
            </Link>
            <nav className="header__nav">
                {currentUser ? (
                    <>
                        <span className="header__user">
                            <User size={15} strokeWidth={2} />
                            {currentUser.firstname} {currentUser.lastname}
                        </span>
                        <button className="header__btn header__btn--ghost" onClick={handleLogout}>
                            <LogOut size={15} strokeWidth={2} />
                            Abmelden
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="header__btn header__btn--ghost">Anmelden</Link>
                        <Link to="/registrierung" className="header__btn header__btn--primary">Registrieren</Link>
                    </>
                )}
                <button className="header__theme-toggle" onClick={toggle} aria-label="Theme wechseln">
                    {dark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
                </button>
            </nav>
        </header>
    )
}