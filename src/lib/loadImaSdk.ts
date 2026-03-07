declare global {
  interface Window {
    google?: { ima?: unknown };
  }
}

const IMA_SDK_URL = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";

let imaSdkPromise: Promise<void> | null = null;

function createScriptLoadHandlers(
  element: HTMLScriptElement,
  resolve: () => void,
  reject: (err: Error) => void,
  onPromiseReset: () => void,
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  const cleanup = () => {
    clearTimeout(timeoutId);
    element.removeEventListener("load", onLoad);
    element.removeEventListener("error", onError);
  };

  const onLoad = () => {
    element.dataset.loaded = "true";
    cleanup();
    resolve();
  };

  const onError = () => {
    cleanup();
    onPromiseReset();
    reject(new Error("Failed to load IMA SDK"));
  };

  timeoutId = setTimeout(() => {
    cleanup();
    onPromiseReset();
    reject(new Error("IMA SDK load timed out"));
  }, 10000);

  element.addEventListener("load", onLoad);
  element.addEventListener("error", onError);
}

export async function loadImaSdk(): Promise<void> {
  if (window.google?.ima) return;
  if (imaSdkPromise) return await imaSdkPromise;

  imaSdkPromise = new Promise<void>((resolve, reject) => {
    const resetPromise = () => (imaSdkPromise = null);

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-ima-sdk="true"]',
    );

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      createScriptLoadHandlers(existing, resolve, reject, resetPromise);
      return;
    }

    const script = document.createElement("script");
    script.src = IMA_SDK_URL;
    script.async = true;
    script.dataset.imaSdk = "true";

    createScriptLoadHandlers(script, resolve, reject, resetPromise);

    document.head.appendChild(script);
  });

  return imaSdkPromise;
}
