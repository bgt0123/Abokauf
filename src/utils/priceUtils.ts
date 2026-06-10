import type { KonfiguratorState, Zahlungsintervall } from '../types'

export function calcDistanceSurcharge(distanceKm: number | null, zustellungsart: KonfiguratorState['zustellungsart']): number {
    if (zustellungsart !== 'Delivery man' || distanceKm === null) return 0
    const over = Math.max(0, distanceKm - 20)
    return Math.min(Math.round(over * 0.01 * 100) / 100, 5.00)
}

export function calcMonthlyPrice(k: KonfiguratorState, distanceKm: number | null = null): number {
    if (!k.aboTyp) return 0
    if (k.aboTyp === 'E-paper') return 12.90
    if (k.aboTyp === 'Website') return 7.90
    const base = k.belieferungsintervall === 'Weekend' ? 19.90 : 34.90
    const postSurcharge = k.zustellungsart === 'Post' ? 3.00 : 0
    return base + postSurcharge + calcDistanceSurcharge(distanceKm, k.zustellungsart)
}

export function calcYearlyPrice(monthly: number): number {
    return Math.round(monthly * 12 * 0.9 * 100) / 100
}

export function calcFinalPrice(monthly: number, interval: Zahlungsintervall | null): number {
    return interval === 'Annual' ? calcYearlyPrice(monthly) : monthly
}

export function formatPrice(n: number): string {
    return n.toFixed(2).replace('.', ',')
}
