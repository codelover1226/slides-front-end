import ColorPicker from "common/ColorPicker";
import RangePicker from "common/RangePicker";
import {
  borderRadiuses,
  borderTypes,
  borders,
  fontFamilies,
  //lineHights,
  fontRange,
  fontSizes,
  lineHights,
} from "constants/slidr";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Col, Row } from "reactstrap";

import borderPx from "assets/images/borderPx.svg";
import borderType from "assets/images/borderType.svg";
import closeIcon from "assets/images/close.svg";
import copyToIcon from "assets/images/copyToBar.svg";
import radiusPx from "assets/images/radiusPx.svg";
import toBackIcon from "assets/images/toBack.svg";
import toFrontIcon from "assets/images/toFront.svg";
import SingleSelect from "components/SingleSelect";
import SingleSelectBorder from "components/SingleSelectBorder";
import SingleSelectBorderRadius from "components/SingleSelectBorderRadius";
import SingleSelectBorderSize from "components/SingleSelectBorderSize";
import SingleSelectFontOption from "components/SingleSelectFontOption";
import SingleSelectFontSize from "components/SingleSelectFontSize";
import useWindowSize from "hooks/useWindowSize";
import max from "lodash/max";
import min from "lodash/min";
import {
  setActiveField,
  setTextFieldValue,
  textFieldCopy,
  textFieldDelete,
} from "modules/slider/store/actions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import RecommendedIcon from "./RecommendedIcon";

