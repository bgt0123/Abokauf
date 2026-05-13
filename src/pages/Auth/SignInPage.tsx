import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { readCustomer } from '../../api/api'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { customer } = await readCustomer(email)
            const found = customer[0]

            if (!found || found.password !== password) {
                setError('E-Mail oder Passwort ist falsch.')
            } else {
                navigate('/konfigurator')
            }
        } catch {
            setError('Anmeldung fehlgeschlagen. Bitte versuche es erneut.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <div className="card" style={{ width: '100%', maxWidth: 420 }}>
                <h1 className="page__title">Anmelden</h1>
                <p className="page__subtitle">Melde dich an, um ein Abo abzuschließen.</p>

                <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">E-Mail</label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Passwort</label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="btn btn--primary" disabled={loading}>
                        {loading ? 'Wird geprüft…' : 'Anmelden'}
                    </button>
                </form>

                <p style={{ marginTop: 16, fontSize: 14, color: 'var(--text)' }}>
                    Noch kein Konto?{' '}
                    <Link to="/registrierung" style={{ color: 'var(--accent)' }}>Jetzt registrieren</Link>
                </p>
            </div>
        </div>
    )
}
