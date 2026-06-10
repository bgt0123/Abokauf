import { Check } from 'lucide-react'

interface Props {
    labels: string[]
    currentIndex: number
}

export function StepIndicator({ labels, currentIndex }: Props) {
    return (
        <div className="step-indicator">
            {labels.map((label, i) => {
                const isDone   = i < currentIndex
                const isActive = i === currentIndex
                return (
                    <div key={label} className="step-indicator__step">
                        <div className="step-indicator__top">
                            <div className={`step-indicator__dot${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}>
                                {isDone ? <Check size={12} strokeWidth={3} /> : i + 1}
                            </div>
                            {i < labels.length - 1 && (
                                <div className={`step-indicator__line${isDone ? ' done' : ''}`} />
                            )}
                        </div>
                        <span className={`step-indicator__label${isActive ? ' active' : ''}`}>
                            {label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
