import { VideoPlayer } from "./components/VideoPlayer";
import { CONTENT_VIDEO_URL, TEST_VMAP_TAG } from "./constants";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <VideoPlayer src={CONTENT_VIDEO_URL} adTagUrl={TEST_VMAP_TAG} />
      </div>
    </div>
  );
}
