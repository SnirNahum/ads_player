# Video Player with IMA Ads

A React video player component with Google IMA SDK integration for pre-roll ad support, built on top of Video.js.

## Tech Stack

- **React 19** + **TypeScript**
- **Video.js** — core video player
- **videojs-ima** — Google IMA SDK integration for ad playback
- **Tailwind CSS** — styling
- **Vite** — build tooling

## Features

- Video playback via Video.js
- Pre-roll ad support via Google IMA SDK
- Graceful ad error fallback (resumes content on ad failure)
- Loading state with poster image support
- Fully typed with TypeScript

## Getting Started

```bash
npm install
npm run dev
```

## Usage

```tsx
<VideoPlayer
  src="https://example.com/video.mp4"
  poster="https://example.com/poster.jpg"
  adTagUrl="https://your-ad-tag-url"
/>
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Lint source files |
| `npm run format` | Check formatting |
