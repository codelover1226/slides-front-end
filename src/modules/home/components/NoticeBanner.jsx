import { ReactComponent as StarIcon } from "assets/images/new-banner-star-icon.svg";
import { ReactComponent as CloseBannerIcon } from "assets/images/close-icon.svg";
import { useState } from "react";

const NoticeBanner = () => {
  const [banner, setBanner] = useState(true);

  return (
    <>
      {banner && (
        <div className="notice-banner">
          <div className="text-section">
            <div className="text-one">
              <StarIcon style={{ marginRight: "6px" }} />
              <span>Welcome to an all new Grow Slides!</span>
            </div>
            <div className="text-two">
              Rebuilt from the ground up with you in mind.
            </div>
          </div>
          <div className="close-section">
            <button
              className="switch-old-version"
              onClick={() =>
                window.location.replace("https://slides.stuffyoucanuse.dev/")
              }
            >
              Switch to old version
            </button>
            <button className="new-btn">What’s new?</button>
            <button
              className="banner-close-btn"
              onClick={() => setBanner(false)}
            >
              <CloseBannerIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NoticeBanner;
