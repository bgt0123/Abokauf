import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { loginThunk, selectAuthError, selectAuthLoading } from '../../features/auth/authSlice'
import { addToast } from '../../features/notifications/notificationsSlice'
import './SignInPage.css'

export default function SignInPage() {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const loading = useAppSelector(selectAuthLoading)
    const reduxError = useAppSelector(selectAuthError)

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        const result = await dispatch(loginThunk({ identifier, password }))
        if (loginThunk.fulfilled.match(result)) {
            dispatch(addToast({ message: 'Erfolgreich angemeldet!', type: 'success' }))
            navigate('/konfigurator')
        }
    }

    return (
        <div className="page">
            <div className="card signin-card">
                <h1 className="page__title">Anmelden</h1>
                <p className="page__subtitle">Melde dich an, um ein Abo abzuschließen.</p>

                <form onSubmit={handleSubmit} className="signin-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="identifier">Benutzername oder E-Mail</label>
                        <input
                            id="identifier"
                            type="text"
                            className="input"
                            value={identifier}
                            onChange={event => setIdentifier(event.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Passwort</label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {reduxError && <p className="form-error">{reduxError}</p>}

                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? 'Wird geprüft…' : 'Anmelden'}
                    </button>
                </form>

                <p className="signin-hint">
                    Noch kein Konto?{' '}
                    <Link to="/registrierung">Jetzt registrieren</Link>
                </p>
            </div>
        </div>
    )
}
