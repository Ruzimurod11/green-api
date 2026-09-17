import axios from "axios"

const GREEN_API_BASE_URL = "https://api.green-api.com"

export interface SendMessageParams {
    idInstance: string
    apiTokenInstance: string
    chatId: string
    message: string
}

export interface ReceiveNotificationParams {
    idInstance: string
    apiTokenInstance: string
}

export interface DeleteNotificationParams extends ReceiveNotificationParams {
    receiptId: number
}

export const greenApiService = {
    // 6-talab: SendMessage metodi
    async sendMessage({
        idInstance,
        apiTokenInstance,
        chatId,
        message,
    }: SendMessageParams) {
        const formattedChatId = chatId.includes("@") ? chatId : `${chatId}@c.us`

        const response = await axios.post(
            `${GREEN_API_BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
            {
                chatId: formattedChatId,
                message,
            },
        )
        return response.data
    },

    // 7-talab: HTTP API orqali bildirishnomani olish (ReceiveNotification)
    async receiveNotification({
        idInstance,
        apiTokenInstance,
    }: ReceiveNotificationParams) {
        const response = await axios.get(
            `${GREEN_API_BASE_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
        )
        return response.data
    },

    // 7-talab: Bildirishnomani navbatdan o'chirish (DeleteNotification)
    async deleteNotification({
        idInstance,
        apiTokenInstance,
        receiptId,
    }: DeleteNotificationParams) {
        const response = await axios.delete(
            `${GREEN_API_BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
        )
        return response.data
    },
}
