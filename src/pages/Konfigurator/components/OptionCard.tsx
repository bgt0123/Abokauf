import type { ReactNode } from 'react'

interface Props {
    label: string
    description?: string
    icon?: ReactNode
    selected: boolean
    onClick: () => void
    disabled?: boolean
}

export function OptionCard({ label, description, icon, selected, onClick, disabled }: Props) {
    return (
        <button
            type="button"
            className={`option-card${selected ? ' option-card--selected' : ''}${disabled ? ' option-card--disabled' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="option-card__icon">{icon}</span>}
            <span className="option-card__label">{label}</span>
            {description && <span className="option-card__desc">{description}</span>}
        </button>
    )
}
