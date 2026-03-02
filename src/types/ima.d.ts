export {};

declare global {
  interface Window {
    google?: typeof google;
  }

  namespace google {
    namespace ima {
      enum ViewMode {
        NORMAL,
      }

      namespace AdErrorEvent {
        const Type: { AD_ERROR: string };
      }

      namespace AdsManagerLoadedEvent {
        const Type: { ADS_MANAGER_LOADED: string };
      }

      namespace AdEvent {
        const Type: {
          CONTENT_PAUSE_REQUESTED: string;
          CONTENT_RESUME_REQUESTED: string;
          ALL_ADS_COMPLETED: string;
        };
      }

      type EventHandler<T> = (evt: T) => void;

      interface AdDisplayContainer {
        initialize(): void;
      }

      interface AdsRequest {
        adTagUrl: string;
      }

      interface AdsManager {
        addEventListener(type: string, cb: () => void): void;
        init(width: number, height: number, viewMode: ViewMode): void;
        start(): void;
        resize(width: number, height: number, viewMode: ViewMode): void;
        destroy(): void;
      }

      interface AdsManagerLoadedEvent {
        getAdsManager(video: HTMLVideoElement): AdsManager;
      }

      interface AdsLoader {
        addEventListener(
          type: typeof AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
          cb: EventHandler<AdsManagerLoadedEvent>,
          capture?: boolean,
        ): void;
        addEventListener(type: string, cb: EventHandler<unknown>, capture?: boolean): void;
        requestAds(request: AdsRequest): void;
        removeEventListener?(
          type: typeof AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
          cb: EventHandler<AdsManagerLoadedEvent>,
          capture?: boolean,
        ): void;
        removeEventListener?(type: string, cb: EventHandler<unknown>, capture?: boolean): void;
      }

      interface AdDisplayContainerConstructor {
        new (adContainer: HTMLElement, video: HTMLVideoElement): AdDisplayContainer;
      }

      interface AdsRequestConstructor {
        new (): AdsRequest;
      }

      interface AdsLoaderConstructor {
        new (container: AdDisplayContainer): AdsLoader;
      }

      const AdDisplayContainer: AdDisplayContainerConstructor;
      const AdsRequest: AdsRequestConstructor;
      const AdsLoader: AdsLoaderConstructor;
    }
  }
}
