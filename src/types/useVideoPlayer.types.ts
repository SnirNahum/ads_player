export interface UseVideoPlayerOptions {
  src: string;
  poster?: string;
  adTagUrl: string;
  adContainerId: string;
}

export interface UseVideoPlayerReturn {
  videoElRef: React.RefObject<HTMLVideoElement | null>;
  ready: boolean;
}