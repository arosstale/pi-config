#!/usr/bin/env node
/**
 * Unified Image Generator CLI
 *
 * Automatically routes to best available provider based on:
 * - API keys available
 * - Model preference
 * - Cost/speed requirements
 *
 * Usage:
 *   node imagen.mjs "prompt" [output.png] [--provider fal|openrouter|google]
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse arguments
const args = process.argv.slice(2);
let prompt = null;
let output = null;
let provider = null;
let model = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--provider' || args[i] === '-p') {
    provider = args[++i];
  } else if (args[i] === '--model' || args[i] === '-m') {
    model = args[++i];
  } else if (args[i] === '--help' || args[i] === '-h') {
    showHelp();
    process.exit(0);
  } else if (!prompt) {
    prompt = args[i];
  } else if (!output) {
    output = args[i];
  }
}

function showHelp() {
  console.log(`
🎨 Unified Image Generator

Usage:
  node imagen.mjs "prompt" [output.png] [options]

Options:
  -p, --provider   Force provider: fal, openrouter, google
  -m, --model      Specific model ID
  -h, --help       Show this help

Providers (auto-detected from env):
  fal          FAL_KEY              Fastest, cheapest
  openrouter   OPENROUTER_API_KEY   Free tier available
  google       GOOGLE_API_KEY       Best text rendering

Default Models:
  fal:         fal-ai/flux/schnell ($0.003/MP)
  openrouter:  google/gemini-2.5-flash-image-preview
  google:      imagen-4 ($0.04/image)

Examples:
  node imagen.mjs "a sunset over mountains"
  node imagen.mjs "cyberpunk city" city.png
  node imagen.mjs "portrait" art.png -p fal
  node imagen.mjs "logo with text" logo.png -p google

Environment Variables:
  FAL_KEY              Fal.ai API key
  OPENROUTER_API_KEY   OpenRouter API key
  GOOGLE_API_KEY       Google AI Studio API key
  `);
}

if (!prompt) {
  showHelp();
  process.exit(1);
}

// Detect available providers
const providers = {
  fal: !!process.env.FAL_KEY,
  openrouter: !!process.env.OPENROUTER_API_KEY,
  google: !!process.env.GOOGLE_API_KEY
};

const available = Object.entries(providers)
  .filter(([_, v]) => v)
  .map(([k]) => k);

if (available.length === 0) {
  console.error('❌ No API keys found. Set one of:');
  console.error('   FAL_KEY, OPENROUTER_API_KEY, or GOOGLE_API_KEY');
  process.exit(1);
}

// Select provider
if (provider && !providers[provider]) {
  console.error(`❌ Provider '${provider}' not available (missing API key)`);
  console.error(`   Available: ${available.join(', ')}`);
  process.exit(1);
}

if (!provider) {
  // Priority: fal (fastest) > openrouter (free) > google
  provider = providers.fal ? 'fal' :
             providers.openrouter ? 'openrouter' : 'google';
}

console.log(`\n🎨 Using provider: ${provider}`);
console.log(`   Available: ${available.join(', ')}\n`);

// Set defaults
output = output || `image_${Date.now()}.png`;

// Route to provider script
const scripts = {
  fal: path.join(__dirname, 'fal-gen.mjs'),
  openrouter: path.join(__dirname, 'openrouter-gen.mjs'),
  google: path.join(__dirname, 'google-gen.py')
};

const script = scripts[provider];
const isNode = script.endsWith('.mjs') || script.endsWith('.js');
const isPython = script.endsWith('.py');

let cmd, cmdArgs;

if (isNode) {
  cmd = 'node';
  cmdArgs = [script, prompt, output];
  if (model) cmdArgs.push(model);
} else if (isPython) {
  cmd = 'python';
  cmdArgs = [script, prompt, output];
  if (model) cmdArgs.push(model);
}

const child = spawn(cmd, cmdArgs, {
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error(`❌ Failed to start: ${err.message}`);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code);
});
