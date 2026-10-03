# React SPA starter template

A **blank** React 19 SPA skeleton with production-ready infrastructure already
wired in. Start a new project from this template instead of assembling it from
scratch: auth, the data layer, i18n, forms, tables, error boundaries, and
monitoring are already set up — you only add routes and pages.

> The template was stripped from the GenFin project: all business pages and the
> multi-tenant layer were removed, leaving only the reusable core. The home
> page (`/`) is a plain "Hello World".

## Stack

| Layer          | Choice                                                  |
| -------------- | ------------------------------------------------------- |
| UI             | React 19.2 (React Compiler enabled)                     |
| Build / dev    | Vite 8                                                  |
| Routing        | TanStack Router (file-based, `autoCodeSplitting`)       |
| Server state   | TanStack Query                                          |
| Tables         | TanStack Table + Virtual                                |
| Styles         | Tailwind CSS v4 (`@tailwindcss/vite`)                   |
| UI primitives  | shadcn/ui (new-york) — Radix-based                      |
| Forms          | react-hook-form + zod v4                                |
| Client state   | Zustand (`persist`)                                     |
| HTTP           | axios (single instance, interceptors)                   |
| i18n           | i18next — **uz** (default) / **ru** (fallback) / **en** |
| Monitoring     | Sentry (enabled when a DSN is set)                      |
| Tests          | Vitest + Testing Library                                |

Package manager is **pnpm**. Node is **24** (pinned via Volta).

## Getting started

```bash
pnpm install
cp .env.example .env      # then fill in the values
pnpm dev                  # http://localhost:3000
```

### `.env`

```env
VITE_DEFAULT_URL=https://api.hello.uz/api/v1/   # backend BASE_URL (with /api/...)
VITE_PORT=3000                                  # dev server port (optional)
VITE_SENTRY_DSN=                                # Sentry stays off when empty
```

In development, requests go through the Vite proxy (`/__api` → backend) as
same-origin, so **CORS never applies** and you can change the port freely.

## Scripts

| Command                   | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `pnpm dev`                | Dev server (port 3000)                       |
| `pnpm build`              | `tsc -b` + `vite build`                      |
| `pnpm preview`            | Preview the production build                 |
| `pnpm tsc`                | Typecheck only (`--noEmit`)                  |
| `pnpm lint`               | ESLint (entire repo)                         |
| `pnpm lint:i18n`          | Check locale JSONs for key drift             |
| `pnpm test`               | Vitest (single run)                          |
| `pnpm test:watch`         | Vitest watch mode                            |
| `pnpm test:coverage-gate` | Critical-path test coverage gate             |

**Pre-commit** (husky + lint-staged): typecheck, `eslint --max-warnings=0`, and
prettier run on staged files; the i18n check also runs when a locale JSON
changes. Lint must pass with **zero warnings**.

## Project structure

```
src/
├── routes/                 # TanStack file routes (routeTree.gen.ts — generated)
│   ├── __root.tsx          # root layout (providers + <Outlet/>)
│   └── index.tsx           # "/" — Hello World
├── components/
│   ├── ui/                 # shadcn/ui primitives (Radix)
│   ├── form/               # react-hook-form + zod form controls
│   ├── custom/             # app-specific composites (modal, table, ...)
│   ├── search-param/       # filters bound to URL search params
│   ├── layouts/            # layout wrappers
│   └── semantic/           # semantic text/group primitives
├── hooks/
│   ├── react-query/        # useGet / useInfinite / useRequest / mutations ...
│   └── store/              # Zustand persist stores
├── lib/
│   ├── api/                # axios-instance + default-requests
│   ├── constants/          # api-endpoints, cookies, modal-keys ...
│   ├── i18n/               # i18next setup + locales/{uz,ru,en}.json
│   ├── monitoring/         # Sentry
│   ├── utils/              # format, cookie-service, on-error ...
│   └── validation/         # zod helpers
├── providers/              # Theme / Language / Modal / Confirm providers
├── types/                  # domain types (api, auth, common ...)
└── @types/                 # i18next d.ts + resource types
```

## Core conventions

- **Prettier**: 4-space indent, **no semicolons**, double quotes, 80 columns,
  trailing commas. Imports are auto-organized by
  `prettier-plugin-organize-imports`.
- **Import alias**: `@/` → `src/`.
- **TS strict** + `noUnusedLocals`/`noUnusedParameters`. `verbatimModuleSyntax`
  is on — use `import type` for type-only imports.
- **React Compiler** is enabled — write `useMemo`/`useCallback` by hand only
  for correctness, not for performance.

## Architecture in brief

### Data layer

- `lib/api/axios-instance.ts` — single axios instance. The request interceptor
  attaches a `Bearer` token from cookies; the response interceptor refreshes
  the token via `accounts/token/refresh/` on 401, retries the request
  **once**, and otherwise clears the tokens.
- API paths are centralized in `lib/constants/api-endpoints.ts` (`API.*`) —
  do not hardcode URLs; add them to this object.

### React Query hooks (`hooks/react-query/`)

- `useGet(url, { deps, params, config, options })` — `useQuery` wrapper.
- `useInfinite(url, { cursorKey, ... })` — expects a
  `{ count, next, previous, results }` pagination shape.
- `useRequest()` — generic mutation (`post/put/patch/remove` + upload
  progress).
- All mutations default to `onError` (`lib/utils/on-error.ts`), which toasts
  server errors via `sonner`.

### Providers (`main.tsx` / `__root.tsx`)

`ErrorBoundary` → `I18nextProvider` → `ThemeProvider` → `ConfirmProvider` →
`TooltipProvider` → `QueryClientProvider` → `RouterProvider`. Each route has
its own `RouteErrorBoundary`.

### i18n

- Default language is **uz**, fallback is **ru**; **en** is additional. The
  language is stored in the `lang` cookie and sent as `Accept-Language`.
- Keys are **type-checked** (`@types/resources.ts` + `i18next.d.ts`) —
  `en.json` is the type source. Add every new key to **all three** locales.

### Auth and state

- JWT tokens live in cookies (`CookieService`). Zustand `persist` stores
  client state (last page, sidebar); keys are in
  `lib/constants/localstorage.ts`.

## Adding a new page

1. Create a file under `src/routes/` (for example `about.tsx`) —
   `export const Route = createFileRoute("/about")({ component: ... })`.
   `routeTree.gen.ts` is updated **automatically** by the Vite plugin.
2. If needed, add colocated `-components/`, `-hooks/`, and `-types/` folders
   (dash prefix) next to it — they are helpers for that page, not routes.
3. For backend requests, add the endpoint to `api-endpoints.ts` and call it
   with `useGet` / `useRequest`.
4. Do not hardcode user-facing copy — add it as an i18n key in all three
   locales.

## Deploy

`vercel.json` is included — ready for Vercel with an SPA rewrite. `pnpm build`
emits a static build to `dist/`; `vite-plugin-sitemap` generates the sitemap
and `robots.txt` (set the hostname in `vite.config.ts`).
