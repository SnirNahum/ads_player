import { useRef } from "react";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { createStableId } from "@/utils/utils";
import type { VideoPlayerProps } from "@/types/VideoPlayer.types";

export function VideoPlayer({ src, adTagUrl, poster }: VideoPlayerProps) {
  const adContainerIdRef = useRef<string>(createStableId("ad"));
  const adContainerId = adContainerIdRef.current;

  const { videoElRef, error } = useVideoPlayer({
    src,
    adTagUrl,
    adContainerId,
    poster,
  });

  if (error) {
    return <p>{"Video player failed to load. Please try again."}</p>;
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden">
      <div id={adContainerId} className="absolute inset-0 z-10 pointer-events-none" />

      <div data-vjs-player className="absolute inset-0">
        <video
          ref={videoElRef}
          className="video-js vjs-big-play-centered w-full h-full"
          controls
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
}
