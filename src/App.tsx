import { VideoPlayer } from "./components/VideoPlayer";
import { BIG_BUCK_BUNNY_VIDEO, TEST_VMAP_TAG } from "./config/media.config";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <VideoPlayer src={BIG_BUCK_BUNNY_VIDEO} adTagUrl={TEST_VMAP_TAG} />
      </div>
    </div>
  );
}
