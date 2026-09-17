// src/routes/index.tsx
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "./_auth/-hooks/use-auth-persist"

export const Route = createFileRoute("/")({
    beforeLoad: () => {
        // 1. Zustand state'ni olamiz
        const { idInstance, apiTokenInstance } = useAuthStore.getState()

        // 2. Zustand hali hydro bo'lmagan bo'lsa, localStorage'dan to'g'ri kalit orqali zaxira tekshiruvi:
        let hasId = idInstance
        let hasToken = apiTokenInstance

        if (!hasId || !hasToken) {
            try {
                const storage = localStorage.getItem("green-api-auth")
                if (storage) {
                    const parsed = JSON.parse(storage)
                    hasId = parsed?.state?.idInstance
                    hasToken = parsed?.state?.apiTokenInstance
                }
            } catch (e) {
                console.error("Storage parse error", e)
            }
        }

        // Agar ikkalasidan ham topilmasa, redirect qilamiz
        if (!hasId || !hasToken) {
            throw redirect({
                to: "/sign-in",
            })
        }
    },
    component: Home,
})

function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">
                GREEN-API Chat Workspace
            </h1>
            <p className="text-muted-foreground text-sm">
                Xush kelibsiz! Chatlarni boshlash uchun chap menyudan
                foydalaning.
            </p>
        </div>
    )
}
