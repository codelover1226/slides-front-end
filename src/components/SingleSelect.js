import { useEffect, useState, useRef } from "react";
import useOutsideClick from "hooks/useOutSideClick";
import RecommendedIcon from "modules/slider/components/rightBar/RecommendedIcon";

const SingleSelect = ({
  onChange,
  defaultOptions,
  value,
  setActiveDropdown,
  activeDropdown,
  dropdownId,
}) => {
  const [selected, setIsSelected] = useState({
    label: "Arial",
    value: "arial",
  });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(defaultOptions);
  }, [defaultOptions]);

  useEffect(() => {
    if (defaultOptions?.length) {
      let findDefaultOption = defaultOptions?.find(f => f?.value === "arial");
      if (!!findDefaultOption) {
        setIsSelected({
          ...findDefaultOption,
        });
      }
    }
  }, [defaultOptions]);

  const serachHandler = e => {
    const result = defaultOptions.filter(option => {
      return (
        option.label.toLowerCase().includes(e.target.value.toLowerCase()) ||
        option.value.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setOptions(result);
  };

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

  const isRecommendedIcon = text => {
    return text.includes("(Recommended)");
  };

  const removeRecommendedText = text => {
    return text?.replace("(Recommended)", "");
  };

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
          <span>
            {removeRecommendedText(selected.label)}
            {isRecommendedIcon(selected.label) ? <RecommendedIcon /> : <></>}
          </span>
          <span
            // className={isActive ? "fas fa-angle-up" : "fas fa-angle-down"}
            className={
              isActiveDropdown ? "fas fa-angle-up" : "fas fa-angle-down"
            }
          />
        </div>
        <div
          className="dropdown-content"
          // style={{ display: isActive ? "block" : "none" }}
          style={{ display: isActiveDropdown ? "block" : "none" }}
        >
          <div className="dropdown-search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="search"
              placeholder="Search"
              onChange={e => serachHandler(e)}
            />
          </div>
          {options?.map(font => (
            <div
              onClick={e => {
                onChange(font?.value);
                setIsSelected(font);
                // setIsActive(!isActive);
                setActiveDropdown(null);
              }}
              className={`item ${
                selected.value === font?.value ? "active" : ""
              }`}
              key={font.value}
              value={font.value}
            >
              <div className="title">
                {removeRecommendedText(font.label)}
                {isRecommendedIcon(font?.label) ? <RecommendedIcon /> : <></>}
              </div>
              {selected.value === font?.value ? (
                <span className="fas fa-check" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleSelect;
