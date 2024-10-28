import { useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ data, link }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="breadcrumb-all">
        <nav style={{ "--bs-breadcrumb-divider": ">" }} aria-label="breadcrumb">
          <div className="breadcrumb">
            <div className="breadcrumb-item">
              <Link to="/" >Grow Slides Dashboard </Link>
              {windowWidth < 576 ? <RightArrow /> : null}
              {windowWidth >= 576 && data ? <RightArrow /> : null}
            </div>
            <div className="breadcrumb-item sub-breadcrumb-item">
              <Link to="#">{data}</Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Breadcrumb;
export const RightArrow = () => {
  return (
    <svg
      width="5"
      height="8"
      viewBox="0 0 5 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1L4 4L1 7" stroke="#999999" />
    </svg>
  );
};
