const GREEN_API_BASE_URL = "https://api.green-api.com"

export const API = {
    GREEN_API: {
        GET_STATE: (idInstance: string, apiTokenInstance: string) =>
            `${GREEN_API_BASE_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,

        SEND_MESSAGE: (idInstance: string, apiTokenInstance: string) =>
            `${GREEN_API_BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,

        RECEIVE_NOTIFICATION: (idInstance: string, apiTokenInstance: string) =>
            `${GREEN_API_BASE_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,

        DELETE_NOTIFICATION: (
            idInstance: string,
            apiTokenInstance: string,
            receiptId: number,
        ) =>
            `${GREEN_API_BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
    },
} as const
