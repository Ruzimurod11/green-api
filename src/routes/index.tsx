// src/routes/index.tsx
import { ChatWindow } from "@/components/chat/chat-window" // Окно чата справа
import { Sidebar } from "@/components/chat/sidebar"
import { useGreenApiPolling } from "@/hooks/use-green-api-polling" // Ваш хук для поллинга
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
    // Включаем фоновый опрос входящих сообщений
    useGreenApiPolling()

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#111923]">
            {/* 1. Левая панель (Sidebar) — фиксированная ширина, во всю высоту */}
            <aside className="w-80 md:w-96 shrink-0 h-full border-r border-gray-800">
                <Sidebar />
            </aside>

            {/* 2. Правая часть (Chat Window) — занимает всё оставшееся пространство */}
            <main className="flex-1 h-full flex flex-col">
                <ChatWindow />
            </main>
        </div>
    )
}
