---
name: gogcli
description: All-in-one Google Workspace CLI tool with 98% token savings over MCP. Use when user needs Gmail, Calendar, Drive, Contacts, Tasks, Sheets, Docs, Slides, or People API access.
---

# GogCLI Skill

**All-in-one Google Workspace CLI tool**

## Description

GogCLI provides unified access to all Google services through a single command-line tool. It's 98% more token-efficient than MCP and supports Gmail, Calendar, Drive, Contacts, Tasks, Sheets, Docs, Slides, and People APIs.

## Installation

### Windows
```powershell
# Download binary
curl -L -o gogcli.zip https://github.com/steipete/gogcli/releases/download/v0.4.2/gogcli_0.4.2_windows_amd64.zip
Expand-Archive gogcli.zip -DestinationPath C:\Users\Artale\gogcli

# Add to PATH
$env:Path += ";C:\Users\Artale\gogcli"
```

### macOS/Linux
```bash
brew install steipete/tap/gogcli
```

## Configuration

### 1. Get OAuth Credentials
1. Go to: https://console.cloud.google.com/
2. Create project
3. Enable APIs: Calendar, Drive, Gmail, Contacts, Tasks, Sheets, Docs, Slides, People
4. Create OAuth client (Desktop app)
5. Download JSON file

### 2. Configure GogCLI
```bash
# Set credentials
gog auth credentials ~/Downloads/client_secret_....json

# Add account
gog auth add you@gmail.com

# Set environment variable
export GOG_ACCOUNT=you@gmail.com
```

## Usage

### Calendar
```bash
# List calendars
gog calendar calendars

# List events
gog calendar events --from now --to +7d

# Upcoming events
gog calendar events --from now --to +24h
```

### Gmail
```bash
# Search unread
gog gmail search "is:unread"

# Search from sender
gog gmail search "from:important@domain.com"

# List labels
gog gmail labels list
```

### Drive
```bash
# List files
gog drive ls

# Search by name
gog drive ls --query "name contains 'report'"

# List PDFs
gog drive ls --query "mimeType = 'application/pdf'"
```

### Contacts
```bash
gog contacts list
gog contacts search "Smith"
```

### Tasks
```bash
gog tasks lists
gog tasks list --list "My Tasks"
gog tasks create --list "My Tasks" --title "Buy milk"
```

### Sheets
```bash
gog sheets list
gog sheets read <spreadsheet-id> --sheet "Sheet1"
```

### Docs
```bash
gog docs list
gog docs read <document-id>
```

### Slides
```bash
gog slides list
```

### People
```bash
gog people profile
```

## Token Efficiency

**GogCLI vs MCP:**
- GogCLI: ~225 tokens per operation
- MCP: ~13,000 tokens per operation
- **Savings: 98%**

## Node.js Wrappers

Our project includes Node.js wrappers for easier integration:

```bash
# Calendar
node agent-tools/gogcli/calendar.js upcoming --hours 24 --json

# Gmail
node agent-tools/gogcli/gmail.js messages search "is:unread" --json

# Drive
node agent-tools/gogcli/drive.js ls --max 10 --json

# Tasks
node agent-tools/gogcli/tasks.js list --list "My Tasks" --json
```

## Agents

### Morning Brief Agent
```bash
npm run gogcli-brief
```

Shows:
- Upcoming calendar events
- Unread emails summary
- Recent Drive files

### Skill Demo Agent
```bash
npm run gogcli-demo
```

Demonstrates all gogcli capabilities.

## JSON Output

For scripting and agent integration:
```bash
gog calendar calendars --json
gog gmail search "is:unread" --json
gog drive ls --json
```

## Environment Variables

```bash
GOG_ACCOUNT=you@gmail.com
GOG_PATH=/path/to/gog  # Optional, auto-detected
```

## Examples

### Daily Workflow
```bash
# Check morning schedule
gog calendar events --from now --to +24h

# Check unread emails
gog gmail search "is:unread"

# List recent files
gog drive ls --max 10
```

### Meeting Prep
```bash
# Get attendee contacts
gog contacts search "meeting attendee"

# Check calendar
gog calendar events --from today --to +3d

# Find relevant files
gog drive ls --query "name contains 'presentation'"
```

### Task Management
```bash
# List tasks
gog tasks list --list "My Tasks"

# Add new task
gog tasks create --list "My Tasks" --title "Follow up on email"
```

## Troubleshooting

### "Insufficient permissions"
```bash
# Re-authenticate with all scopes
gog auth add you@gmail.com
```

### "Account not set"
```bash
export GOG_ACCOUNT=you@gmail.com
# or
gog <service> --account you@gmail.com <command>
```

### Browser doesn't open
```bash
# Use manual mode
gog auth add you@gmail.com --manual
# Then copy/paste the URL
```

## Related Skills

- **gccli** - Google Calendar (standalone)
- **gdcli** - Google Drive (standalone)
- **gmcli** - Google Gmail (standalone)
- **browser-tools** - Chrome automation
- **brave-search** - Web search

## References

- [GogCLI GitHub](https://github.com/steipete/gogcli)
- [Google Cloud Console](https://console.cloud.google.com/)
- [WINDOWS-SETUP.md](../WINDOWS-SETUP.md)
- [GOGCLI-QUICK-START.md](../GOGCLI-QUICK-START.md)