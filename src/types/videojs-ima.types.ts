import videojs from "video.js";

export type VideoJsPlayer = ReturnType<typeof videojs>;

export type ImaInitOptions = {
  adTagUrl: string;
  adContainerId?: string;
  debug?: boolean;
  [key: string]: unknown;
};

export type ImaPlugin = ((options: ImaInitOptions) => void) & {
  initializeAdDisplayContainer?: () => void;
  requestAds?: () => void;
  resumeAdPlayback?: () => void;
};

export type PlayerWithIma = VideoJsPlayer & {
  ima: ImaPlugin;
};