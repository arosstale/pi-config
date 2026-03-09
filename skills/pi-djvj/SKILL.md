---
name: pi-djvj
description: DJ + VJ from your coding agent. Play music with cliamp + real-time audio-reactive visuals in the terminal.
---

## Trigger Conditions
Trigger on requests for: "play visuals", "DJ mode", "visualizer", "shader visuals", or any music + visual request.

## Workflow

1. **Music & Visuals Request:** Launch `cliamp` *and* the visualizer with `/djvj [path]` followed by `/viz`. Instruct the user to execute both commands.
2. **Visuals Only Request:** Launch the visualizer in demo mode with `/viz`.
3. **Fullscreen Request:** Issue `/viz full` after the visualizer is running.
4. **Control Instructions:** Provide controls only when relevant.
5. **Shader Information:** Provide concise, categorized shader lists.

## Rules & Capabilities

*   **Commands:**
    *   `/viz`: Opens the visualizer, capturing system audio or using demo mode.
    *   `/viz full`: Switches to fullscreen alt-screen mode (requires `/viz` running).
    *   `/djvj [path]`: Launches `cliamp` with the specified music file.
*   **Controls (Inform user when relevant):**
    *   `Q / Esc`: Quit visualizer.
    *   `N / P`: Next/previous shader.
    *   `v`: Cycle visualizer modes: halfblock → braille → ascii.
    *   `a`: ASCII mode.
    *   `b`: Next braille shader.
    *   `1-9, 0`: Select shader by number.
    *   `F`: Toggle fullscreen.
    *   `+ / -`: Adjust audio sensitivity.
    *   `Space`: Pause/unpause music (via `cliamp`).
*   **Shader Categories:**
    *   **Half-Block Shaders (60):** Classic, Raymarched/SDF, Effects, Art Pieces I, II, & III.
    *   **Braille Shaders (20):** Original, Batch II, Batch III.
    *   **ASCII (1):** IBM CP437 luminance ramp.
*   **Audio Capture Priority:** `mpv` PCM tap > `ffmpeg` DirectShow > Demo mode.
*   **Architecture:** Relies on `cliamp` and a terminal-based visualizer.

## Examples

**User:** "Play some music and visuals!"
**Agent:** `/djvj /path/to/your/music.mp3\n/viz` (Output: "Launching cliamp with /path/to/your/music.mp3 and starting the visualizer. Run these commands in separate terminals.")

**User:** "Show me some visuals."
**Agent:** `/viz`

**User:** "Make the visuals fullscreen."
**Agent:** `/viz full` (Assuming `/viz` is already running)

**User:** "List all half-block shaders"
**Agent:** "Half-Block Shaders (60): Classic, Raymarched/SDF, Effects, Art Pieces I, II, III."

**User:** "Next shader!"
**Agent:** "Press 'N' in the visualizer terminal to cycle to the next shader."

**User:** "How do I pause the music?"
**Agent:** "Press 'Space' in the `cliamp` terminal to pause/unpause the music."

## Output Format

Output commands for terminal execution. Use a single line, or two lines separated by `\n` for sequential commands.