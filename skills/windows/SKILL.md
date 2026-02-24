---
name: windows
description: "Windows-specific patterns for pi running on Git Bash (MINGW64). Use when dealing with paths, processes, permissions, registry, services, Windows tools, or any Windows-native operation."
---

# Windows Skill

Pi runs inside **Git Bash (MINGW64)** on Windows. The default shell is bash, but Windows-native tools are available via `cmd.exe /c`, `powershell.exe -Command`, and `pwsh.exe -Command`.

## Environment

- **OS:** Windows 11 (build 26200)
- **Shell:** Git Bash (MINGW64) — NOT PowerShell, NOT WSL
- **Node:** v22 via NVM (`C:\Users\Artale\AppData\Local\nvm`)
- **Package managers:** winget, choco (chocolatey)
- **PowerShell:** 5.1 (Windows) + 7.5 (pwsh.exe)

## Path Translation

Git Bash uses POSIX-style paths. Many Windows tools need native paths.

| Context | Format | Example |
|---------|--------|---------|
| bash commands | `/c/Users/Artale/...` | `ls /c/Users/Artale` |
| cmd.exe / powershell | `C:\Users\Artale\...` | `cmd.exe /c "dir C:\Users\Artale"` |
| node / pi tools | Either works | `read("C:\\Users\\Artale\\file.txt")` |
| Environment vars | Windows-style | `$APPDATA` → `/c/Users/Artale/AppData/Roaming` |

**Convert paths:**
```bash
# POSIX → Windows
cygpath -w /c/Users/Artale     # → C:\Users\Artale

# Windows → POSIX
cygpath -u 'C:\Users\Artale'   # → /c/Users/Artale
```

## Running Windows Commands

### cmd.exe
```bash
cmd.exe /c "command here" 2>&1
```

### PowerShell (use for WMI, registry, services, ACLs)
```bash
# Windows PowerShell 5.1
powershell.exe -NoProfile -Command "Get-Process | Sort-Object WS -Descending | Select -First 10"

# PowerShell 7 (preferred for complex scripts)
pwsh.exe -NoProfile -Command "Get-ChildItem"
```

**Escape rules for PowerShell in bash:**
- Dollar signs: `\$variable` (escape from bash)
- Single quotes inside: use double-quotes or `''` (two singles)
- Multiline: use heredoc or `-File` with a temp .ps1

### Complex PowerShell scripts
```bash
# Write to temp file and execute — avoids escaping hell
cat > /tmp/script.ps1 << 'EOF'
$procs = Get-Process | Sort-Object WS -Descending | Select-Object -First 10
$procs | Format-Table Name, Id, @{N='MB';E={[math]::Round($_.WS/1MB)}} -AutoSize
EOF
pwsh.exe -NoProfile -File "$(cygpath -w /tmp/script.ps1)"
```

## Common Tasks

### Process Management
```bash
# List processes (prefer PowerShell — richer output)
powershell.exe -Command "Get-Process | Sort WS -Desc | Select -First 15 Name, Id, @{N='MB';E={[math]::Round(\$_.WS/1MB)}}"

# Kill by name
taskkill /F /IM "process.exe"

# Kill by PID
taskkill /F /PID 12345

# Find what's using a port
powershell.exe -Command "Get-NetTCPConnection -LocalPort 3000 | Select OwningProcess"
```

### Memory & System Info
```bash
# Free memory
powershell.exe -Command "\$os = Get-CimInstance Win32_OperatingSystem; 'Free: {0:N0} MB / Total: {1:N0} MB' -f (\$os.FreePhysicalMemory/1024), (\$os.TotalVisibleMemorySize/1024)"

# Disk space
powershell.exe -Command "Get-PSDrive -PSProvider FileSystem | Format-Table Name, @{N='Free(GB)';E={[math]::Round(\$_.Free/1GB,1)}}, @{N='Used(GB)';E={[math]::Round(\$_.Used/1GB,1)}}"
```

### File Permissions & Ownership
```bash
# View ACLs
icacls "C:\path\to\file"

# Grant full control
icacls "C:\path\to\dir" /grant Artale:F /t

# Take ownership (may need admin)
takeown /f "C:\path" /r /d y

# Remove stubborn directories
cmd.exe /c "rd /s /q C:\path\to\dir"
```

### Services
```bash
# List services
powershell.exe -Command "Get-Service | Where-Object {\$_.Status -eq 'Running'} | Sort DisplayName"

# Start/stop
powershell.exe -Command "Start-Service 'ServiceName'"
powershell.exe -Command "Stop-Service 'ServiceName'"
```

### Registry
```bash
powershell.exe -Command "Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion'"
```

### Networking
```bash
# Flush DNS
ipconfig /flushdns

# Open ports
netstat -ano | grep LISTENING

# Firewall rules
powershell.exe -Command "Get-NetFirewallRule | Where Enabled -eq True | Select DisplayName, Direction, Action | Sort DisplayName"
```

### Package Management
```bash
# winget (preferred)
winget search "package"
winget install "package"
winget upgrade --all

# Chocolatey
choco search "package"
choco install "package" -y
choco upgrade all -y
```

### Environment Variables
```bash
# Read (from bash)
echo "$APPDATA"
echo "$LOCALAPPDATA"
echo "$USERPROFILE"

# Set persistent (user-level)
powershell.exe -Command "[Environment]::SetEnvironmentVariable('VAR_NAME', 'value', 'User')"

# Set persistent (system-level — needs admin)
powershell.exe -Command "[Environment]::SetEnvironmentVariable('VAR_NAME', 'value', 'Machine')"
```

## Gotchas

1. **ENOMEM errors** — Windows doesn't have swap by default. When RAM is full, `spawn` fails. Check free memory first if child processes fail.

2. **Path length limit** — Windows has 260 char limit by default. Enable long paths:
   ```bash
   # Needs admin
   powershell.exe -Command "Set-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'LongPathsEnabled' -Value 1"
   ```

3. **Line endings** — Git Bash uses LF, Windows expects CRLF. Watch for this in scripts.
   ```bash
   # Check
   file myfile.txt  # shows "CRLF" or "LF"
   # Convert
   dos2unix myfile.txt
   unix2dos myfile.txt
   ```

4. **Symlinks** — Git Bash symlinks may not work as expected. Windows symlinks need Developer Mode or admin. Use `mklink` via cmd for Windows-native symlinks:
   ```bash
   cmd.exe /c "mklink /D link target"
   ```

5. **Temp directory** — `os.tmpdir()` returns `C:\Users\Artale\AppData\Local\Temp`. Zombie directories with broken ACLs happen after crashes. Override with `$env:TMP` / `$env:TEMP` if needed.

6. **Admin elevation** — pi cannot self-elevate. If a command needs admin, tell the user to open an elevated terminal and run the command manually.

7. **Antivirus** — Windows Defender (MsMpEng) can lock files and eat memory. If file operations fail mysteriously, it may be scanning.

8. **Locked files** — Windows locks open files. Can't delete/move files in use. Use `handle.exe` (SysInternals) or Resource Monitor to find the locking process.
