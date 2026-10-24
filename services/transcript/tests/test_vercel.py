import hashlib
import hmac
import importlib.util
import json
import os
from pathlib import Path
import sys
import unittest

ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT))
spec=importlib.util.spec_from_file_location('vercel_transcript',ROOT/'api/transcript.py')
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class SignatureTests(unittest.TestCase):
 def test_binds_body_and_time_and_rejects_replay_after_expiration(self):
  body=b'{"id":"BESKw0hiZ3Q","languages":["de"]}'
  timestamp='1000';secret='test-key'
  signature=hmac.new(secret.encode(),b'elio-transcript-v1\n'+timestamp.encode()+b'\n'+body,hashlib.sha256).hexdigest()
  self.assertTrue(module.valid_signature(body,timestamp,signature,secret,now=1001))
  self.assertFalse(module.valid_signature(body+b' ',timestamp,signature,secret,now=1001))
  self.assertFalse(module.valid_signature(body,timestamp,signature,secret,now=1200))
  self.assertFalse(module.valid_signature(body,timestamp,signature,'wrong-key',now=1001))
 def test_missing_or_malformed_signatures_are_rejected(self):
  for timestamp,signature,secret in [(None,None,'key'),('oops','a'*64,'key'),('1000','a'*64,''),('1000','bad','key')]:
   self.assertFalse(module.valid_signature(b'{}',timestamp,signature,secret,now=1000))

if __name__=='__main__':unittest.main()
