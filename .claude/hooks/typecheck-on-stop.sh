#!/usr/bin/env bash
# Stop hook (asyncRewake): Claude tugatganda, agar commit qilinmagan TS o'zgarish
# bo'lsa `pnpm tsc` ishlaydi. Xato bo'lsa exit 2 — Claude avtomatik uyg'onib tuzatadi.
# Toza bo'lsa (yoki TS o'zgarish yo'q) — jim exit 0, hech narsa ko'rsatilmaydi.
set -uo pipefail

# Commit qilinmagan .ts/.tsx o'zgarish yo'q bo'lsa — tekshirishga hojat yo'q.
git status --porcelain 2>/dev/null | grep -qE '\.tsx?$' || exit 0

if out="$(pnpm tsc 2>&1)"; then
    exit 0
fi

printf '%s\n' "$out" | tail -40
exit 2
