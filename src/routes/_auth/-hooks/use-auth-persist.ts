import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
    idInstance: string
    apiTokenInstance: string
    activeChatPhone: string | null
    // Metodlar
    setCredentials: (idInstance: string, apiTokenInstance: string) => void
    setActiveChatPhone: (phone: string | null) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            idInstance: "",
            apiTokenInstance: "",
            activeChatPhone: null,

            setCredentials: (idInstance, apiTokenInstance) =>
                set({
                    idInstance: idInstance.trim(),
                    apiTokenInstance: apiTokenInstance.trim(),
                }),

            setActiveChatPhone: (phone) =>
                set({
                    activeChatPhone: phone ? phone.replace(/\D/g, "") : null,
                }),

            logout: () =>
                set({
                    idInstance: "",
                    apiTokenInstance: "",
                    activeChatPhone: null,
                }),
        }),
        {
            name: "green-api-auth", // localStorage dagi kalit nomi
        },
    ),
)
