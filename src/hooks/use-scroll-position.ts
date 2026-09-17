import { useCallback, useSyncExternalStore } from "react"

interface Args {
    containerId?: string
}

export function useScrollPosition({ containerId }: Args = {}) {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const target: HTMLElement | Window | null =
                containerId ? document.getElementById(containerId) : window
            if (!target) return () => undefined
            target.addEventListener("scroll", onChange, { passive: true })
            return () => target.removeEventListener("scroll", onChange)
        },
        [containerId],
    )

    const getSnapshot = useCallback(() => {
        if (containerId) {
            return document.getElementById(containerId)?.scrollTop ?? 0
        }
        return window.scrollY
    }, [containerId])

    return useSyncExternalStore(subscribe, getSnapshot, () => 0)
}
