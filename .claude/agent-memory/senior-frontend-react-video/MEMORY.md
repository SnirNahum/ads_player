# Project: ads_player — Agent Memory

## Path Alias
- Vite alias `@` → `src/` is configured in `vite.config.ts`
- TypeScript paths `@/*` → `src/*` are in `tsconfig.app.json` (baseUrl: ".")

## Folder Conventions
- `src/lib/` — third-party integration utilities (e.g., loadImaSdk.ts)
- `src/hooks/` — custom React hooks (prefixed with `use`)
- `src/components/` — JSX-only shells; no business logic inline

## video.js
- Player type: `type VideoJsPlayer = ReturnType<typeof videojs>` — never `VideoJsPlayer` named import (not exported in v8)
- Plugin side-effects imported in the hook file: `import 'videojs-contrib-ads'` and `import 'videojs-ima'`
- IMA plugin method calls use `// @ts-expect-error plugin method exists at runtime`

## IMA SDK Loader (src/lib/loadImaSdk.ts)
- Dedup guard: checks `window.google` first, then `script[data-ima-sdk="true"]`
- `declare global { interface Window { google?: unknown } }` lives in loadImaSdk.ts
- SDK URL constant: `https://imasdk.googleapis.com/js/sdkloader/ima3.js`

## useVideoPlayer Hook (src/hooks/useVideoPlayer.ts)
- Accepts: `{ src, poster?, adTagUrl, adContainerId }`
- Returns: `{ videoElRef, ready }`
- `adContainerId` is owned by the component (via `useId`) and passed into the hook
- IMA init deferred to first `play` event to satisfy browser autoplay/gesture policies
- `adserror` handler calls `player.ima?.resumeAdPlayback?.()` to resume content on ad failure
- Cleanup: `disposed` flag prevents state updates after unmount; player disposed via `p.dispose()`

## VideoPlayer Component (src/components/VideoPlayer.tsx)
- Generates `adContainerId` with `useId().replace(/:/g, '')` (colons are invalid in HTML id)
- Ad container div: `absolute inset-0 z-10 pointer-events-none` — IMA needs it in DOM, pointer-events disabled so video controls remain interactive
