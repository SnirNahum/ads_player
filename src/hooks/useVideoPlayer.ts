import { useEffect, useRef, useState } from "react";
import "videojs-contrib-ads";
import "videojs-ima";
import { loadImaSdk } from "@/lib/loadImaSdk";
import type { VideoJsPlayer } from "@/types/videojs-ima.types";
import type {
  UseVideoPlayerOptions,
  UseVideoPlayerReturn,
} from "@/types/useVideoPlayer.types";
import {
  attachAdListeners,
  createPlayer,
  disposePlayer,
  initIma,
} from "@/utils/videoPlayerUtils";

export function useVideoPlayer({
  src,
  adTagUrl,
  adContainerId,
}: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isEffectStillValid = true;

    async function init() {
      setReady(false);
      setError(null);

      const el = videoElRef.current;
      if (!el) return;

      disposePlayer(playerRef.current);
      playerRef.current = null;

      await loadImaSdk();
      if (!isEffectStillValid) return;

      const player = createPlayer(el, src);
      if (!isEffectStillValid) {
        player.dispose();
        return;
      }

      playerRef.current = player;

      initIma(player, adTagUrl, adContainerId);
      attachAdListeners(player);

      setReady(true);
    }

    init().catch((err: unknown) => {
      if (!isEffectStillValid) return;
      setError(err instanceof Error ? err.message : "Player failed to load");
    });

    return () => {
      isEffectStillValid = false;
      disposePlayer(playerRef.current);
      playerRef.current = null;
    };
  }, [src, adTagUrl, adContainerId]);

  return { videoElRef, ready, error };
}
