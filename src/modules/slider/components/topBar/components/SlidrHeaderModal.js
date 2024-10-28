import React, { useRef, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import duplicateIcon from "assets/images/Duplicate.svg";
import previewIcon from "assets/images/preview.svg";
import gridViewIcon from "assets/images/grid.svg";
import deleteIcon from "assets/images/delete.svg";
import renameIcon from "assets/images/pencil.svg";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSlideSettings } from "modules/slider/store/actions";
import { slideShowTitle } from "store/actions";
import useOutsideClick from "hooks/useOutSideClick";

const SlidrHeaderModal = ({
  isOpen,
  onClose,
  slideshowTitle,
  handleRepeatSlideshow,
  handleGridLines,
  slideshow_id,
  clickDeleteSlideShow,
}) => {
  const [showInput, setShowInput] = useState(false);
  const { settings } = useSelector(state => state.Slidr);
  const [value, setValue] = useState(settings.title || "");
  const dispatch = useDispatch();
  const dropdownRef = useRef();
  const menus = [
    {
      id: 1,
      label: "Repeat Slideshow",
      icon: duplicateIcon,
      onClick: handleRepeatSlideshow,
    },
    {
      id: 2,
      label: "Preview",
      icon: previewIcon,
      onClick: () => window.open(`/slide-show-preview/${slideshow_id}`),
    },
    {
      id: 3,
      label: settings.grids === true ? "Hide Grid Line" : "Show Grid Line",
      icon: gridViewIcon,
      onClick: handleGridLines,
    },
    {
      id: 4,
      label: "Delete",
      icon: deleteIcon,
      onClick: clickDeleteSlideShow,
    },
  ];

  const doubleClick = () => {
    setShowInput(true);
  };
  useOutsideClick(dropdownRef, e => {
    dispatch(
      setSlideSettings({
        ...settings,
        title: value,
      })
    );
    dispatch(
      slideShowTitle({
        slideshow_id: slideshow_id,
        title: value ? value : "Untitled Slideshow",
      })
    );
    setShowInput(false);
  });
  return (
    <div>
      <Modal
        isOpen={isOpen}
        centered
        className="slidr-header-modal slidr_header_modal_main"
        backdrop="static"
      >
        <ModalHeader toggle={onClose} className="slidr-header">
          <div>
            {showInput ? (
              <input
                ref={dropdownRef}
                onClick={e => e.stopPropagation()}
                type="text"
                value={value}
                className="form-control"
                onChange={e => {
                  setValue(e.target.value);
                }}
                onBlur={e => {
                  dispatch(
                    setSlideSettings({
                      ...settings,
                      title: e.target.value
                        ? e.target.value
                        : "Untitled Slideshow",
                    })
                  );
                }}
              />
            ) : (
              <h4>
                {/* {slideshowTitle} */}
                {settings.title}
                <img src={renameIcon} alt="" onClick={doubleClick} />
              </h4>
              // <h2 onDoubleClick={doubleClick} className="mb-0">
              //   {settings.title}
              // </h2>
            )}
            {/* <h4>
              {slideshowTitle}
              <img src={renameIcon} alt="" onDoubleClick={doubleClick} />
            </h4> */}
          </div>
        </ModalHeader>

        <ModalBody className="modal-header-content">
          <div>
            <ul className="modal-header-menu-body">
              {menus?.map(x => (
                <li
                  className="d-flex gap-3 sub-header-menu"
                  onClick={x.onClick}
                >
                  <img src={x.icon} alt="menu-icon" />
                  {x.label}
                </li>
              ))}
            </ul>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SlidrHeaderModal;
