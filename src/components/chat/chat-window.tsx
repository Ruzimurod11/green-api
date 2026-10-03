// components/chat/chat-window.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatStore } from "@/hooks/store/use-chat-store"
import { greenApiService } from "@/lib/api/green-api"
import { useAuthStore } from "@/routes/_auth/-hooks/use-auth-persist"
import { useState } from "react"

export function ChatWindow() {
    const { activeChatId, chats, addMessage } = useChatStore()
    const { idInstance, apiTokenInstance } = useAuthStore()
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)

    if (!activeChatId) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center bg-[#111923] p-8 text-center text-gray-400">
                <h2 className="text-2xl font-bold text-white">
                    GREEN-API Chat Workspace
                </h2>
                <p className="mt-2 text-sm">
                    Выберите чат из списка слева или создайте новый, чтобы
                    начать общение.
                </p>
            </div>
        )
    }

    const messages = chats[activeChatId] || []
    const phoneNumber = activeChatId.replace("@c.us", "")

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim() || !idInstance || !apiTokenInstance) return

        const messageText = text
        setText("")
        setLoading(true)

        try {
            const res = await greenApiService.sendMessage({
                idInstance,
                apiTokenInstance,
                chatId: activeChatId,
                message: messageText,
            })

            // Добавляем свое отправленное сообщение в стор
            addMessage(activeChatId, {
                id: res.idMessage || Date.now().toString(),
                text: messageText,
                sender: "me",
                timestamp: Date.now(),
            })
        } catch (error) {
            console.error("Failed to send message:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col h-full bg-[#0b1015]">
            {/* Шапка чата */}
            <div className="border-b border-gray-800 bg-[#1a232e] px-6 py-4">
                <h3 className="font-semibold text-white">+{phoneNumber}</h3>
            </div>

            {/* Список сообщений */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ?
                    <p className="text-center text-xs text-gray-500">
                        История сообщений пуста
                    </p>
                :   messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                                    msg.sender === "me" ?
                                        "bg-[#4be06e] text-black rounded-tr-none"
                                    :   "bg-[#1a232e] text-white rounded-tl-none border border-gray-800"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Ввод сообщения */}
            <form
                onSubmit={handleSend}
                className="flex gap-2 border-t border-gray-800 bg-[#1a232e] p-4"
            >
                <Input
                    type="text"
                    placeholder="Напишите сообщение..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="bg-[#111923] border-gray-700 text-white placeholder:text-gray-500"
                />
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#4be06e] text-black hover:bg-[#3cd05e]"
                >
                    Отправить
                </Button>
            </form>
        </div>
    )
}
