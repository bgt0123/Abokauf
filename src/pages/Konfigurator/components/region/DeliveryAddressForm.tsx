import { useState } from 'react'
import './DeliveryAddressForm.css'
import { CheckCircle2, XCircle } from 'lucide-react'

export type PlzStatus = 'idle' | 'found' | 'not-found'

interface Props {
    street?:      string
    plz:          string
    city:         string
    loading:      boolean
    plzStatus:    PlzStatus
    showStreet?:  boolean
    onStreetChange?: (v: string) => void
    onPlzChange:  (v: string) => void
    onCityChange: (v: string) => void
    onSearch:     (plz: string) => void
}

export function DeliveryAddressForm({
    street = '', plz, city, loading, plzStatus, showStreet = false,
    onStreetChange, onPlzChange, onCityChange, onSearch,
}: Props) {
    const [touched, setTouched] = useState(false)
    const invalid = touched && plz.length !== 5

    function handleSearch() {
        setTouched(true)
        if (plz.length === 5) onSearch(plz)
    }

    return (
        <div className="delivery-address-form">
            {showStreet && (
                <div className="form-group">
                    <label className="form-label" htmlFor="lieferStreet">Straße & Hausnummer</label>
                    <input
                        id="lieferStreet"
                        type="text"
                        className="input"
                        value={street}
                        onChange={e => onStreetChange?.(e.target.value)}
                        placeholder="z.B. Musterstraße 12"
                    />
                </div>
            )}

            <div className="form-group">
                <label className="form-label" htmlFor="plz">Postleitzahl</label>
                <div className="delivery-address-form__row">
                    <input
                        id="plz"
                        type="text"
                        className={`input${invalid ? ' input--error' : ''}`}
                        maxLength={5}
                        value={plz}
                        onChange={e => { onPlzChange(e.target.value); setTouched(false) }}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="z.B. 70173"
                    />
                    <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={handleSearch}
                        disabled={loading || plz.length !== 5}
                    >
                        {loading ? 'Suche…' : 'Prüfen'}
                    </button>
                </div>
                {invalid && <p className="form-error">Bitte gib eine gültige 5-stellige PLZ ein.</p>}
                {!loading && plzStatus === 'found' && (
                    <p className="plz-status plz-status--found">
                        <CheckCircle2 size={14} strokeWidth={2.5} />
                        PLZ gefunden – bitte wähle deine Lokalausgabe.
                    </p>
                )}
                {!loading && plzStatus === 'not-found' && (
                    <p className="plz-status plz-status--not-found">
                        <XCircle size={14} strokeWidth={2.5} />
                        Diese PLZ wird leider nicht beliefert.
                    </p>
                )}
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="city">Ort</label>
                <input
                    id="city"
                    type="text"
                    className="input"
                    value={city}
                    onChange={e => onCityChange(e.target.value)}
                    placeholder="z.B. Stuttgart"
                />
            </div>
        </div>
    )
}
