import { useEffect, useState, useRef } from "react";
import useOutsideClick from "hooks/useOutSideClick";

const SingleSelectBorder = ({
  onChange,
  defaultOptions,
  value,
  icon,
  label,
  setActiveDropdown,
  activeDropdown,
  dropdownId,
}) => {
  // const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState({
    label: label || defaultOptions[0].label,
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
          className="dropdown-content"
          // style={{ display: isActive ? "block" : "none" }}
          style={{ display: isActiveDropdown ? "block" : "none" }}
        >
          {options?.map(border => (
            <div
              onClick={e => {
                onChange(border?.label);
                setIsSelected(border);
                // setIsActive(!isActive);
                setActiveDropdown(null);
              }}
              className={`item ${
                selected.value === border?.value ? "active" : ""
              }`}
              key={border.value}
              value={border.value}
            >
              <div className="title">{border.label}</div>
              {selected.value === border?.value ? (
                <span className="fas fa-check" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleSelectBorder;

// const SingleSelectBorder = ({ onChange, defaultOptions, value, icon }) => {
//   const [isActive, setIsActive] = useState(false);
//   const [selected, setIsSelected] = useState({
//     label: value || defaultOptions[0].label,
//     value: value || defaultOptions[0].value,
//   });
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     setOptions(defaultOptions);
//   }, [defaultOptions]);

//   useEffect(() => {
//     if (value) {
//       setIsSelected({ label: value, value: value });
//     }
//   }, [value]);

//   return (
//     <div className="form-control flex-grow right-editor-props text-input filter-dropdown">
//       <div className="dropdown">
//         <div
//           onClick={() => {
//             setIsActive(!isActive);
//           }}
//           className="dropdown-btn"
//         >
//           {icon && <img src={icon} alt="icon" />}
//           {selected.label}
//           <span className={isActive ? "fas fa-angle-up" : "fas fa-angle-down"} />
//         </div>
//         <div
//           className="dropdown-content"
//           style={{ display: isActive ? "block" : "none" }}
//         >
//           {options?.map(border => (
//             <div
//               onClick={() => {
//                 onChange(border?.value);
//                 setIsSelected(border);
//                 setIsActive(!isActive);
//               }}
//               className={`item ${selected.value === border?.value ? "active" : ""}`}
//               key={border.value}
//               value={border.value}
//             >
//               <div className="title">{border.label}</div>
//               {selected.value === border?.value ? <span className="fas fa-check" /> : null}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleSelectBorder;
