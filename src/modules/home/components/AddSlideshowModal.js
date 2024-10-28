import GrowSlideImg from "assets/images/Grow-Leaf-Logos.svg";
import NewSlideImg from "assets/images/Grow-Slides-Logos.svg";
import closeIcon from "assets/images/close.svg";
import folderSVG from "assets/images/folder.svg";
import noThumbnailImg from "assets/images/new_no_thumbnail_img.jpg"
import {
  GET_ALL_SERIES_URL,
  GET_VOLUMES_URL,
  GET_ALL_GAME_URL,
} from "helper/url_helper";
import { useEffect, useMemo, useState } from "react";
import { ModalHeader } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ReactSVG } from "react-svg";
import { toast } from "react-toastify";
import { Col, Modal, ModalBody, Row } from "reactstrap";
import { axiosAdmin, axiosSlidr } from "services/api";
import useDebounce from "hooks/useDebounce";
import { ministries } from "constants";
import {
  addGrowSlideshow,
  addSlideshow,
  fetchUserVolumesSlidesCount,
} from "../store/actions";

import { ReactComponent as LeftArrow } from "assets/images/arrow-left.svg";
import useWindowSize from "hooks/useWindowSize";
import { getSliderContent } from "utils/slider";
import MobileViewAddSlideshowModal from "./MobileViewAddSlideshowModal";
const ministry_type = {
  1: "kids",
  2: "students",
  3: "groups",
};

