import { useState } from "react";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import type { VideoPlayerProps } from "@/types/VideoPlayer.types";
import { createStableId } from "@/utils/videoPlayerUtils";

export function VideoPlayer({ src, adTagUrl }: VideoPlayerProps) {
  const [adContainerId] = useState(() => createStableId("ad"));

  const { videoElRef, ready, error } = useVideoPlayer({
    src,
    adTagUrl,
    adContainerId,
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
