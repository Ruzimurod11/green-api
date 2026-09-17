import babel from "@rolldown/plugin-babel"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vitest/config"

// Standalone Vitest config — intentionally does NOT reuse vite.config.ts so the
// TanStack-Router codegen and sitemap passes don't run for unit tests. We DO
// mirror the React + React-Compiler babel chain from vite.config.ts so component
// tests render with the same memoization as production (otherwise they would
// miss compiler-specific bugs — see the RHF formState/"use no memo" caveat).
export default defineConfig({
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
        env: {
            VITE_DEFAULT_URL: "https://api.test.local",
        },
    },
})