const GrowSlideShowModal = ({ isOpen, onClose, feedId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loadingAddGrowSlideshow } = useSelector(state => state.Home);
  const [ministryType, setMinistryType] = useState(0);
  const [loadingVolume, setLoadingVolume] = useState(false);
  const [volumes, setVolumes] = useState([]);
  const [volumeId, setVolumeId] = useState(0);
  const [series, setSeries] = useState([]);
  const [seriesId, setSeriesId] = useState(0);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [checkedSlide, setCheckedSlide] = useState(0);
  const [userCount, setUserCount] = useState([]);

  const { fetchCounts } = useSelector(state => state.Home);
  const innerWidth = useWindowSize();
  const [library, setLibrary] = useState();
  const page_record = 12;
  useEffect(() => {
    setUserCount({
      kids: fetchCounts.kids,
      students: fetchCounts.students,
      groups: fetchCounts.groups,
    });
  }, [fetchCounts]);
  const [page, setPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search);
  // eslint-disable-next-line no-unused-vars
  const [loadingSlideshow, setLoadingSlideshow] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [slideshowId, setSlideshowId] = useState(0);
  const [gameSlideShow, setGameSlideShow] = useState([]);
  const [gamesCount, setGamesCount] = useState(0);
  const slideshows = useMemo(
    () =>
      series.find(x => x.category_id === seriesId)?.slide_show_details || [],
    [seriesId, series]
  );
  // eslint-disable-next-line no-unused-vars
  const next = () => {
    setPage(page + 1);
    page_record * page < totalSize ? setHasMore(true) : setHasMore(false);
  };
  const resetData = () => {
    setVolumeId(0);
    setVolumes([]);
    setSeriesId(0);
    setSeries([]);
  };
  useEffect(() => {
    try {
      // if (page !== 1) {
      // setLoadingSlideshow(true);
      axiosSlidr
        .post(GET_ALL_GAME_URL, {
          page_no: page,
          page_record: page_record,
        })
        .then(res => {
          if (res.status && res.data?.data?.slideShows) {
            setGamesCount(res.data?.data?.slideShows?.count);
            if (page !== 1) {
              setGameSlideShow(prev => [
                ...prev,
                ...res.data?.data?.slideShows.rows,
              ]);
            }
          }
        });
      // }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  }, [page]);

  useEffect(() => {
    setPage(1);
    try {
      if (ministryType === 4) {
        setLoadingSlideshow(true);
        setSlideshowId(0);
        axiosSlidr
          .post(GET_ALL_GAME_URL, {
            page_no: 1,
            page_record: page_record,
            search: debounceSearch,
          })
          .then(res => {
            if (res.status && res.data?.data?.slideShows) {
              setGameSlideShow(res.data?.data?.slideShows?.rows);
              // res.data?.data?.slideShows?.rows.length === 0 &&
              //   setSlideshowId(0);
              setTotalSize(res.data?.data?.slideShows?.count);
              page_record < res.data?.data?.slideShows?.count
                ? setHasMore(true)
                : setHasMore(false);
              setLoadingSlideshow(false);
            }
          });
      }
    } catch (err) {
      // setLoadingSeries(false);
      setLoadingSlideshow(false);
      toast.error(err.response?.data?.message || err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch]);
  const changeMinistryType = (e, ministryType) => {
    e.preventDefault();
    resetData();
    setMinistryType(ministryType);
    setLibrary(ministryType);
    setGameSlideShow([]);
    if (library === ministryType) {
      setMinistryType(0);
      setLibrary(0);
      return;
    }
    try {
      setLoadingVolume(true);
      axiosAdmin.get(`${GET_VOLUMES_URL}/${ministryType}`).then(res => {
        if (res.status && res.data?.data?.purchased_volumes) {
          resetData();
          setLoadingVolume(false);
          let vol = res.data.data.purchased_volumes.filter(
            x => x.category_id !== +process.env.REACT_APP_MUSIC_ID
          );
          setVolumes(vol);
        }
      });
    } catch (err) {
      setLoadingVolume(false);
      toast.error(err.response?.data?.message || err.message);
    }
  };
  const changeGameType = ministryType => {
    resetData();
    setMinistryType(ministryType);
    setPage(1);
    setSearch("");
    if (innerWidth?.width < 576) {
      setSeriesId(0);
    }
    try {
      setSlideshowId(0);
      setLoadingSlideshow(true);
      axiosSlidr
        .post(GET_ALL_GAME_URL, {
          page_no: 1,
          page_record: page_record,
        })
        .then(res => {
          if (res.status && res.data?.data?.slideShows) {
            setGameSlideShow(res.data?.data?.slideShows?.rows);
            // res.data?.data?.slideShows?.rows.length === 0 && setSlideshowId(0);
            setTotalSize(res.data?.data?.slideShows?.count);
            page_record < res.data?.data?.slideShows?.count
              ? setHasMore(true)
              : setHasMore(false);
            setLoadingSlideshow(false);
          }
        });
    } catch (err) {
      // setLoadingSeries(false);
      setLoadingSlideshow(false);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const changeVolume = (e, categories_id) => {
    e.preventDefault();
    setGameSlideShow([]);
    if (volumeId === categories_id) {
      setVolumeId(0);
      return;
    }
    setVolumeId(categories_id);

    // let series_data = userCount[ministry_type[ministryType]]?.volumes?.find(
    //   f => f?.category_id === categories_id
    // )?.series;

    // setSeries(series_data);

    try {
      setLoadingSeries(true);
      axiosSlidr
        .post(GET_ALL_SERIES_URL, {
          volume_id: categories_id,
          ministry_type: ministryType,
        })

        .then(res => {
          if (res.status && res.data?.data?.rows) {
            setSeriesId(0);
            setLoadingSeries(false);
            setSeries(res.data.data.rows);
          }
        });
    } catch (err) {
      setLoadingSeries(false);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const addSlideShow = id => {
    if (loadingAddGrowSlideshow) return;

    dispatch(
      addGrowSlideshow({
        feed_id: feedId,
        slideshow_id: id,
        navigate: navigate,
      })
    );
  };

  // const handleAddGrowSlideshow = () => {
  //   dispatch(
  //     addGrowSlideshow({
  //       feed_id: feedId,
  //       slideshow_id: slideshowId,
  //       navigate: navigate,
  //     })
  //   );
  // };

  const handleFolderback = () => {
    if (gameSlideShow) {
      setGameSlideShow([]);
    }
    if (seriesId) {
      setSeriesId(0);
      return;
    }
    if (volumeId) {
      setVolumeId(0);
    }
    if (!volumeId && ministryType) {
      setMinistryType(0);
      resetData();
    }
  };

  useEffect(() => {
    // dispatch(fetchUserVolumesCount());
    dispatch(fetchUserVolumesSlidesCount());
  }, [dispatch]);

  const getCurrentViewLabel = () => {
    if (volumeId) {
      return (
        volumes?.find(volume => volume.category_id === volumeId)
          ?.category_title || ""
      );
    } else if (!volumeId && ministryType) {
      return (
        ministries?.find(ministry => ministry.id === ministryType)?.label || ""
      );
    } else {
      return "Library";
    }
  };
  // useEffect(() => {
  //   return () => {
  //     resetData();
  //     setMinistryType(0);
  //   };
  // }, [onClose]);

  const volumesWithCount = useMemo(() => {
    return volumes?.map(i => {
      return {
        ...i,
        count: userCount[ministry_type[ministryType]]?.volumes?.find(
          f => +f.category_id === i?.category_id
        )?.count,
      };
    });
  }, [ministryType, userCount, volumes]);

  const seriesCount = useMemo(() => {
    let series_data = userCount[ministry_type[ministryType]]?.volumes
      ?.find(f => f?.category_id === volumeId)
      ?.series?.map(m => +m.category_id);

    return series
      ?.filter(f => series_data?.includes(+f?.category_id))
      ?.map(p => {
        return { ...p, count: p?.slide_show_details?.length };
      });
  }, [ministryType, series, userCount, volumeId]);

  const checkBackgroundImage = (htmlString, index) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;
    const sectionElement = tempElement.querySelector("section");

    if (sectionElement) {
      const style = sectionElement.getAttribute("style");
      if (style && style.includes("background-image")) {
        return true;
      }
    }
    return false;
  };
  function extractCleanURL(html) {
    const urlRegex = /url\(&quot;\s*(.*?)\s*&quot;\)/;
    const matches = html.match(urlRegex);
    if (matches && matches.length > 1) {
      const url = matches[1].trim();
      return `<img src="${url}" alt="slide"/>`;
    }
    return null;
  }

  function modifiedGetSliderContent(content) {
    const cleanedURL = extractCleanURL(content);
    if (cleanedURL) {
      return cleanedURL;
    } else {
      return getSliderContent(content);
    }
  }

  return (
    <Modal
      className="slidr-modal add-slideshow-modal grow-slideshow-modal slidr-slideshow-modal "
      isOpen={isOpen}
      centered
      size="xl"
    >
      <ModalHeader className="cursor-pointer">
        <div className="d-block w-100">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-block">
              <h2>Grow Slideshows</h2>
              {/* <span>
                Choose from the files below the slide templates you need
              </span> */}
            </div>
            <div className="d-flex">
              {/* <CommonButton
                btnClass="me-3 text-white"
                btnClick={handleAddGrowSlideshow}
                btnDisabled={!slideshowId}
                btnText={
                  loadingAddGrowSlideshow ? "Adding..." : "Add Slideshow"
                }
              /> */}
              <img
                className="mobileClose"
                src={closeIcon}
                alt="close"
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className={innerWidth?.width < 576 ? "" : `fixBody`}>
        {innerWidth?.width < 576 ? (
          <>
            {/* Mobile Container Start */}

            {!seriesId && !slideshows.length && !gameSlideShow.length ? (
              // Ministry and Volume start
              <Col lg={4} md={6} sm={6} xs={12} className="slideshow_library">
                <h6>
                  {" "}
                  {getCurrentViewLabel() === "Library" ? (
                    "Library"
                  ) : (
                    <>
                      <LeftArrow
                        className="collapse-icon"
                        style={{ marginRight: "5px", marginBottom: "3px" }}
                        onClick={() => handleFolderback()}
                      />
                      <>{getCurrentViewLabel()}</>
                    </>
                  )}
                </h6>
                <div id="accordion" style={{ marginTop: "5%" }}>
                  <div className="series-card">
                    <MobileViewAddSlideshowModal
                      ministries={ministries}
                      volumes={volumesWithCount}
                      series={seriesCount}
                      changeMinistryType={changeMinistryType}
                      changeGameType={changeGameType}
                      gameSlideShow={gameSlideShow}
                      gamesCount={gamesCount}
                      changeVolume={changeVolume}
                      setSeriesId={setSeriesId}
                      ministryType={ministryType}
                      loadingVolume={loadingVolume}
                      loadingSeries={loadingSeries}
                      userCount={userCount}
                      volumeId={volumeId}
                      seriesId={seriesId}
                    />
                  </div>
                </div>
              </Col>
            ) : (
              // Ministry and Volume end
              // Ministry and Volume end
              <div
                className="select_slideshow "
                style={{ height: "calc(100vh - 97px)" }}
              >
                {/* Mobile slide show start */}
                <h6 className="pb-3">
                  <LeftArrow
                    className="collapse-icon"
                    style={{
                      marginRight: "5px",
                      marginBottom: "3px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleFolderback()}
                  />
                  Select Slideshow
                </h6>
                <Row className="libSlide">
                  {!!slideshows.length && !gameSlideShow.length ? (
                    slideshows.map((slide, i) => (
                      //  Mobile Volumes Slideshow start
                      <Col
                        // lg={6}
                        // md={6}
                        //  sm={6}
                        xs={6}
                        // lg={5}
                        // className="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-3"
                        onClick={
                          () => addSlideShow(slide.slideshow_id)
                          // changeSlideshow(slide.slideshow_id)
                        }
                      >
                        <div className="add-grow-slideshows p-0">
                          <input
                            className="checked-slide-radio"
                            type="radio"
                            checked={
                              checkedSlide === slide.slideshow_id ? true : false
                            }
                            onChange={() => setCheckedSlide(slide.slideshow_id)}
                          />

                          <div className="add-new-slide w-100">
                            {slide &&
                            slide?.gs_slides &&
                            slide.gs_slides.length > 0 &&
                            slide.gs_slides[0].content ? (
                              <div
                                className="prv-html"
                                dangerouslySetInnerHTML={{
                                  __html: modifiedGetSliderContent(
                                    slide?.gs_slides[0]?.content || ""
                                  ),
                                }}
                                onClick={() =>
                                  setCheckedSlide(slide.slideshow_id)
                                }
                              />
                            ) : (
                              <div className="" style={{ height: "100%" }}>
                                <img
                                  src={noThumbnailImg}
                                  alt="no thumbnail"
                                  className="rounded"
                                />
                              </div>
                            )}
                          </div>

                          <h6 className="py-2">{slide.title}</h6>
                        </div>
                      </Col>
                      //  Mobile Volumes Slideshow end
                    ))
                  ) : !!gameSlideShow.length ? (
                    gameSlideShow.map((slide, i) => (
                      <Col
                        // lg={6}
                        // md={6}
                        //  sm={6}
                        xs={6}
                        // lg={5}
                        // className="col-lg-6 col-md-6 col-sm-6 col-xs-6 mb-3"
                        onClick={
                          () => addSlideShow(slide.slideshow_id)
                          // changeSlideshow(slide.slideshow_id)
                        }
                      >
                        <div className="add-grow-slideshows p-0">
                          <input
                            className="checked-slide-radio"
                            type="radio"
                            checked={
                              checkedSlide === slide.slideshow_id ? true : false
                            }
                            onChange={() => setCheckedSlide(slide.slideshow_id)}
                          />
                          <div className="add-new-slide w-100">
                            {slide &&
                            slide?.gs_slides &&
                            slide.gs_slides.length > 0 &&
                            slide.gs_slides[0].content &&
                            checkBackgroundImage(
                              slide?.gs_slides[0].content,
                              i
                            ) ? (
                              <div
                                className="prv-html"
                                dangerouslySetInnerHTML={{
                                  __html: modifiedGetSliderContent(
                                    slide?.gs_slides[0]?.content || ""
                                  ),
                                }}
                                onClick={() =>
                                  setCheckedSlide(slide.slideshow_id)
                                }
                              />
                            ) : (
                              <div className="" style={{ height: "100%" }}>
                                <img
                                  src={noThumbnailImg}
                                  alt="no thumbnail"
                                  className="rounded"
                                />
                              </div>
                            )}
                          </div>

                          <h6 className="py-2">{slide.title}</h6>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <p className="h6">No data found</p>
                  )}
                </Row>
                {/* Mobile slide show end */}
              </div>
            )}
            {/* Mobile Container End */}
          </>
        ) : (
          <>
            {/* Web Container Start */}
            <Row>
              <Col lg={5} md={12} sm={12} className="slideshow_library">
                <div id="accordion">
                  <div className="series-card"></div>
                </div>

                <h6 className="pb-3">Library</h6>
                <div id="accordion">
                  <div className="series-card">
                    {/* ministry menu  start*/}
                    {ministries.map(ministry => (
                      <div
                        className="series-card-header"
                        id="heading-1"
                        key={ministry.id}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={e => changeMinistryType(e, ministry.id)}
                        >
                          <label
                            className={`justify-content-between cursor-pointer ${
                              ministryType === ministry.id ? "active" : ""
                            }`}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <i
                                className={`bx ${
                                  ministryType === ministry.id
                                    ? "bxs-up-arrow"
                                    : "bxs-right-arrow"
                                } menu-arrow`}
                              ></i>
                              <img
                                className="imgHover"
                                src={folderSVG}
                                alt="folder"
                              />
                              <div>{ministry.label}</div>
                            </div>

                            {loadingVolume && ministryType === ministry.id ? (
                              <i className="bx bx-loader bx-spin"></i>
                            ) : (
                              <div className="userVolumeCount">
                                {(userCount &&
                                  Object.values(userCount)?.find(
                                    x => x?.ministry_type === ministry.id
                                  )?.count) ||
                                  0}
                              </div>
                            )}
                          </label>
                        </div>
                        {ministryType === ministry.id &&
                          volumesWithCount?.map((volume, i) => (
                            <>
                              <div
                                className="child cursor-pointer"
                                key={volume.category_id}
                                onClick={e => {
                                  changeVolume(e, volume.category_id);
                                }}
                              >
                                <label
                                  className={`justify-content-between cursor-pointer ${
                                    volumeId === volume.category_id
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <div className="d-flex align-items-center gap-3">
                                    <i
                                      className={`bx ${
                                        volumeId === volume.category_id
                                          ? "bxs-up-arrow"
                                          : "bxs-right-arrow"
                                      }`}
                                    ></i>
                                    <img src={folderSVG} alt="folder" />
                                    {volume.category_title}
                                  </div>

                                  {loadingSeries &&
                                  volumeId === volume.category_id ? (
                                    <i className="bx bx-loader bx-spin"></i>
                                  ) : (
                                    <div className="userVolumeCount">
                                      {volume?.count}
                                    </div>
                                  )}
                                </label>
                              </div>
                              {!loadingSeries &&
                                volumeId === volume.category_id &&
                                seriesCount?.map(ser => (
                                  <div
                                    className="series-child cursor-pointer"
                                    key={ser.category_id}
                                    onClick={() => setSeriesId(ser.category_id)}
                                  >
                                    <label
                                      className={`justify-content-between cursor-pointer ${
                                        seriesId === ser.category_id
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <div className="d-flex align-items-center gap-3">
                                        <i
                                          className={`bx ${
                                            seriesId === ser.category_id
                                              ? "bxs-up-arrow"
                                              : "bxs-right-arrow"
                                          }`}
                                        ></i>
                                        <img src={folderSVG} alt="folder" />
                                        {ser.category_title}
                                      </div>

                                      <div className="userVolumeCount">
                                        {ser.count || 0}
                                      </div>
                                    </label>
                                  </div>
                                ))}
                            </>
                          ))}
                      </div>
                    ))}
                    {/* ministry menu  End*/}
                    {/* ministry Games menu start*/}
                    <div
                      className="series-card-header"
                      id="heading-1"
                      //key={ministry.id}
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => changeGameType(4)}
                      >
                        <label
                          className="justify-content-between cursor-pointer"
                          // className={`justify-content-between cursor-pointer ${
                          //   ministryType === ministry.id ? "active" : ""
                          // }`}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <i
                              className={`bx ${
                                gameSlideShow.length
                                  ? "bxs-up-arrow"
                                  : "bxs-right-arrow"
                              } menu-arrow`}
                            ></i>
                            <img
                              className="imgHover"
                              src={folderSVG}
                              alt="folder"
                            />
                            <div>Grow Games</div>
                          </div>

                          <div className="userVolumeCount">
                            {gamesCount || 0}
                          </div>
                        </label>
                      </div>
                      {/* {ministryType === ministry.id &&
                          volumesWithCount?.map((volume, i) => (
                            <>
                              <div
                                className="child cursor-pointer"
                                key={volume.category_id}
                                onClick={e => {
                                  changeVolume(e, volume.category_id);
                                }}
                              >
                                <label
                                  className={`justify-content-between cursor-pointer ${
                                    volumeId === volume.category_id
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <div className="d-flex align-items-center gap-3">
                                    <i
                                      className={`bx ${
                                        volumeId === volume.category_id
                                          ? "bxs-up-arrow"
                                          : "bxs-right-arrow"
                                      }`}
                                    ></i>
                                    <img src={folderSVG} alt="folder" />
                                    {volume.category_title}
                                  </div>

                                  {loadingSeries &&
                                  volumeId === volume.category_id ? (
                                    <i className="bx bx-loader bx-spin"></i>
                                  ) : (
                                    <div className="userVolumeCount">
                                      {volume?.count}
                                    </div>
                                  )}
                                </label>
                              </div>
                              {!loadingSeries &&
                                volumeId === volume.category_id &&
                                seriesCount?.map(ser => (
                                  <div
                                    className="series-child cursor-pointer"
                                    key={ser.category_id}
                                    onClick={() => setSeriesId(ser.category_id)}
                                  >
                                    <label
                                      className={`justify-content-between cursor-pointer ${
                                        seriesId === ser.category_id
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <div className="d-flex align-items-center gap-3">
                                        <i
                                          className={`bx ${
                                            seriesId === ser.category_id
                                              ? "bxs-up-arrow"
                                              : "bxs-right-arrow"
                                          }`}
                                        ></i>
                                        <img src={folderSVG} alt="folder" />
                                        {ser.category_title}
                                      </div>

                                      <div className="userVolumeCount">
                                        {ser.count || 0}
                                      </div>
                                    </label>
                                  </div>
                                ))}
                            </>
                          ))} */}
                    </div>
                    {/* ministry Games menu End*/}
                  </div>
                </div>
              </Col>
              {/* web */}
              <Col lg={7} md={12} sm={12} className="select_slideshow">
                <h6 className="pb-3">Select Slideshow</h6>
                <Row className="gap-1 libSlide">
                  {!!slideshows.length && !gameSlideShow.length ? (
                    slideshows.map(slide => (
                      <Col
                        lg={6}
                        sm={6}
                        className="add-grow-slideshows"
                        onClick={() => addSlideShow(slide.slideshow_id)}
                      >
                        <input
                          className="checked-slide-radio"
                          type="radio"
                          checked={
                            checkedSlide === slide.slideshow_id ? true : false
                          }
                          onChange={() => setCheckedSlide(slide.slideshow_id)}
                        />
                        <div className="add-new-slide abc">
                          {slide &&
                          slide?.gs_slides &&
                          slide.gs_slides.length > 0 &&
                          slide.gs_slides[0].content ? (
                            <div
                              className="prv-html"
                              dangerouslySetInnerHTML={{
                                __html: modifiedGetSliderContent(
                                  slide?.gs_slides[0]?.content || ""
                                ),
                              }}
                              onClick={() =>
                                setCheckedSlide(slide.slideshow_id)
                              }
                            />
                          ) : (
                            <div
                              className="add-new-slide-nothumbnail"
                              style={{ height: "auto" }}
                            >
                              <img
                                src={noThumbnailImg}
                                alt="no thumbnail"
                                className="rounded"
                              />
                            </div>
                          )}
                        </div>

                        <h6 className="py-2">{slide.title}</h6>
                      </Col>
                    ))
                  ) : !!gameSlideShow.length ? (
                    gameSlideShow.map(slide => (
                      <Col
                        lg={6}
                        sm={6}
                        className="add-grow-slideshows"
                        onClick={() => addSlideShow(slide.slideshow_id)}
                      >
                        <input
                          className="checked-slide-radio"
                          type="radio"
                          checked={
                            checkedSlide === slide.slideshow_id ? true : false
                          }
                          onChange={() => setCheckedSlide(slide.slideshow_id)}
                        />
                        <div className="add-new-slide abc">
                          {slide &&
                          slide?.gs_slides &&
                          slide.gs_slides.length > 0 &&
                          slide.gs_slides[0].content ? (
                            <div
                              className="prv-html"
                              dangerouslySetInnerHTML={{
                                __html: modifiedGetSliderContent(
                                  slide?.gs_slides[0]?.content || ""
                                ),
                              }}
                              onClick={() =>
                                setCheckedSlide(slide.slideshow_id)
                              }
                            />
                          ) : (
                            <div
                              className="add-new-slide-nothumbnail"
                              style={{ height: "auto" }}
                            >
                              <img
                                src={noThumbnailImg}
                                alt="no thumbnail"
                                className="rounded"
                              />
                            </div>
                          )}
                        </div>

                        <h6 className="py-2">{slide.title}</h6>
                      </Col>
                    ))
                  ) : (
                    // <p className="h6">No data found</p>
                    <></>
                  )}
                </Row>
              </Col>
            </Row>
            {/* Web Container End */}
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

const AddSlideshowModal = ({ isOpen, onClose, feedId }) => {
  const dispatch = useDispatch();
  const [growSlideshowModal, setGrowSlideshowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      <GrowSlideShowModal />;
    };
  }, [onClose]);

  const addBlankSlideshow = (category_id = 0) => {
    dispatch(
      addSlideshow({
        payload: {
          feed_id: feedId,
          category_id: category_id,
        },
        navigate: navigate,
      })
    );
  };
  return (
    <Modal
      className="slidr-modal add-slideshow-modal slidr-slideshow-modal"
      isOpen={isOpen}
      centered
      size="lg"
    >
      <ModalHeader className="cursor-pointer">
        <h2>Add Slideshow</h2>
        <img src={closeIcon} alt="" onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        <span>How do you want to create your slideshow?</span>
        <div className="d-flex justify-content-between mt-3 gap-3 mobile-down">
          <div className="blank-slide w-100 d-block border rounded cursor-pointer">
            <div className="slidermodel" onClick={() => addBlankSlideshow(0)}>
              <div className="slider-new-add">
                {/* <img src={newSlideImg} alt="new slideshow" /> */}
                <ReactSVG src={NewSlideImg} />
              </div>
              <p className="text-center pt-3 mb-0">New Slideshow</p>
            </div>
          </div>
          <div className="blank-slide w-100 d-block border rounded cursor-pointer">
            <div
              className="slidermodel"
              onClick={() => setGrowSlideshowModal(true)}
            >
              <div className="slider-new-add">
                {/* <img src={growSlideImg} alt="grow slideshow" /> */}
                <ReactSVG src={GrowSlideImg} />
              </div>
              <p className="text-center pt-3 mb-0">Grow Slideshow</p>
            </div>
          </div>
        </div>
      </ModalBody>
      <GrowSlideShowModal
        isOpen={growSlideshowModal}
        onClose={() => setGrowSlideshowModal(false)}
        feedId={feedId}
      />
    </Modal>
  );
};
export default AddSlideshowModal;
