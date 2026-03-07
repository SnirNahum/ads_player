import type { RefObject } from "react";

export type UseVideoPlayerOptions = {
  src: string;
  adTagUrl: string;
  adContainerId: string;
};

export type UseVideoPlayerReturn = {
  videoElRef: RefObject<HTMLVideoElement | null>;
  ready: boolean;
  error: string | null;
};
