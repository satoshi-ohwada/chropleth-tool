#!/usr/bin/env python3
"""
Aomori Choropleth Studio - Verification Web Server
"""
import http.server
import socketserver
import functools
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    
    handler = functools.partial(CustomHandler, directory=DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("=" * 60)
        print(" 🗺️  青森県市町村コロプレスツール サーバー起動中")
        print(f" 🌐 アクセスURL: http://localhost:{PORT}")
        print(f" 📂 ディレクトリ: {DIRECTORY}")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nサーバーを停止しました。")
