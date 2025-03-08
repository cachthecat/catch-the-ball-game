from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver
import os

class PWAHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Aggiungi headers per PWA
        self.send_header('Service-Worker-Allowed', '/')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        # Gestisci il service worker correttamente
        if self.path == '/sw.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            with open('sw.js', 'rb') as f:
                self.wfile.write(f.read())
        else:
            return SimpleHTTPRequestHandler.do_GET(self)

# Avvia il server
port = 8000
handler = PWAHandler
handler.extensions_map['.js'] = 'application/javascript'
handler.extensions_map['.css'] = 'text/css'
handler.extensions_map['.json'] = 'application/json'

with socketserver.TCPServer(("", port), handler) as httpd:
    print(f"Server avviato su porta {port}")
    print("Per installare il gioco sul telefono:")
    print("1. Apri Chrome sul telefono")
    print(f"2. Vai su http://192.168.1.56:{port}")
    print("3. Tocca i tre puntini (⋮) in alto a destra")
    print("4. Seleziona 'Installa app' o 'Aggiungi a schermata Home'")
    httpd.serve_forever()
