import React from "react";

const CommonButton = ({
  btnText,
  btnClass = "",
  btnClick,
  btnType = "button",
  btnDisabled,
  btnRounded = "true",
  btnChildren = "",
  children,
  btnId = "",
  btnOutline = false,
  iconType,
  btnCancel,
  btnImg,
}) => {
  return (
    <button
      id={btnId}
      className={`common-btn ${btnClass} ${btnRounded ? "btn-rounded" : ""} ${
        btnChildren ? "d-flex" : ""
      } ${btnCancel ? "btn-cancel" : ""}${btnOutline ? "outline" : ""} ${
        btnDisabled ? "disabled" : ""
      } `}
      disabled={btnDisabled}
      onClick={btnClick}
      type={btnType}
    >
      {iconType ? <i className={`bx bx-${iconType}`} /> : null}
      {btnImg && <img src={btnImg} alt="Button Icon" />}{" "}
      {/* Render img if btnImg prop is provided */}
      <span className="text-center align-items-center mb-0">
        {!!children ? children : btnText}
      </span>
    </button>
  );
};

export default CommonButton;
