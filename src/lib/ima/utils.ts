export function withCorrelator(url: string) {
  const c = Date.now();
  return url.includes("correlator=")
    ? url.replace(/correlator=[^&]*/g, `correlator=${c}`)
    : `${url}${url.includes("?") ? "&" : "?"}correlator=${c}`;
}
