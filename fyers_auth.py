"""
Fyers OAuth2 Token Generator
Run this script once a day to refresh your access token.

Usage:
    python fyers_auth.py

Steps:
    1. Script prints an auth URL — open it in your browser
    2. Log in with your Fyers credentials
    3. You'll be redirected to http://127.0.0.1:8080/?auth_code=XXXX&...
    4. Copy the auth_code from the URL and paste it here
    5. Script saves the access_token to .env automatically
"""

import os
import re
from dotenv import load_dotenv, set_key
from fyers_apiv3 import fyersModel

ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(ENV_PATH)

CLIENT_ID    = os.getenv("FYERS_CLIENT_ID")
SECRET_KEY   = os.getenv("FYERS_SECRET_KEY")
REDIRECT_URI = os.getenv("FYERS_REDIRECT_URI", "http://127.0.0.1:8080/")

if not CLIENT_ID or not SECRET_KEY or SECRET_KEY == "your_secret_key_here":
    print("ERROR: Fill in FYERS_CLIENT_ID and FYERS_SECRET_KEY in your .env file first.")
    exit(1)

# ── Step 1: generate auth URL ──────────────────────────────────────────────────
session = fyersModel.SessionModel(
    client_id=CLIENT_ID,
    secret_key=SECRET_KEY,
    redirect_uri=REDIRECT_URI,
    response_type="code",
    grant_type="authorization_code",
)

auth_url = session.generate_authcode()
print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("  Open this URL in your browser and log in:")
print(f"\n  {auth_url}\n")
print("  After login you'll land on http://127.0.0.1:8080/?auth_code=XXXX&...")
print("  Copy the value of  auth_code  from that URL.")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

# ── Step 2: accept auth_code ───────────────────────────────────────────────────
raw = input("Paste the auth_code (or the full redirect URL): ").strip()

# Accept either the full URL or just the code
match = re.search(r"auth_code=([^&]+)", raw)
auth_code = match.group(1) if match else raw

# ── Step 3: exchange for access token ─────────────────────────────────────────
session.set_token(auth_code)
response = session.generate_token()

if response.get("s") != "ok":
    print(f"\nERROR: {response}")
    exit(1)

access_token = response["access_token"]

# ── Step 4: save to .env ───────────────────────────────────────────────────────
set_key(ENV_PATH, "FYERS_ACCESS_TOKEN", access_token)

print(f"\n✓ Access token saved to .env")
print(f"  Token (first 20 chars): {access_token[:20]}...")
print("\n  You can now start the backend — it will use Fyers for market data.")
