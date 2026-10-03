// store/use-chat-store.ts
import { create } from "zustand"

export interface Message {
    id: string
    text: string
    sender: "me" | "them"
    timestamp: number
}

interface ChatStore {
    activeChatId: string | null
    chats: Record<string, Message[]> // chatId -> messages[]
    setActiveChatId: (chatId: string) => void
    addMessage: (chatId: string, message: Message) => void
}

export const useChatStore = create<ChatStore>((set) => ({
    activeChatId: null,
    chats: {},

    setActiveChatId: (chatId) => set({ activeChatId: chatId }),

    addMessage: (chatId, message) =>
        set((state) => {
            const currentMessages = state.chats[chatId] || []
            // Избегаем дубликатов сообщений
            if (currentMessages.some((m) => m.id === message.id)) {
                return state
            }
            return {
                chats: {
                    ...state.chats,
                    [chatId]: [...currentMessages, message],
                },
            }
        }),
}))
