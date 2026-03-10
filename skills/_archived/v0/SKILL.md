---
name: v0
description: Generate UIs, apps, and deploy to Vercel using v0 Platform API and SDK. Use when asked to "v0 generate", "scaffold a UI", "create a landing page with v0", "deploy to Vercel", or any v0.dev-related task. Programmatic access to v0's AI code generation.
---

# v0 — Vercel AI Code Generation

Generate working applications from natural language, get files back, deploy to Vercel — all from CLI.

## Setup

```bash
npm install v0-sdk
```

**API Key**: Get from [v0.dev/settings](https://v0.dev/settings) → API Keys.

```bash
export V0_API_KEY="your-key-here"
```

## Quick Start

```ts
import { V0 } from 'v0-sdk';

const v0 = new V0({ apiKey: process.env.V0_API_KEY });

// Generate an app
const chat = await v0.chats.create({
  message: 'Build a todo app with React and TypeScript',
});

// Access generated files
chat.files?.forEach((file) => {
  console.log(`File: ${file.name}`);
  console.log(`Content: ${file.content}`);
});

// Get live preview URL
console.log(`Preview: ${chat.latestVersion?.demoUrl}`);
```

## Core API

### Chats (Generate Code)

```ts
// Create — natural language → code
const chat = await v0.chats.create({
  message: 'Create a responsive navbar with shadcn/ui',
  system: 'You are an expert React developer',  // optional
});

// Follow-up refinement
const response = await v0.chats.sendMessage(chat.id, {
  message: 'Add dark mode support',
});

// Get chat with all versions
const chatData = await v0.chats.getById(chat.id);
```

### Projects

```ts
const project = await v0.projects.create({ name: 'My App' });
const projects = await v0.projects.find();
const projectData = await v0.projects.getById(project.id);
```

### Deployments

```ts
const deployment = await v0.deployments.create({
  projectId: project.id,
  chatId: chat.id,
  versionId: chat.latestVersion.id,
});

const status = await v0.deployments.getById(deployment.id);
const logs = await v0.deployments.findLogs(deployment.id);
```

### User

```ts
const user = await v0.user.get();
const billing = await v0.user.getBilling();
const plan = await v0.user.getPlan();
```

## Client Options

```ts
const v0 = new V0({
  apiKey: 'your-api-key',
  baseURL: 'https://api.v0.dev/v1',  // default
  timeout: 30000,
  maxRetries: 3,
});
```

## Error Handling

```ts
import { V0Error } from 'v0-sdk';

try {
  const chat = await v0.chats.create({ message: 'Create an app' });
} catch (error) {
  if (error instanceof V0Error) {
    console.error(`${error.status}: ${error.message} (${error.code})`);
  }
}
```

## Workflow: Prompt → Files → Deploy

```ts
// 1. Generate
const chat = await v0.chats.create({ message: 'SaaS landing page with pricing' });

// 2. Get files
chat.files?.forEach(f => writeFileSync(f.name, f.content));

// 3. Refine
await v0.chats.sendMessage(chat.id, { message: 'Make CTA buttons orange' });

// 4. Deploy
const project = await v0.projects.create({ name: 'my-saas' });
await v0.deployments.create({
  projectId: project.id,
  chatId: chat.id,
  versionId: chat.latestVersion.id,
});
```

## Key Facts

- **Stack**: React + TypeScript + Tailwind + shadcn/ui
- **Deploys to**: Vercel (instant)
- **Node.js**: 22+
- **npm**: `v0-sdk`
- **Docs**: [v0.app/docs](https://v0.app/docs)
