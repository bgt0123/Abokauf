import { useState, useEffect } from 'react'
import './RegionStep.css'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
    setField, fetchLocalVersionsThunk, fetchDistanceThunk,
    selectKonfigurator, selectLocalVersions, selectPlzLoading,
} from '../../../../features/konfigurator/konfiguratorSlice'
import { selectCurrentUser } from '../../../../features/auth/authSlice'
import type { KonfiguratorState } from '../../../../types'
import type { PlzStatus } from './DeliveryAddressForm'
import { DeliveryAddressForm } from './DeliveryAddressForm'
import { LocalPaperSelect }    from './LocalPaperSelect'

function set<K extends keyof KonfiguratorState>(
    dispatch: ReturnType<typeof useAppDispatch>,
    field: K,
    value: KonfiguratorState[K],
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(setField({ field, value } as any))
}

export function RegionStep() {
    const dispatch      = useAppDispatch()
    const currentUser   = useAppSelector(selectCurrentUser)
    const konfig        = useAppSelector(selectKonfigurator)
    const localVersions = useAppSelector(selectLocalVersions)
    const plzLoading    = useAppSelector(selectPlzLoading)

    const [useAltPlz, setUseAltPlz]         = useState(false)
    const [plzSearchDone, setPlzSearchDone] = useState(false)

    useEffect(() => {
        if (useAltPlz || !currentUser) return
        const { street1, plz, city } = currentUser.deliveryAddress
        set(dispatch, 'lieferStreet', street1)
        set(dispatch, 'lieferPlz',    plz)
        set(dispatch, 'lieferCity',   city)
        if (plz.length === 5) {
            dispatch(fetchLocalVersionsThunk(plz))
            dispatch(fetchDistanceThunk(plz))
            setPlzSearchDone(true)
        }
    }, [useAltPlz]) // eslint-disable-line react-hooks/exhaustive-deps

    const plzStatus: PlzStatus =
        plzSearchDone && !plzLoading
            ? Object.keys(localVersions).length > 0 ? 'found' : 'not-found'
            : 'idle'

    const addr = currentUser?.deliveryAddress
    const addrDisplay = konfig.aboTyp === 'Printed'
        ? `${addr?.street1}, ${addr?.plz} ${addr?.city}`
        : `${addr?.plz} ${addr?.city}`

    function handleUseAltPlzChange(checked: boolean) {
        setUseAltPlz(checked)
        setPlzSearchDone(false)
        set(dispatch, 'lokalausgabeId', null)
    }

    function handleLieferPlzChange(plz: string) {
        set(dispatch, 'lieferPlz', plz)
        setPlzSearchDone(false)
    }

    function handlePlzSearch(plz: string) {
        dispatch(fetchLocalVersionsThunk(plz))
        dispatch(fetchDistanceThunk(plz))
        set(dispatch, 'lokalausgabeId', null)
        setPlzSearchDone(true)
    }

    return (
        <div className="konfig-step">
            <h2 className="konfig-step__title">In welcher Region wohnst du?</h2>

            <div className="user-address-box">
                <span className="user-address-box__label">Deine Lieferadresse</span>
                <span className="user-address-box__value">{addrDisplay}</span>
            </div>

            <label className="dataprivacy-check konfig-check--spaced">
                <input
                    type="checkbox"
                    checked={useAltPlz}
                    onChange={e => handleUseAltPlzChange(e.target.checked)}
                />
                <span>Andere Lieferadresse verwenden</span>
            </label>

            {useAltPlz && (
                <DeliveryAddressForm
                    street={konfig.lieferStreet}
                    plz={konfig.lieferPlz}
                    city={konfig.lieferCity}
                    loading={plzLoading}
                    plzStatus={plzStatus}
                    showStreet={konfig.aboTyp === 'Printed'}
                    onStreetChange={v => set(dispatch, 'lieferStreet', v)}
                    onPlzChange={handleLieferPlzChange}
                    onCityChange={v => set(dispatch, 'lieferCity', v)}
                    onSearch={handlePlzSearch}
                />
            )}

            {plzStatus === 'found' && (
                <LocalPaperSelect
                    versions={localVersions}
                    selectedId={konfig.lokalausgabeId}
                    onSelect={id => set(dispatch, 'lokalausgabeId', id)}
                />
            )}
        </div>
    )
}
