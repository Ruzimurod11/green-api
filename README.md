# React SPA boshlang'ich shabloni

Ishlab chiqarishga tayyor infratuzilma bilan jihozlangan, **bo'sh** React 19 SPA
skeleti. Yangi loyihani noldan yig'ish o'rniga shu shablondan boshlanadi: auth,
data-layer, i18n, forma, jadval, xato-chegaralari va monitoring allaqachon
o'rnatilgan — faqat marshrut va sahifa qo'shiladi.

> Shablon GenFin loyihasidan «stripped» qilib olingan: barcha biznes sahifalar
> va multi-tenant qatlami olib tashlangan, faqat qayta ishlatiladigan yadro
> qoldirilgan. Bosh sahifa (`/`) — oddiy «Hello World».

## Texnologiyalar

| Qatlam         | Tanlov                                                  |
| -------------- | ------------------------------------------------------- |
| UI             | React 19.2 (React Compiler yoqilgan)                    |
| Build / dev    | Vite 8                                                  |
| Marshrutlash   | TanStack Router (fayl asosida, `autoCodeSplitting`)     |
| Server-state   | TanStack Query                                          |
| Jadval         | TanStack Table + Virtual                                |
| Stillar        | Tailwind CSS v4 (`@tailwindcss/vite`)                   |
| UI primitivlar | shadcn/ui (new-york) — Radix asosida                    |
| Forma          | react-hook-form + zod v4                                |
| Klient-state   | Zustand (`persist`)                                     |
| HTTP           | axios (yagona instance, interceptor'lar)                |
| i18n           | i18next — **uz** (default) / **ru** (fallback) / **en** |
| Monitoring     | Sentry (DSN bo'lsa yoqiladi)                            |
| Testlar        | Vitest + Testing Library                                |

Paket menejeri — **pnpm**, Node — **24** (Volta orqali pinlangan).

## Boshlash

```bash
pnpm install
cp .env.example .env      # keyin qiymatlarni to'ldiring
pnpm dev                  # http://localhost:3000
```

### `.env`

```env
VITE_DEFAULT_URL=https://api.hello.uz/api/v1/   # backend BASE_URL (/api/... bilan)
VITE_PORT=3000                                  # dev server porti (ixtiyoriy)
VITE_SENTRY_DSN=                                # bo'sh bo'lsa Sentry o'chiq
```

Dev'da so'rovlar Vite proxy orqali (`/__api` → backend) same-origin ketadi,
shuning uchun **CORS umuman yuzaga kelmaydi** va portni xohlagancha o'zgartirsa
bo'ladi.

## Skriptlar

| Buyruq                    | Vazifasi                                             |
| ------------------------- | ---------------------------------------------------- |
| `pnpm dev`                | Dev server (port 3000)                               |
| `pnpm build`              | `tsc -b` + `vite build`                              |
| `pnpm preview`            | Ishlab chiqarish build'ini ko'rish                   |
| `pnpm tsc`                | Faqat typecheck (`--noEmit`)                         |
| `pnpm lint`               | ESLint (butun repo)                                  |
| `pnpm lint:i18n`          | Locale JSON'lar orasidagi kalit drift'ini tekshirish |
| `pnpm test`               | Vitest (bir marta)                                   |
| `pnpm test:watch`         | Vitest watch rejimi                                  |
| `pnpm test:coverage-gate` | Kritik-yo'l test qamrovi gate'i                      |

**Pre-commit** (husky + lint-staged): staged fayllarda typecheck, `eslint
--max-warnings=0` va prettier ishlaydi; locale JSON o'zgarsa i18n tekshiruvi
ham. Lint **nol ogohlantirish** bilan o'tishi shart.

## Loyiha strukturasi

```
src/
├── routes/                 # TanStack fayl-marshrutlar (routeTree.gen.ts — avto)
│   ├── __root.tsx          # ildiz layout (providerlar + <Outlet/>)
│   └── index.tsx           # "/" — Hello World
├── components/
│   ├── ui/                 # shadcn/ui primitivlar (Radix)
│   ├── form/               # react-hook-form + zod forma nazoratlari
│   ├── custom/             # ilova-spetsifik kompozitlar (modal, jadval, ...)
│   ├── search-param/       # URL search-param bilan bog'langan filtrlar
│   ├── layouts/            # layout wrapper'lar
│   └── semantic/           # semantik matn/guruh primitivlari
├── hooks/
│   ├── react-query/        # useGet / useInfinite / useRequest / mutations ...
│   └── store/              # Zustand persist store'lar
├── lib/
│   ├── api/                # axios-instance + default-requests
│   ├── constants/          # api-endpoints, cookies, modal-keys ...
│   ├── i18n/               # i18next sozlamasi + locales/{uz,ru,en}.json
│   ├── monitoring/         # Sentry
│   ├── utils/              # format, cookie-service, on-error ...
│   └── validation/         # zod helper'lar
├── providers/              # Theme / Language / Modal / Confirm provayderlar
├── types/                  # domen tiplar (api, auth, common ...)
└── @types/                 # i18next d.ts + resurs tiplari
```

## Asosiy konventsiyalar

- **Prettier**: 4 bo'shliq, **nuqtali vergul yo'q**, ikkilik qo'shtirnoq, 80
  ustun, trailing comma. Import'lar `prettier-plugin-organize-imports` bilan
  avtomatik tartiblanadi.
- **Import alias**: `@/` → `src/`.
- **TS strict** + `noUnusedLocals`/`noUnusedParameters`. `verbatimModuleSyntax`
  yoqilgan — tip-only importlarda `import type` ishlating.
- **React Compiler** yoqilgan — `useMemo`/`useCallback` ni faqat to'g'rilik
  uchun qo'lda yozing, perf uchun emas.

## Arxitektura qisqacha

### Data-layer

- `lib/api/axios-instance.ts` — yagona axios instance. Request interceptor
  cookie'dan `Bearer` token qo'yadi; response interceptor 401'da
  `accounts/token/refresh/` orqali tokenni yangilab, so'rovni **bir marta**
  qayta yuboradi, aks holda tokenlarni tozalaydi.
- API yo'llari `lib/constants/api-endpoints.ts` (`API.*`) da markazlashgan —
  URL'larni qo'lda yozmang, shu obyektga qo'shing.

### React Query hook'lari (`hooks/react-query/`)

- `useGet(url, { deps, params, config, options })` — `useQuery` wrapper.
- `useInfinite(url, { cursorKey, ... })` — `{ count, next, previous, results }`
  paginatsiya shaklini kutadi.
- `useRequest()` — generic mutatsiya (`post/put/patch/remove` + upload progress).
- Barcha mutatsiyalar default `onError` (`lib/utils/on-error.ts`) bilan
  server xatolarini `sonner` toast qiladi.

### Provayderlar (`main.tsx` / `__root.tsx`)

`ErrorBoundary` → `I18nextProvider` → `ThemeProvider` → `ConfirmProvider` →
`TooltipProvider` → `QueryClientProvider` → `RouterProvider`. Har marshrut o'z
`RouteErrorBoundary` chegarasiga ega.

### i18n

- Standart til **uz**, fallback **ru**; `en` qo'shimcha. Til `lang` cookie'da
  saqlanadi va `Accept-Language` sifatida yuboriladi.
- Kalitlar **tip-tekshiriladi** (`@types/resources.ts` + `i18next.d.ts`) —
  `en.json` tip manbasi. Yangi kalitni **uchala** locale'ga ham qo'shing.

### Auth & state

- JWT tokenlar cookie'da (`CookieService`). Zustand `persist` bilan klient
  holati (oxirgi sahifa, sidebar) saqlanadi; kalitlar
  `lib/constants/localstorage.ts` da.

## Yangi sahifa qo'shish

1. `src/routes/` ichida fayl yarating (masalan `about.tsx`) —
   `export const Route = createFileRoute("/about")({ component: ... })`.
   `routeTree.gen.ts` Vite plagini tomonidan **avtomatik** yangilanadi.
2. Kerak bo'lsa yon-yonida `-components/`, `-hooks/`, `-types/` (dash prefiks)
   papkalarini qo'shing — ular marshrut emas, o'sha sahifa yordamchilari.
3. Backend so'rovlari uchun endpoint'ni `api-endpoints.ts` ga qo'shib,
   `useGet`/`useRequest` bilan chaqiring.
4. Foydalanuvchiga ko'rinadigan matnlarni to'g'ridan-to'g'ri yozmang —
   i18n kaliti sifatida uchala locale'ga qo'shing.

## Deploy

`vercel.json` mavjud — SPA rewrite bilan Vercel'ga tayyor. `pnpm build`
`dist/` ga statik build chiqaradi; `vite-plugin-sitemap` sitemap va
`robots.txt` yaratadi (hostname'ni `vite.config.ts` da moslang).
