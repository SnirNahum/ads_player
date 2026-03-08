import type { PlayerWithIma, VideoJsPlayer } from "@/types/videojs-ima.types";
import videojs from "video.js";

export function createStableId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function getVideoMimeType(src: string): string {
  if (src.includes(".m3u8")) return "application/x-mpegURL";
  if (src.includes(".mpd")) return "application/dash+xml";
  if (src.includes(".webm")) return "video/webm";
  return "video/mp4";
}

export function disposePlayer(player: VideoJsPlayer | null): void {
  if (player && !player.isDisposed()) {
    player.dispose();
  }
}

export function createPlayer(el: HTMLVideoElement, src: string): PlayerWithIma {
  return videojs(el, {
    controls: true,
    preload: "auto",
    sources: [{ src, type: getVideoMimeType(src) }],
    fluid: true,
    playsinline: true,
  }) as PlayerWithIma;
}

export function initIma(
  player: PlayerWithIma,
  adTagUrl: string,
  adContainerId: string,
): void {
  player.ima({
    adTagUrl,
    adContainerId,
    autoPlayAdBreaks: true,
    debug: import.meta.env.DEV,
  });
}

export function attachAdListeners(player: PlayerWithIma): void {
  const onFirstPlay = () => {
    player.ima.initializeAdDisplayContainer?.();
    player.ima.requestAds?.();
    player.off("play", onFirstPlay);
  };

  player.on("play", onFirstPlay);

  player.on("adserror", () => {
    player.ima.resumeAdPlayback?.();
  });
}
