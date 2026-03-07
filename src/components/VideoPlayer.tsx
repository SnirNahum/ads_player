import { useRef } from "react";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { createStableId } from "@/utils/utils";
import type { VideoPlayerProps } from "@/types/VideoPlayer.types";

export function VideoPlayer({ src, adTagUrl, poster }: VideoPlayerProps) {
  const adContainerIdRef = useRef<string>(createStableId("ad"));
  const adContainerId = adContainerIdRef.current;

  const { videoElRef, ready, error } = useVideoPlayer({
    src,
    adTagUrl,
    adContainerId,
    poster,
  });

  if (error) {
    return <p>Video player failed to load. Please try again.</p>;
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl">
      <div id={adContainerId} className="absolute inset-0 z-10 pointer-events-none " />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <p className="text-white text-sm">Loading...</p>
        </div>
      )}
      <div data-vjs-player className="h-full w-full">
        <video
          ref={videoElRef}
          className="video-js vjs-big-play-centered h-full w-full"
          controls
          playsInline
          preload="auto"
        />
      </div>
    </div>
  );
}
