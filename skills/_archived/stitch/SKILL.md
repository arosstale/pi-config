---
name: stitch
description: Generate UIs with Google Stitch AI and pull designs into local dev workflow. Use when asked to "stitch generate", "Google Stitch", "design a UI with Stitch", "stitch-mcp", or any stitch.withgoogle.com task. Covers both the web tool and the CLI/MCP integration.
---

# Google Stitch — AI UI Generation

Generate mobile and web UIs from text descriptions, pull them into your dev workflow via CLI/MCP.

## What Is Stitch?

[stitch.withgoogle.com](https://stitch.withgoogle.com) — Google's AI design tool (launched I/O 2025). Describe an app in plain English, get full UI screens. Iterate via chat. Export to code.

## CLI: stitch-mcp

The `@_davideast/stitch-mcp` CLI bridges Stitch designs → local dev workflow.

### Install

```bash
# Run directly (no install)
npx @_davideast/stitch-mcp <command>

# Or install globally
npm install -g @_davideast/stitch-mcp
```

### Setup

```bash
# Guided wizard — handles gcloud, auth, MCP config
npx @_davideast/stitch-mcp init

# OR use API key (skip OAuth)
export STITCH_API_KEY="your-api-key"
```

### Core Commands

| Command | Description |
|---------|-------------|
| `init` | Set up auth, gcloud, MCP client config |
| `doctor` | Verify configuration health |
| `serve -p <id>` | Preview project screens locally (Vite dev server) |
| `screens -p <id>` | Browse screens in terminal |
| `view` | Interactive resource browser |
| `site -p <id>` | Generate Astro site from screens |
| `snapshot` | Save screen state to file |
| `tool [name]` | Invoke MCP tools from CLI |
| `proxy` | Run MCP proxy for coding agents |
| `logout` | Revoke credentials |

### Preview Designs Locally

```bash
# Serve all screens from a project on a local dev server
npx @_davideast/stitch-mcp serve -p <project-id>

# Browse screens interactively (c=copy, s=preview, o=open in Stitch, q=quit)
npx @_davideast/stitch-mcp view --projects
```

### Build a Site from Designs

```bash
# Generate an Astro project by mapping screens to routes
npx @_davideast/stitch-mcp site -p <project-id>
```

### MCP Integration (for coding agents)

Add to your MCP client config (VS Code, Cursor, Claude Code, Gemini CLI, pi):

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"]
    }
  }
}
```

### Virtual Tools (via MCP proxy)

| Tool | Description |
|------|-------------|
| `build_site` | Build a site from project, mapping screens to routes |
| `get_screen_code` | Get a screen's HTML code |
| `get_screen_image` | Get a screen's screenshot as base64 |

```bash
# Invoke a tool from CLI
npx @_davideast/stitch-mcp tool build_site -d '{
  "projectId": "123456",
  "routes": [
    { "screenId": "abc", "route": "/" },
    { "screenId": "def", "route": "/about" }
  ]
}'

# List all available tools
npx @_davideast/stitch-mcp tool

# Show a tool's schema
npx @_davideast/stitch-mcp tool get_screen_code -s
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `STITCH_API_KEY` | API key (skips OAuth) |
| `STITCH_ACCESS_TOKEN` | Pre-existing access token |
| `STITCH_USE_SYSTEM_GCLOUD` | Use system gcloud config |
| `STITCH_PROJECT_ID` | Override project ID |
| `STITCH_HOST` | Custom API endpoint |

### Manual gcloud Setup

```bash
gcloud auth application-default login
gcloud config set project <PROJECT_ID>
gcloud beta services mcp enable stitch.googleapis.com --project=<PROJECT_ID>
```

## Workflow: Design → Code → Ship

1. **Design** in Stitch web UI (stitch.withgoogle.com) — describe your app, iterate
2. **Pull** designs locally: `npx @_davideast/stitch-mcp serve -p <project-id>`
3. **Build** an Astro site: `npx @_davideast/stitch-mcp site -p <project-id>`
4. **Hand off** to coding agent via MCP proxy for implementation
5. **Deploy** the generated Astro site anywhere

## Key Facts

- **Web**: stitch.withgoogle.com (free, Google account)
- **CLI**: `@_davideast/stitch-mcp` (npm, Apache 2.0)
- **Output**: HTML/CSS screens
- **Site builder**: Astro
- **MCP**: Full proxy for VS Code, Cursor, Claude Code, Gemini CLI, pi
- **Auth**: Google OAuth or API key
- **Note**: stitch-mcp is community-built (davideast), NOT official Google
