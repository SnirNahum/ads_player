declare global {
  interface Window {
    google?: { ima?: unknown };
  }
}

const IMA_SDK_URL = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";

let imaSdkPromise: Promise<void> | null = null;

export function loadImaSdk(): Promise<void> {
  if (window.google?.ima) return Promise.resolve();
  if (imaSdkPromise) return imaSdkPromise;

  imaSdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-ima-sdk="true"]',
    );

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      const onLoad = () => {
        existing.dataset.loaded = "true";
        cleanup();
        resolve();
      };

      const onError = () => {
        cleanup();
        imaSdkPromise = null;
        reject(new Error("Failed to load IMA SDK"));
      };

      const cleanup = () => {
        existing.removeEventListener("load", onLoad);
        existing.removeEventListener("error", onError);
      };

      existing.addEventListener("load", onLoad);
      existing.addEventListener("error", onError);
      return;
    }

    const script = document.createElement("script");
    script.src = IMA_SDK_URL;
    script.async = true;
    script.dataset.imaSdk = "true";

    const onLoad = () => {
      script.dataset.loaded = "true";
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      imaSdkPromise = null;
      reject(new Error("Failed to load IMA SDK"));
    };

    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    document.head.appendChild(script);
  });

  return imaSdkPromise;
}
