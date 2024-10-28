import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { SketchPicker } from "react-color";
import { Label } from "reactstrap";

const getColor = (type, color) => {
  switch (type) {
    case "hex":
      return color.hex;
    case "rgba":
      return color.rgb;
    default:
      return color.hex;
  }
};

const rgbaToHex = rgba => {
  rgba = rgba.match(
    /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
  );
  return rgba && rgba.length === 4
    ? "#" +
        ("0" + parseInt(rgba[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgba[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgba[3], 10).toString(16)).slice(-2)
    : "";
};

const ColorPicker = forwardRef(
  (
    {
      value,
      onChange,
      label = "Choose Color",
      size = "sm",
      type = "hex",
      disableAlpha = true,
      className,
      toolTip,
    },
    ref
  ) => {
    const selfRef = useRef();
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        isOpen,
        setIsOpen,
        contains: target => {
          return selfRef.current && selfRef.current.contains(target);
        },
      }),
      [isOpen]
    );

    return (
      <div
        ref={selfRef}
        className={`${
          className
            ? className
            : "d-flex align-items-center justify-content-between"
        }`}
      >
        {!!label && <Label className="color-picker-label">{label}</Label>}
        <div className="d-flex align-items-center right-editor-props w-100">
          {value ? (
            <Label
              className={` me-2 mb-0 ${
                type === "hex" ? "text-uppercase" : ""
              } cursor-pointer`}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              {type === "rgba"
                ? rgbaToHex(`rgba(${Object.values(value).join(",")})`)
                : value}
            </Label>
          ) : (
            ""
          )}
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip" className="background-tooltip">
                {toolTip}
              </Tooltip>
            }
          >
            <div
              className={`color-circle--${size} cursor-pointer color-input border border-none`}
              onClick={() => {
                setIsOpen(true);
              }}
              id="tooltip"
              style={
                !!value
                  ? {
                      backgroundColor:
                        type === "hex"
                          ? value
                          : `rgba(${Object.values(value).join(",")})`,
                    }
                  : null
              }
            >
              {isOpen && (
                <div className={`parent-color-picker`}>
                  <SketchPicker
                    color={!!value ? value : ""}
                    onChange={color => {
                      if (!!onChange && typeof onChange === "function")
                        onChange(getColor(type, color));
                    }}
                    disableAlpha={disableAlpha}
                  />
                </div>
              )}
            </div>
          </OverlayTrigger>
        </div>
      </div>
    );
  }
);

export default ColorPicker;
