---
name: suno-direct
description: Generate music via Suno API directly.
---

# Suno AI Music Generation - Direct

## Setup
1. Valid Suno API key ([https://www.suno.ai/](https://www.suno.ai/)).
2. `requests` Python library installed (`pip install requests`).

## Functionality
Directly interacts with the Suno API to generate music from text prompts, supporting `Song` and `Reaction` modes.

**Use when:** A user requests music generation with a clear text prompt.

### Commands:

1.  **`generate_song(prompt: str, style: str = "default", version: int = 2)`**: Generates a full song.
    *   `prompt`: (Required) Song description. Example: "A melancholic piano ballad about a lost love, with a female vocalist."
    *   `style`: (Optional) Song style: "default", "fast", "chill", "epic", "happy", "sad". Default is "default".
    *   `version`: (Optional) Suno API version (currently 2). Default is 2.
    *   **Example:** `generate_song(prompt="A high-energy electronic dance track with a driving beat and a futuristic sound.", style="fast")`
    *   **Output:** Song URL (string). Example: `"https://api.suno.ai/songs/abcdef1234567890"`

2.  **`generate_reaction(prompt: str, version: int = 2)`**: Generates a short "Reaction" clip (5-10 seconds).
    *   `prompt`: (Required) Reaction description. Example: "A dramatic sting with strings and brass."
    *   `version`: (Optional) Suno API version (currently 2). Default is 2.
    *   **Example:** `generate_reaction(prompt="A whimsical sound effect of a fairy fluttering its wings.")`
    *   **Output:** Reaction clip URL (string). Example: `"https://api.suno.ai/reactions/xyz9876543210"`

**Code Example (Python for internal use - do not expose to user directly):**