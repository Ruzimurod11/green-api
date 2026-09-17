import { greenApiService } from "@/lib/api/green-api"
import { useState } from "react"

export function GreenApiApp() {
    // Kredensiallar
    const [idInstance, setIdInstance] = useState("")
    const [apiTokenInstance, setApiTokenInstance] = useState("")

    // SendMessage formasi
    const [chatId, setChatId] = useState("")
    const [message, setMessage] = useState("")
    const [sendResult, setSendResult] = useState<string | null>(null)

    // ReceiveNotification oynasi
    const [notificationLog, setNotificationLog] = useState<string>("")
    const [loading, setLoading] = useState(false)

    // 1. SendMessage chaqiruv
    const handleSendMessage = async () => {
        if (!idInstance || !apiTokenInstance || !chatId || !message) {
            alert("Barcha maydonlarni to'ldiring!")
            return
        }

        try {
            const data = await greenApiService.sendMessage({
                idInstance,
                apiTokenInstance,
                chatId,
                message,
            })
            setSendResult(JSON.stringify(data, null, 2))
        } catch (error: any) {
            setSendResult(
                JSON.stringify(error.response?.data || error.message, null, 2),
            )
        }
    }

    // 2. HTTP API - Receive & Delete Notification (7-talab)
    const handleReceiveNotification = async () => {
        if (!idInstance || !apiTokenInstance) {
            alert("idInstance va apiTokenInstance ni kiriting!")
            return
        }

        setLoading(true)
        try {
            // Bildirishnomani olamiz
            const data = await greenApiService.receiveNotification({
                idInstance,
                apiTokenInstance,
            })

            if (!data) {
                setNotificationLog("Hozircha yangi bildirishnoma yo'q.")
                return
            }

            setNotificationLog(JSON.stringify(data, null, 2))

            // HTTP API texnologiyasi bo'yicha olgandan so'ng navbatdan o'chirish shart
            if (data.receiptId) {
                await greenApiService.deleteNotification({
                    idInstance,
                    apiTokenInstance,
                    receiptId: data.receiptId,
                })
            }
        } catch (error: any) {
            setNotificationLog(
                JSON.stringify(error.response?.data || error.message, null, 2),
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "20px auto",
                fontFamily: "sans-serif",
                padding: "20px",
            }}
        >
            <h2>GREEN-API Minimal Interface</h2>

            {/* Kredensiallar */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="idInstance"
                    value={idInstance}
                    onChange={(e) => setIdInstance(e.target.value)}
                    style={{ flex: 1, padding: "8px" }}
                />
                <input
                    type="text"
                    placeholder="apiTokenInstance"
                    value={apiTokenInstance}
                    onChange={(e) => setApiTokenInstance(e.target.value)}
                    style={{ flex: 2, padding: "8px" }}
                />
            </div>

            <hr />

            {/* SendMessage Bo'limi */}
            <div style={{ marginTop: "20px" }}>
                <h3>1. Send Message</h3>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Chat ID (masalan: 998901234567)"
                        value={chatId}
                        onChange={(e) => setChatId(e.target.value)}
                        style={{ padding: "8px" }}
                    />
                    <textarea
                        placeholder="Xabar matni..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        style={{ padding: "8px" }}
                    />
                    <button
                        onClick={handleSendMessage}
                        style={{ padding: "10px", cursor: "pointer" }}
                    >
                        SendMessage
                    </button>
                </div>
                {sendResult && (
                    <pre
                        style={{
                            background: "#f4f4f4",
                            padding: "10px",
                            marginTop: "10px",
                        }}
                    >
                        {sendResult}
                    </pre>
                )}
            </div>

            <hr style={{ margin: "20px 0" }} />

            {/* ReceiveNotification Bo'limi */}
            <div>
                <h3>2. Receive Notification (HTTP API)</h3>
                <button
                    onClick={handleReceiveNotification}
                    disabled={loading}
                    style={{ padding: "10px", cursor: "pointer" }}
                >
                    {loading ? "Kutilmoqda..." : "Get Notification"}
                </button>

                {notificationLog && (
                    <pre
                        style={{
                            background: "#f4f4f4",
                            padding: "10px",
                            marginTop: "10px",
                        }}
                    >
                        {notificationLog}
                    </pre>
                )}
            </div>
        </div>
    )
}
