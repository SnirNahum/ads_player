import { VideoPlayer } from "./components/VideoPlayer";
import { MIDROLL_AD_TAG_URL, PREROLL_AD_TAG_URL, VIDEO_URL } from "./config/config";

export default function App() {
  return (
    <div>
      <VideoPlayer
        src={VIDEO_URL}
        prerollAdTagUrl={PREROLL_AD_TAG_URL}
        midrollAdTagUrl={MIDROLL_AD_TAG_URL}
      />
    </div>
  );
}
