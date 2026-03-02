import { useRef } from "react";
import { useImaAds } from "../lib/ima/useImaAds";

type VideoPlayerProps = {
  src: string;
  prerollAdTagUrl: string;
  midrollAdTagUrl: string;
};

export function VideoPlayer({
  src,
  prerollAdTagUrl,
  midrollAdTagUrl,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const adContainerRef = useRef<HTMLDivElement | null>(null);

  const { adBreakActive, onPlay, onTimeUpdate } = useImaAds({
    videoRef,
    adContainerRef,
    prerollAdTagUrl,
    midrollAdTagUrl,
  });

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="relative aspect-video bg-black">
          <div
            ref={adContainerRef}
            className={`absolute inset-0 z-10 ${
              adBreakActive ? "pointer-events-auto" : "pointer-events-none"
            }`}
          />
          <video
            ref={videoRef}
            src={src}
            playsInline
            controls
            onPlay={onPlay}
            onTimeUpdate={onTimeUpdate}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
