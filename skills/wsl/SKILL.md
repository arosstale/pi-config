---
name: wsl
description: "WSL (Windows Subsystem for Linux) management and cross-OS operations. Use when running Linux commands, managing WSL distros, sharing files between Windows and Linux, Docker via WSL, or when the user asks to do something in Linux."
---

# WSL Skill

Manage WSL2 distros and run Linux workloads from pi (which runs in Git Bash on Windows).

## Environment

- **WSL version:** 2
- **Default distro:** Ubuntu-24.04
- **Docker Desktop:** Available (WSL2 backend, currently stopped)
- **Pi shell:** Git Bash (MINGW64) — NOT inside WSL

## Running Commands in WSL

### Basic execution
```bash
# Run a single command (uses default distro)
wsl.exe -- ls -la /home

# Run in a specific distro
wsl.exe -d Ubuntu-24.04 -- command args

# Run as root
wsl.exe -u root -- apt update

# Run with a specific working directory
wsl.exe --cd /home/artale -- pwd
```

### Multi-line / complex commands
```bash
# Pipe a script in
wsl.exe -- bash -c 'echo "hello from $(uname -s)" && whoami'

# For complex scripts, write to a file first
cat > /tmp/wsl-script.sh << 'EOF'
#!/bin/bash
set -euo pipefail
echo "Running in: $(cat /etc/os-release | grep PRETTY_NAME)"
apt list --installed 2>/dev/null | wc -l
EOF
wsl.exe -- bash "$(wslpath -u "$(cygpath -w /tmp/wsl-script.sh)")"
```

### Interactive commands (avoid)
WSL commands that require a TTY (like `vim`, `top`, `htop`) will hang pi. Always use non-interactive alternatives:
```bash
# BAD — hangs
wsl.exe -- top

# GOOD — one-shot
wsl.exe -- bash -c "ps aux --sort=-%mem | head -20"
```

## Distro Management

```bash
# List distros with status and version
wsl.exe --list --verbose

# Start a stopped distro
wsl.exe -d Ubuntu-24.04 -- echo "started"

# Shutdown a specific distro
wsl.exe --terminate Ubuntu-24.04

# Shutdown all WSL
wsl.exe --shutdown

# Set default distro
wsl.exe --set-default Ubuntu-24.04

# Export a distro (backup)
wsl.exe --export Ubuntu-24.04 "C:\backups\ubuntu-backup.tar"

# Import a distro
wsl.exe --import MyDistro "C:\WSL\MyDistro" "C:\backups\ubuntu-backup.tar"

# Unregister (delete) a distro
wsl.exe --unregister DistroName

# Install a new distro
wsl.exe --install -d Ubuntu-24.04

# Update WSL itself
wsl.exe --update
```

## Path Translation

Windows and WSL have different filesystem views. Paths must be translated.

| From → To | Method | Example |
|-----------|--------|---------|
| Windows → WSL | `/mnt/c/...` | `C:\Users\Artale` → `/mnt/c/Users/Artale` |
| WSL → Windows | `\\wsl$\distro\...` | `/home/artale` → `\\wsl$\Ubuntu-24.04\home\artale` |
| Git Bash → WSL | chain conversion | `/c/Users/Artale` → `/mnt/c/Users/Artale` |

```bash
# Convert Windows path to WSL path (from inside WSL)
wsl.exe -- wslpath -u 'C:\Users\Artale\file.txt'
# → /mnt/c/Users/Artale/file.txt

# Convert WSL path to Windows path (from inside WSL)
wsl.exe -- wslpath -w '/home/artale/file.txt'
# → \\wsl$\Ubuntu-24.04\home\artale\file.txt

# Access WSL files from Windows/Git Bash
ls "//wsl$/Ubuntu-24.04/home/"

# Access Windows files from WSL
wsl.exe -- ls /mnt/c/Users/Artale/
```

## File Sharing

### Windows → WSL
Files under `/mnt/c/` are Windows files accessed from WSL. **Performance is slow** for heavy I/O (cross-filesystem penalty).

```bash
# Copy file to WSL native filesystem for better performance
wsl.exe -- cp /mnt/c/Users/Artale/project/data.csv /home/artale/data.csv
```

### WSL → Windows
```bash
# Copy from WSL to Windows
wsl.exe -- cp /home/artale/output.txt /mnt/c/Users/Artale/Desktop/output.txt

# Or access via UNC path from Git Bash
cp "//wsl$/Ubuntu-24.04/home/artale/output.txt" ~/Desktop/
```

## Package Management (inside WSL)

