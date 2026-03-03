import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "videojs-contrib-ads";
import "videojs-ima";
import { loadImaSdk } from "@/lib/loadImaSdk";
import { ADS_ERROR, AUTO, MP4_TYPE, PLAY } from "@/CONSTANTS";
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

  useEffect(() => {
    let canceled = false;
    setReady(false);

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
        sources: [{ src, type: MP4_TYPE }],
        fluid: true,
        playsinline: true,
      });

      const player = playerBase as PlayerWithIma;
      playerRef.current = player;

      player.ima({
        adTagUrl,
        adContainerId,
        debug: false,
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

    init();

    return () => {
      canceled = true;
      const p = playerRef.current;
      playerRef.current = null;
      if (p && !p.isDisposed()) p.dispose();
    };
  }, [src, poster, adTagUrl, adContainerId]);

  return { videoElRef, ready };
}