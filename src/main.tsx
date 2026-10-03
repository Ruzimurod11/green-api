import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import type { AxiosError } from "axios"
import { Suspense } from "react"
import { createRoot } from "react-dom/client"
import { I18nextProvider } from "react-i18next"
import { ErrorBoundary } from "./components/custom/error-boundary"
import { RouteErrorBoundary } from "./components/custom/route-error-boundary"
import Loader from "./components/ui/loader"
import { Toaster } from "./components/ui/sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import "./index.css"
import { setupAxiosInterceptors } from "./lib/api/axios-instance"
import i18n from "./lib/i18n/request"
import { initSentry } from "./lib/monitoring/sentry"
import { onError } from "./lib/utils/on-error"
import { ConfirmProvider } from "./providers/confirm-provider"
import { ThemeProvider } from "./providers/theme-provider"
import { routeTree } from "./routeTree.gen"

initSentry()

// Setup axios interceptors with queryClient
const queryClient = new QueryClient({
    // Query xatolari endi global ko'rinadi: har komponentda qo'lda ushlash
    // shart emas. Mutation'lar allaqachon `onError` ishlatadi — bir xil
    // formatlangan toast. (onError 4xx/5xx/tarmoqни farqlaydi.)
    queryCache: new QueryCache({
        // `meta.silentError` bo'lgan query'lar (masalan ixtiyoriy/best-effort
        // ma'lumot) xato bersa, foydalanuvchiga toast ko'rsatmaymiz.
        onError: (error, query) => {
            if (query.meta?.silentError) return
            onError(error)
        },
    }),
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: (query) => query.state.data === undefined,
            // 4xx (auth/validatsiya/topilmadi) — qayta urinish foydasiz.
            // Faqat tarmoq/5xx xatolarida 2 marta exponential backoff bilan.
            retry: (failureCount, error) => {
                const status = (error as AxiosError)?.response?.status
                if (status && status >= 400 && status < 500) return false
                return failureCount < 2
            },
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
            gcTime: 1000 * 60 * 2,
            staleTime: 60 * 1000,
        },
    },
})
setupAxiosInterceptors(queryClient)

const router = createRouter({
    routeTree,
    context: {
        queryClient,
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    // Har bir marshrut o'z xato chegarasini oladi: bitta seksiya qulasa,
    // butun ilova emas, faqat o'sha `<Outlet />` fallback bilan almashadi
    // (sidebar/nav joyida qoladi). Global ErrorBoundary yuqorida — provayder
    // darajasidagi falokatlar uchun zaxira bo'lib qoladi.
    defaultErrorComponent: RouteErrorBoundary,
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}

// Render the app
const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement)
    root.render(
        // <StrictMode>
        <ErrorBoundary>
            <I18nextProvider i18n={i18n}>
                <Suspense fallback={<Loader />}>
                    <ThemeProvider>
                        <ConfirmProvider>
                            <TooltipProvider>
                                <QueryClientProvider client={queryClient}>
                                    <RouterProvider router={router} />
                                    <Toaster />
                                </QueryClientProvider>
                            </TooltipProvider>
                        </ConfirmProvider>
                    </ThemeProvider>
                </Suspense>
            </I18nextProvider>
        </ErrorBoundary>,
        // </StrictMode>,
    )
}
