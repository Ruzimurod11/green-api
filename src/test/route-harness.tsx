// Page-level smoke-test harness.
//
// Mounts a *real* TanStack route (from the generated routeTree) inside a memory
// router + QueryClient + i18n, so a page renders through its actual layout,
// search-param binding (`Route.useSearch()`), loaders and child queries — the
// closest thing to "open this URL" we can assert in jsdom.
//
// The only seam is the network: tests mock `@/lib/api/default-requests` and feed
// `apiResponder()` as the `getRequest` implementation. The default responder
// authenticates (non-empty profile) and returns an empty page for every list,
// which is enough for a "renders without crashing" smoke check. Permissions are
// intentionally left empty — `usePermissions` is fail-open, so the layout shows
// the <Outlet/> (the page) rather than <AccessDenied/>.
import { TooltipProvider } from "@/components/ui/tooltip"
import i18n from "@/lib/i18n/request"
import { CookieService } from "@/lib/utils/cookie-service"
import { ConfirmProvider } from "@/providers/confirm-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { routeTree } from "@/routeTree.gen"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
    createMemoryHistory,
    createRouter,
    RouterProvider,
} from "@tanstack/react-router"
import { render } from "@testing-library/react"
import { I18nextProvider } from "react-i18next"

// Empty DRF-paginated payload — the safe default for any list endpoint.
export const EMPTY_PAGE = { count: 0, next: null, previous: null, results: [] }

// Non-empty profile → the authed layout treats the session as authenticated and
// does NOT redirect to /sign-in (its effect only redirects when the profile
// query has resolved AND is empty).
export const FAKE_PROFILE = { id: 1, email: "test@genfin.local" }

/**
 * Build a `getRequest` implementation for page smoke tests.
 * - `accounts/profile` → a non-empty profile (authenticates the layout)
 * - anything else → an empty page
 */
export function apiResponder() {
    return (url: string) => {
        if (url.includes("accounts/profile"))
            return Promise.resolve(FAKE_PROFILE)
        return Promise.resolve(EMPTY_PAGE)
    }
}

/** Render a real route at `path` (e.g. "/profile/dashboard"). */
export async function renderRoute(path: string) {
    CookieService.setAccessToken("test-token")
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    })
    const router = createRouter({
        routeTree,
        context: { queryClient },
        history: createMemoryHistory({ initialEntries: [path] }),
    })
    const utils = render(
        <I18nextProvider i18n={i18n}>
            <ThemeProvider>
                <ConfirmProvider>
                    <TooltipProvider>
                        <QueryClientProvider client={queryClient}>
                            <RouterProvider router={router} />
                        </QueryClientProvider>
                    </TooltipProvider>
                </ConfirmProvider>
            </ThemeProvider>
        </I18nextProvider>,
    )
    return { ...utils, router, queryClient }
}
