import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { registerThunk, selectAuthError, selectAuthLoading } from '../../features/auth/authSlice'
import { addToast } from '../../features/notifications/notificationsSlice'
import type { NewCustomer } from '../../types'
import './SignUpPage.css'

interface ReqItem { label: string; met: boolean }

function RequirementList({ items, visible }: { items: ReqItem[]; visible: boolean }) {
    if (!visible) return null
    return (
        <ul className="req-list">
            {items.map(r => (
                <li key={r.label} className={`req-item ${r.met ? 'req-item--ok' : 'req-item--no'}`}>
                    {r.met ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                    {r.label}
                </li>
            ))}
        </ul>
    )
}

export default function SignUpPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [form, setForm] = useState({
        username: '', password: '',
        vorname: '', nachname: '', email: '', phone: '',
        street: '', plz: '', city: '',
    })
    const [focused, setFocused] = useState({ username: false, password: false })
    const [errors, setErrors]   = useState<Partial<typeof form>>({})

    const loading     = useAppSelector(selectAuthLoading)
    const serverError = useAppSelector(selectAuthError)

    const inputCls = (field: keyof typeof form) => `input${errors[field] ? ' input--error' : ''}`

    const usernameReqs: ReqItem[] = [
        { label: 'Mindestens 5 Zeichen', met: form.username.length >= 5 },
        { label: 'Keine Leerzeichen',    met: form.username.length > 0 && !form.username.includes(' ') },
    ]
    const passwordReqs: ReqItem[] = [
        { label: 'Mindestens 8 Zeichen',       met: form.password.length >= 8 },
        { label: 'Mindestens 1 Großbuchstabe', met: /[A-Z]/.test(form.password) },
        { label: 'Mindestens 1 Zahl',          met: /[0-9]/.test(form.password) },
    ]

    function updateField(field: keyof typeof form, value: string) {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    function validate(): Partial<typeof form> {
        const errs: Partial<typeof form> = {}

        if (usernameReqs.some(req => !req.met)) errs.username = 'Benutzername erfüllt nicht alle Anforderungen.'
        if (passwordReqs.some(req => !req.met)) errs.password = 'Passwort erfüllt nicht alle Anforderungen.'

        const requiredFields = ['vorname', 'nachname', 'email', 'street', 'plz', 'city'] as const
        for (const field of requiredFields) {
            if (!form[field]) errs[field] = 'Pflichtfeld.'
        }

        return errs
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const errs = validate()
        if (Object.keys(errs).length > 0) { setErrors(errs); return }

        const adresse = { street1: form.street, street2: '', city: form.city, plz: form.plz }
        const newCustomer: NewCustomer = {
            firstname:       form.vorname,
            lastname:        form.nachname,
            companyname:     form.username, // DB-Schema hat kein username-Feld — companyname wird als Username verwendet
            email:           form.email,
            password:        form.password,
            phone:           form.phone,
            deliveryAddress: adresse,
            billingAddress:  adresse,
        }

        const result = await dispatch(registerThunk(newCustomer))
        if (registerThunk.fulfilled.match(result)) {
            dispatch(addToast({ message: 'Konto erfolgreich erstellt!', type: 'success' }))
            navigate('/konfigurator')
        }
    }

    return (
        <div className="page">
            <div className="signup-card">
                <div className="signup-header">
                    <h1 className="page__title">Konto erstellen</h1>
                    <p className="page__subtitle">Registriere dich, um ein Abo abzuschließen.</p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">

                    <section className="signup-section">
                        <h2 className="signup-section__title">Account</h2>

                        <div className="form-group">
                            <label className="form-label" htmlFor="username">Benutzername *</label>
                            <input id="username" className={inputCls('username')} type="text"
                                autoComplete="username" value={form.username}
                                onChange={event => updateField('username', event.target.value)}
                                onFocus={() => setFocused(f => ({ ...f, username: true }))}
                                onBlur={()  => setFocused(f => ({ ...f, username: false }))} />
                            <RequirementList items={usernameReqs} visible={focused.username || form.username.length > 0} />
                            {errors.username && <p className="form-error">{errors.username}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Passwort *</label>
                            <input id="password" className={inputCls('password')} type="password"
                                autoComplete="new-password" value={form.password}
                                onChange={e => updateField('password', e.target.value)}
                                onFocus={() => setFocused(f => ({ ...f, password: true }))}
                                onBlur={()  => setFocused(f => ({ ...f, password: false }))} />
                            <RequirementList items={passwordReqs} visible={focused.password || form.password.length > 0} />
                            {errors.password && <p className="form-error">{errors.password}</p>}
                        </div>
                    </section>

                    <section className="signup-section">
                        <h2 className="signup-section__title">Persönliche Daten</h2>
                        <div className="signup-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="vorname">Vorname *</label>
                                <input id="vorname" className={inputCls('vorname')} type="text"
                                    value={form.vorname} onChange={e => updateField('vorname', e.target.value)} />
                                {errors.vorname && <p className="form-error">{errors.vorname}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="nachname">Nachname *</label>
                                <input id="nachname" className={inputCls('nachname')} type="text"
                                    value={form.nachname} onChange={e => updateField('nachname', e.target.value)} />
                                {errors.nachname && <p className="form-error">{errors.nachname}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">E-Mail *</label>
                            <input id="email" className={inputCls('email')} type="email"
                                autoComplete="email" value={form.email}
                                onChange={e => updateField('email', e.target.value)} />
                            {errors.email && <p className="form-error">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">
                                Telefonnummer <span className="signup-optional">(optional)</span>
                            </label>
                            <input id="phone" className="input" type="tel"
                                autoComplete="tel" value={form.phone}
                                onChange={e => updateField('phone', e.target.value)} />
                        </div>
                    </section>

                    <section className="signup-section">
                        <h2 className="signup-section__title">Adresse</h2>
                        <div className="form-group">
                            <label className="form-label" htmlFor="street">Straße & Hausnummer *</label>
                            <input id="street" className={inputCls('street')} type="text"
                                value={form.street} onChange={e => updateField('street', e.target.value)} />
                            {errors.street && <p className="form-error">{errors.street}</p>}
                        </div>
                        <div className="signup-row signup-row--plz">
                            <div className="form-group">
                                <label className="form-label" htmlFor="plz">PLZ *</label>
                                <input id="plz" className={inputCls('plz')} type="text"
                                    maxLength={5} value={form.plz}
                                    onChange={e => updateField('plz', e.target.value)} />
                                {errors.plz && <p className="form-error">{errors.plz}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="city">Ort *</label>
                                <input id="city" className={inputCls('city')} type="text"
                                    value={form.city} onChange={e => updateField('city', e.target.value)} />
                                {errors.city && <p className="form-error">{errors.city}</p>}
                            </div>
                        </div>
                    </section>

                    {serverError && <p className="form-error">{serverError}</p>}

                    <button type="submit" className="btn btn--primary signup-submit" disabled={loading}>
                        {loading ? 'Wird gespeichert…' : 'Konto erstellen'}
                    </button>
                </form>

                <p className="signup-login-hint">
                    Bereits ein Konto? <Link to="/login">Jetzt anmelden</Link>
                </p>
            </div>
        </div>
    )
}
