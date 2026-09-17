import { createContext, type ReactNode, useEffect, useState } from "react"

const THEME_KEY = "theme"

export type Theme = "dark" | "light"

interface ThemeContextType {
    theme: Theme
    isDark: boolean
    toggle: () => void
    setTheme: (theme: Theme) => void
}

// Context
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined,
)

// Provider Component
//
// Butun ilova uchun yagona tema manbasi: landing, auth va dashboard endi bitta
// holatdan o'qiydi, shuning uchun birida almashtirilsa hammasida darhol aks
// etadi. `dark` klassi `<html>`ga qo'yiladi (Radix portallar — popover, sheet —
// ham temaga bo'ysunadi) va tanlov `genfin-theme` kaliti ostida saqlanadi.
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(THEME_KEY) as Theme) || "dark",
    )

    useEffect(() => {
        localStorage.setItem(THEME_KEY, theme)
        document.documentElement.classList.toggle("dark", theme === "dark")
    }, [theme])

    const toggle = () =>
        setTheme((prev) => (prev === "dark" ? "light" : "dark"))

    return (
        <ThemeContext
            value={{ theme, isDark: theme === "dark", toggle, setTheme }}
        >
            {children}
        </ThemeContext>
    )
}
