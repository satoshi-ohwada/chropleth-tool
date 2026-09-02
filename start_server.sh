#!/bin/bash
# ==============================================================================
# 青森県市町村コロプレスツール サーバー起動スクリプト (Linux/macOS)
# ==============================================================================

PORT=${1:-3000}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

if command -v python3 &> /dev/null; then
    python3 start_server.py "$PORT"
elif command -v node &> /dev/null && command -v npx &> /dev/null; then
    echo "Python3が見つからないため、npx serveで起動します..."
    npx serve . -p "$PORT"
else
    echo "エラー: Python3 または Node.js が見つかりませんでした。"
    exit 1
fi
