import { useCallback, useEffect, useRef, useState } from "react";
import { createImaClient } from "./createImaClient";
import { loadImaSdk } from "./loadImaSdk";
import { ABORT_ERROR } from "./constants";
import { withCorrelator } from "./utils";

export type UseImaAdsArgs = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  adContainerRef: React.RefObject<HTMLDivElement | null>;
  prerollAdTagUrl: string;
  midrollAdTagUrl: string;
};

export function useImaAds({
  videoRef,
  adContainerRef,
  prerollAdTagUrl,
  midrollAdTagUrl,
}: UseImaAdsArgs) {
  const imaRef = useRef<ReturnType<typeof createImaClient> | null>(null);
  const initializedRef = useRef(false);

  const prerollRequestedRef = useRef(false);
  const midrollRequestedRef = useRef(false);

  const adBreakActiveRef = useRef(false);
  const [adBreakActive, setAdBreakActive] = useState(false);

  const setAdBreak = (active: boolean) => {
    adBreakActiveRef.current = active;
    setAdBreakActive(active);
  };

  const ensureIma = useCallback(async () => {
    const video = videoRef.current;
    const container = adContainerRef.current;
    if (!video || !container) return null;

    await loadImaSdk();

    if (!imaRef.current) {
      imaRef.current = createImaClient(video, container, {
        onAdBreakStart: () => {
          setAdBreak(true);
          video.pause();
        },
        onAdBreakEnd: () => {
          setAdBreak(false);
          video.play().catch((err: unknown) => {
            if (err instanceof DOMException && err.name === ABORT_ERROR) return;
            if (import.meta.env.DEV) console.error(err);
          });
        },
        onAdError: () => {
          setAdBreak(false);
          midrollRequestedRef.current = false;
          video.play().catch((err: unknown) => {
            if (err instanceof DOMException && err.name === ABORT_ERROR) return;
            if (import.meta.env.DEV) console.error(err);
          });
        },
      });
    }

    if (!initializedRef.current) {
      imaRef.current.initialize();
      initializedRef.current = true;
    }

    return imaRef.current;
  }, [adContainerRef, videoRef]);

  useEffect(() => {
    const onResize = () => imaRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => {
      imaRef.current?.destroy();
      imaRef.current = null;
      initializedRef.current = false;
    };
  }, []);

  const requestAds = useCallback(
    async (adTagUrl: string, pauseBeforeRequest: boolean) => {
      const video = videoRef.current;
      if (!video) return;

      const ima = await ensureIma();
      if (!ima) return;

      if (pauseBeforeRequest) video.pause();
      ima.requestAds(withCorrelator(adTagUrl));
    },
    [ensureIma, videoRef],
  );

  const onPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (adBreakActiveRef.current) {
      video.pause();
      return;
    }

    if (prerollRequestedRef.current) return;
    prerollRequestedRef.current = true;

    try {
      await requestAds(prerollAdTagUrl, true);
    } catch {
      video.play().catch((err: unknown) => {
        if (err instanceof DOMException && err.name === ABORT_ERROR) return;
        if (import.meta.env.DEV) console.error(err);
      });
    }
  }, [prerollAdTagUrl, requestAds, videoRef]);

  const onTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (adBreakActiveRef.current) return;
    if (video.seeking) return;
    if (midrollRequestedRef.current) return;

    midrollRequestedRef.current = true;
    void requestAds(midrollAdTagUrl, true);
  }, [midrollAdTagUrl, requestAds, videoRef]);

  return { adBreakActive, onPlay, onTimeUpdate };
}
