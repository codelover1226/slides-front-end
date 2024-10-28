import update from "immutability-helper";
import clonedeep from "lodash.clonedeep";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { toast } from "react-toastify";
import img_slides from "assets/images/import_slides.svg";
import {
  addImage,
  addSlideImage,
  saveSlideshow,
  setBackgroundField,
} from "modules/slider/store/actions";
import * as Yup from "yup";
import {
  addSlide,
  copySlide,
  deleteSlide,
  setActiveField,
  setActiveSlide,
  setSlides,
} from "../../store/actions";
//   import Alert from "common/Alert";
import duplicateIcon from "assets/images/copy.svg";
import deleteIcon from "assets/images/delete.svg";
import Ellipse from "assets/images/ellipsis.svg";
import addIcon from "assets/images/plus.svg";
import videoReplaceIcon from "assets/images/video-replace.svg";
import CommonButton from "components/CommonButton";
import useWindowSize from "hooks/useWindowSize";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import Alert from "../../../home/components/Alert";
import { Container } from "../centerBar";
import AddVideoModal from "../topBar/components/AddVideoModal";
import CutomeDropZoneMultiple from "common/CustomDropZone/CustomeDropZoneMuliple";
// import { useParams } from "react-router-dom";

const type = "SLIDE";

const Slide = ({
  slide,
  index,
  onCopy,
  onDelete,
  onSelect,
  moveSlide,
  slidrLeftRef,
  activeSlideIndex,
  slidesLength,
  slideshowId,
  newSlides,
  openDropdown,
  setOpenDropdown,
}) => {
  const ref = useRef(null);
  const videoRef = useRef();
  const dispatch = useDispatch();
  const windowWidth = useWindowSize();
  const [hoverDropdown, setHoverDropdown] = useState(null);
  const blockRef = useRef();
  const threeDotsRef = useRef();
  const menuRef = useRef();

  const handleMouseEnter = id => {
    setHoverDropdown(id);
  };

  const handleMouseLeave = () => {
    setHoverDropdown();
  };

  const handleSlideClick = (event) => {
    if (threeDotsRef.current && !threeDotsRef.current.contains(event.target)) {
      handleContextMenuButtonClick(+slide?.id)
      return;
    }
    setOpenDropdown({isOpen: false, id: 0})
  };

  const { activeSlide, settings } = useSelector(state => state.Slidr);

  const selected = useMemo(
    () => slide.id === activeSlide,
    [activeSlide, slide]
  );

  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => {
      return { id: slide.id, index };
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const dragElement = document.getElementById(monitor.getItem().id);
      const dragBoundingRect = dragElement.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      const dragRight = dragIndex === hoverIndex - 1;
      const dragLeft = dragIndex === hoverIndex + 1;
      const dragUp = dragBoundingRect.top > hoverBoundingRect.top;
      const dragDown = dragBoundingRect.bottom < hoverBoundingRect.bottom;

      if (dragRight && dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      if (dragLeft && dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      if (dragUp && dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      if (dragDown && dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      moveSlide(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  drag(drop(ref));

  useEffect(() => {
    if (selected) {
      const delta = activeSlideIndex * (140 + 16);
      slidrLeftRef.current.scrollTop = delta;
    }
  }, [selected, activeSlideIndex, slidrLeftRef]);
  // const [openDropdown, setOpenDropdown] = useState(false);

  // const handleContextMenuButtonClick = e => {
  //   setOpenDropdown(!openDropdown);
  // };


  useEffect(() => {
    console.log(menuRef)
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenDropdown({ isOpen: false, id: 0 });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenDropdown]);
  

  const handleContextMenuButtonClick = sli => {
    setOpenDropdown(prev => {
      return { isOpen: +prev?.id !== sli ? true : !openDropdown.isOpen, id: sli };
    });
  };

  useEffect(() => {
    if(activeSlide != openDropdown.id)
      setOpenDropdown(prev => {
        return { isOpen: false, id: 0 };
      });
  }, [activeSlide])

  useEffect(() => {
    if (openDropdown?.isOpen) {
      setTimeout(() => {
        const dropMenu = document.getElementById("mobile-dots-show");
        const dropItem = document.getElementById("mobile-show-dropdown");

        if (dropMenu && dropItem) {
          const dropMenuRect = dropMenu.getBoundingClientRect();
          if (windowWidth.width < 991) {
            dropItem.style.left =
              dropMenuRect.left >= 300
                ? dropMenuRect.left - 60 + "px"
                : dropMenuRect.left + "px";
          } else {
            dropItem.style.left = "190px";
            if (dropMenuRect.top < 280){
              dropItem.style.top = "175px"
            }
            else {
              dropItem.style.top =
              dropMenuRect.top <= windowWidth.height - 150
                ? dropMenuRect.top - 165 + "px"
                : windowWidth.height - 320 + "px";
            }
          }
        }
      }, 0);
    }
  }, [openDropdown]);

  return (
    <>
      <div      
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        // onClick={handleSlideClick}
      >
        <ContextMenuTrigger id={slide?.id?.toString()}>
          <div
            className={`d-flex slide mb-3 ${selected ? "selected" : "ps-3"} ${
              isDragging ? "opacity-0" : ""
            } ${settings.presentationSize === 2 ? "small-box-size" : ""}`}
            ref={blockRef}
          >
            <div className="d-flex justify-content-between align-items-center flex-column m-auto me-2 slide-box-left">
              <span className={`slide-number `}>{index + 1}</span>
            </div>
            <div
              className={`flex-grow-1 overflow-hidden cursor-pointer slide-box mobile-dots-wrapper ${
                selected ? "selected" : "non-active"
              } `}
              onContextMenu={e => {
                e.preventDefault();
              }}
              onClick={e => onSelect(slide.id)}
            >
              {hoverDropdown === index && (
                <div
                  className="mobile-dots"
                  id={`mobile-dots${
                    openDropdown?.id === +slide?.id ? "-show" : ""
                  }`}
                  onClick={() => handleContextMenuButtonClick(+slide?.id)}
                  ref={threeDotsRef}                  
                >
                  <img className="mobile-dots-image" src={Ellipse} alt="Menu" />
                </div>
              )}
              <Container slide={slide} withDrag={false} grids={false} />
            </div>
          </div>
          {selected &&
            [...Array(newSlides).keys()].map(i => (
              <div key={i} className={`d-flex slide placeholder-glow`}>
                <div className="d-flex justify-content-between align-items-center flex-column m-auto me-2 slide-box-left">
                  <span className={`slide-number `}>{index + i + 2}</span>
                </div>
                <div
                  className={`flex-grow-1 overflow-hidden shadow-sm cursor-pointer placeholder slide-box border-0`}
                >
                  <div></div>
                </div>
              </div>
            ))}
        </ContextMenuTrigger>
        {windowWidth.width > 576 ? (
          <ContextMenu id={slide?.id?.toString()} holdToDisplay={-1}>
            <LeftBarContextDropdown
              slide={slide}
              videoRef={videoRef}
              onDelete={onDelete}
              slideshowId={slideshowId}
              dispatch={dispatch}
              onCopy={onCopy}
              blockRef={blockRef}
              slidesLength={slidesLength}
            />
          </ContextMenu>
        ) : null}
        <AddVideoModal
          ref={videoRef}
          slideshow_id={slideshowId}
          type="0"
          slideId={slide}
        />
      </div>
      {/* {windowWidth.width < 991 ? ( */}
        <div>
          {openDropdown?.isOpen && +slide?.id === +openDropdown?.id && (
            <div
              className="left-bar-context-menu-wrapper"
              id="mobile-show-dropdown"
              ref={menuRef}
            >
              <LeftBarContextDropdown
                slide={slide}
                videoRef={videoRef}
                onDelete={onDelete}
                slideshowId={slideshowId}
                dispatch={dispatch}
                onCopy={onCopy}
                blockRef={blockRef}
                slidesLength={slidesLength}
              />
            </div>
          )}
        </div>
      {/* ) : null} */}
    </>
  );
};

const LeftBarContextDropdown = props => {
  return (
    <>
      {!!props?.slide?.videoUrl ? (
        <>
          <MenuItem
            data={{ foo: "bar" }}
            onClick={() => {
              props?.onCopy(props?.slide.id);
            }}
          >
            <img className="me-2" src={duplicateIcon} alt="duplicate" />{" "}
            Duplicate
          </MenuItem>
          <MenuItem
            data={{ foo: "bar" }}
            onClick={() => props?.videoRef.current.open()}
          >
            <img className="me-2" src={videoReplaceIcon} alt="add" /> Replace
            Video
          </MenuItem>
          <MenuItem
            data={{ foo: "bar" }}
            onClick={() => {
              props?.onDelete(props?.slide.id);
            }}
          >
            <img className="me-2" src={deleteIcon} alt="duplicate" /> Delete
            Video
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem
            data={{ foo: "bar" }}
            onClick={() => props?.dispatch(addSlide(props?.slideshowId))}
          >
            <img className="me-2" src={addIcon} alt="add" /> Add Slide
          </MenuItem>
          <MenuItem
            data={{ foo: "bar" }}
            onClick={() => {
              props?.onCopy(props?.slide.id);
            }}
          >
            <img className="me-2" src={duplicateIcon} alt="duplicate" />{" "}
            Duplicate
          </MenuItem>

          <MenuItem
            data={{ foo: "bar" }}
            onClick={() => {
              if (props?.slidesLength > 1) {
                props?.onDelete(props?.slide.id);
              }
            }}
            disabled={props?.slidesLength <= 1}
          >
            <img
              className={`me-2 ${props?.slidesLength === 1 ? "disabled" : ""}`}
              src={deleteIcon}
              alt="delete"
            />
            <span style={{ opacity: props?.slidesLength === 1 ? 0.5 : 1 }}>
              Delete
            </span>
          </MenuItem>
        </>
      )}
    </>
  );
};

const LeftBar = ({ slideshow_id }) => {
  const { slides, activeSlide, newSlides, loadingDeleteSlide } = useSelector(
    state => state.Slidr
  );

  const windowWidth = useWindowSize();
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [deleteSlideId, setDeleteSlideId] = useState(0);
  const [openDropdown, setOpenDropdown] = useState({ isOpen: false, id: 0 });
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [imageArray, setImageArray] = useState([]);

  const imageRef = useRef();
  const slidrLeftRef = useRef();
  const dispatch = useDispatch();
  const [showImportButton, setShowImportButton] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setShowImportButton(window.innerWidth > 991);
    };

    handleResize(); // Initial check on component mount

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleSelect = id => {
    dispatch(setActiveField(null));
    dispatch(setActiveSlide(id));
  };

  const handleCopy = slide_id => {
    dispatch(copySlide({ slideshow_id: slideshow_id, slide_id: slide_id }));
  };

  const handleDelete = id => {
    setIsOpenAlert(true);
    setDeleteSlideId(id);
  };
  const confirmed = () => {
    dispatch(
      deleteSlide({
        slide_id: deleteSlideId,
        callBack: () => {
          setDeleteSlideId(0);
          setIsOpenAlert(false);
        },
      })
    );
  };

  const moveSlide = useCallback(
    (dragIndex, hoverIndex) => {
      const updatedSlides = clonedeep(slides);
      const dragSlide = updatedSlides[dragIndex];
      dispatch(
        setSlides(
          update(updatedSlides, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragSlide],
            ],
          })
        )
      );
    },
    [slides, dispatch]
  );

  const onDragEnd = useCallback(
    ({ source, destination }) => {
      const updatedSlides = clonedeep(slides);
      const dragSlide = updatedSlides[source.index];
      dispatch(
        setSlides(
          update(updatedSlides, {
            $splice: [
              [source?.index, 1],
              [destination?.index, 0, dragSlide],
            ],
          })
        )
      );
    },
    [slides, dispatch]
  );

  // eslint-disable-next-line no-unused-vars
  const validationSchema = Yup.object().shape({
    img: Yup.string().required("Image is required."),
  });
  // eslint-disable-next-line no-unused-vars
  const sorted = imageArray.sort((a, b) => {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
  // eslint-disable-next-line no-unused-vars
  const onSubmit = values => {
    if (!!imageRef.current?.isUploading) {
      toast.warning("Please wait while image is uploading...");
      return true;
    }
    dispatch(addImage(values.img));
    onCloseImage();
    setImageArray([]);
  };
  const handleAddSlideImage = () => {
    setIsOpenImage(true);
  };
  const onCloseImage = () => {
    setIsOpenImage(false);
  };

  const handelImageSubmit = () => {
    if (!!imageArray.length) {
      Promise.all([...Array(imageArray.length).keys()]).then(values => {
        imageArray.forEach((element, i) => {
          dispatch(
            addSlideImage({ slideshow_id }, slideshow_id, status => {
              if (status) {
                dispatch(
                  setBackgroundField({
                    backgroundImage: element,
                    backgroundColor: "#fff",
                    isBackgroundImage: true,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  })
                );
                dispatch(saveSlideshow());
              }
            })
          );
        });
        setImageArray([]);
      });
    }
    onCloseImage();
  };

  return (
    <div className="slidr-left-bar bg-white" ref={slidrLeftRef}>
      {" "}
      {/*shadow-sm */}
      <Card className="bg-transparent">
        <CardBody>
          <div className=" h-auto align-items-center text-center d-flex">
            <CommonButton
              btnClass="add-slide-btn"
              btnText={"Add slide"}
              btnOutline={true}
              btnClick={() => dispatch(addSlide(slideshow_id))}
              iconType={"plus me-2"}
            />
          </div>
          {showImportButton && (
            <div
              className=" h-auto align-items-center text-center d-flex "
              style={{ border: "none" }}
            >
              <CommonButton
                btnClass="add-slide-btn-import"
                btnText={"Import slides"}
                btnOutline={true}
                btnClick={handleAddSlideImage}
                btnImg={img_slides}
              />
            </div>
          )}
          {showImportButton && <hr />}
          {/* <hr/> */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="droppable"
              direction={windowWidth.width > 576 ? "vertical" : "horizontal"}
            >
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {slides.map((slide, index) => (
                    <Draggable
                      key={slide.id}
                      draggableId={`"${slide.id}"`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Slide
                            key={slide.id}
                            slide={slide}
                            index={index}
                            onCopy={() => handleCopy(slide.id)}
                            onDelete={handleDelete}
                            onSelect={handleSelect}
                            moveSlide={moveSlide}
                            slidesLength={slides.length}
                            slidrLeftRef={slidrLeftRef}
                            activeSlideIndex={slides.findIndex(
                              x => x.id === activeSlide
                            )}
                            activeSlide={activeSlide}
                            slideshowId={slideshow_id}
                            newSlides={newSlides}
                            slides={slides}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                          />
                          {/* {[...Array(newSlides).keys()].map(i => (
                              <div
                                key={i}
                                className={`d-flex slide mb-3 placeholder-glow`}
                              >
                                <div className="d-flex justify-content-between align-items-center flex-column">
                                  <span className={`slide-number `}>
                                    {slides.length + i + 1}
                                  </span>
                                  <div
                                    className={`d-flex flex-column  slide-actions   me-2 `}
                                  >
                                    <i
                                      className={`bx bx-copy mb-3
                       `}
                                    />
                                    <i className={`bx bx-trash-alt `} />
                                  </div>
                                </div>
                                <div
                                  className={`flex-grow-1 overflow-hidden shadow-sm cursor-pointer placeholder slide-box border-0`}
                                >
                                  <div></div>
                                </div>
                              </div>
                            ))} */}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {/* {!!sEllipselides && slides.length > 0 ? (
              <>
                {slides.map((slide, index) => (
                  <Slide
                    key={slide.id}
                    slide={slide}
                    index={index}
                    onCopy={() => handleCopy(slide.id)}
                    onDelete={handleDelete}
                    onSelect={handleSelect}
                    moveSlide={moveSlide}
                    slidesLength={slides.length}
                    slidrLeftRef={slidrLeftRef}
                    activeSlideIndex={slides.findIndex(x => x.id === activeSlide)}
                    slideshowId={slideshow_id}
                  />
                ))}
  
                {[...Array(newSlides).keys()].map(i => (
                  <div key={i} className={`d-flex slide mb-3 placeholder-glow`}>
                    <div className="d-flex justify-content-between align-items-center flex-column">
                      <span className={`slide-number `}>
                        {slides.length + i + 1}
                      </span>
                      <div
                        className={`d-flex flex-column  slide-actions   me-2 `}
                      >
                        <i
                          className={`bx bx-copy mb-3
                       `}
                        />
                        <i className={`bx bx-trash-alt `} />
                      </div>
                    </div>
                    <div
                      className={`flex-grow-1 overflow-hidden shadow-sm cursor-pointer placeholder slide-box border-0`}
                    >
                      <div></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center"> No slide available</div>
            )} */}
          <Alert
            isOpen={isOpenAlert}
            onClose={() => setIsOpenAlert(false)}
            alertHeaderText="Delete Slide"
            confirmed={confirmed}
            alertDescriptionText="Are you sure you want to Delete this slide?"
            loading={loadingDeleteSlide}
            isDelete
          />
        </CardBody>
      </Card>
      <Modal
        isOpen={isOpenImage}
        centered
        backdrop="static"
        className="slidr-modal add-video-modal slidr-slideshow-modal img_upload_modal_main"
      >
        <ModalHeader toggle={onCloseImage}>Import Image</ModalHeader>

        <ModalBody>
          <CutomeDropZoneMultiple
            // ref={imageRef}
            type="image"
            src={imageArray}
            value={JSON.stringify(imageArray)}
            multiple={true}
            handleOnDrop={url => {
              setImageArray(prev => [...prev, url]);
            }}
            handleRemove={url => {
              setImageArray(prev => prev.filter(item => item !== url));
            }}
            //accept=".jpg,.jpeg,.png"
            accept={{ "image/*": [] }}
            folderName={process.env.REACT_APP_AWS_FOLDER_IMAGES}
            bucketName={process.env.REACT_APP_AWS_BUCKET_SLIDR}
            // error={!!errors.img}
            // errorMessage={errors.img}
            withBottomMargin={false}
          />
        </ModalBody>
        <ModalFooter>
          <div className="d-flex text-end gap-3">
            <CommonButton
              btnClass="px-4"
              btnText="Cancel"
              btnClick={() => setIsOpenImage(false)}
              btnCancel
            />
            <CommonButton
              btnForm="slidr-image-upload-form"
              btnClass="px-3"
              btnText="Import"
              btnClick={() => {
                handelImageSubmit();
              }}
              btnDisabled={imageArray?.length === 0}
            />
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default LeftBar;
