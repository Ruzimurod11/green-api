// hooks/use-green-api-polling.ts
import { greenApiService } from "@/lib/api/green-api"
import { useAuthStore } from "@/routes/_auth/-hooks/use-auth-persist"
import { useEffect } from "react"
import { useChatStore } from "./store/use-chat-store"

export function useGreenApiPolling() {
    const { idInstance, apiTokenInstance } = useAuthStore()
    const { addMessage } = useChatStore()

    useEffect(() => {
        if (!idInstance || !apiTokenInstance) return

        let isMounted = true

        const pollNotifications = async () => {
            try {
                const data = await greenApiService.receiveNotification({
                    idInstance,
                    apiTokenInstance,
                })

                if (data?.receiptId) {
                    const webhookType = data.body?.typeWebhook

                    // Проверяем, что это входящее текстовое сообщение
                    if (webhookType === "incomingMessageReceived") {
                        const messageData = data.body?.messageData
                        if (messageData?.typeMessage === "textMessage") {
                            const senderId = data.body?.senderData?.chatId // "79xxxxxxxxx@c.us"
                            const text =
                                messageData?.textMessageData?.textMessage
                            const messageId = data.body?.idMessage

                            if (senderId && text) {
                                addMessage(senderId, {
                                    id: messageId,
                                    text,
                                    sender: "them",
                                    timestamp:
                                        data.body?.timestamp || Date.now(),
                                })
                            }
                        }
                    }

                    // Обязательно удаляем обработанное уведомление
                    await greenApiService.deleteNotification({
                        idInstance,
                        apiTokenInstance,
                        receiptId: data.receiptId,
                    })
                }
            } catch (error) {
                console.error("Polling error:", error)
            } finally {
                // Если компонент еще смонтирован, повторяем запрос через 2 секунды
                if (isMounted) {
                    setTimeout(pollNotifications, 2000)
                }
            }
        }

        pollNotifications()

        return () => {
            isMounted = false
        }
    }, [idInstance, apiTokenInstance, addMessage])
}
