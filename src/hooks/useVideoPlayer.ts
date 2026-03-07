import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "videojs-contrib-ads";
import "videojs-ima";
import { loadImaSdk } from "@/lib/loadImaSdk";
import { getVideoMimeType } from "@/utils/utils";
import type { PlayerWithIma, VideoJsPlayer } from "@/types/videojs-ima.types";
import type {
  UseVideoPlayerOptions,
  UseVideoPlayerReturn,
} from "@/types/useVideoPlayer.types";

export function useVideoPlayer({
  src,
  poster,
  adTagUrl,
  adContainerId,
}: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isEffectStillValid = true;
    setReady(false);
    setError(null);

    async function init() {
      const el = videoElRef.current;
      if (!el) return;

      const prev = playerRef.current;
      if (prev && !prev.isDisposed()) {
        prev.dispose();
      }
      playerRef.current = null;

      await loadImaSdk();
      if (!isEffectStillValid) return;

      const playerBase = videojs(el, {
        controls: true,
        preload: "auto",
        poster,
        sources: [{ src, type: getVideoMimeType(src) }],
        fluid: true,
        playsinline: true,
      });

      const player = playerBase as PlayerWithIma;

      if (!isEffectStillValid) {
        player.dispose();
        return;
      }

      playerRef.current = player;

      player.ima({
        adTagUrl,
        adContainerId,
        debug: import.meta.env.DEV,
      });

      const onFirstPlay = () => {
        player.ima.initializeAdDisplayContainer?.();
        player.ima.requestAds?.();
        player.off("play", onFirstPlay);
      };

      player.on("play", onFirstPlay);

      player.on("adserror", () => {
        player.ima.resumeAdPlayback?.();
      });
      setReady(true);
    }

    init().catch((err: unknown) => {
      if (!isEffectStillValid) return;
      setError(err instanceof Error ? err.message : "Player failed to load");
    });

    return () => {
      isEffectStillValid = false;

      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
      }

      playerRef.current = null;
    };
  }, [src, poster, adTagUrl, adContainerId]);

  return { videoElRef, ready, error };
}
