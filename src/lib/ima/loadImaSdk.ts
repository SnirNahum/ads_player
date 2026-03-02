import { IMA_SDK_LOAD_FAILED, IMA_SDK_URL } from "./constants";

let imaPromise: Promise<void> | null = null;

export function loadImaSdk(): Promise<void> {
  if (imaPromise) return imaPromise;

  imaPromise = new Promise((resolve, reject) => {
    if (window.google?.ima) return resolve();

    const script = document.createElement("script");
    script.src = IMA_SDK_URL;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => {
      imaPromise = null;
      reject(new Error(IMA_SDK_LOAD_FAILED));
    };

    document.head.appendChild(script);
  });

  return imaPromise;
}
