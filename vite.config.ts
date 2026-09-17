import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import path from "path"
import { defineConfig, loadEnv } from "vite"
import sitemap from "vite-plugin-sitemap"

export default defineConfig(({ mode }) => {
    // `""` prefiks — barcha env o'zgaruvchilarini (VITE_ prefiksisiz ham) o'qiydi.
    const env = loadEnv(mode, process.cwd(), "")

    // Dev proxy: brauzer faqat o'z origin'i (`localhost:<port>`) bilan gaplashadi,
    // so'rovlar `/__api` orqali backendga uzatiladi. Shu sabab CORS UMUMAN yuzaga
    // kelmaydi — dev portni xohlagancha o'zgartirsa ham ishlayveradi. `/__api`
    // backend yo'l-prefiksiga (masalan `/api`) qayta yoziladi; `/ws` esa WebSocket
    // (team real-time) uchun. `changeOrigin` Host sarlavhasini target'ga moslaydi.
    const apiUrl = env.VITE_DEFAULT_URL
    const target = apiUrl ? new URL(apiUrl) : null
    const backendPath = target ? target.pathname.replace(/\/$/, "") : ""

    return {
        plugins: [
            tanstackRouter({
                target: "react",
                autoCodeSplitting: true,
            }),
            react(),
            babel({ presets: [reactCompilerPreset()] }),
            tailwindcss(),
            sitemap({
                hostname: "https://example.com",
                dynamicRoutes: ["/", "/home"],
                changefreq: "weekly",
                priority: 0.7,
                generateRobotsTxt: true,
            }),
        ],
        server: {
            // Yagona manba: default 3000, `.env` da VITE_PORT bilan o'zgartiriladi.
            // Proxy tufayli portni o'zgartirish CORS'ga ta'sir qilmaydi.
            port: Number(env.VITE_PORT) || 3000,
            proxy:
                target ?
                    {
                        "/__api": {
                            target: target.origin,
                            changeOrigin: true,
                            secure: true,
                            rewrite: (p) => p.replace(/^\/__api/, backendPath),
                        },
                        "/ws": {
                            target: target.origin,
                            changeOrigin: true,
                            secure: true,
                            ws: true,
                        },
                    }
                :   undefined,
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        build: {
            // "hidden" — .map fayllari generatsiya qilinadi, lekin bundle'ga
            // sourceMappingURL kommenti qo'shilmaydi (prod'da public'ga sizib
            // chiqmaydi). Sentry'da minified bo'lmagan stack uchun shu .map
            // fayllarni Sentry'ga upload qiling (@sentry/vite-plugin yoki CLI).
            sourcemap: "hidden",
            rolldownOptions: {
                output: {
                    // Split heavy, rarely-changing libraries into their own vendor
                    // chunks so they stay cached across app deploys instead of
                    // bloating route/shared chunks. Most specific groups first.
                    codeSplitting: {
                        groups: [
                            // ~500KB, eagerly imported by zod-helpers (every form).
                            {
                                name: "vendor-phone",
                                test: /node_modules[\\/]google-libphonenumber[\\/]/,
                            },
                            // recharts + its d3 dependencies (dashboard charts).
                            {
                                name: "vendor-charts",
                                test: /node_modules[\\/](recharts|victory-vendor|d3-[^\\/]+|internmap|robust-predicates|delaunator)[\\/]/,
                            },
                            // Rich-text editor (quill-field).
                            {
                                name: "vendor-editor",
                                test: /node_modules[\\/](react-quill-new|quill|parchment)[\\/]/,
                            },
                            {
                                name: "vendor-calendar",
                                test: /node_modules[\\/]vanilla-calendar-pro[\\/]/,
                            },
                            {
                                name: "vendor-shiki",
                                test: /node_modules[\\/](shiki|@shikijs)[\\/]/,
                            },
                        ],
                    },
                },
            },
        },
    }
})
