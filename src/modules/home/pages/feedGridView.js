import React, { useState } from "react";
import noThumbnailImg from "assets/images/new_no_thumbnail_img.jpg";
import { useNavigate } from "react-router";
import ActionDropdown from "../components/ActionDropdown";
import { getSliderContent } from "utils/slider";
import { Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import { HomeLoader } from "common/Loaders/HomeLoader";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
const FeedGridView = ({ gs_slideshows, handleSlideStatusChange }) => {
  const navigate = useNavigate();
  const { feedSlideLoading } = useSelector(state => state.Home);
  const [hoverDropdown, setHoverDropdown] = useState(null);

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

  const handleMouseEnter = id => {
    setHoverDropdown(id);
  };

  const handleMouseLeave = () => {
    setHoverDropdown();
  };

  return (
    <>
      <div className="main-slider-area">
        <Row className="">
          {feedSlideLoading ? (
            <HomeLoader size={3} />
          ) : !!gs_slideshows?.length ? (
            gs_slideshows?.map(slides => (
              <Col
                lg={4}
                md={6}
                sm={12}
                className="slider-inner"
                key={slides.slideshow_id}
              >
                <div
                  className="slider-image"
                  onMouseEnter={() => handleMouseEnter(slides.slideshow_id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="add-new-slide"
                    onClick={() => {
                      if (slides?.is_shared) {
                        window.open(`/slide-show-preview/${slides.slideshow_id}`);
                      } else {
                        navigate(`/slidr/${slides.slideshow_id}`);
                      }
                    }}
                  >
                    {slides &&
                    slides?.gs_slides &&
                    slides.gs_slides.length > 0 &&
                    slides.gs_slides[0].content &&
                    checkBackgroundImage(slides?.gs_slides[0]?.content) ? (
                      <div
                        className="prv-html"
                        dangerouslySetInnerHTML={{
                          __html: getSliderContent(
                            slides?.gs_slides[0]?.content || ""
                          ),
                        }}
                      />
                    ) : (
                      <img src={noThumbnailImg} alt="No" />
                    )}
                  </div>
                  {/* Dropdown will appear on hover */}

                  {hoverDropdown === slides.slideshow_id &&
                    (slides?.is_shared ? (
                      <></>
                    ) : (
                      <ActionDropdown
                        slides={slides}
                        gs_slideshows={gs_slideshows}
                      />
                    ))}
                    
                </div>
                <div className="d-flex align-items-center justify-content-between slidetitle">
                  <h4>{slides.title}</h4>
                  <div className="d-flex align-items-center">
                    {" "}
                    {!!slides.is_scheduled && !!!slides.is_active && (
                      <>
                        {" "}
                        <OverlayTrigger
                          placement="top"
                          target={`date_${slides.slideshow_id}`}
                          overlay={
                            <Tooltip id="tooltip">
                              {" "}
                              Slideshow will active on{" "}
                              {moment(slides.schedule_active_date_time).format(
                                "MM/DD/YYYY, hh:mm a"
                              )}
                            </Tooltip>
                          }
                        >
                          <i
                            className="fa-regular fa-clock cursor-pointer"
                            style={{
                              position: "absolute",
                              color: "#bfbfbf",
                              fontSize: "19px",
                            }}
                            id={`date_${slides.slideshow_id}`}
                          />
                        </OverlayTrigger>
                      </>
                    )}
                    {slides?.is_shared ? (
                      <></>
                    ) : (
                      <div
                        className="form-check form-switch form-switch-md custom-switch mb-0"
                        style={{ paddingLeft: "50px" }}
                      >
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="tooltip">Activate</Tooltip>}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input cursor-pointer mt-0 mb-0"
                            checked={slides?.is_active === 1 ? true : false}
                            onChange={e =>
                              handleSlideStatusChange(
                                slides?.slideshow_id,
                                slides?.is_active,
                                slides?.feed_id
                              )
                            }
                          />
                        </OverlayTrigger>
                      </div>
                    )}
                  </div>
                </div>
                <hr className="hubs-divider" />
              </Col>
            ))
          ) : (
            <div className="justify-content-center d-flex pb-4">
              No data found
            </div>
          )}
        </Row>
      </div>
    </>
  );
};

export default FeedGridView;
