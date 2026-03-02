// src/hooks/useVideoPlayer.ts
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'videojs-contrib-ads';
import 'videojs-ima';
import { loadImaSdk } from '@/lib/loadImaSdk';

type VideoJsPlayer = ReturnType<typeof videojs>;

interface UseVideoPlayerOptions {
  src: string;
  poster?: string;
  adTagUrl: string;
  adContainerId: string;
}

interface UseVideoPlayerReturn {
  videoElRef: React.RefObject<HTMLVideoElement | null>;
  ready: boolean;
}

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
    let disposed = false;

    async function init() {
      if (!videoElRef.current) return;

      await loadImaSdk();
      if (disposed) return;

      const player = videojs(videoElRef.current, {
        controls: true,
        preload: 'auto',
        poster,
        sources: [{ src, type: 'video/mp4' }],
        fluid: true,
        playsinline: true,
      });

      playerRef.current = player;

      // @ts-expect-error plugin method exists at runtime
      player.ima({
        adTagUrl,
        adContainerId,
        debug: false,
      });

      const onFirstPlay = () => {
        // @ts-expect-error plugin method exists at runtime
        player.ima?.initializeAdDisplayContainer?.();
        // @ts-expect-error plugin method exists at runtime
        player.ima?.requestAds?.();
        player.off('play', onFirstPlay);
      };

      player.on('play', onFirstPlay);

      player.on('adserror', () => {
        // @ts-expect-error plugin method exists at runtime
        player.ima?.resumeAdPlayback?.();
      });

      setReady(true);
    }

    init();

    return () => {
      disposed = true;
      const p = playerRef.current;
      playerRef.current = null;
      if (p && !p.isDisposed()) p.dispose();
    };
  }, [src, poster, adTagUrl, adContainerId]);

  return { videoElRef, ready };
}