```bash
# Update packages
wsl.exe -u root -- bash -c "apt update && apt upgrade -y"

# Install packages
wsl.exe -u root -- apt install -y build-essential git curl

# Check installed
wsl.exe -- dpkg -l | grep package-name
```

## Docker via WSL

Docker Desktop uses WSL2 as its backend. When Docker Desktop is running, `docker` commands work from both Git Bash and WSL.

```bash
# Start Docker Desktop (from Windows)
powershell.exe -Command "Start-Process 'C:\Program Files\Docker\Docker\Docker Desktop.exe'"

# Wait for Docker to be ready
wsl.exe -- bash -c "until docker info &>/dev/null; do sleep 1; done; echo 'Docker ready'"

# Run containers
wsl.exe -- docker run --rm hello-world

# Docker compose
wsl.exe --cd /home/artale/project -- docker compose up -d
```

## Networking

WSL2 runs in a lightweight VM with its own IP. Localhost forwarding usually works automatically.

```bash
# Get WSL IP
wsl.exe -- hostname -I

# Get Windows IP from inside WSL
wsl.exe -- bash -c "cat /etc/resolv.conf | grep nameserver | awk '{print \$2}'"

# Port forwarding (if localhost forwarding doesn't work)
# From admin PowerShell:
# netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$(wsl hostname -I)
```

## WSL Config

### Per-distro: `/etc/wsl.conf` (inside WSL)
```bash
wsl.exe -- cat /etc/wsl.conf 2>/dev/null || echo "No wsl.conf"

# Example: auto-mount with metadata (fixes permissions)
wsl.exe -u root -- bash -c 'cat > /etc/wsl.conf << CONF
[automount]
enabled = true
options = "metadata,umask=22,fmask=11"

[interop]
enabled = true
appendWindowsPath = true
CONF'
```

### Global: `.wslconfig` (Windows side)
```bash
cat ~/.wslconfig 2>/dev/null || echo "No .wslconfig"

# Example: limit WSL memory and CPU
cat > ~/.wslconfig << 'EOF'
[wsl2]
memory=4GB
processors=2
swap=2GB
localhostForwarding=true
EOF
# Restart WSL for changes to take effect
wsl.exe --shutdown
```

## Common Tasks

### Run a dev server in WSL
```bash
# Start in background, capture port
wsl.exe -- bash -c "cd /home/artale/project && npm run dev &>/tmp/dev.log &"
# Check it's running
wsl.exe -- bash -c "curl -s localhost:3000 | head -5"
```

### Build a project in WSL (better I/O than cross-filesystem)
```bash
# Clone and build natively in WSL
wsl.exe -- bash -c "cd /home/artale && git clone https://github.com/user/repo.git && cd repo && make -j\$(nproc)"
```

### Check WSL resource usage
```bash
# Memory usage inside WSL
wsl.exe -- free -h

# Disk usage
wsl.exe -- df -h /

# Running processes
wsl.exe -- bash -c "ps aux --sort=-%mem | head -15"
```

### Reclaim disk space
WSL VHDs grow but don't shrink automatically:
```bash
# Compact the VHDX (run from admin PowerShell)
# First shutdown WSL
wsl.exe --shutdown
# Then:
# powershell.exe -Command "Optimize-VHD -Path 'C:\Users\Artale\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu24.04LTS_*\LocalState\ext4.vhdx' -Mode Full"
```

## Gotchas

1. **WSL must be started** — If the distro is stopped, the first `wsl.exe` command starts it (takes a few seconds). Check with `wsl.exe -l -v`.

2. **Cross-filesystem performance** — Accessing `/mnt/c/` from WSL (or `\\wsl$\` from Windows) is ~5-10x slower than native filesystem. Keep heavy I/O workloads on the native side.

3. **File permissions** — Windows files accessed via `/mnt/c/` show as 777 by default. Use `wsl.conf` with `metadata` option to preserve Linux permissions.

4. **Line endings** — Files created on Windows have CRLF. WSL expects LF. Use `dos2unix` or configure git:
   ```bash
   wsl.exe -- git config --global core.autocrlf input
   ```

5. **Clock skew** — WSL clock can drift after sleep/hibernate. Fix with:
   ```bash
   wsl.exe -u root -- hwclock -s
   ```

6. **Memory** — WSL2 takes up to 50% of host RAM by default (or 8GB, whichever is less). On a 16GB system, this can starve Windows. Limit it in `.wslconfig`.

7. **DNS issues** — If DNS breaks after VPN connect, fix resolv.conf:
   ```bash
   wsl.exe -u root -- bash -c "echo 'nameserver 8.8.8.8' > /etc/resolv.conf"
   ```
