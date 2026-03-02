// src/components/VideoPlayer.tsx
import { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import { ABORT_ERROR } from "../lib/ima/constants";
import { createImaClient } from "../lib/ima/createImaClient";
import { loadImaSdk } from "../lib/ima/loadImaSdk";
import { withCorrelator } from "../lib/ima/utils";

interface VideoPlayerProps {
  src: string;
  adTagUrl: string;
}

/**
 * Video player with Google IMA pre-roll and mid-roll ad support.
 *
 * Uses Video.js for the player UI and a custom IMA SDK integration
 * (no videojs-ima or videojs-contrib-ads dependencies).
 */
export function VideoPlayer({ src, adTagUrl }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const imaRef = useRef<ReturnType<typeof createImaClient> | null>(null);
  const adInitializedRef = useRef(false);
  const adRequestedRef = useRef(false);
  const adBreakActiveRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    // Guard: prevent double-init in React StrictMode
    if (!container || playerRef.current) return;

    // --- Video.js element (imperative DOM to avoid React/VJS conflicts) ---
    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered");
    videoElement.setAttribute("playsinline", "");
    container.appendChild(videoElement);

    // --- Ad container overlay ---
    const adContainer = document.createElement("div");
    adContainer.style.cssText =
      "position:absolute;inset:0;z-index:10;pointer-events:none;";
    container.appendChild(adContainer);

    // --- Initialize Video.js player ---
    const player = videojs(videoElement, {
      controls: true,
      preload: "auto",
      sources: [{ src, type: "video/mp4" }],
    });

    playerRef.current = player;

    // --- Helpers ---
    const resumeContent = () => {
      player.play()?.catch((err: unknown) => {
        if (err instanceof DOMException && err.name === ABORT_ERROR) return;
        if (import.meta.env.DEV) console.error(err);
      });
    };

    // --- IMA ad lifecycle callbacks ---
    const onAdBreakStart = () => {
      adBreakActiveRef.current = true;
      adContainer.style.pointerEvents = "auto";
      player.pause();
    };

    const onAdBreakEnd = () => {
      adBreakActiveRef.current = false;
      adContainer.style.pointerEvents = "none";
      resumeContent();
    };

    const onAdError = () => {
      adBreakActiveRef.current = false;
      adContainer.style.pointerEvents = "none";
      resumeContent();
    };

    // --- First-play handler: load IMA SDK and request ads ---
    const onPlay = async () => {
      // Block content playback while an ad break is active
      if (adBreakActiveRef.current) {
        player.pause();
        return;
      }

      // Only request ads once per mount
      if (adRequestedRef.current) return;
      adRequestedRef.current = true;

      player.pause();

      try {
        await loadImaSdk();

        const nativeVideo = player
          .el()
          .querySelector("video") as HTMLVideoElement | null;

        if (!nativeVideo) {
          resumeContent();
          return;
        }

        if (!imaRef.current) {
          imaRef.current = createImaClient(nativeVideo, adContainer, {
            onAdBreakStart,
            onAdBreakEnd,
            onAdError,
          });
        }

        if (!adInitializedRef.current) {
          imaRef.current.initialize();
          adInitializedRef.current = true;
        }

        imaRef.current.requestAds(withCorrelator(adTagUrl));
      } catch {
        resumeContent();
      }
    };

    player.on("play", onPlay);

    // --- Resize IMA ad overlay when window resizes ---
    const handleResize = () => imaRef.current?.resize();
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("resize", handleResize);
      imaRef.current?.destroy();
      imaRef.current = null;
      adInitializedRef.current = false;
      player.dispose();
      playerRef.current = null;
    };
  }, [src, adTagUrl]);

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <div ref={containerRef} className="relative aspect-video" />
      </div>
    </div>
  );
}
