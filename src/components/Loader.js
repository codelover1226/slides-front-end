import React from "react";
import logo from "assets/images/groefaviconBig.png";

const Loader = () => {
  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center flex-column">
      <img src={logo} alt="stuff-you-can-use logo" className="avatar-lg" />
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
