---
name: obsidian-vault
description: "Manage Obsidian vaults via the official CLI (v1.12.4+). Read, search, write, move notes, manage tags, properties, links, and daily notes — all through Obsidian's internal API so wikilinks and index stay intact. Use when asked about notes, vault, obsidian, daily notes, tags, properties, backlinks, orphans, or vault health."
---

# Obsidian Vault Skill

Manage Obsidian vaults using the **official Obsidian CLI** (v1.12.4+, Feb 2026).

## Key Design

The CLI is a **remote control for a running Obsidian app** — every operation goes through Obsidian's internal API. File moves auto-update wikilinks. Property changes update the index. No more breaking links with raw `mv`.

**Obsidian must be running.** If not, the CLI auto-launches it (wait for startup).

## Setup

1. Update Obsidian to ≥1.12.4
2. Settings → General → Command line interface → Enable → Register CLI
3. Add to PATH (Windows: add binary path to environment variables)
4. Verify: `obsidian version`

## Command Syntax

```
obsidian <command> [param=value] [flag]
```

Multiple vaults: `obsidian vault="MyVault" <command>`

## File Operations

```bash
# List all notes
obsidian files

# Folder tree
obsidian folders

# Read a note
obsidian read file="Projects/my-project"

# File metadata
obsidian file file="Projects/my-project"

# Create
obsidian create name="Notes/new-note" content="# Title"

# Create from template
obsidian create name="Reading/book-name" template="BookNote"

# Append to end
obsidian append file="Projects/log" content="\n\n## Update\n- Done"

# Insert after frontmatter
obsidian prepend file="Daily/2026-03-09" content="Weather: sunny"

# Move (auto-updates ALL wikilinks)
obsidian move file="Inbox/idea" to="Projects/"

# Delete (to trash)
obsidian delete file="old-note"

# Permanent delete
obsidian delete file="old-note" permanent
```

## Properties (Frontmatter)

```bash
# View properties
obsidian properties file="my-note"

# Set a property
obsidian property:set file="my-note" name="status" value="done"
obsidian property:set file="my-note" name="category" value="tech"

# Remove a property
obsidian property:remove file="my-note" name="status"

# Bulk set via pipe
obsidian files | while read -r f; do
  obsidian property:set file="$f" name="reviewed" value="true"
done
```

## Search

```bash
# Full-text search
obsidian search query="TODO"

# Search with context lines (grep-like)
obsidian search:context query="bottleneck" limit=10

# JSON output for scripting
obsidian search query="TODO" format=json | jq '.[].file'
```

## Tags

```bash
# List all tags
obsidian tags

# Files with a specific tag
obsidian tag tag="#project"

# Bulk rename a tag across entire vault
obsidian tags:rename old=meeting new=meetings
```

## Links & Graph Health

```bash
# Outgoing links
obsidian links file="MOC-Reading"

# Backlinks (what links TO this note)
obsidian backlinks file="Zettelkasten"

# Broken links (targets that don't exist)
obsidian unresolved

# Orphan notes (nothing links to them)
obsidian orphans
```

## Daily Notes

```bash
# Open/create today's daily note
obsidian daily

# Append to today
obsidian daily:append content="- [ ] Review PRs"

# Read today's note
obsidian daily:read

# Get daily note path
obsidian daily:path
```

## Plugins & Themes

```bash
# List plugins
obsidian plugins

# Enable/disable
obsidian plugin:enable id=dataview
obsidian plugin:disable id=calendar

# Hot-reload (dev)
obsidian plugin:reload id=my-plugin

# Themes
obsidian themes
obsidian theme:set name="Minimal"

# CSS snippets
obsidian snippets
```

## Developer / Eval

```bash
# Run JS against Obsidian's app object
obsidian eval code="app.vault.getFiles().length"
obsidian eval code="app.workspace.getActiveFile()?.path"

# DevTools
obsidian devtools

# Screenshot (base64 PNG)
obsidian dev:screenshot

# Console messages / errors
obsidian dev:console
obsidian dev:errors
```

## Output Formats

| Format | Use |
|--------|-----|
| `json` | Pipe to `jq` |
| `csv` / `tsv` | Spreadsheet export |
| `md` | Markdown |
| `paths` | File paths only (for piping) |
| `text` | Human-readable (default) |
| `tree` | Folder hierarchy |
| `yaml` | YAML (default for properties) |

```bash
obsidian search query="TODO" format=json
obsidian files format=paths
```

## Recipes

### Vault health check
```bash
echo "=== Vault Health ==="
echo "Files: $(obsidian eval code='app.vault.getFiles().length')"
echo ""
echo "## Orphans"
obsidian orphans
echo ""
echo "## Unresolved Links"
obsidian unresolved
echo ""
echo "## Tags"
obsidian tags
```

### Classify inbox with AI
```bash
obsidian tag tag="#inbox" | while read -r note; do
  content=$(obsidian read file="$note")
  # Agent analyzes content, decides category
  obsidian move file="$note" to="Tech/"
  obsidian property:set file="$note" name="category" value="tech"
done
```

### Bulk tag by folder
```bash
obsidian tag tag="#archive" | xargs -I{} obsidian move file="{}" to="Archive/"
```

### Weekly cron report
```bash
# Append vault health to daily note every Monday
obsidian daily:append content="$(./vault-health.sh)"
```

### Client CRM pattern
```bash
# Create client note
obsidian create name="Clients/Sarah Chen" content="# Sarah Chen\n\n**Company:** TechStartup Inc\n**Email:** sarah@example.com"
obsidian property:set file="Clients/Sarah Chen" name="stage" value="lead"
obsidian property:set file="Clients/Sarah Chen" name="next_action" value="2026-03-15"

# Check follow-ups
obsidian search query="next_action" format=json | jq '.[] | select(.file | startswith("Clients/"))'
```

## When to Use What

| Operation | Tool | Why |
|-----------|------|-----|
| Move/rename notes | **CLI** | Auto-updates wikilinks |
| Set properties | **CLI** | Index stays in sync |
| Bulk tag rename | **CLI** (`tags:rename`) | One command |
| Orphan/link check | **CLI** | Built-in commands |
| Bulk process 3000+ files | **Python/Node script** | CLI is sequential, slow at scale |
| Complex plugin config | **Direct JSON** (Obsidian closed) | CLI doesn't cover all settings |

## Limitations

- **Obsidian must be running** — remote control, not headless (except Sync)
- **Desktop only** — no CLI on iOS/Android
- **Sequential execution** — each command round-trips to the app, slow for thousands of files
- **Multiple vaults** — must specify `vault="Name"` every time
