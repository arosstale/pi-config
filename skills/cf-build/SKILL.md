---
name: cf-build
description: Build and deploy full-stack AI apps with Cloudflare VibeSDK and Workers. Use when asked to "cloudflare build", "vibesdk", "cf build", "deploy to workers", "vibe coding", or any Cloudflare AI app generation task. Covers the VibeSDK platform, SDK, and Wrangler CLI.
---

# Cloudflare VibeSDK — AI Full-Stack App Generator

Open source AI vibe coding platform on Cloudflare's developer stack. Generate full-stack React+TS apps from natural language, deploy to Workers.

**Live**: [build.cloudflare.dev](https://build.cloudflare.dev)  
**Repo**: [github.com/cloudflare/vibesdk](https://github.com/cloudflare/vibesdk)

## SDK Quick Start

```bash
npm install @cf-vibesdk/sdk
```

```ts
import { PhasicClient } from '@cf-vibesdk/sdk';

const client = new PhasicClient({
  baseUrl: 'https://build.cloudflare.dev',
  apiKey: process.env.VIBESDK_API_KEY!,
});

// Build an app from a prompt
const session = await client.build('Build a todo app with React', {
  projectType: 'app',
  autoGenerate: true,
});

// Wait for it to be deployable
await session.wait.deployable();

// Deploy preview
session.deployPreview();
const preview = await session.wait.previewDeployed();
console.log('Preview URL:', preview.previewURL);

// Access generated files
const paths = session.files.listPaths();       // ['src/App.tsx', ...]
const code = session.files.read('src/App.tsx'); // file content
const all = session.files.snapshot();           // { path: content }

session.close();
```

## Authentication

```ts
// API key (recommended)
const client = new PhasicClient({
  baseUrl: 'https://build.cloudflare.dev',
  apiKey: 'vibe_xxxxxxxxxxxx',
});

// Pre-minted JWT
const client = new PhasicClient({
  baseUrl: 'https://build.cloudflare.dev',
  token: 'eyJhbGciOiJIUzI1NiIs...',
});
```

## Three Client Types

| Client | Default Behavior |
|--------|------------------|
| `VibeClient` | No default — specify `behaviorType` |
| `PhasicClient` | Phase-based generation (structured) |
| `AgenticClient` | Autonomous agent (free-form) |

## Build Options

```ts
const session = await client.build('Build a weather dashboard', {
  projectType: 'app',           // 'app' | 'component' | 'api'
  behaviorType: 'phasic',       // 'phasic' | 'agentic'
  language: 'typescript',
  frameworks: ['react'],
  selectedTemplate: 'vite',
  autoConnect: true,
  autoGenerate: true,
  credentials: { /* provider API keys */ },
  onBlueprintChunk: (chunk) => console.log(chunk),
});
```

## Session Lifecycle

```ts
// Control
session.startGeneration();
session.stop();
session.resume();
session.deployPreview();
session.deployCloudflare();
session.close();

// Follow-up refinement
session.followUp('Add dark mode support', {
  images: [{ base64: '...', mimeType: 'image/png' }],
});

// Wait helpers
await session.wait.generationStarted({ timeoutMs: 60_000 });
await session.wait.generationComplete({ timeoutMs: 600_000 });
await session.wait.deployable();
const preview = await session.wait.previewDeployed();
const cf = await session.wait.cloudflareDeployed();
```

## Phase Timeline (Phasic Mode)

```ts
const phases = session.phases.list();
// [{ id: 'phase-0', name: 'Core Setup', status: 'completed', files: [...] }]

const current = session.phases.current();
const done = session.phases.completed();
const allDone = session.phases.allCompleted();

// Subscribe to phase changes
session.phases.onChange((event) => {
  console.log(`${event.type}: ${event.phase.name} → ${event.phase.status}`);
});
```

## Events

```ts
session.on('connected', (msg) => { });
session.on('generation', (msg) => { });  // started, complete, stopped
session.on('phase', (msg) => { });       // generating, implementing, validating
session.on('file', (msg) => { });        // generating, generated
session.on('preview', (msg) => { });     // started, completed, failed
session.on('cloudflare', (msg) => { });  // started, completed, error
session.on('error', ({ error }) => { });
```

## App Management

```ts
const publicApps = await client.apps.listPublic({ limit: 20, sort: 'recent' });
const myApps = await client.apps.listMine();
const app = await client.apps.get('app-id');

await client.apps.delete('app-id');
await client.apps.setVisibility('app-id', 'public');
await client.apps.toggleStar('app-id');

// Git clone
const { cloneUrl, expiresAt } = await client.apps.getGitCloneToken('app-id');
```

## Connect to Existing Session

```ts
const session = await client.connect('agent-id-here');
await session.connect();

// State is restored from the agent
console.log('Query:', session.state.get().query);
console.log('Files:', session.files.listPaths());
console.log('Phases:', session.phases.list());
```

## Deploy Your Own Instance

```bash
# One-click deploy
# https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/vibesdk
```

### Requirements
- Cloudflare Workers Paid Plan
- Workers for Platforms subscription
- Google Gemini API Key (`GOOGLE_AI_STUDIO_API_KEY`)

### Wrangler CLI (for manual deploy)

```bash
npm create cloudflare@latest     # scaffold
npx wrangler dev                 # local dev
npx wrangler deploy              # deploy to Workers
npx wrangler tail                # stream logs
npx wrangler d1 list             # list D1 databases
npx wrangler r2 bucket list      # list R2 buckets
```

### Sandbox Instance Types

| Type | Memory | CPU | Disk |
|------|--------|-----|------|
| `lite` | 256 MiB | 1/16 vCPU | 2 GB |
| `standard-1` | 4 GiB | 1/2 vCPU | 8 GB |
| `standard-2` | 8 GiB | 1 vCPU | 12 GB |
| `standard-3` (default) | 12 GiB | 2 vCPU | 16 GB |
| `standard-4` | 12 GiB | 4 vCPU | 20 GB |

## Cloudflare Stack

| Layer | Service |
|-------|---------|
| Frontend | React + Vite + Tailwind |
| Backend | Workers + Durable Objects |
| Database | D1 (SQLite) + Drizzle ORM |
| AI | Multiple LLMs via AI Gateway |
| Containers | Sandboxed app previews |
| Storage | R2 buckets, KV for sessions |
| Deploy | Workers for Platforms |

## Wrangler Cheat Sheet

```bash
# Project setup
npm create cloudflare@latest
npx wrangler init

# Development
npx wrangler dev                  # local dev server
npx wrangler dev --remote         # remote dev (uses CF infra)

# Deploy
npx wrangler deploy               # deploy to production
npx wrangler deploy --dry-run     # preview what would deploy
npx wrangler rollback             # rollback to previous version

# Logs & Debug
npx wrangler tail                 # stream live logs
npx wrangler tail --format json   # JSON format

# D1 Database
npx wrangler d1 create <name>
npx wrangler d1 execute <db> --command "SELECT * FROM users"
npx wrangler d1 execute <db> --file schema.sql

# R2 Storage
npx wrangler r2 bucket create <name>
npx wrangler r2 object put <bucket>/<key> --file ./data.json

# KV Namespace
npx wrangler kv namespace create <name>
npx wrangler kv key put --binding=<NS> "key" "value"

# Secrets
npx wrangler secret put <name>    # prompted for value
npx wrangler secret list

# Workers AI
npx wrangler ai models            # list available models
```

## Key Facts

- **SDK**: `@cf-vibesdk/sdk` (npm, MIT)
- **Stack**: React + TypeScript + Tailwind
- **Deploys to**: Cloudflare Workers
- **Node.js**: 22+ (native WebSocket)
- **Build modes**: Phasic (structured phases) or Agentic (autonomous)
- **GitHub**: github.com/cloudflare/vibesdk
- **Live demo**: build.cloudflare.dev
