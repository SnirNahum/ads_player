// src/lib/loadImaSdk.ts

declare global {
  interface Window {
    google?: unknown;
  }
}

const IMA_SDK_URL = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';

export function loadImaSdk(): Promise<void> {
  if (window.google) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-ima-sdk="true"]',
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load IMA SDK')),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = IMA_SDK_URL;
    s.async = true;
    s.defer = true;
    s.dataset.imaSdk = 'true';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load IMA SDK'));
    document.head.appendChild(s);
  });
}
