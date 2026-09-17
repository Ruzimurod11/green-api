import { ThemeContext } from "@/providers/theme-provider"
import { use } from "react"

export function useTheme() {
    const context = use(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
