"""Receptor local para la extracción de Figma.

Uso: python3 scripts/figma/receptor.py <carpeta-de-salida>
- GET  /<archivo>.js  sirve los scripts de esta carpeta (para cargarlos en la pestaña de Figma).
- POST /<ruta>        guarda el cuerpo en <carpeta-de-salida>/<ruta> (JSON o PNG en base64 con ?b64).
"""
import base64, http.server, os, sys

OUT = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_GET(self):
        path = os.path.join(HERE, os.path.basename(self.path.split('?')[0]))
        if not path.endswith('.js') or not os.path.exists(path):
            self.send_response(404); self._cors(); self.end_headers(); return
        body = open(path, 'rb').read()
        self.send_response(200); self._cors()
        self.send_header('Content-Type', 'text/javascript'); self.end_headers(); self.wfile.write(body)

    def do_POST(self):
        raw, _, query = self.path.partition('?')
        rel = os.path.normpath(raw.lstrip('/'))
        if rel.startswith('..'):
            self.send_response(400); self._cors(); self.end_headers(); return
        data = self.rfile.read(int(self.headers['Content-Length']))
        if 'b64' in query:
            data = base64.b64decode(data)
        dest = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, 'wb').write(data)
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(b'ok')

    def log_message(self, *args):
        pass


http.server.HTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
