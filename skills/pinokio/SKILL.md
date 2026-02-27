---
name: pinokio
description: Manage openclaw running via Pinokio on Windows. Use when starting, stopping, updating, or debugging openclaw through Pinokio, or when reading openclaw logs and config.
---

# Pinokio + OpenClaw

OpenClaw runs on this machine via Pinokio (Electron app launcher). Don't `npm install -g openclaw` — it's already installed through Pinokio's isolated environment.

## Paths

| What | Path |
|------|------|
| Pinokio root | `C:/pinokio/` |
| OpenClaw app | `C:/pinokio/api/openclaw.pinokio.git/` |
| OpenClaw binary | `C:/pinokio/bin/npm/openclaw` |
| OpenClaw state | `C:/Users/Artale/.openclaw/` |
| OpenClaw config | `C:/Users/Artale/.openclaw/` (gateway.yaml, agents/, cron/, etc.) |
| OpenClaw logs | `C:/Users/Artale/.openclaw/logs/` |
| Pinokio app logs | `C:/pinokio/api/openclaw.pinokio.git/logs/` |
| Pinokio env config | `C:/pinokio/api/openclaw.pinokio.git/ENVIRONMENT` |

## Version

```bash
"C:/pinokio/bin/npm/openclaw" --version
```

Currently: `2026.2.23`

## How It Starts

Pinokio runs `start.js` which does two things in sequence:
1. `openclaw gateway run` — starts the gateway (waits for WS listener)
2. `openclaw dashboard` — opens the Control UI in browser

The gateway listens on `http://127.0.0.1:18789` with a token in the URL fragment.

## Common Operations

### Check if running
```bash
# Gateway process
tasklist | grep -i node | head -5
# Or check the port
netstat -ano | grep 18789
```

### Read live logs
```bash
# Most recent gateway log
ls -t "C:/Users/Artale/.openclaw/logs/" | head -5
```

### Update openclaw
Through Pinokio GUI (click Update), or manually:
```bash
cd "C:/pinokio/api/openclaw.pinokio.git"
git pull
npm i -g openclaw@latest
```

### Restart
Kill from Pinokio GUI, or:
```bash
taskkill /F /IM "openclaw.exe" 2>/dev/null
# Then start from Pinokio
```

## Known Issues (Windows)

### WhatsApp 440 death loop
Status 440 "Unknown Stream Errored (conflict)" → retries 12 times → auto-restart → retries 12 more → forever. Floods logs, wastes CPU. If WhatsApp isn't needed, disable it in config.

### Dashboard token loss on reconnect
After first WS disconnect, browser loses the token from the URL fragment. Every reconnect attempt fails with `token_missing`, spamming logs every 15 seconds. Workaround: refresh the dashboard URL with the full token.

### Lane wait exceeded
`diagnostic: lane wait exceeded` with `queueAhead=0` — the session lane blocks for 20-30s with nothing queued. Intermittent. No workaround yet.

## Config

OpenClaw config lives at `~/.openclaw/`. Key files:
- `gateway.yaml` — main config (not `gateway.cmd`)
- `agents/` — agent definitions
- `cron/` — scheduled tasks
- `credentials/` — API keys
- `identity/` — identity links

## WSL (Ubuntu 24.04)

OpenClaw also installed in WSL. Same version. Use it to confirm whether a bug is Windows-only or cross-platform.

```bash
wsl.exe -- openclaw --version    # 2026.2.23
```

**Run both side by side** on different ports to compare behavior:
```bash
# Windows: already on 18789 via Pinokio
# WSL: start on a different port
wsl.exe -- bash -c "OPENCLAW_GATEWAY_PORT=18790 openclaw gateway run"
```

Use cases:
- Same input, both gateways → compare output/errors
- Bug on Windows? Check WSL immediately → "Windows-only" or "cross-platform"
- Plugin install fails? Try both → isolate the environment

Node in WSL is native (`/usr/bin/node`), not the Windows symlink (fixed during setup).

## VPS (Linux)

OpenClaw also running on VPS via Tailscale:
- Host: `ubuntu-2204-jammy-amd64-base` (`100.107.90.127`)
- Dashboard: `https://ubuntu-2204-jammy-amd64-base.tailbd056e.ts.net`
- Tailnet-only (no public exposure, no funnel)
- No SSH access from here (port 22 refused)

Three environments total: Windows (Pinokio), WSL (local), VPS (Linux).

## Don't

- Don't `npm install -g openclaw` outside Pinokio — conflicts with Pinokio's isolated env
- Don't edit files in `C:/pinokio/api/openclaw.pinokio.git/` unless you know what you're doing — Pinokio's update will overwrite
- Don't kill the Pinokio Electron app while openclaw is running — orphans the gateway process
