import { useState, useEffect } from 'react'

export function useTheme() {
    const [dark, setDark] = useState(
        () => document.documentElement.getAttribute('data-theme') === 'dark'
    )

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
        document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }, [dark])

    return { dark, toggle: () => setDark(d => !d) }
}