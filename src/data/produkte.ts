import type { LucideIcon } from 'lucide-react'
import { Newspaper, Tablet, Globe } from 'lucide-react'
import type { AboTyp } from '../types'

export const ABO_TYPES: AboTyp[] = ['Printed', 'E-paper', 'Website']

export const ABO_URL: Record<AboTyp, string> = {
    Printed:   '/produkt/printed',
    'E-paper': '/produkt/e-paper',
    Website:   '/produkt/website',
}

export interface AboMeta {
    Icon:        LucideIcon
    iconColor:   string
    iconBg:      string
    heroBg:      string
    badge:       string | null
    title:       string
    priceFrom:   string
    tagline:     string
    description: string
}

export const ABO_META: Record<AboTyp, AboMeta> = {
    Printed: {
        Icon:        Newspaper,
        iconColor:   '#1d4ed8',
        iconBg:      '#eff6ff',
        heroBg:      'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        badge:       'Beliebteste Wahl',
        title:       'Gedruckte Zeitung',
        priceFrom:   '19,90',
        tagline:     'Frisch gedruckt. Direkt bei Ihnen.',
        description: 'Genießen Sie Ihre Tageszeitung ganz ohne Bildschirm — jeden Morgen pünktlich in Ihrem Briefkasten, bevor der Tag beginnt.',
    },
    'E-paper': {
        Icon:        Tablet,
        iconColor:   '#0891b2',
        iconBg:      '#ecfeff',
        heroBg:      'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
        badge:       null,
        title:       'E-Paper',
        priceFrom:   '12,90',
        tagline:     'Die komplette Zeitung. Überall dabei.',
        description: 'Das E-Paper ist die 1:1-Digitalausgabe Ihrer Tageszeitung — identisches Layout, gewohnter Lesefluss, aber auf jedem Gerät verfügbar. Ab 5 Uhr morgens abrufbar, auch wenn kein Internet zur Verfügung steht.',
    },
    Website: {
        Icon:        Globe,
        iconColor:   '#16a34a',
        iconBg:      '#f0fdf4',
        heroBg:      'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        badge:       null,
        title:       'Website-Zugang',
        priceFrom:   '7,90',
        tagline:     'Immer informiert. Ohne Bezahlschranke.',
        description: 'Mit dem Website-Zugang lesen Sie alle Artikel auf unserer Nachrichtenplattform ohne Einschränkung. Dazu kommen exklusive Online-Inhalte, Echtzeit-Meldungen und ein täglicher Newsletter direkt in Ihr Postfach.',
    },
}
