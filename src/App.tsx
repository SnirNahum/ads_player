import { VideoPlayer } from "./components/VideoPlayer";
import { AD_TAG_URL, VIDEO_URL } from "./config/config";

export default function App() {
  return (
    <div>
      <VideoPlayer src={VIDEO_URL} adTagUrl={AD_TAG_URL} />
    </div>
  );
}
