import { IMA_SDK_NOT_LOADED } from "./constants";

type ImaCallbacks = {
  onAdBreakStart?: () => void;
  onAdBreakEnd?: () => void;
  onAdError?: () => void;
};

export function createImaClient(
  videoEl: HTMLVideoElement,
  adContainerEl: HTMLElement,
  cb: ImaCallbacks = {},
) {
  if (!window.google?.ima) throw new Error(IMA_SDK_NOT_LOADED);

  const adDisplayContainer = new google.ima.AdDisplayContainer(adContainerEl, videoEl);
  const adsLoader = new google.ima.AdsLoader(adDisplayContainer);

  let adsManager: google.ima.AdsManager | null = null;
  let initialized = false;

  const destroyManager = () => {
    adsManager?.destroy();
    adsManager = null;
  };

  const onError = () => {
    destroyManager();
    cb.onAdError?.();
  };

  const onAdsManagerLoaded = (e: google.ima.AdsManagerLoadedEvent) => {
    destroyManager();

    try {
      adsManager = e.getAdsManager(videoEl);
    } catch {
      onError();
      return;
    }

    if (!adsManager) return;

    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onError);
    adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      () => cb.onAdBreakStart?.(),
    );
    adsManager.addEventListener(
      google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      () => cb.onAdBreakEnd?.(),
    );
    adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, destroyManager);

    adsManager.init(videoEl.clientWidth, videoEl.clientHeight, google.ima.ViewMode.NORMAL);
    adsManager.start();
  };

  adsLoader.addEventListener(
    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
    onAdsManagerLoaded,
  );

  return {
    initialize() {
      if (initialized) return;
      adDisplayContainer.initialize();
      initialized = true;
    },

    requestAds(adTagUrl: string) {
      const req = new google.ima.AdsRequest();
      req.adTagUrl = adTagUrl;
      adsLoader.requestAds(req);
    },

    resize() {
      if (!adsManager) return;
      adsManager.resize(videoEl.clientWidth, videoEl.clientHeight, google.ima.ViewMode.NORMAL);
    },

    destroy() {
      destroyManager();
      adsLoader.removeEventListener?.(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
      );
    },
  };
}
