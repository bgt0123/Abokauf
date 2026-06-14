import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
    setField,
    selectKonfigurator, selectDistanceKm,
} from '../../../features/konfigurator/konfiguratorSlice'
import type { KonfiguratorState } from '../../../types'
import { calcDistanceSurcharge, formatPrice } from '../../../utils/priceUtils'
import { OptionCard } from './OptionCard'

function set<K extends keyof KonfiguratorState>(
    dispatch: ReturnType<typeof useAppDispatch>,
    field: K,
    value: KonfiguratorState[K],
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(setField({ field, value } as any))
}

export function ZustellungStep() {
    const dispatch   = useAppDispatch()
    const konfig     = useAppSelector(selectKonfigurator)
    const distanceKm = useAppSelector(selectDistanceKm)

    return (
        <div className="konfig-step">
            <h2 className="konfig-step__title">Wie soll geliefert werden?</h2>

            <div className="konfig-section">
                <h3 className="konfig-section__title">Zustellungsart</h3>
                <div className="option-cards">
                    <OptionCard
                        label="Austräger"
                        description="Wird morgens direkt an deine Tür gebracht"
                        selected={konfig.zustellungsart === 'Delivery man'}
                        onClick={() => set(dispatch, 'zustellungsart', 'Delivery man')}
                    />
                    <OptionCard
                        label="Post"
                        description="Zustellung per Deutsche Post (+3,00 €/Monat)"
                        selected={konfig.zustellungsart === 'Post'}
                        onClick={() => set(dispatch, 'zustellungsart', 'Post')}
                    />
                </div>
            </div>

            <div className="konfig-section">
                <h3 className="konfig-section__title">Belieferungsintervall</h3>
                <div className="option-cards">
                    <OptionCard
                        label="Täglich"
                        description="Montag bis Samstag"
                        selected={konfig.belieferungsintervall === 'Daily'}
                        onClick={() => set(dispatch, 'belieferungsintervall', 'Daily')}
                    />
                    <OptionCard
                        label="Wochenende"
                        description="Freitag und Samstag"
                        selected={konfig.belieferungsintervall === 'Weekend'}
                        onClick={() => set(dispatch, 'belieferungsintervall', 'Weekend')}
                    />
                </div>
            </div>

            {konfig.zustellungsart === 'Delivery man' && (
                <div className="konfig-section">
                    <div className="form-group">
                        <label className="form-label" htmlFor="hinweis">
                            Hinweis für den Austräger{' '}
                            <span className="konfig-optional">(optional)</span>
                        </label>
                        <textarea
                            id="hinweis"
                            className="input konfig-textarea"
                            rows={3}
                            maxLength={200}
                            value={konfig.austraegerHinweis}
                            onChange={e => set(dispatch, 'austraegerHinweis', e.target.value)}
                            placeholder="z.B. Bitte in den Briefkasten links einwerfen"
                        />
                    </div>
                </div>
            )}

            {distanceKm !== null && konfig.zustellungsart === 'Delivery man' && distanceKm > 20 && (
                <p className="form-hint">
                    Entfernungszuschlag für {Math.round(distanceKm)} km:{' '}
                    +{formatPrice(calcDistanceSurcharge(distanceKm, 'Delivery man'))} €/Monat
                </p>
            )}
        </div>
    )
}
