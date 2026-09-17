#!/usr/bin/env bash
# PostToolUse (Write|Edit) hook: tahrir qilingan faylni prettier bilan formatlaydi.
# Faqat formatlanadigan kengaytmalarni qabul qiladi; xato bo'lsa jim o'tadi.
set -euo pipefail

f="$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')"
[ -z "$f" ] && exit 0

case "$f" in
    *.ts | *.tsx | *.js | *.jsx | *.json | *.css | *.md)
        pnpm exec prettier --write "$f" >/dev/null 2>&1 || true
        ;;
esac
exit 0
