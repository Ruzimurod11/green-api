// components/chat/sidebar.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatStore } from "@/hooks/store/use-chat-store"
import { useState } from "react"

export function Sidebar() {
    const [phone, setPhone] = useState("")
    const { setActiveChatId, chats } = useChatStore()

    const handleCreateChat = (e: React.FormEvent) => {
        e.preventDefault()

        // Очищаем номер от плюсов, пробелов и скобок
        const cleanPhone = phone.replace(/\D/g, "")
        if (!cleanPhone) return

        // Форматируем chatId под требования GREEN-API
        const chatId = `${cleanPhone}@c.us`

        // Устанавливаем активный чат
        setActiveChatId(chatId)
        setPhone("")
    }

    return (
        <div className="flex h-full flex-col bg-[#1a232e] p-4 text-white">
            <h2 className="mb-4 text-lg font-bold">Чаты</h2>

            {/* Форма создания нового чата */}
            <form onSubmit={handleCreateChat} className="flex gap-2">
                <Input
                    type="text"
                    placeholder="79001112233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-gray-700 bg-[#111923] text-white"
                />
                <Button
                    type="submit"
                    className="bg-[#4be06e] text-black hover:bg-[#3cd05e]"
                >
                    Создать
                </Button>
            </form>

            {/* Список активных чатов */}
            <div className="mt-4 flex flex-col gap-2 overflow-y-auto">
                {Object.keys(chats).map((chatId) => (
                    <button
                        key={chatId}
                        onClick={() => setActiveChatId(chatId)}
                        className="rounded-lg bg-[#111923] p-3 text-left text-sm text-white hover:bg-gray-800 transition-colors"
                    >
                        +{chatId.replace("@c.us", "")}
                    </button>
                ))}
            </div>
        </div>
    )
}
