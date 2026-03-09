---
name: cliamp
description: Play music, radio streams, and podcasts with cliamp (Terminal Winamp). Use when asked to "play music", "put on some tunes", "play a podcast", "stream radio", or any music playback request.
---

# CLIAMP — Terminal Music Player

Play music inside pi using [cliamp](https://github.com/bjarneo/cliamp), a Winamp 2.x-inspired terminal player.

## Prerequisites

- Binary installed at `~/bin/cliamp.exe` (v1.20.1, built from source)
- ffmpeg for AAC/ALAC/Opus/WMA (MP3/WAV/FLAC/OGG work without it)
- yt-dlp for YouTube Music, SoundCloud, Bandcamp streaming

## How to Launch

cliamp is a full TUI app — it takes over the terminal. **Always use `interactive_shell`** to launch it.

### Interactive (user controls playback)
```
interactive_shell({ command: 'cliamp ~/Music/Music/2026', mode: 'interactive' })
```

### Background (plays while user works)
```
interactive_shell({ command: 'cliamp ~/Music/Music/2026', mode: 'dispatch', background: true })
```

### Stream HTTP audio
```
interactive_shell({ command: 'cliamp https://ice1.somafm.com/groovesalad-128-mp3', mode: 'interactive' })
```

## Path Handling

✅ **What Works** (all tested):
- Absolute paths with backslashes: `C:\Users\Artale\Music\2026`
- Absolute paths with forward slashes: `C:/Users/Artale/Music/2026`
- Tilde expansion: `~/Music/Music/2026`
- Unix-style paths: `/c/Users/Artale/Music/Music/2026`
- Current directory: `.` (when already in the music folder)
- Relative paths: `2026` (when in parent directory)
- Quoted paths: `"Folder With Spaces"`
- Single files: `"Song Name.mp3"`
- Multiple folders: `~/Music/2026 ~/Music/Suno` (combines both)

❌ **Known Issues**:
- M3U playlists: May cause runtime panic with shuffle enabled

## Commands Available

The cliamp extension registers these pi commands:
- `/play [path|url]` — launch player (default: ~/Music)
- `/music` — play ~/Music
- `/radio <url>` — stream from URL

## Playback Keys (inside cliamp overlay)

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `s` | Stop |
| `>` `.` | Next track |
| `<` `,` | Previous track |
| `←` `→` | Seek -/+5s |
| `+` `-` | Volume up/down |
| `m` | Toggle mono |
| `e` | Cycle EQ preset (Rock, Jazz, Bass Boost, etc.) |
| `v` | Cycle visualizer (Spectrum, Snow, Binary, Matrix, etc.) |
| `P` | Cycle provider (Local / Radio / Navidrome / Spotify / YouTube Music) |
| `/` | Search playlist |
| `r` | Cycle repeat (Off / All / One) |
| `z` | Toggle shuffle |
| `q` | Quit |

## Visualizers (v1.19+)

Press `v` to cycle through visualizers:
- **Spectrum** — classic frequency bars
- **Snow** — falling snow particles
- **Binary** — binary code rain
- **Matrix** — Matrix-style green rain

Visualizers are GPU-optimized (v1.20.1: precomputed Hann window, batch renders, zero-alloc).

## Supported Formats

MP3, WAV, FLAC, OGG (native) — AAC, ALAC, Opus, WMA (requires ffmpeg)

## Configuration

Config file at `~/.config/cliamp/config.toml`:

```toml
volume = 0          # -30 to 6 dB
repeat = "off"      # "off", "all", "one"
shuffle = false
mono = false
eq_preset = "Flat"  # Rock, Pop, Jazz, Classical, Bass Boost, etc.
```

Optional: Custom 10-band EQ gains (range: -12 to 12 dB)
```toml
eq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  # 70Hz, 180Hz, 320Hz, 600Hz, 1k, 3k, 6k, 12k, 14k, 16k
```

## Providers (v1.19+)

cliamp has a built-in provider system. Press `P` to cycle between providers:

### Local Files (default)
Pass a directory or file path:
```bash
cliamp ~/Music/Music/2026
```

### Radio
Built-in internet radio with M3U station lists. Launch with no args to browse:
```bash
cliamp
```

### HTTP Streams
Direct MP3/OGG streams work perfectly:
```bash
cliamp https://ice1.somafm.com/groovesalad-128-mp3
```

### Spotify (v1.19+)
Connects via go-librespot. Requires Spotify credentials:
```bash
# First launch prompts for login
cliamp  # then press P to switch to Spotify provider
```

### YouTube Music (v1.20+)
Stream from YouTube Music. Requires `yt-dlp`:
```bash
cliamp  # press P to cycle to YouTube Music provider
```

### Navidrome Music Server
Set environment variables to browse a music server:
```bash
export NAVIDROME_URL="https://your-server.com"
export NAVIDROME_USER="user"
export NAVIDROME_PASS="pass"
cliamp
```

### SoundCloud, YouTube, Bandcamp
Supported but require `yt-dlp`:
```bash
cliamp https://soundcloud.com/user/sets/playlist
cliamp https://www.youtube.com/watch?v=...
cliamp https://artist.bandcamp.com/album/...
```

## Important Notes

- **Never run cliamp directly via bash** — it's a TUI app that needs a PTY. Always use `interactive_shell`.
- For background music, use `mode: "dispatch"` with `background: true`.
- cliamp expands tilde (`~`) correctly — no special handling needed.
- Paths work correctly regardless of slash direction (forward/backslash).
- Spaces in folder names work fine when quoted.
- The `play_music` tool is registered by the extension — it returns launch instructions.

## Quick Reference

**Play a folder:**
```javascript
interactive_shell({ 
  command: 'cliamp ~/Music/Music/2026', 
  mode: 'interactive' 
})
```

**Play and stay in background:**
```javascript
interactive_shell({ 
  command: 'cliamp ~/Music/Music/2026', 
  mode: 'dispatch', 
  background: true 
})
```

**Stream radio:**
```javascript
interactive_shell({ 
  command: 'cliamp https://ice1.somafm.com/groovesalad-128-mp3', 
  mode: 'interactive' 
})
```

**Quit the player:**
Press `q` inside the TUI.
