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

      let timeoutId: ReturnType<typeof setTimeout>;

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
        clearTimeout(timeoutId);
        existing.removeEventListener("load", onLoad);
        existing.removeEventListener("error", onError);
      };

      timeoutId = setTimeout(() => {
        cleanup();
        imaSdkPromise = null;
        reject(new Error("IMA SDK load timed out"));
      }, 10_000);

      existing.addEventListener("load", onLoad);
      existing.addEventListener("error", onError);
      return;
    }

    const script = document.createElement("script");
    script.src = IMA_SDK_URL;
    script.async = true;
    script.dataset.imaSdk = "true";

    let timeoutId: ReturnType<typeof setTimeout>;

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
      clearTimeout(timeoutId);
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    timeoutId = setTimeout(() => {
      cleanup();
      imaSdkPromise = null;
      reject(new Error("IMA SDK load timed out"));
    }, 10_000);

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    document.head.appendChild(script);
  });

  return imaSdkPromise;
}
