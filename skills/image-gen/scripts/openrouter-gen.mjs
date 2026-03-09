#!/usr/bin/env node
/**
 * OpenRouter Image Generator CLI
 *
 * Usage:
 *   node openrouter-gen.mjs "your prompt" [output.png] [model]
 *
 * Models:
 *   - google/gemini-2.5-flash-image-preview (default, free tier available)
 *   - google/gemini-3-pro-image (Nano Banana Pro)
 *   - openai/gpt-5-image (GPT-5 + image gen)
 *
 * Environment:
 *   OPENROUTER_API_KEY=your-api-key
 */

import fs from 'fs';
import https from 'https';
import path from 'path';

// Parse arguments
const args = process.argv.slice(2);
const prompt = args[0];
const output = args[1] || `image_${Date.now()}.png`;
const model = args[2] || 'google/gemini-2.5-flash-image-preview';

// Help
if (!prompt || prompt === '--help' || prompt === '-h') {
  console.log(`
OpenRouter Image Generator

Usage:
  node openrouter-gen.mjs "prompt" [output.png] [model]

Arguments:
  prompt    Text description of the image (required)
  output    Output filename (default: image_timestamp.png)
  model     OpenRouter model ID

Models:
  google/gemini-2.5-flash-image-preview  Free tier, fast
  google/gemini-3-pro-image              Nano Banana Pro, premium
  openai/gpt-5-image                     GPT-5 + DALL-E, $10/M tokens

Examples:
  node openrouter-gen.mjs "a sunset over mountains"
  node openrouter-gen.mjs "cyberpunk city" city.png
  node openrouter-gen.mjs "portrait" art.png openai/gpt-5-image

Environment:
  OPENROUTER_API_KEY   Your OpenRouter API key (required)
  `);
  process.exit(0);
}

// Check API key
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error('Error: OPENROUTER_API_KEY environment variable not set');
  console.error('Get your key at: https://openrouter.ai/keys');
  process.exit(1);
}

console.log(`\n🎨 Generating image...`);
console.log(`   Prompt: "${prompt}"`);
console.log(`   Model: ${model}`);
console.log(`   Output: ${output}\n`);

// Build request
const requestBody = JSON.stringify({
  model,
  messages: [
    { role: "user", content: `Generate an image: ${prompt}` }
  ],
  modalities: ["image", "text"]
});

const options = {
  hostname: 'openrouter.ai',
  path: '/api/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestBody)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (response.error) {
        console.error(`\n❌ API Error: ${response.error.message}`);
        process.exit(1);
      }

      const message = response.choices?.[0]?.message;
      const content = message?.content;
      const images = message?.images;

      // Check for images in message.images array (new OpenRouter format)
      if (images && images.length > 0) {
        const imageUrl = images[0]?.image_url?.url;
        if (imageUrl && imageUrl.startsWith('data:image/')) {
          const base64Match = imageUrl.match(/data:image\/[^;]+;base64,(.+)/);
          if (base64Match) {
            const imageData = Buffer.from(base64Match[1], 'base64');
            const outputPath = path.resolve(output);
            fs.writeFileSync(outputPath, imageData);
            console.log(`\n✅ Saved: ${outputPath}`);
            console.log(`   Size: ${(imageData.length / 1024).toFixed(1)} KB`);
            if (response.usage) {
              console.log(`   Tokens: ${response.usage.total_tokens}`);
            }
            process.exit(0);
          }
        }
      }

      if (!content && !images) {
        console.error('\n❌ No content or images in response');
        console.error(JSON.stringify(response, null, 2));
        process.exit(1);
      }

      // Check for base64 image data in content (fallback)
      const base64Match = content?.match(/data:image\/[^;]+;base64,([^"'\s]+)/);

      if (base64Match) {
        const imageData = Buffer.from(base64Match[1], 'base64');
        const outputPath = path.resolve(output);
        fs.writeFileSync(outputPath, imageData);
        console.log(`\n✅ Saved: ${outputPath}`);
        console.log(`   Size: ${(imageData.length / 1024).toFixed(1)} KB`);
      } else {
        // Response might contain URL or text
        console.log('\n📝 Response:');
        console.log(content.substring(0, 500));

        if (content.includes('http')) {
          console.log('\n(Response may contain image URL - check output above)');
        }
      }

      // Show usage
      if (response.usage) {
        console.log(`\n   Tokens: ${response.usage.total_tokens}`);
      }

    } catch (err) {
      console.error(`\n❌ Parse error: ${err.message}`);
      console.error(data.substring(0, 500));
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error(`\n❌ Request failed: ${err.message}`);
  process.exit(1);
});

req.write(requestBody);
req.end();
