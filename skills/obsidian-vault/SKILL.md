---
name: obsidian-vault
description: "Manage an Obsidian-style vault with markdown files, frontmatter queries, client CRM, project tracking, and task management. Use when asked about notes, clients, projects, follow-ups, daily notes, or vault queries."
---

# Obsidian Vault Skill

Manage structured markdown notes with YAML frontmatter. Works with any folder of `.md` files — Obsidian optional.

## Routing

**Trigger keywords**: notes, vault, clients, follow-up, projects, daily note, tasks, obsidian, frontmatter

## Vault Structure

```
vault/
├── Clients/        # CRM — one file per client
├── Projects/       # Project tracking
├── Tasks/          # Task files (or use TaskNotes API)
├── Daily/          # Daily notes (YYYY-MM-DD.md)
└── Notes/          # Everything else
```

## Querying — Use grep, NOT full file reads

**IMPORTANT:** Extract frontmatter with `grep`. Do NOT read full files unless asked.

### Projects
```bash
grep -l "" Projects/*.md | while read f; do
  echo "=== $(basename "$f" .md) ==="
  grep "^status:\|^priority:\|^deadline:" "$f"
done
```

### Clients
```bash
grep -l "" Clients/*.md | while read f; do
  echo "=== $(basename "$f" .md) ==="
  grep "^stage:\|^company:\|^next_action:" "$f"
done
```

### Daily Notes (recent)
```bash
ls -t Daily/*.md | head -5 | while read f; do
  echo "=== $(basename "$f" .md) ==="
  grep "^mood:\|^energy:\|^sleep_quality:" "$f"
done
```

**Always present results as markdown tables.**

## Client CRM

### Client file template
```markdown
---
type: client
name: Sarah Chen
email: sarah@example.com
company: TechStartup Inc
stage: lead          # lead | active | customer
next_action: 2026-01-10
next_action_note: Follow up on proposal
last_contact: 2026-01-05
---

# Sarah Chen

**Email:** sarah@example.com
**Company:** TechStartup Inc

## Notes

- Initial call about automation project
```

### Quick commands

| Say | Does |
|-----|------|
| "Who needs follow-up?" | Clients where `next_action <= today` |
| "Tell me about [name]" | Full client context |
| "Draft email to [name]" | Personalized follow-up using notes + context |
| "Add client [name]" | Create `Clients/[Name].md` from template |
| "Find leads" | `grep -l "stage: lead" Clients/*.md` |

### Check follow-ups
```bash
today=$(date +%Y-%m-%d)
grep -l "next_action:" Clients/*.md | while read f; do
  action_date=$(grep "^next_action:" "$f" | cut -d' ' -f2)
  if [[ "$action_date" < "$today" || "$action_date" == "$today" ]]; then
    name=$(grep "^name:" "$f" | cut -d: -f2- | xargs)
    note=$(grep "^next_action_note:" "$f" | cut -d: -f2- | xargs)
    echo "$name — $note (due $action_date)"
  fi
done
```

### Draft email workflow
1. Read client file for context (company, recent notes, action needed)
2. Draft brief, actionable email referencing previous interaction
3. Present draft and ask "Ready to send, or adjust?"

## Task Management

### File-based tasks
Tasks as markdown files with frontmatter:
```yaml
---
title: Review proposal
status: open          # open | in-progress | done
priority: high        # none | low | normal | high
project: "[[Website Redesign]]"
due: 2026-01-15
scheduled: 2026-01-10
---
```

### TaskNotes API (if plugin running)
```
Base: http://127.0.0.1:8090/api
```

| Action | Method | Endpoint |
|--------|--------|----------|
| List | GET | `/tasks` or `/tasks?status=in-progress` |
| Create | POST | `/tasks` with JSON body |
| Update | PUT | `/tasks/Tasks%2F{filename}.md` |
| Delete | DELETE | `/tasks/Tasks%2F{filename}.md` |
| Options | GET | `/options` |

**Create task:**
```bash
node -e "
const http = require('http');
const data = JSON.stringify({title:'Review proposal',status:'open',priority:'high',projects:['[[Website Redesign]]'],due:'2026-01-15'});
const req = http.request({hostname:'127.0.0.1',port:8090,path:'/api/tasks',method:'POST',headers:{'Content-Type':'application/json','Content-Length':data.length}}, res => {
  let body=''; res.on('data',c=>body+=c); res.on('end',()=>console.log(body));
});
req.write(data); req.end();
"
```

**Note:** Path must be URL-encoded (`/` → `%2F`, space → `%20`).

## Adding a new entity

1. Ask for required fields (name, email/company for clients; title/status for projects)
2. Create file from template in appropriate folder
3. Confirm creation, offer next step ("Want me to draft an intro email?")

## Notes
- Uses Node.js `http` module instead of curl for cross-platform compatibility
- Wikilinks (`[[Project Name]]`) for Obsidian graph connections
- Frontmatter must be valid YAML between `---` delimiters
