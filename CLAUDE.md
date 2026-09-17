# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Template — a **blank React 19 SPA skeleton** with production-ready infrastructure pre-wired: auth, data layer, i18n, forms, tables, error boundaries, and monitoring. It was stripped from the GenFin financial SaaS: all business pages and the multi-tenant layer were removed, leaving only the reusable core. The home route (`/`) is a plain "Hello World" — new features are added as routes on top. Built with Vite, TanStack Router (file-based), TanStack Query, Tailwind v4, and shadcn/ui (new-york style). Backend is a Django REST API (`../../Backend/GenFin_Backend`) with JWT auth; only generic `accounts/*` (auth/profile/users/sessions) and media endpoints remain.

## Commands

- `pnpm dev` — dev server on port 3000
- `pnpm build` — `tsc -b` then `vite build`
- `pnpm tsc` — typecheck only (`tsc --project tsconfig.app.json --noEmit`)
- `pnpm lint` — ESLint over the repo
- `pnpm lint:i18n` — check locale JSONs for key drift across uz/ru/en
- `pnpm test` — Vitest (`vitest run`); `pnpm test:watch` for watch mode
- `pnpm preview` — preview the production build

Package manager is **pnpm** (Node 24 via Volta). Tests run on **Vitest** — a critical-path suite is configured.

Pre-commit (husky + lint-staged): runs typecheck, `eslint --max-warnings=0`, and prettier on staged files; runs `lint:i18n` when a locale JSON changes. Lint must pass with **zero warnings**.

## Conventions (enforced)

- Prettier: 4-space indent, **no semicolons**, double quotes, 80 col, trailing commas, `experimentalTernaries`. Imports are auto-organized by `prettier-plugin-organize-imports`.
- Import alias: `@/` → `src/`.
- TS is strict with `noUnusedLocals`/`noUnusedParameters`; `verbatimModuleSyntax` is on, so use `import type` for type-only imports.
- React Compiler (`babel-plugin-react-compiler`) is enabled — do not hand-write `useMemo`/`useCallback` for perf unless needed for correctness.

## Sub-agent delegation (default for breadth)

This is a file-based-routing codebase (`src/routes/` mirrors the URL tree with colocated `-components/`, `-hooks/`, `-types/`). When a task means **sweeping many files instead of editing a known one**, delegate to a sub-agent and keep the conclusion — don't read dozens of files into the main context.

- **Explore** (read-only) — default for "where is X used / find all Y / which route owns Z / audit the codebase for W". Launch several in one message for parallel coverage. It returns the answer, not file dumps.
- **Plan** — for multi-file feature/refactor strategy before writing code (routing/data-layer/auth/shared-component changes).
- **Skip delegation** for a single-file lookup where the target is already known — search directly.
- Concretely: "find every place `useGet` is called with a hardcoded URL", "audit i18n keys used but missing from `uz.json`" → Explore, not manual grepping in the main loop.

## Architecture

### Routing (TanStack Router, file-based)

- Routes live in `src/routes/`; `routeTree.gen.ts` is **auto-generated** by the Vite plugin (`autoCodeSplitting: true`) — never edit it by hand.
- Currently only `__root.tsx` (root layout: providers + `<Outlet/>`) and `index.tsx` (`/` — Hello World) exist. Layout groups (`_main`, `_auth`, `profile/_layout`) were part of GenFin and were stripped — add them back as the app grows.
- File naming: `$param` = dynamic segment; `-components/`, `-hooks/`, `-types/` (dash prefix) = colocated, non-routable helpers for that route; `_layout` = pathless layout route. Each leaf route exports `Route = createFileRoute(...)`.

### Data layer

- `src/lib/api/axios-instance.ts` — single axios instance. Request interceptor injects `Bearer` token from cookies; response interceptor handles 401 by refreshing via `accounts/token/refresh/` (shared-promise mutex so concurrent 401s trigger a single refresh) and retrying once, else clears tokens and reloads. Auth endpoints (login/register/refresh/logout) are excluded from the refresh flow. FormData requests disable the 30s timeout.
- `src/lib/api/default-requests.ts` — thin `getRequest`/`postRequest`/etc. wrappers returning `res.data`.
- API paths are centralized in `src/lib/constants/api-endpoints.ts` (nested `API.*` object, e.g. `API.USER.PROFILE.INDEX`). Always reference these, don't hardcode URLs; add new module endpoints to this object.
- `BASE_URL` comes from `VITE_DEFAULT_URL` (`.env`). In dev, requests go through a same-origin Vite proxy (`/__api` → backend), so **CORS never applies**.

### React Query hooks (`src/hooks/react-query/`)

- `useGet(url, { deps, params, config, options })` — wraps `useQuery`. Query keys are built by `makeQueryKey` from url + deps + param values.
- `useInfinite(url, { cursorKey, ... })` — wraps `useInfiniteQuery`; expects `{ count, next, previous, results }` paginated shape, auto-fetches first page.
- `useRequest()` — generic mutation returning `post/put/patch/remove` (+ `*Async`) helpers with upload progress.
- `usePost/usePut/usePatch/useDelete` (`mutations.ts`) — per-method mutation hooks.
- All mutations default to `onError` (`src/lib/utils/on-error.ts`), which toasts formatted server errors via `sonner`. Query errors surface globally through `queryCache.onError` (skipped when `meta.silentError` is set).
- Convention: feature-specific query hooks live in the route's `-hooks/` dir and wrap `useGet`/`useInfinite`, reading search params via `useSearch({ strict: false })`.
- QueryClient defaults (in `main.tsx`): `staleTime` 60s, `gcTime` 2m, no refetch on window focus; `retry` skips 4xx and does 2 exponential-backoff attempts on network/5xx.

### State & providers

- Auth tokens stored in cookies via `CookieService` (`src/lib/utils/cookie-service.ts`). Cookie keys in `src/lib/constants/cookies.ts`.
- Zustand (with `persist`) for client state — last page (`use-last-page-persist`), sidebar (`use-sidebar-persist`). Persisted store keys are in `src/lib/constants/localstorage.ts`.
- Providers (in `main.tsx` / `__root.tsx`), outer→inner: `ErrorBoundary`, `I18nextProvider`, `ThemeProvider` (dark/light via `<html>` class), `ConfirmProvider` (promise-based `confirm()` dialog), `TooltipProvider`, `QueryClientProvider`, `RouterProvider`; plus `LanguageProvider` and `ModalProvider` (keyed modals, keys in `modal-keys.ts`) inside `__root.tsx`. Each route gets its own `RouteErrorBoundary`.

### i18n

- `src/lib/i18n/` — i18next with **uz** (default), **ru** (fallback), and **en** locales in `locales/*.json`. Language persisted in `lang` cookie and sent as `Accept-Language`.
- Translation keys are **type-checked**: `@types/resources.ts` + `@types/i18next.d.ts` type `t()` against the `en` JSON (type source). Add every new key to **all three** locales (`en.json`, `ru.json`, `uz.json`); `lint:i18n` guards against drift.

### UI

- shadcn/ui primitives in `src/components/ui/` (Radix-based) — **customized forks; do not blanket-overwrite** with `npx shadcn add`. Reusable form controls (react-hook-form + zod) in `src/components/form/`. App-specific composites in `src/components/custom/`.
- `cn()` / utils alias at `@/lib/utils/shadcn`. Tailwind v4 via `@tailwindcss/vite`, styles in `src/index.css`.

### Monitoring

- Sentry (`src/lib/monitoring/sentry.ts`) initializes only when `VITE_SENTRY_DSN` is set — off in dev/local by default. `captureError` is used by the axios layer.