const RightBar = ({ isActive = "", onClose = () => {} }) => {
  const { activeField, slides, activeSlide, imageSelect, recommendedFonts } =
    useSelector(state => state.Slidr);
  const fontRef = useRef();
  const borderRef = useRef();
  const opacityRef = useRef();
  const rotationRef = useRef();
  const backgroundColorPicker = useRef();
  const textColorPicker = useRef();
  const borderColorPicker = useRef();
  const result = useWindowSize();
  const currentSlide = slides.find(slide => slide.id === activeSlide);
  const [propActive, setPropActive] = useState({
    font: window.innerWidth > 992 ? true : false,
    border: window.innerWidth > 992 ? true : false,
    opacity: window.innerWidth > 992 ? true : false,
    rotation: window.innerWidth > 992 ? true : false,
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const textField = useMemo(() => {
    if (currentSlide) {
      return currentSlide[imageSelect ? "imageFields" : "textFields"].find(
        field => field.id === activeField
      );
    }
    return null;
  }, [activeField, imageSelect, currentSlide]);

  const dispatch = useDispatch();

  const handleChange = (key, value) => {
    dispatch(
      setTextFieldValue({
        key,
        value,
      })
    );
  };

  const handleDelete = () => {
    dispatch(textFieldDelete());
  };
  const handleCopy = () => {
    dispatch(textFieldCopy());
  };
  const handleSetTop = () => {
    const maxZIndex = max([
      ...currentSlide.imageFields.map(i => i.zIndex),
      ...currentSlide.textFields.map(i => i.zIndex),
    ]);
    if (maxZIndex === textField?.zIndex) return;
    const newZIndex = (maxZIndex || 1000) + 10;

    dispatch(
      setTextFieldValue({
        key: "zIndex",
        value: newZIndex,
      })
    );
  };
  const handleSetBack = () => {
    const minZIndex = min([
      ...currentSlide.imageFields.map(i => i.zIndex),
      ...currentSlide.textFields.map(i => i.zIndex),
    ]);
    if (minZIndex === textField?.zIndex) return;
    const newZIndex = (minZIndex || 1000) - 10;
    dispatch(
      setTextFieldValue({
        key: "zIndex",
        value: newZIndex,
      })
    );
  };

  useEffect(() => {
    setPropActive(prev => ({
      ...prev,
      [isActive]: true,
    }));
  }, [isActive]);

  const fondFamilyWithRecommendedFonts = useMemo(() => {
    return fontFamilies
      ?.map(item => {
        return {
          ...item,
          label:
            item?.label +
            " " +
            (!!recommendedFonts?.includes(item?.label) ? "(Recommended)" : ""),
          isRecommended: recommendedFonts?.includes(item?.label),
        };
      })
      ?.sort((a, b) => b.isRecommended - a.isRecommended);
  }, [recommendedFonts]);

  const setVisibleColorPicker = e => {
    // Now you can call the child's function
    if (
      textColorPicker &&
      textColorPicker.current?.isOpen &&
      !textColorPicker.current.contains(e.target)
    ) {
      textColorPicker.current.setIsOpen(false);
    }
    if (
      backgroundColorPicker &&
      backgroundColorPicker.current?.isOpen &&
      !backgroundColorPicker.current.contains(e.target)
    ) {
      backgroundColorPicker.current.setIsOpen(false);
    }
    if (
      borderColorPicker &&
      borderColorPicker.current?.isOpen &&
      !borderColorPicker.current.contains(e.target)
    ) {
      borderColorPicker.current.setIsOpen(false);
    }
  };

  return (
    <>
      {!!textField && (
        <Card
          className="shadow-sm bg-light-gray slidr-right-bar text_editor_modal"
          onClick={e => setVisibleColorPicker(e)}
        >
          <CardBody>
            <>
              <Row className="m-0">
                {!imageSelect && (
                  <>
                    <Col
                      sm={12}
                      className="d-flex justify-content-between box_padding_15px slidr-text-label"
                    >
                      {isActive && result.width < 576
                        ? isActive.charAt(0).toUpperCase() + isActive.slice(1)
                        : "Text"}
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip">Close</Tooltip>}
                      >
                        <img
                          className="cursor-pointer"
                          id="Close"
                          onClick={() => {
                            dispatch(setActiveField(null));
                            onClose();
                          }}
                          src={closeIcon}
                          alt="close"
                          height={25}
                          width={25}
                        />
                      </OverlayTrigger>
                    </Col>
                    <hr className="my-3" />
                    <Col
                      className={`px-0 mobile-menu box_padding_15px ${
                        isActive === "font" ? "active" : ""
                      }`}
                      sm={12}
                    >
                      {recommendedFonts?.length ? (
                        <div className="notes-message-small d-flex justify-content-center align-items-center">
                          In Font <RecommendedIcon /> indicates that it is
                          recommended by us.
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="">
                        <div className="">
                          {isActive === "font" ? null : (
                            <div
                              className={`rc-accordion-toggle d-flex ${
                                propActive.font ? "active" : ""
                              }`}
                              onClick={() =>
                                setPropActive(prev => ({
                                  ...prev,
                                  font: !propActive.font,
                                }))
                              }
                            >
                              <span className="label d-block">Font</span>
                              <i className="fa fa-chevron-down rc-accordion-icon me-2"></i>
                            </div>
                          )}
                        </div>
                        <div
                          ref={fontRef}
                          className={`rc-collapse ${
                            propActive.font ? "show" : ""
                          }`}
                          // style={
                          //   propActive.font
                          //     ? { height: fontRef?.current?.scrollHeight }
                          //     : { height: "0px" }
                          // }
                        >
                          <Row className="mb-3 mt-2 font-style-filter-wrapper">
                            <Col sm={12}>
                              <SingleSelect
                                defaultOptions={fondFamilyWithRecommendedFonts}
                                onChange={e => handleChange("fontFamily", e)}
                                setActiveDropdown={setActiveDropdown}
                                activeDropdown={activeDropdown}
                                dropdownId="fontDropdown"
                              />
                            </Col>
                          </Row>
                          <Row className="mb-3 mt-2 font-style-filter-wrapper">
                            <Col sm={12}>
                              <SingleSelectFontOption
                                defaultOptions={fontRange}
                                onChange={e => {
                                  let fontSize = fontRange?.find(
                                    f => f?.label === e
                                  );
                                  handleChange("fontSize", fontSize?.value);
                                  handleChange("fontRange", e);
                                }}
                                value={textField?.fontRange}
                                setActiveDropdown={setActiveDropdown}
                                activeDropdown={activeDropdown}
                                dropdownId="fontRangeDropdown"
                              />
                            </Col>
                          </Row>
                          <Row className="mb-3 mx-0 flex-nowrap gap-2">
                            <Col className="d-flex align-items-center flex-grow font_style">
                              <i className="bx bx bx-move-vertical me-1 fs-20" />
                              <SingleSelectFontSize
                                defaultOptions={lineHights}
                                onChange={e => handleChange("lineHeight", e)}
                                value={textField?.lineHeight}
                                setActiveDropdown={setActiveDropdown}
                                activeDropdown={activeDropdown}
                                dropdownId="fontWidthDropdown"
                              />
                            </Col>
                            {/* <Col className="d-flex align-items-center flex-grow font_style">
                              <SingleSelectFontOption
                                defaultOptions={fontRange}
                                onChange={e => {
                                  let fontSize = fontRange?.find(
                                    f => f?.label === e
                                  );
                                  handleChange("fontSize", fontSize?.value);
                                  handleChange("fontRange", e);
                                }}
                                value={textField?.fontRange}
                                setActiveDropdown={setActiveDropdown}
                                activeDropdown={activeDropdown}
                                dropdownId="fontRangeDropdown"
                              />
                            </Col> */}
                            <Col className="d-flex align-items-center flex-grow flex-grow font_style">
                              <i className="bx bx-font-size me-1 fs-20" />

                              <SingleSelectFontSize
                                defaultOptions={fontSizes}
                                onChange={e => handleChange("fontSize", e)}
                                value={textField?.fontSize}
                                setActiveDropdown={setActiveDropdown}
                                activeDropdown={activeDropdown}
                                dropdownId="fontSizeDropdown"
                              />
                            </Col>
                          </Row>
                          <Col sm={12} className="mb-3">
                            <div className="d-flex right-bar-color-picker w-100 gap-2">
                              <Col className="d-flex align-items-center flex-grow right-editor-props w-50">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id="tooltip">Left Align</Tooltip>
                                  }
                                >
                                  <i
                                    id="leftAlign"
                                    className={`bx bx-align-left ${
                                      textField?.textAlign === "left"
                                        ? "text-primary"
                                        : "mx-2"
                                    }`}
                                    onClick={() =>
                                      handleChange("textAlign", "left")
                                    }
                                  />
                                </OverlayTrigger>

                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id="tooltip">Center Align</Tooltip>
                                  }
                                >
                                  <i
                                    id="centerAlign"
                                    className={`bx bx-align-middle ${
                                      textField?.textAlign === "center"
                                        ? "text-primary"
                                        : "mx-2"
                                    }`}
                                    onClick={() =>
                                      handleChange("textAlign", "center")
                                    }
                                  />
                                </OverlayTrigger>

                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id="tooltip">Right Align</Tooltip>
                                  }
                                >
                                  <i
                                    id="rightAlign"
                                    className={`bx bx-align-right ${
                                      textField?.textAlign === "right"
                                        ? "text-primary"
                                        : "mx-2"
                                    }`}
                                    onClick={() =>
                                      handleChange("textAlign", "right")
                                    }
                                  />
                                </OverlayTrigger>
                              </Col>
                              <Col className="d-flex align-items-center flex-grow right-editor-props w-50">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id="tooltip">Italic</Tooltip>
                                  }
                                >
                                  <i
                                    id="italic"
                                    className={`bx bx-italic ${
                                      textField?.isItalic
                                        ? "text-primary me-1"
                                        : "mx-2"
                                    }`}
                                    onClick={() =>
                                      handleChange(
                                        "isItalic",
                                        !textField?.isItalic
                                      )
                                    }
                                  />
                                </OverlayTrigger>

                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id="tooltip">Underline</Tooltip>
                                  }
                                >
                                  <i
                                    id="underline"
                                    className={`bx bx-underline ${
                                      textField?.isUnderline
                                        ? "text-primary me-1"
                                        : " mx-2"
                                    }`}
                                    onClick={() =>
                                      handleChange(
                                        "isUnderline",
                                        !textField?.isUnderline
                                      )
                                    }
                                  />
                                </OverlayTrigger>

                                <OverlayTrigger
                                  placement="top"
                                  overlay={<Tooltip id="tooltip">Bold</Tooltip>}
                                >
                                  <i
                                    id="bold"
                                    className={`bx bx-bold ${
                                      textField?.isBold
                                        ? "text-primary"
                                        : "mx-2"
                                    }`}
                                    onClick={() =>
                                      handleChange("isBold", !textField?.isBold)
                                    }
                                  />
                                </OverlayTrigger>
                              </Col>
                            </div>
                          </Col>
                          <Col className="mb-2 d-flex justify-content-between gap-2 text_color_picker">
                            <Col className="align-items-center flex-grow d-flex w-50">
                              <ColorPicker
                                toolTip={"Text Color"}
                                ref={textColorPicker}
                                label=""
                                value={textField?.color}
                                onChange={value => {
                                  handleChange("color", value);
                                }}
                                className={
                                  "d-flex align-items-center justify-content-between w-100 right-bar-color-picker bg-picker-1"
                                }
                              />
                            </Col>
                            <Col className="align-items-center flex-grow d-flex w-50">
                              <ColorPicker
                                label=""
                                disableAlpha={false}
                                type="rgba"
                                value={textField?.backgroundColor}
                                onChange={value =>
                                  handleChange("backgroundColor", value)
                                }
                                className={
                                  "d-flex align-items-center justify-content-between w-100 right-bar-color-picker "
                                }
                                toolTip={"Background Color"}
                                ref={backgroundColorPicker}
                              />
                            </Col>
                            {/* <hr className="my-2" /> */}
                          </Col>
                        </div>
                      </div>
                      <hr className="my-2" />
                    </Col>

                    {/* <Col className="mt-2 mb-3 gap-0 d-flex justify-content-between">
                    <Col
                      sm={6}
                      className="right-editor-props align-items-center flex-grow d-flex"
                    >
                      <i
                        className={`me-3 bx bx-align-left ${
                          textField?.textAlign === "left" ? "text-primary" : ""
                        }`}
                        onClick={() => handleChange("textAlign", "left")}
                      />
                      <i
                        className={`me-3 bx bx-align-middle ${
                          textField?.textAlign === "center" ? "text-primary" : ""
                        }`}
                        onClick={() => handleChange("textAlign", "center")}
                      />
                      <i
                        className={`bx bx-align-right ${
                          textField?.textAlign === "right" ? "text-primary" : ""
                        }`}
                        onClick={() => handleChange("textAlign", "right")}
                      />
                    </Col>
                    <Col
                      sm={6}
                      className="right-editor-props align-items-center flex-grow d-flex"
                    >
                      <i
                        className={`me-3 bx bx-underline ${
                          textField?.isUnderline ? "text-primary" : ""
                        }`}
                        onClick={() =>
                          handleChange("isUnderline", !textField?.isUnderline)
                        }
                      />
                      <i
                        className={`me-3 bx bx-italic ${
                          textField?.isItalic ? "text-primary" : ""
                        }`}
                        onClick={() =>
                          handleChange("isItalic", !textField?.isItalic)
                        }
                      />
                      <i
                        className={`bx bx-bold ${
                          textField?.isBold ? "text-primary" : ""
                        }`}
                        onClick={() =>
                          handleChange("isBold", !textField?.isBold)
                        }
                      />
                    </Col>
                    <hr className="my-4" />
                  </Col> */}
                  </>
                )}
                {!!imageSelect && (
                  <>
                    <Col
                      sm={12}
                      className="d-flex justify-content-between box_padding_15px slidr-text-label"
                    >
                      {/* <div className="top-header">Image</div> */}
                      {isActive && result.width < 576
                        ? isActive.charAt(0).toUpperCase() + isActive.slice(1)
                        : "Image"}
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip">Close</Tooltip>}
                      >
                        <img
                          className="cursor-pointer"
                          id="Close"
                          onClick={() => dispatch(setActiveField(null))}
                          src={closeIcon}
                          alt="close"
                          height={15}
                          width={15}
                        />
                      </OverlayTrigger>
                    </Col>
                    <hr className="my-2" />
                  </>
                )}
                <Col
                  className={`px-0 mobile-menu box_padding_15px ${
                    isActive === "border" ? "active" : ""
                  }`}
                  sm={12}
                >
                  <div className="">
                    {isActive === "border" ? null : (
                      <div className="">
                        <div
                          className={`rc-accordion-toggle d-flex ${
                            propActive.border ? "active" : ""
                          }`}
                          onClick={() =>
                            setPropActive(prev => ({
                              ...prev,
                              border: !propActive.border,
                            }))
                          }
                        >
                          <span className="label d-block">Border</span>
                          <i className="fa fa-chevron-down rc-accordion-icon me-2"></i>
                        </div>
                      </div>
                    )}
                    <div
                      ref={borderRef}
                      className={`rc-collapse ${
                        propActive.border ? "show" : ""
                      }`}
                      // style={
                      //   propActive.border
                      //     ? { height: borderRef.current?.scrollHeight }
                      //     : { height: "0px" }
                      // }
                    >
                      <Col className="mb-2 d-flex justify-content-between gap-2 text_color_picker">
                        <Col className="align-items-center flex-grow d-flex w-50">
                          <ColorPicker
                            label=""
                            value={textField?.borderColor}
                            size="sm"
                            onChange={value =>
                              handleChange("borderColor", value)
                            }
                            className={
                              "d-flex align-items-center justify-content-between w-100 right-bar-color-picker bg-picker-1"
                            }
                            toolTip={"Border Color"}
                            ref={borderColorPicker}
                          />
                        </Col>
                        <Col className="align-items-center flex-grow d-flex w-50">
                          {/* <i className="bx bx-border-all" /> */}
                          {/* <select
                            className="form-control select-small right-editor-props align-items-center flex-grow d-flex"
                            value={textField?.borderWidth}
                            onChange={e =>
                              handleChange("borderWidth", e.target.value)
                            }
                          >
                            {borders.map(border => (
                              <option
                                key={border.value}
                                value={`${border.value}px`}
                              >
                                {border.label}
                              </option>
                            ))}
                          </select> */}
                          {/* <img src="borderpx" alt="img"/> */}
                          <SingleSelectBorderSize
                            defaultOptions={borders}
                            onChange={e => handleChange("borderWidth", e)}
                            value={textField?.borderWidth}
                            icon={borderPx}
                            setActiveDropdown={setActiveDropdown}
                            activeDropdown={activeDropdown}
                            dropdownId="borderDropdown"
                          />
                        </Col>
                      </Col>
                      <Col className="mb-3 gap-2 d-flex justify-content-between w-100">
                        <Col className="align-items-center flex-grow d-flex w-50">
                          {/* <select
                            className="form-control right-editor-props align-items-center flex-grow d-flex"
                            value={textField?.borderStyle}
                            onChange={e =>
                              handleChange("borderStyle", e.target.value)
                            }
                          >
                            {borderTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select> */}

                          <SingleSelectBorder
                            defaultOptions={borderTypes}
                            value={textField?.borderStyle}
                            onChange={e => handleChange("borderStyle", e)}
                            icon={borderType}
                            setActiveDropdown={setActiveDropdown}
                            activeDropdown={activeDropdown}
                            dropdownId="borderStyleDropdown"
                          />
                        </Col>
                        <Col className="align-items-center flex-grow d-flex w-50">
                          {/* <i className="bx bx-border-radius" /> */}
                          {/* <input
                            className="w-100 form-control me-1 right-editor-props align-items-center flex-grow d-flex"
                            min={0}
                            type="number"
                            value={+textField?.borderRadius.replace("px", "")}
                            onChange={e => {
                              handleChange(
                                "borderRadius",
                                `${e.target.value}px`
                              );
                            }}
                          />{" "} */}
                          <SingleSelectBorderRadius
                            defaultOptions={borderRadiuses}
                            value={textField?.borderRadiuses}
                            onChange={e => handleChange("borderRadius", e)}
                            icon={radiusPx}
                            setActiveDropdown={setActiveDropdown}
                            activeDropdown={activeDropdown}
                            dropdownId="borderRadiusDropdown"
                          />
                          {/* <span className="input-group-text right-editor-props mx-2">
                            px
                          </span> */}
                        </Col>
                      </Col>
                    </div>
                  </div>
                  {/* <div className="mt-2">
                  <Row className="mb-2 d-flex align-items-center">
                    <Col>
                      <span className="label">Border Radius</span>
                    </Col>
                    <Col className="d-flex form-group">
                      {/* <i className="bx bx-border-radius" /> 
                      <input
                        className="w-100 form-control me-1"
                        min={0}
                        type="number"
                        value={+textField?.borderRadius.replace("px", "")}
                        onChange={e => {
                          handleChange("borderRadius", `${e.target.value}px`);
                        }}
                      />{" "}
                      <span className="input-group-text">px</span>
                      {/* <select
                            className="form-control select-small ms-2"
                            value={textField?.borderRadius}
                            onChange={e =>
                              handleChange("borderRadius", e.target.value)
                            }
                          >
                            {borderRadiuses.map(radius => (
                              <option
                                key={radius.value}
                                value={`${radius.value}px`}
                              >
                                {radius.label}
                              </option>
                            ))}
                          </select> 
                    </Col>
                  </Row>
                </div> */}

                  <hr className="my-2" />
                </Col>
                <div
                  className={`px-0 mobile-menu box_padding_15px ${
                    isActive === "opacity" ? "active" : ""
                  }`}
                >
                  <div className="">
                    {isActive === "opacity" ? null : (
                      <div className="">
                        <div
                          className={`rc-accordion-toggle d-flex ${
                            propActive.opacity ? "active" : ""
                          }`}
                          onClick={() =>
                            setPropActive(prev => ({
                              ...prev,
                              opacity: !propActive.opacity,
                            }))
                          }
                        >
                          <span className="label d-block">Opacity</span>
                          <i className="fa fa-chevron-down rc-accordion-icon me-2"></i>
                        </div>
                      </div>
                    )}
                    <div
                      ref={opacityRef}
                      className={`rc-collapse ${
                        propActive.opacity ? "show" : ""
                      }`}
                      // style={
                      //   propActive.opacity
                      //     ? { height: opacityRef.current.scrollHeight }
                      //     : { height: "0px" }
                      // }
                    >
                      <Row className="align-items-center gap-3 mt-2 w-100 flex-nowrap opacity_box m-0">
                        <Col className="w-25">
                          <div className="right-editor-props align-items-center flex-grow d-flex">
                            {textField?.opacity}
                          </div>
                        </Col>
                        <Col className="w-75">
                          <RangePicker
                            value={textField?.opacity}
                            icon="bx bxs-droplet-half"
                            valueClasses="label mt-1"
                            onChange={value => handleChange("opacity", value)}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <hr className="my-2" />
                </div>
                <div
                  className={`px-0 mobile-menu box_padding_15px ${
                    isActive === "rotation" ? "active" : ""
                  }`}
                >
                  <div className="">
                    {isActive === "rotation" ? null : (
                      <div className="">
                        <div
                          className={`rc-accordion-toggle d-flex ${
                            propActive.rotation ? "active" : ""
                          }`}
                          onClick={() =>
                            setPropActive(prev => ({
                              ...prev,
                              rotation: !propActive.rotation,
                            }))
                          }
                        >
                          <span className="label d-block">Rotation</span>
                          <i className="fa fa-chevron-down rc-accordion-icon me-2"></i>
                        </div>
                      </div>
                    )}
                    <div
                      ref={rotationRef}
                      className={`rc-collapse ${
                        propActive.rotation ? "show" : ""
                      }`}
                      // style={
                      //   propActive.rotation
                      //     ? { height: rotationRef?.current?.scrollHeight }
                      //     : { height: "0px" }
                      // }
                    >
                      {" "}
                      <Row className="align-items-center gap-3 w-100 mt-2 flex-nowrap opacity_box m-0 row">
                        <Col className="w-25">
                          <div className="right-editor-props align-items-center flex-grow d-flex">
                            {textField?.rotate}
                          </div>
                        </Col>
                        <Col className="w-75">
                          <RangePicker
                            value={textField?.rotate}
                            icon="bx bx-rotate-left"
                            min={0}
                            max={360}
                            valueClasses="label mt-1"
                            onChange={value => handleChange("rotate", value)}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <hr className="my-2" />
                </div>
                {isActive ? null : (
                  <PositionCards
                    handleSetTop={handleSetTop}
                    handleSetBack={handleSetBack}
                    handleCopy={handleCopy}
                    handleDelete={handleDelete}
                  />
                )}
              </Row>
            </>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default RightBar;

export const PositionCards = ({
  handleSetTop,
  handleSetBack,
  handleCopy,
  handleDelete,
}) => {
  return (
    <Row className="position-cards text_position_cards remove-position">
      <Col
        onClick={handleSetTop}
        className="right-editor-props d-flex align-items-center  cursor-pointer action-button"
      >
        <img className="me-2" src={toFrontIcon} alt="To Front" />
        To Front
      </Col>
      <Col
        onClick={handleSetBack}
        className="right-editor-props d-flex align-items-center cursor-pointer action-button"
      >
        <img className="me-2" src={toBackIcon} alt="To Back" />
        To Back
      </Col>

      <Col
        className="right-editor-props d-flex align-items-center  cursor-pointer action-button"
        onClick={handleCopy}
      >
        <img className="me-2" src={copyToIcon} alt="Copy" />
        Copy
      </Col>
      <Col
        className="right-editor-props d-flex align-items-center cursor-pointer action-button action-button--delete"
        onClick={handleDelete}
      >
        <i className="bx bx-trash small text-danger me-2" />
        Delete
      </Col>
    </Row>
  );
};
