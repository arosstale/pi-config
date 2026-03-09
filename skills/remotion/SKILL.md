---
name: remotion
description: Render animated presentation videos and music visualizers with Remotion. Use when asked to "make a video", "render slides to video", "create a presentation video", "music visualizer", "animated deck", or any programmatic video generation request. Covers slide-based presentations, music videos, and custom compositions.
---

# Remotion — Programmatic Video from Code

Render React compositions to MP4/WebM using [Remotion](https://remotion.dev) v4. Two existing setups available — presentation decks and music visualizers.

## Existing Projects

### Presentation Video
**Location**: `~/Projects/gh-repo/remotion/`

Renders the 30-slide OpenClaw agentic engineering deck as an animated 1920×1080 MP4.

```bash
cd ~/Projects/gh-repo/remotion
node render.mjs                              # default output
node render.mjs --out ~/Desktop/talk.mp4     # custom output
node render.mjs --fps 60                     # higher framerate
```

**Architecture**:
- `src/slides.js` — slide data array (type, heading, bullets, code, kpis, etc.)
- `src/Presentation.jsx` — 10 slide type renderers + spring animations + crossfade
- `src/Root.jsx` — Composition registration
- `render.mjs` — CLI renderer (bundler → selectComposition → renderMedia)

**Slide types**: `title`, `divider`, `quote`, `content`, `split`, `code`, `table`, `dashboard`, `steps`, `final`

**Timing**: 6 seconds per slide (180 frames @ 30fps), 0.5s crossfade transitions.

**Palette**: Matches the HTML deck — DM Sans + Fira Code, dark (#0c1018) with accent (#38bdf8), green (#34d399), amber (#fbbf24), rose (#fb7185), teal (#2dd4bf).

### Music Visualizer
**Location**: `~/Projects/pi-dj/remotion/`

Renders audio-reactive music videos with 3 visualizer styles.

```bash
cd ~/Projects/pi-dj/remotion
node render.mjs --audio song.mp3 --style bars --title "Track Name" --artist "Artist"
node render.mjs --audio song.mp3 --style wave --out output.mp4
node render.mjs --audio song.mp3 --style circle --cover art.png
```

**Styles**: `bars` (frequency bars), `wave` (waveform), `circle` (radial)

**Options**:
- `--audio <file>` — audio file (required)
- `--out <file>` — output path
- `--title`, `--artist`, `--genre` — metadata overlays
- `--style bars|wave|circle` — visualizer type
- `--cover <file>` — album art
- `--fps <n>`, `--dur <n>`, `--width <n>`, `--height <n>`

## Creating New Compositions

### Scaffold a new project

```bash
mkdir -p ~/Projects/<name>/remotion
cd ~/Projects/<name>/remotion
```

**package.json** (minimal):
```json
{
  "type": "module",
  "dependencies": {
    "@remotion/bundler": "^4.0.431",
    "@remotion/cli": "^4.0.431",
    "@remotion/renderer": "^4.0.431",
    "remotion": "^4.0.431"
  }
}
```

Add `@remotion/media-utils` only if using audio visualization.

### Root.jsx pattern

```jsx
import { Composition, registerRoot } from 'remotion';
import { MyVideo } from './MyVideo.jsx';

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={300}   // 10s @ 30fps
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: 'Hello' }}
  />
);
registerRoot(RemotionRoot);
```

### render.mjs pattern

```js
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const serveUrl = await bundle({ entryPoint: 'src/Root.jsx' });
const comp = await selectComposition({ serveUrl, id: 'MyVideo' });
await renderMedia({
  composition: comp,
  serveUrl,
  codec: 'h264',
  outputLocation: 'output.mp4',
  onProgress: ({ progress }) => process.stdout.write(`\r${Math.round(progress * 100)}%`),
});
```

### Animation primitives

**Spring animation** (the workhorse):
```jsx
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

function FadeUp({ children, delay = 0 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.6 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);
  return <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>;
}
```

**Sequence for timing** (scenes within a composition):
```jsx
import { Sequence } from 'remotion';

// Each slide gets its own Sequence with from/durationInFrames
<Sequence from={0} durationInFrames={180}>
  <SlideOne />
</Sequence>
<Sequence from={180} durationInFrames={180}>
  <SlideTwo />
</Sequence>
```

**Audio visualization** (requires `@remotion/media-utils`):
```jsx
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

const audioData = useAudioData(audioSrc);
const samples = audioData
  ? visualizeAudio({ audioData, frame, fps, numberOfSamples: 80, smoothing: true })
  : fallbackArray;
```

## Key Patterns

1. **Data-driven slides**: Keep slide content in a separate `slides.js` array. Render loop maps over it with `<Sequence>`. Easy to add/remove/reorder.

2. **Staggered reveals**: Use `delay` prop on `FadeUp` — each bullet gets `delay={base + i * 8}` for cascading entry.

3. **Crossfade transitions**: Overlap sequences by N frames. Use `interpolate` for fade-in at start and fade-out at end of each sequence.

4. **Local file serving**: Remotion renders in headless Chrome — local files need HTTP serving. Use `createServer` from `node:http` to serve audio/images on localhost, pass the URL to the composition as a prop.

5. **Override at render time**: `composition` prop in `renderMedia` can spread with overrides: `{ ...comp, durationInFrames, fps, width, height }`.

## Performance Notes

- 5400 frames (3 min @ 30fps) takes ~8 minutes on a modern machine
- Remotion auto-downloads Chrome Headless Shell on first run (~108MB)
- Text-only slides render fast; audio visualization is heavier
- Use `--fps 15` for draft previews (half the frames, half the time)
- `npx remotion preview src/Root.jsx` opens a browser preview without rendering

## Rendering Tips

- **Draft**: `node render.mjs --fps 15` — quick preview, half the frames
- **Production**: `node render.mjs --fps 30 --codec h264` — standard quality
- **High quality**: `node render.mjs --fps 60 --codec h264` — smooth animation
- **WebM**: `node render.mjs --codec vp8` — smaller file, web-friendly
- **GIF** (short clips): Use `@remotion/gif` or render then convert with ffmpeg

## Troubleshooting

| Issue | Fix |
|---|---|
| Chrome download stalls | Set `PUPPETEER_SKIP_DOWNLOAD=1`, point to existing Chrome |
| `useAudioData` returns null | Audio file must be HTTP-served, not a file:// path |
| Fonts not loading | Use Google Fonts `<link>` or inline `@font-face` with base64 |
| OOM on long videos | Reduce concurrency: `--concurrency 2` in renderMedia |
| Windows path issues | Use `resolve()` from `node:path` — Remotion needs absolute paths |
