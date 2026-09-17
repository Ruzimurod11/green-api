import { LS } from "@/lib/constants/localstorage"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Sidebar yig'ilgan (rail) yoki yoyilgan holati. localStorage'da saqlanadi —
// reload'dan keyin foydalanuvchi tanlovi qoladi.
interface SidebarState {
    collapsed: boolean
    toggle: () => void
    setCollapsed: (collapsed: boolean) => void
}

export const useSidebarPersist = create<SidebarState>()(
    persist(
        (set) => ({
            collapsed: false,
            toggle: () => set((s) => ({ collapsed: !s.collapsed })),
            setCollapsed: (collapsed) => set({ collapsed }),
        }),
        { name: LS.SIDEBAR },
    ),
)
