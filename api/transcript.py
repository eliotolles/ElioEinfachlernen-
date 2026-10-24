"""Private Node -> Python bridge, authenticated before any upstream request."""
from http.server import BaseHTTPRequestHandler
import hashlib
import hmac
import json
import os
from pathlib import Path
import tempfile
import threading
import time
from services.transcript import server

# Vercel's application filesystem is read-only. Only ephemeral /tmp cache is used.
server.DB = str(Path(tempfile.gettempdir()) / 'elio-transcript-v1.sqlite3')
server.DEADLINE = 55
_ready = False
_init_lock = threading.Lock()


def valid_signature(body, timestamp, signature, secret, now=None):
    if not secret or not timestamp or not signature or len(signature) != 64:
        return False
    try:
        if abs((time.time() if now is None else now) - int(timestamp)) > 90:
            return False
    except (TypeError, ValueError):
        return False
    message = b'elio-transcript-v1\n' + timestamp.encode() + b'\n' + body
    expected = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


class handler(BaseHTTPRequestHandler):
    def respond(self, status, data):
        raw = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(raw)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(raw)

    def log_message(self, *args):
        pass  # Do not log body, signature, cookies or signed upstream URLs.

    def do_GET(self):
        self.respond(200, {'ok': True, 'service': 'elio-transcript', 'runtime': 'vercel-python'})

    def do_POST(self):
        global _ready
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 8192:
                self.respond(413, {'error': 'Invalid body size'})
                return
            body = self.rfile.read(length)
            if not valid_signature(body, self.headers.get('X-Elio-Transcript-Time'),
                                   self.headers.get('X-Elio-Transcript-Signature'),
                                   os.environ.get('AI_ENCRYPTION_KEY', '')):
                self.respond(401, {'error': 'Unauthorized'})
                return
            payload = json.loads(body)
            if not isinstance(payload, dict):
                raise ValueError()
            # Never initialize or query Turso here. Existing Node route enforces sessions.
            with _init_lock:
                if not _ready:
                    server.initialize()
                    _ready = True
            self.respond(200, server.resolve(payload))
        except (ValueError, TypeError, UnicodeDecodeError):
            self.respond(400, {'error': 'Invalid request'})
        except Exception:
            self.respond(500, {'available': False, 'code': 'CAPTIONS_INTERNAL_ERROR',
                               'reason': 'Python chưa xử lý được yêu cầu.', 'cues': []})
