import { useId } from 'react';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  adTagUrl: string;
}

export function VideoPlayer({ src, poster, adTagUrl }: VideoPlayerProps) {
  const adContainerId = useId().replace(/:/g, '');
  const { videoElRef, ready } = useVideoPlayer({ src, poster, adTagUrl, adContainerId });

  return (
    <div className="relative">
      <div id={adContainerId} className="absolute inset-0 z-10 pointer-events-none" />

      <div data-vjs-player>
        <video
          ref={videoElRef}
          className="video-js vjs-big-play-centered rounded-xl overflow-hidden"
        />
      </div>

      {!ready && (
        <div className="mt-3 text-xs text-zinc-400">Loading player…</div>
      )}
    </div>
  );
}
