// Global test setup.
// - jest-dom matchers (toBeInTheDocument, toHaveValue, ...) for component tests.
// - Reset the jsdom cookie jar between tests so cookie/token suites don't leak.
import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest"

// jsdom ships no ResizeObserver, which Radix primitives (checkbox, select, ...)
// touch on mount. A no-op stub is enough for behavioural tests.
/* eslint-disable @typescript-eslint/no-empty-function */
class ResizeObserverStub implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
/* eslint-enable @typescript-eslint/no-empty-function */
globalThis.ResizeObserver = ResizeObserverStub

/* eslint-disable @typescript-eslint/no-empty-function */
// jsdom doesn't implement scrollTo; pages call it on mount/route change.
globalThis.scrollTo = (() => {}) as typeof globalThis.scrollTo

// jsdom has no matchMedia; some UI primitives read it on mount.
globalThis.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
})) as typeof globalThis.matchMedia
/* eslint-enable @typescript-eslint/no-empty-function */

// The authed layout opens a /ws/team/ socket via useTeamRealtime. A no-op stub
// keeps page smoke tests from touching the network (jsdom's WebSocket would try
// to actually connect and emit async errors).
/* eslint-disable @typescript-eslint/no-empty-function */
class WebSocketStub {
    static readonly CONNECTING = 0
    static readonly OPEN = 1
    static readonly CLOSING = 2
    static readonly CLOSED = 3
    readonly readyState = WebSocketStub.CONNECTING
    close() {}
    send() {}
    addEventListener() {}
    removeEventListener() {}
}
/* eslint-enable @typescript-eslint/no-empty-function */
globalThis.WebSocket = WebSocketStub as unknown as typeof WebSocket

afterEach(() => {
    document.cookie
        .split(";")
        .map((c) => c.split("=")[0]?.trim())
        .filter(Boolean)
        .forEach((name) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
        })
})
