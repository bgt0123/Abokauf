import type { LocalVersionsResult, LocalPaperVersion } from '../../../../types'
import { OptionCard } from '../OptionCard'

interface Props {
    versions: LocalVersionsResult
    selectedId: number | null
    onSelect: (id: number) => void
}

function toArray(versions: LocalVersionsResult): LocalPaperVersion[] {
    if (!versions || typeof versions !== 'object') return []
    return Object.values(versions) as LocalPaperVersion[]
}

export function LocalPaperSelect({ versions, selectedId, onSelect }: Props) {
    const items = toArray(versions)
    if (items.length === 0) return null

    return (
        <div className="konfig-section">
            <h3 className="konfig-section__title">Lokalausgabe auswählen</h3>
            <div className="option-cards">
                {items.map(v => (
                    <OptionCard
                        key={v.id}
                        label={v.name}
                        selected={selectedId === v.id}
                        onClick={() => onSelect(v.id)}
                    />
                ))}
            </div>
        </div>
    )
}
