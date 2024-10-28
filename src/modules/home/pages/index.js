import noThumbnailImg from "assets/images/new_no_thumbnail_img.jpg";
import searchIcon from "assets/images/search.svg";
import { HomeLoader } from "common/Loaders/HomeLoader";
import CommonButton from "components/CommonButton";
import FeedModal from "modules/home/components/FeedModal";
import Breadcrumb from "modules/slider/components/Breadcrumb";
import React, { memo, useEffect, useMemo, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import { getSliderContent } from "utils/slider";
import Card from "../components/Card";
import {
  activeDeactiveRecentSlideShow,
  fetchFeeds,
  recentSlideShow,
} from "../store/actions";
import NoticeBanner from "../components/NoticeBanner";

const Home = () => {
  const dispatch = useDispatch();
  const { loadingFeeds, feeds, slideShow,sharedDashboardAccess } = useSelector(state => state.Home);
  const { user } = useSelector(state => state.Auth);
  const { subscriptionStatus } = useSelector(state => state.Profile);
  const navigate = useNavigate();
  const [openAddFeedModal, setOpenAddFeedModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [editData, setEditData] = useState(null);
  const [modalType, setModalType] = useState(0);

  const redirectingToSubscription = () => {
    toast.error("You need to purchase subscription before proceeding further");
    navigate(`/subscription`);
  };

  const isSubscribed = useMemo(
    () => [1, 2].includes(user?.user_role) || subscriptionStatus,
    [subscriptionStatus, user]
  );

  const clickOpenFeed = () => {
    if (isSubscribed || feeds.length === 0 || sharedDashboardAccess) {
      setModalType(1);
      setOpenAddFeedModal(true);
    } else {
      redirectingToSubscription();
    }
  };
  const handleCloseAddUpdateFeed = () => {
    setOpenAddFeedModal(false);
  };

  const editFeed = feed => {
    setModalType(2);
    setOpenAddFeedModal(true);
    setEditData(feed);
  };

  const handleRecentSlideStatusChange = (slideshow_id, is_active, feed_id) => {
    const payload = {
      slideshow_id: slideshow_id,
      is_active: is_active ? 0 : 1,
    };
    dispatch(
      activeDeactiveRecentSlideShow({
        payload,
        feed_id,
      })
    );
  };

  const feedList = useMemo(() => {
    let filteredFeeds = feeds.filter(item => {
      const query = searchVal?.toLowerCase();
      return (
        item?.title?.toLowerCase().indexOf(query) >= 0 ||
        item?.code?.toLowerCase().indexOf(query) >= 0
      );
    });
  
    filteredFeeds.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  
    return filteredFeeds;
  }, [feeds, searchVal]);
  useEffect(() => {
    dispatch(recentSlideShow());
    dispatch(fetchFeeds());
  }, [dispatch]);

  const checkBackgroundImage = htmlString => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;
    const sectionElement = tempElement.querySelector("section");

    if (sectionElement) {
      const style = sectionElement.getAttribute("style");
      const hasBackgroundImage = style && style.includes("background-image");
      const hasImgTag = sectionElement.querySelector("img");
  
      if (hasBackgroundImage || hasImgTag) {
        return true;
      }
    }
    return false;
  };
  console.log(slideShow)
  return (
    <div className="right_bar">
      {/* <NoticeBanner /> */}
      <Breadcrumb />
      <h1 className="hello_title">Grow Slides Dashboard</h1>
      <div className="right-main-card main-card">
        {/* <div className="container-fluid">
          <div className="search">
            <div className="d-flex position-relative">
              <input
                type="text"
                label="Search"
                placeholder="Search ..."
                className="pe-5"
                onChange={e => setSearchVal(e.target.value)}
              />
              <img src={searchIcon} alt="" className="search-icon" />
            </div>
            <CommonButton
              btnClass="text-white inner-space"
              btnClick={clickOpenFeed}
              btnText={"Add Feed"}
            />
          </div>
        </div>
        <hr /> */}
        <div className="main-slider-area">
          <h2 style={{marginTop:"0px"}}>Recent Slideshows</h2>
          <Row className="recent-slideshow pb-2 ">
            {loadingFeeds ? (
              <HomeLoader size={1} />
            ) : !!slideShow.length ? (
              slideShow?.slice(0, 3)?.map((slide, i) => {
                return (
                  <Col
                    className="slider-inner col-lg-4 col-md-6 col-sm-6 col-xs-12"
                    key={i}
                  >
                    <div className="slider-image ">
                      <div
                        className="add-new-slide"
                        onClick={() => navigate(`/slidr/${slide.slideshow_id}`)}
                      >
                        {slide &&
                        slide?.gs_slides &&
                        slide.gs_slides.length > 0 &&
                        slide.gs_slides[0].content &&
                        checkBackgroundImage(slide?.gs_slides[0]?.content) ? (
                          <div
                            className="prv-html"
                            dangerouslySetInnerHTML={{
                              __html: getSliderContent(
                                slide?.gs_slides[0]?.content || ""
                              ),
                            }}
                          />
                        ) : (
                          <img src={noThumbnailImg} alt="No" />
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="slideshow-inner-left">
                        <h4>{slide?.title}</h4>
                        <p className="slider-description mb-0">
                          {slide?.feed_title}
                        </p>
                      </div>
                      {slide?.is_shared ? (
                        <></>
                      ) : (
                        <div className="form-switch">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip">Activate</Tooltip>}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={slide?.is_active === 1 ? true : false}
                              onChange={e =>
                                handleRecentSlideStatusChange(
                                  slide?.slideshow_id,
                                  slide?.is_active,
                                  slide?.feed_id
                                )
                              }
                            />
                          </OverlayTrigger>
                        </div>
                      )}
                    </div>
                  </Col>
                );
              })
            ) : (
              <div className="d-flex justify-content-center py-4">
                No data found
              </div>
            )}
          </Row>
          <hr className="recent-slider-hr" />
          <div className="folder-section  mt-2">
            <div className="feeds-btn">
            <h2 className="feedPadding">Feeds</h2>
            <CommonButton
              btnClass="text-white inner-space"
              btnClick={clickOpenFeed}
              btnText={"Add Feed"}
            />
            </div>
            {loadingFeeds ? (
              <HomeLoader size={1} />
            ) : !!feedList.length ? (
              <Row>
                {feedList?.map((feed, i) => (
                  <React.Fragment key={i}>
                    <Card
                      feed={feed}
                      editFeed={editFeed}
                      className={
                        i === feedList.length - 1
                          ? "last-feed-card"
                          : "non-last-feed-card"
                      }
                    />
                  </React.Fragment>
                ))}
              </Row>
            ) : (
              <div className="d-flex justify-content-center py-4">
                No data found
              </div>
            )}
          </div>
        </div>
      </div>
      <FeedModal
        isOpen={openAddFeedModal}
        handleClose={handleCloseAddUpdateFeed}
        editData={editData}
        modalType={modalType}
      />
    </div>
  );
};

export default memo(Home);
