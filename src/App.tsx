import { VideoPlayer } from "./components/VideoPlayer";

const TEST_VMAP_TAG =
  "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpremidpost&ciu_szs=300x250&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&cmsid=496&vid=short_onecue&correlator=";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <VideoPlayer
          src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          adTagUrl={TEST_VMAP_TAG}
        />
      </div>
    </div>
  );
}
