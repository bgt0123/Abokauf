import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import './ZahlungStep.css'
import {
    setField,
    selectKonfigurator,
} from '../../../../features/konfigurator/konfiguratorSlice'
import type { KonfiguratorState } from '../../../../types'
import { PaymentForm } from './PaymentForm'

function set<K extends keyof KonfiguratorState>(
    dispatch: ReturnType<typeof useAppDispatch>,
    field: K,
    value: KonfiguratorState[K],
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(setField({ field, value } as any))
}

export function ZahlungStep() {
    const dispatch = useAppDispatch()
    const konfig   = useAppSelector(selectKonfigurator)

    return (
        <div className="konfig-step">
            <h2 className="konfig-step__title">Vertragsdetails</h2>

            <div className="konfig-section">
                <h3 className="konfig-section__title">Startdatum</h3>
                <div className="form-group">
                    <label className="form-label" htmlFor="startDatum">Ab wann soll das Abo beginnen? *</label>
                    <input
                        id="startDatum"
                        type="date"
                        className="input"
                        style={{ maxWidth: 220 }}
                        value={konfig.startDatum}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={e => set(dispatch, 'startDatum', e.target.value)}
                    />
                </div>
            </div>

            <PaymentForm />

            <div className="konfig-section">
                <h3 className="konfig-section__title">Rechnungsadresse</h3>
                <label className="dataprivacy-check">
                    <input
                        type="checkbox"
                        checked={konfig.rechnungsAbweichend}
                        onChange={e => set(dispatch, 'rechnungsAbweichend', e.target.checked)}
                    />
                    <span>Rechnungsadresse weicht von der Lieferadresse ab</span>
                </label>

                {konfig.rechnungsAbweichend && (
                    <div className="billing-address-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="rechnungsStreet">Straße & Hausnummer</label>
                            <input
                                id="rechnungsStreet"
                                type="text"
                                className="input"
                                value={konfig.rechnungsStreet}
                                onChange={e => set(dispatch, 'rechnungsStreet', e.target.value)}
                                placeholder="z.B. Musterstraße 12"
                            />
                        </div>
                        <div className="billing-address-form__row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="rechnungsPlz">PLZ</label>
                                <input
                                    id="rechnungsPlz"
                                    type="text"
                                    className="input"
                                    maxLength={5}
                                    value={konfig.rechnungsPlz}
                                    onChange={e => set(dispatch, 'rechnungsPlz', e.target.value)}
                                    placeholder="z.B. 70173"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="rechnungsCity">Ort</label>
                                <input
                                    id="rechnungsCity"
                                    type="text"
                                    className="input"
                                    value={konfig.rechnungsCity}
                                    onChange={e => set(dispatch, 'rechnungsCity', e.target.value)}
                                    placeholder="z.B. Stuttgart"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
