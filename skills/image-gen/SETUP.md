# ImageGen Setup Guide

Quick setup for AI image generation with Fal.ai, OpenRouter, and Google AI Studio.

## 1. Get API Keys

| Provider | Get Key | Free Tier |
|----------|---------|-----------|
| **Fal.ai** | https://fal.ai/dashboard/keys | $5 credit |
| **OpenRouter** | https://openrouter.ai/keys | Yes (Gemini) |
| **Google AI Studio** | https://aistudio.google.com/apikey | Yes |

## 2. Set Environment Variables

### Windows (PowerShell)

```powershell
# Add to your PowerShell profile
$env:FAL_KEY = "your-fal-key"
$env:OPENROUTER_API_KEY = "your-openrouter-key"
$env:GOOGLE_API_KEY = "your-google-key"

# Or add to system environment variables permanently
[System.Environment]::SetEnvironmentVariable("FAL_KEY", "your-key", "User")
```

### Windows (CMD)

```cmd
setx FAL_KEY "your-fal-key"
setx OPENROUTER_API_KEY "your-openrouter-key"
setx GOOGLE_API_KEY "your-google-key"
```

### Linux/macOS

```bash
# Add to ~/.bashrc or ~/.zshrc
export FAL_KEY="your-fal-key"
export OPENROUTER_API_KEY="your-openrouter-key"
export GOOGLE_API_KEY="your-google-key"
```

## 3. Install Dependencies

### Fal.ai (Node.js)

```bash
npm install @fal-ai/client
```

### Google AI Studio (Python)

```bash
pip install google-generativeai
```

### OpenRouter (No extra deps)

Uses built-in Node.js https module.

## 4. Test Installation

```bash
# Navigate to scripts directory
cd ~/.claude/skills/ImageGen/scripts

# Test Fal.ai
node fal-gen.mjs "test image" test-fal.png

# Test OpenRouter
node openrouter-gen.mjs "test image" test-or.png

# Test Google
python google-gen.py "test image" test-google.png

# Or use unified CLI
node imagen.mjs "test image" test.png
```

## 5. Add to PATH (Optional)

### Windows

```powershell
# Create a simple batch wrapper
$content = '@node "%USERPROFILE%\.claude\skills\ImageGen\scripts\imagen.mjs" %*'
Set-Content -Path "$env:USERPROFILE\bin\imagen.cmd" -Value $content

# Add to PATH if not already
$env:PATH += ";$env:USERPROFILE\bin"
```

### Linux/macOS

```bash
# Create symlink
ln -s ~/.claude/skills/ImageGen/scripts/imagen.mjs ~/bin/imagen

# Or add alias to shell config
echo 'alias imagen="node ~/.claude/skills/ImageGen/scripts/imagen.mjs"' >> ~/.bashrc
```

## 6. Usage Examples

### Quick Generate

```bash
# Using Fal.ai (fastest)
node imagen.mjs "a cat in space" cat.png

# Force specific provider
node imagen.mjs "sunset" sunset.png -p openrouter
node imagen.mjs "logo with text" logo.png -p google
```

### From Claude Code

```
Generate an image of a mountain landscape using fal.ai
```

Claude will use the ImageGen skill automatically.

## Provider Comparison

| Feature | Fal.ai | OpenRouter | Google |
|---------|--------|------------|--------|
| **Speed** | ⭐⭐⭐ Fastest | ⭐⭐ Fast | ⭐⭐ Fast |
| **Quality** | ⭐⭐⭐ Excellent | ⭐⭐ Good | ⭐⭐⭐ Excellent |
| **Text Render** | ⭐⭐ Good | ⭐⭐ Good | ⭐⭐⭐ Best |
| **Free Tier** | $5 credit | Yes | Yes |
| **Cheapest** | $0.003/MP | Free | $0.02/img |
| **Best Model** | FLUX Pro Ultra | Nano Banana Pro | Imagen 4 Ultra |

## Troubleshooting

### "Module not found"

```bash
# Install Fal.ai client
npm install @fal-ai/client

# Or install globally
npm install -g @fal-ai/client
```

### "API key not found"

Verify environment variable is set:

```bash
# Windows PowerShell
echo $env:FAL_KEY

# Linux/macOS
echo $FAL_KEY
```

### "Rate limited"

Switch to a different provider:

```bash
node imagen.mjs "prompt" output.png -p openrouter
```

### "NSFW content blocked"

Some providers filter content. Try:
- Rephrasing the prompt
- Using a different provider
- Using a less restrictive model

## MCP Server Setup (Advanced)

Add Fal.ai MCP server for IDE integration:

```bash
npm install mcp-fal-ai-image
```

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "fal-image": {
      "command": "npx",
      "args": ["mcp-fal-ai-image"],
      "env": {
        "FAL_KEY": "${FAL_KEY}"
      }
    }
  }
}
```

## Next Steps

1. ✅ Set up API keys
2. ✅ Install dependencies
3. ✅ Test generation
4. 🎨 Start creating!

See [SKILL.md](./SKILL.md) for detailed documentation and prompt engineering tips.
