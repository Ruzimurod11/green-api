import { QueryClient } from "@tanstack/react-query"
import axios, { AxiosError, type AxiosAdapter, type AxiosResponse } from "axios"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { API } from "../constants/api-endpoints"

// In-memory token store, hoisted so the vi.mock factory can close over it.
const { store } = vi.hoisted(() => ({
    store: {} as { access?: string; refresh?: string },
}))

vi.mock("../utils/cookie-service", () => ({
    CookieService: {
        getAccessToken: () => store.access,
        setAccessToken: vi.fn((t: string) => {
            store.access = t
        }),
        removeAccessToken: vi.fn(() => {
            store.access = undefined
        }),
        getRefreshToken: () => store.refresh,
        setRefreshToken: vi.fn((t: string) => {
            store.refresh = t
        }),
        removeRefreshToken: vi.fn(() => {
            store.refresh = undefined
        }),
        getOrCreateDeviceId: () => "TEST_DEVICE_ID",
    },
}))

import { CookieService } from "../utils/cookie-service"
import axiosInstance, { setupAxiosInterceptors } from "./axios-instance"

// Attach the real request/response interceptors to the singleton instance.
setupAxiosInterceptors(new QueryClient())

// Stub the transport: the protected resource returns 401 unless the request
// carries the *refreshed* bearer token. Token refresh itself goes through the
// global `axios.post` (a different code path), which we spy on per-test.
const serverCalls: { url?: string; auth?: unknown }[] = []
const adapter: AxiosAdapter = async (config) => {
    const auth = config.headers?.Authorization
    serverCalls.push({ url: config.url, auth })
    const ok = auth === "Bearer NEW_ACCESS"
    const response: AxiosResponse = {
        data: ok ? { ok: true } : { detail: "token expired" },
        status: ok ? 200 : 401,
        statusText: ok ? "OK" : "Unauthorized",
        headers: {},
        config,
    }
    if (ok) return response
    // A custom adapter must honour validateStatus itself — axios only calls
    // settle() inside its built-in xhr/http adapters. So reject non-2xx the way
    // axios would, carrying the response so the interceptor sees status 401.
    return Promise.reject(
        new AxiosError("Unauthorized", "401", config, undefined, response),
    )
}
axiosInstance.defaults.adapter = adapter

const refreshOk = {
    data: { access: "NEW_ACCESS" },
} as unknown as AxiosResponse
const postSpy = vi.spyOn(axios, "post")

beforeEach(() => {
    store.access = "OLD_ACCESS"
    store.refresh = "REFRESH_TOKEN"
    serverCalls.length = 0
    vi.clearAllMocks()
})

describe("response interceptor — 401 refresh flow", () => {
    it("refreshes the token and replays the original request", async () => {
        postSpy.mockResolvedValue(refreshOk)

        const res = await axiosInstance.get("/protected")

        // request succeeded after the silent refresh + retry
        expect(res.data).toEqual({ ok: true })
        // refresh endpoint was called once with the stored refresh token
        expect(postSpy).toHaveBeenCalledTimes(1)
        expect(postSpy.mock.calls[0]?.[0]).toContain(
            API.USER.REFRESH_TOKEN.INDEX,
        )
        expect(postSpy.mock.calls[0]?.[1]).toEqual({
            refresh: "REFRESH_TOKEN",
        })
        // the new access token was persisted
        expect(CookieService.setAccessToken).toHaveBeenCalledWith("NEW_ACCESS")
        // transport saw the old token first, then the refreshed token on retry
        expect(serverCalls.map((c) => c.auth)).toEqual([
            "Bearer OLD_ACCESS",
            "Bearer NEW_ACCESS",
        ])
    })

    it("does NOT attempt a refresh for auth endpoints (e.g. login 401)", async () => {
        await expect(
            axiosInstance.post(API.USER.LOGIN.INDEX, { phone: "x" }),
        ).rejects.toMatchObject({ response: { status: 401 } })

        expect(postSpy).not.toHaveBeenCalled()
        expect(CookieService.setAccessToken).not.toHaveBeenCalled()
    })

    it("clears tokens and rejects when the refresh itself fails", async () => {
        postSpy.mockRejectedValue(new Error("refresh expired"))

        await expect(axiosInstance.get("/protected")).rejects.toThrow(
            "refresh expired",
        )

        expect(CookieService.removeAccessToken).toHaveBeenCalledTimes(1)
        expect(CookieService.removeRefreshToken).toHaveBeenCalledTimes(1)
    })

    it("only retries once — a persistent 401 is not refreshed twice", async () => {
        // refresh returns a token the server still rejects → no infinite loop
        postSpy.mockResolvedValue({
            data: { access: "STILL_BAD" },
        } as unknown as AxiosResponse)

        await expect(axiosInstance.get("/protected")).rejects.toMatchObject({
            response: { status: 401 },
        })

        expect(postSpy).toHaveBeenCalledTimes(1)
    })
})
