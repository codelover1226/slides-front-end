import GrowSlidesLogo from "assets/images/GrowSlides.png";
// import { ReactComponent as MainSiteLogo } from "assets/images/stuff-use.svg"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { RouteConstants } from "routes/RouteConstants";
import { fetchHeder } from "store/actions";
import MyAccount from "./MyAccount";
import stuffYouCanUseLogo from "assets/images/stuffyoucanuse.png";
import OtherTools from "./OtherTools";
// import { ReactSVG } from "react-svg";

const Header = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchHeder({
        site_id: 2,
        menu_type: 1,
      })
    );
  }, [dispatch]);

  return (
    <header style={{ height: 71 }}>
      <div className="main_logo">
        <Link to={RouteConstants.home}>
          <img
            src={GrowSlidesLogo}
            alt="Grow"
            height={30}
            style={{ width: "192.6px" }}
          />
        </Link>
      </div>

      <div className="right_header">
        <div className="left_search">
          <div className="search_main">
            <input type="search" />
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 10C7.70914 10 9.5 8.20914 9.5 6C9.5 3.79086 7.70914 2 5.5 2C3.29086 2 1.5 3.79086 1.5 6C1.5 8.20914 3.29086 10 5.5 10Z"
                stroke="#091D37"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 11L8.32501 8.825"
                stroke="#091D37"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="right-all">
          {/* <MainSiteLogo
            className="stuff-use"
            //src={mainSiteLogo}
            alt="stuff you can use"
          /> */}
          <img
            src={stuffYouCanUseLogo}
            alt="grow kid music"
            height={23}
            style={{}}
            className="stuff-logo"
          />
          <OtherTools />
          <MyAccount />
        </div>
      </div>
    </header>
  );
};

export default Header;
