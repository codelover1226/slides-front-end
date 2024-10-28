import { useEffect, useState, useRef } from "react";
import useOutsideClick from "hooks/useOutSideClick";

const SingleSelectBorderRadius = ({
  onChange,
  defaultOptions,
  value,
  icon,
  setActiveDropdown,
  activeDropdown,
  dropdownId,
}) => {
  // const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState({
    label: value || defaultOptions[0].label,
    value: value || defaultOptions[0].value,
  });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  useEffect(() => {
    if (value) {
      setIsSelected({ label: value, value: value });
    }
  }, [value]);

  const dropdownRef = useRef(null);
  // useOutsideClick(dropdownRef, () => {
  //   setIsActive(false);
  // });
  useOutsideClick(dropdownRef, () => {
    if (activeDropdown === dropdownId) {
      setActiveDropdown(null);
    }
  });

  const isActiveDropdown = activeDropdown === dropdownId;

  return (
    <div className="form-control flex-grow right-editor-props text-input filter-dropdown">
      <div className="dropdown" ref={dropdownRef}>
        <div
          // onClick={e => {
          //   setIsActive(!isActive);
          // }}
          onClick={e => {
            setActiveDropdown(isActiveDropdown ? null : dropdownId);
          }}
          className="dropdown-btn"
        >
          {icon && <img src={icon} alt="icon" />}
          {selected.label}
          <span
            // className={isActive ? "fas fa-angle-up" : "fas fa-angle-down"}
            className={
              isActiveDropdown ? "fas fa-angle-up" : "fas fa-angle-down"
            }
          />
        </div>
        <div
          className="dropdown-content font-content"
          // style={{ display: isActive ? "block" : "none" }}
          style={{ display: isActiveDropdown ? "block" : "none" }}
        >
          {options?.map(size => (
            <div
              onClick={e => {
                onChange(`${size?.label}px`);
                setIsSelected(size);
                // setIsActive(!isActive);
                setActiveDropdown(null);
              }}
              className={`item ${
                selected.value === size?.value + "px" ? "active" : ""
              }`}
              key={size.value}
              value={size.value}
            >
              <div className="title">{size.label}</div>
              {selected.value === size?.value + "px" ? (
                <span className="fas fa-check" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleSelectBorderRadius;
