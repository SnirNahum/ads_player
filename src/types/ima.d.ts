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
        const Type: { AD_ERROR: "AD_ERROR" };
      }

      namespace AdsManagerLoadedEvent {
        const Type: { ADS_MANAGER_LOADED: "ADS_MANAGER_LOADED" };
      }

      namespace AdEvent {
        const Type: {
          CONTENT_PAUSE_REQUESTED: "CONTENT_PAUSE_REQUESTED";
          CONTENT_RESUME_REQUESTED: "CONTENT_RESUME_REQUESTED";
          ALL_ADS_COMPLETED: "ALL_ADS_COMPLETED";
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
          type: "ADS_MANAGER_LOADED",
          cb: EventHandler<AdsManagerLoadedEvent>,
          capture?: boolean,
        ): void;

        addEventListener(
          type: string,
          cb: EventHandler<unknown>,
          capture?: boolean,
        ): void;

        requestAds(request: AdsRequest): void;

        removeEventListener?(
          type: "ADS_MANAGER_LOADED",
          cb: EventHandler<AdsManagerLoadedEvent>,
          capture?: boolean,
        ): void;

        removeEventListener?(
          type: string,
          cb: EventHandler<unknown>,
          capture?: boolean,
        ): void;
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
