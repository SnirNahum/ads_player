export function getVideoMimeType(src: string): string {
  if (src.includes(".m3u8")) return "application/x-mpegURL";
  if (src.includes(".mpd")) return "application/dash+xml";
  if (src.includes(".webm")) return "video/webm";
  return "video/mp4";
}

export function createStableId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
