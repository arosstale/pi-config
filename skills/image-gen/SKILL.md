---
name: image-gen
description: AI image generation using OpenRouter, Fal.ai, and Google AI Studio with models like FLUX, Imagen 4, and Gemini
---

# ImageGen Skill

AI image generation using OpenRouter, Fal.ai, and Google AI Studio. Generate images from text prompts using state-of-the-art models like FLUX, Imagen 4, and Gemini.

## Routing

**Trigger keywords**: generate image, create image, image gen, flux, imagen, fal.ai, openrouter image, ai art, text to image, t2i

Use this skill when:
- Generating images from text descriptions
- Creating AI artwork
- Producing visual content programmatically
- Batch image generation
- High-quality image synthesis

## Available Providers

### OpenRouter
Models: FLUX, SDXL, DALL-E alternatives

```bash
curl -X POST https://openrouter.ai/api/v1/images/generations \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"prompt": "...", "model": "flux-pro"}'
```

### Fal.ai
Models: FLUX, Stable Diffusion XL, Lightning

```bash
fal run fal-ai/flux-pro -p "your prompt here"
```

### Google AI Studio
Models: Imagen 4, Gemini 2.5 Flash

```bash
curl -X POST https://generativelanguage.googleapis.com/v1beta/models/imagen-4:predictImage \
  -H "x-goog-api-key: $GOOGLE_API_KEY" \
  -d '{"prompt": "..."}'
```

## Workflows

### Generate Image
```bash
Use image-gen to create an image of [description]
Provider: [fal.ai|openrouter|google]
Model: [flux-pro|imagen-4|sdxl]
```

### Batch Generation
```bash
Use image-gen to generate 5 variations of [description]
Save to: output/images/
```

### Style Transfer
```bash
Use image-gen to create [description] in [style] style
Reference: [optional reference image URL]
```

## Image Quality Tips

### Better Prompts
- Be specific about style (photorealistic, illustration, 3D render)
- Include lighting direction and mood
- Specify aspect ratio (1:1, 16:9, 9:16)
- Add technical terms (8K, HDR, cinematic, bokeh)

### Example Prompts

**Photorealistic:**
```
A golden retriever puppy sitting in a sunlit meadow, golden hour lighting, shallow depth of field, photorealistic, 8K, cinematic
```

**Illustration:**
```
Futuristic city skyline at night, neon lights, cyberpunk style, digital art, trending on ArtStation, vibrant colors
```

## Model Selection

| Model | Best For | Quality | Speed |
|-------|-----------|---------|--------|
| FLUX Pro | General purpose, high quality | Excellent | Medium |
| Imagen 4 | Photorealism, diversity | Excellent | Fast |
| SDXL Lightning | Speed, good quality | Good | Fast |
| Gemini 2.5 Flash | Creative, diverse | Very Good | Fast |

## Best Agent

| Priority | CLI | Command | Why |
|----------|-----|---------|-----|
| Primary | Direct | CLI tools | Direct API calls |
| Backup | Claude | `claude "..."` | Can craft prompts |

## Environment Variables

```bash
OPENROUTER_API_KEY=sk-or-...
FAL_API_KEY=...
GOOGLE_API_KEY=AI...
```

## Output Location

Generated images: `output/images/` or specified path.
