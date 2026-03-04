import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "videojs-contrib-ads";
import "videojs-ima";
import { loadImaSdk } from "@/lib/loadImaSdk";
import { getVideoMimeType } from "@/utils/utils";
import { ADS_ERROR, AUTO, PLAY } from "@/CONSTANTS";
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
    let canceled = false;
    setReady(false);
    setError(null);

    async function init() {
      const el = videoElRef.current;
      if (!el) return;

      const prev = playerRef.current;
      if (prev && !prev.isDisposed()) prev.dispose();
      playerRef.current = null;

      await loadImaSdk();
      if (canceled) return;

      const playerBase = videojs(el, {
        controls: true,
        preload: AUTO,
        poster,
        sources: [{ src, type: getVideoMimeType(src) }],
        fluid: true,
        playsinline: true,
      });

      const player = playerBase as PlayerWithIma;
      playerRef.current = player;

      player.ima({
        adTagUrl,
        adContainerId,
        debug: import.meta.env.DEV,
      });

      const onFirstPlay = () => {
        player.ima.initializeAdDisplayContainer?.();
        player.ima.requestAds?.();
        player.off(PLAY, onFirstPlay);
      };

      player.on(PLAY, onFirstPlay);

      player.on(ADS_ERROR, () => {
        player.ima.resumeAdPlayback?.();
      });

      setReady(true);
    }

    init().catch((err: unknown) => {
      if (canceled) return;
      setError(err instanceof Error ? err.message : "Player failed to load");
    });

    return () => {
      canceled = true;
      const player = playerRef.current;
      playerRef.current = null;
      if (player && !player.isDisposed()) player.dispose();
    };
  }, [src, poster, adTagUrl, adContainerId]);

  return { videoElRef, ready, error };
}