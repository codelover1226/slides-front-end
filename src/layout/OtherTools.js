import React, { useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import tools1Icon from "assets/images/tools1.svg";
import { useDispatch, useSelector } from "react-redux";
import allSitesLogo from "assets/images/grid.svg";
import { ReactSVG } from "react-svg";

// import vbsImg from "assets/images/Header/vbs.svg";
// import lessonBuilderImg from "assets/images/Header/lesson-builder.svg";
// import hubsImg from "assets/images/Header/hubs.svg";
// import slidesImg from "assets/images/Header/slides.svg";
// import supportForum from "assets/images/support-forum.svg";
// import gamesImg from "assets/images/Header/games.svg";
// import grow_printsImg from "assets/images/Header/grow_prints.svg";

import vbsImg from "assets/images/icons/product/VBS_Icon.png";
import lessonBuilderImg from "assets/images/icons/product/LessonBuilder_Icon.png";
import hubsImg from "assets/images/icons/product/Hubs_Icon.png";
import slidesImg from "assets/images/icons/product/Slides_Icon.png";
import gamesImg from "assets/images/icons/product/Games_Icon.png";
import booksImg from "assets/images/icons/product/Books_Icon.png";
import grow_printsImg from "assets/images/icons/product/PrintShop_Icon.png";
import blogImg from "assets/images/icons/product/Blog_Icon.png";
import kidsMusicImg from "assets/images/icons/product/KidsMusic_Icon.png";

// import growNumbers from "assets/images/grow numbers.svg";

import supportForum from "assets/images/support-forum.svg";
import externalLink from "assets/images/external-link.svg";
import liveChatSvg from "assets/images/live-chat.svg";
import { setChatBoxVisibility } from "store/actions";
import arrowRight from "assets/images/icons/angle-right.svg";
// import growKids from "assets/images/kids-logo-white.png";
// import growStudents from "assets/images/student-logo-white.png";
import { Link } from "react-router-dom";
import useOutsideClick from "hooks/useOutSideClick";

const headerMenu1 = [
  {
    id: 1,
    title: "Grow Kids",
    link: "https://curriculum.stuffyoucanuse.org/grow-kids-volume-8",
    icon: "https://sycu-curriculum.s3.us-east-2.amazonaws.com/cards/kids/GrowKids_1718091393597.png",
  },
  {
    id: 2,
    title: "Grow Students",
    link: "https://curriculum.stuffyoucanuse.org/grow-students-volume-8",
    icon: "https://sycu-curriculum.s3.us-east-2.amazonaws.com/cards/kids/GrowStudents_1718091415003.png",
  },
  {
    id: 3,
    title: "Kids Music",
    link: "https://kidsmusic.stuffyoucanuse.org/",
    icon: "https://general-all-data.s3.us-east-2.amazonaws.com/other_tools_icons/vbs-svg.svg",
  },
  {
    id: 4,
    title: "Lesson Builder",
    link: "https://builder.stuffyoucanuse.org/",
    icon: "https://general-all-data.s3.us-east-2.amazonaws.com/other_tools_icons/lesson-builder-svg.svg",
  },
  {
    id: 5,
    title: "Grow Hubs",
    link: "https://hubs.stuffyoucanuse.org",
    icon: "https://general-all-data.s3.us-east-2.amazonaws.com/other_tools_icons/hubs-svg.svg",
  },
  {
    id: 6,
    title: "Grow Slides",
    link: "https://slides.stuffyoucanuse.org/",
    icon: "https://general-all-data.s3.us-east-2.amazonaws.com/other_tools_icons/slides-svg.svg",
  },
  {
    id: 7,
    title: "Grow Games",
    link: "https://games.stuffyoucanuse.org",
    icon: "https://general-all-data.s3.us-east-2.amazonaws.com/other_tools_icons/games-svg.svg",
  },
  {
    id: 8,
    title: "Grow Books",
    link: "https://books.stuffyoucanuse.org/",
    icon: "https://general-all-data.s3.us-east-2.amazonaws.com/other_tools_icons/lesson-builder-svg-1.svg",
  },
  {
    id: 9,
    title: "Print Shop",
    link: "https://shop.growcurriculum.org/",
    icon: "https://general-all-data.s3.us-east-2.amazonaws.com/other_tools_icons/lesson-builder-svg-1.svg",
  },
  {
    id: 10,
    title: "Grow Blog",
    link: "https://growcurriculum.org/blog/",
    icon: "https://general-all-data.s3.us-east-2.amazonaws.com/other_tools_icons/lesson-builder-svg-1.svg",
  },
  {
    id: 11,
    title: "VBS",
    link: "https://vbs.stuffyoucanuse.org/",
    icon: "https://general-all-data.s3.us-east-2.amazonaws.com/other_tools_icons/lesson-builder-svg-1.svg",
  },
];
const OtherTools = () => {
  const { headerMenu, headerLoading } = useSelector(state => state.Layout);
  // const headerLoading
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const ref = useRef();
  useOutsideClick(ref, () => setShowDropdown(false));
  const getIcon = title => {
    switch (title) {
      case "VBS":
        return vbsImg;
      case "Lesson Builder":
        return lessonBuilderImg;
      case "Grow Hubs":
        return hubsImg;
      case "Grow Slides":
        return slidesImg;
      case "Grow Games":
        return gamesImg;
      case "Grow Books":
        return booksImg;
      case "Print Shop":
        return grow_printsImg;
      case "Kids Music":
        return kidsMusicImg;
      case "Grow Blog":
        return blogImg;
      default:
        return tools1Icon;
    }
  };

  return (
    <div className="catalog" ref={ref}>
      <Dropdown show={showDropdown}>
        <Dropdown.Toggle
          id="dropdown-autoclose-true"
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-0"
        >
          <ReactSVG src={allSitesLogo} className="all-sites-icon" />
        </Dropdown.Toggle>

        <Dropdown.Menu show={showDropdown} align={"end"} style={{ zIndex: 10 }}>
          <ul>
            <h6 className="pt-0">Curriculum</h6>
            <div className="header-main-dropdown">
              {!!!headerLoading && !!headerMenu ? (
                headerMenu
                  ?.filter(
                    x => x.title === "Grow Kids" || x.title === "Grow Students"
                  )
                  ?.map((item, i) => (
                    <li
                      key={i}
                      id={
                        item.title === "Grow Kids"
                          ? "grow-app-launcher-curriculum-grow-kids"
                          : "grow-app-launcher-curriculum-grow-students"
                      }
                      style={{ backgroundColor: "#444950" }}
                    >
                      <a href={item.link}>
                        <div className="tools-inner">
                          <div className="d-flex justify-content-center">
                            <img
                              src={
                                item.title === "Grow Kids"
                                  ? "https://sycu-curriculum.s3.us-east-2.amazonaws.com/cards/kids/GrowKids_1718091393597.png"
                                  : "https://sycu-curriculum.s3.us-east-2.amazonaws.com/cards/kids/GrowStudents_1718091415003.png"
                              }
                              alt={item.title}
                              height={28}
                            />
                          </div>
                        </div>
                      </a>
                    </li>
                  ))
              ) : (
                <li>Loading..</li>
              )}
            </div>
            <li>
              <hr
                className="dropdown-divider"
                style={{ backgroundColor: "white" }}
              />
            </li>
            <h6>CHURCH LEADER TOOLS</h6>
            <div className="main-dropdown">
              {!!!headerLoading && !!headerMenu ? (
                // headerMenu?.slice(2)?.map((item, i) => (
                headerMenu1?.slice(2)?.map((item, i) => (
                  <li key={i}>
                    <a
                      href={item?.link}
                      rel="noreferrer"
                      target="_blank"
                      id={`grow-app-launcher-tool-${item.title
                        .toLowerCase()
                        .split(" ")
                        .join("-")}`}
                    >
                      <div className="tools-inner">
                        <div
                          className="d-flex justify-content-center"
                          style={{ height: 40 }}
                        >
                          {/* <ReactSVG src={getIcon(item?.title)} /> */}
                          <img
                            src={getIcon(item?.title)}
                            height={40}
                            width={40}
                            style={{ objectFit: "contain" }}
                            alt="getIcon"
                          />
                        </div>
                        <div className="tool-desc d-flex justify-content-center mt-2">
                          <span className="tool-desc-title">
                            {item?.title?.includes("Grow")
                              ? item.title.split(" ")[1] || item.title
                              : item.title}
                          </span>
                        </div>
                      </div>
                    </a>
                  </li>
                ))
              ) : (
                <li>Loading..</li>
              )}
            </div>
            <li>
              <hr
                className="dropdown-divider"
                style={{ backgroundColor: "white" }}
              />
            </li>
            <h6>SUPPORT</h6>
            <a
              href={"https://support.stuffyoucanuse.org/home"}
              className="support-forum cursor-pointer"
              id="grow-app-launcher-support-forum"
              rel="noreferrer"
              target={"_blank"}
              style={{ marginBottom: "10px" }}
            >
              <div className="d-flex gap-2">
                {"icon" && (
                  <span className="link-icon d-flex">
                    <img
                      src={supportForum}
                      style={{ width: "16px", height: "13px" }}
                      alt="supportForum"
                    />
                  </span>
                )}
                {
                  <span className="d-flex align-items-center">
                    Support Forum
                  </span>
                }
              </div>
              {
                <span>
                  <img
                    src={externalLink}
                    alt=">"
                    className="support-external-link"
                  />
                </span>
              }
            </a>
            <Link
              className="support-forum cursor-pointer"
              rel="noreferrer"
              id="grow-app-launcher-support-live-chat"
              onClick={() => {
                setShowDropdown(false);
                dispatch(setChatBoxVisibility("maximized"));
              }}
            >
              <div className="d-flex gap-2">
                {"icon" && (
                  <span className="link-icon d-flex">
                    <img
                      src={liveChatSvg}
                      style={{ width: "16px", height: "14px" }}
                      alt="Start a Live Chat"
                    />
                  </span>
                )}
                {
                  <span className="d-flex align-items-center">
                    Start a Live Chat
                  </span>
                }
              </div>
              {
                <span>
                  <img
                    src={arrowRight}
                    alt=">"
                    style={{ width: "6px", height: "13px" }}
                  />
                </span>
              }
            </Link>
          </ul>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default OtherTools;
