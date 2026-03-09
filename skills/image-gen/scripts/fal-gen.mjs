#!/usr/bin/env node
/**
 * Fal.ai Image Generator CLI
 *
 * Usage:
 *   node fal-gen.mjs "your prompt" [output.png] [model]
 *
 * State of the Art Models (Dec 2025):
 *   - fal-ai/flux-2-pro (best quality)
 *   - fal-ai/flux-2 (latest generation)
 *   - fal-ai/nano-banana-pro (Gemini-based)
 *   - fal-ai/reve/text-to-image (Reve)
 *   - fal-ai/bytedance/seedream/v4/text-to-image (SeedDream)
 *
 * Fast Open Source Models:
 *   - fal-ai/flux-1/schnell (default, fastest, $0.003/MP)
 *   - fal-ai/flux-1/dev (quality, $0.025/MP)
 *   - fal-ai/flux-1/krea (Krea-enhanced)
 *
 * Environment:
 *   FAL_KEY=your-api-key
 */

import { fal } from "@fal-ai/client";
import fs from 'fs';
import https from 'https';
import path from 'path';

// Parse arguments
const args = process.argv.slice(2);
const prompt = args[0];
const output = args[1] || `image_${Date.now()}.png`;
const model = args[2] || 'fal-ai/flux-1/schnell';

// Help
if (!prompt || prompt === '--help' || prompt === '-h') {
  console.log(`
Fal.ai Image Generator

Usage:
  node fal-gen.mjs "prompt" [output.png] [model]

Arguments:
  prompt    Text description of the image (required)
  output    Output filename (default: image_timestamp.png)
  model     Fal.ai model ID (default: fal-ai/flux-1/schnell)

🔥 State of the Art (Dec 2025):
  fal-ai/flux-2-pro        Best quality, premium
  fal-ai/flux-2            Latest generation, premium
  fal-ai/nano-banana-pro   Gemini-based, fast
  fal-ai/reve/text-to-image  Reve model
  fal-ai/bytedance/seedream/v4/text-to-image  SeedDream v4
  fal-ai/bytedance/dreamina/v3.1/text-to-image  Dreamina

⚡ Fast Open Source:
  fal-ai/flux-1/schnell    Fastest (1-4 steps), $0.003/MP
  fal-ai/flux-1/dev        Quality balance, $0.025/MP
  fal-ai/flux-1/krea       Krea-enhanced FLUX

🎨 Specialized:
  fal-ai/flux-lora         Custom LoRA styles, $0.035/MP
  fal-ai/flux-kontext/pro  Image editing

Examples:
  node fal-gen.mjs "a cat wearing sunglasses"
  node fal-gen.mjs "mountain sunset" sunset.png
  node fal-gen.mjs "portrait" art.png fal-ai/flux-2-pro
  node fal-gen.mjs "anime girl" anime.png fal-ai/bytedance/seedream/v4/text-to-image

Environment:
  FAL_KEY   Your Fal.ai API key (required)
  `);
  process.exit(0);
}

// Check API key
if (!process.env.FAL_KEY) {
  console.error('Error: FAL_KEY environment variable not set');
  console.error('Get your key at: https://fal.ai/dashboard/keys');
  process.exit(1);
}

// Configure client
fal.config({ credentials: process.env.FAL_KEY });

console.log(`\n🎨 Generating image...`);
console.log(`   Prompt: "${prompt}"`);
console.log(`   Model: ${model}`);
console.log(`   Output: ${output}\n`);

try {
  // Generate image
  const result = await fal.subscribe(model, {
    input: {
      prompt,
      image_size: "landscape_16_9",
      num_images: 1,
      num_inference_steps: model.includes('schnell') ? 4 : 28,
      guidance_scale: 3.5
    },
    logs: false,
    onQueueUpdate: (update) => {
      if (update.status === 'IN_QUEUE') {
        console.log(`   Queue position: ${update.queue_position || 'processing...'}`);
      }
    }
  });

  // Handle both result.images and result.data.images formats
  const images = result.images || result.data?.images;
  const imageUrl = images[0].url;
  console.log(`   Generated: ${imageUrl}`);

  // Download image
  const outputPath = path.resolve(output);
  const file = fs.createWriteStream(outputPath);

  https.get(imageUrl, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`\n✅ Saved: ${outputPath}`);

      // Show metadata (handle both formats)
      const seed = result.seed || result.data?.seed;
      const timings = result.timings || result.data?.timings;
      if (seed) console.log(`   Seed: ${seed}`);
      if (timings) {
        console.log(`   Time: ${(timings.inference * 1000).toFixed(0)}ms`);
      }
    });
  }).on('error', (err) => {
    fs.unlink(outputPath, () => {});
    console.error(`\n❌ Download failed: ${err.message}`);
    process.exit(1);
  });

} catch (error) {
  console.error(`\n❌ Generation failed: ${error.message}`);
  if (error.body) {
    console.error(`   Details: ${JSON.stringify(error.body)}`);
  }
  process.exit(1);
}
