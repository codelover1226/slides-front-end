/* eslint-disable react-hooks/exhaustive-deps */
// import { Editor } from "@tinymce/tinymce-react";
//import closeIcon from "assets/images/close.svg";
import bg from "assets/images/bg2.svg";
import borderIcon from "assets/images/borderIcon.svg";
import editIcon from "assets/images/dashboard.svg";
import deleteIcon from "assets/images/delete.svg";
import menuIcon from "assets/images/ellipsis.svg";
//import checkCircle from "assets/images/check-circle.svg"
import fontIcon from "assets/images/fonts.svg";
import gif from "assets/images/gif2.svg";
import historyIcon from "assets/images/history2.svg";
import imageIcon from "assets/images/image2.svg";
import leftIcon from "assets/images/angle-left.svg";
import musicIcon from "assets/images/music2.svg";
import opacityIcon from "assets/images/opacity.svg";
import playlistIcon from "assets/images/playlist2.svg";
import historyVersionIcon from "assets/images/restore_point.svg";
import rotationIcon from "assets/images/rotation.svg";
import settingIcon from "assets/images/settings2.svg";
import textIcon from "assets/images/text2.svg";
import undoIcon from "assets/images/undo1.svg";
import videoIcon from "assets/images/video2.svg";
import CustomDropZone from "common/CustomDropZone/CustomDropZone";
import CommonButton from "components/CommonButton";
import { useFormik } from "formik";
import { SAVE_SLIDE_SHOW_HISTORY } from "helper/url_helper";
import useDebounce from "hooks/useDebounce";
import useWindowSize from "hooks/useWindowSize";
import max from "lodash/max";
import min from "lodash/min";
import Alert from "modules/home/components/Alert";
import RenameSlideShowTitle from "modules/home/components/RenameSlideShowTitle";
import {
  actionRedo,
  actionUndo,
  addSlideImage,
  addText,
  deleteSlideShowHistory,
  fetchSlideShowHistory,
  publishSlideshow,
  UnPublishSlideshow,
  saveSlideshow,
  setActivePlayList,
  setActiveSlide,
  setBackgroundField,
  setGlobalCopyField,
  setGlobalPasteField,
  setSlides,
  setTextFieldValue,
  slideShowTitle,
  slideSettings,
  slidesChange,
  textFieldCopy,
  textFieldDelete,
  setDeleteSlide,
  setLoadingSaveMessage,
  setActiveHistory,
} from "modules/slider/store/actions";
import { addSlide } from "../../store/actions";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledTooltip,
} from "reactstrap";
import { axiosSlidr } from "services/api";
import { handleDownloadZip } from "utils";
import RightBar, { PositionCards } from "../rightBar";
import AddGifModal from "./components/AddGifModal";
import AddImageModal from "./components/AddImageModal";
import AddManualHistoryModal from "./components/AddManualHistoryModal";
import AddMusicModal from "./components/AddMusicModal";
import AddVideoModal from "./components/AddVideoModal";
import ConfirmPublishModal from "./components/ConfirmPublishModal";
import SlideBackgroundSettingsModal from "./components/SlideBackgroundSettingsModal";
import SlideshowSettingsModal from "./components/SlideshowSettingsModal";
import SlidrHeaderModal from "./components/SlidrHeaderModal";
//import slideSettings from "./components/SlideshowSettingsModal";
// import duplicateIcon from "assets/images/Duplicate.svg";
import saveIcon from "assets/images/cloud-check.svg";
import { defaultDocumentTitle } from "constants/slidr";
// import gridViewIcon from "assets/images/grid.svg";
// import renameIcon from "assets/images/pencil.svg";
// import previewIcon from "assets/images/preview.svg";
import useOutsideClick from "hooks/useOutSideClick";
import { deleteSlideShow } from "store/actions";

const getOS = () => {
  let userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }
  return os;
};
let action = "";
const Settings = ({ slideshow_id }) => {
  const {
    settings,
    slides,
    stack: { undo, redo },
    activeSlide,
    activeField,
    imageSelect,
    copy,
    historyData,
    showSavedMessage,
    activeHistory,
  } = useSelector(state => state.Slidr);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const result = useWindowSize();
  const debouncedSlides = useDebounce(slides, 500);
  const debouncedSave = useDebounce(slides, 2000);
  const imageRef = useRef();
  const videoRef = useRef();
  const musicRef = useRef();
  const backgroundRef = useRef();
  const gifRef = useRef();
  const slideshowSettingsRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [isMultiple, setisMultipe] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  const [isOpenConfirmPublishModal, setIsOpenConfirmPublishModal] =
    useState(false);
  const [editHistoryTitle, setEditHistoryTitle] = useState("");
  const [exportProgress, setExportProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [isPublishDisable, setIsPublishDisable] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isPublished = !!settings.published_date_time;
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState({
    status: false,
    id: null,
  });
  const [tabType, setTabType] = useState(0);
  const [editData] = useState(null);
  const [openAddFeedModal, setOpenAddFeedModal] = useState(false);
  const [openAddManualHistoryModal, setOpenAddManualHistoryModal] =
    useState(false);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [alertType, setAlertType] = useState(0);
  const [deleteSlideShowIds, setDeleteSlideShowIds] = useState({
    feed_id: 0,
    slideshow_id: 0,
  });
  const [isOpenHeaderModal, setIsOpenHeaderModal] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [historyId, setHistoryId] = useState(0);
  const { loadingDeleteSlideshow } = useSelector(state => state.Slidr);
  // const { activePAge } = useSelector(state => state.Home);
  const [alertTypes, setAlertTypes] = useState(null);

  const getAlertDescriptionText = () => {
    switch (alertTypes) {
      case "image":
        return "Images can’t be added onto slides with video or GIF backgrounds.";
      case "music":
        return "Music can’t be added onto slides with video or GIF backgrounds.";
      case "text":
        return "Text can’t be added onto slides with video or GIF backgrounds.";
      default:
        return "Can’t be added onto slides with video or GIF backgrounds.";
    }
  };
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
    }
  };

  useEffect(() => {
    if (slides) {
      if (isOpenConfirmPublishModal) {
        setIsPublishDisable(true);
        setInterval(() => {
          setIsPublishDisable(false);
        }, slides.length * 6 * 1000);
      }
    }
  }, [slides, isOpenConfirmPublishModal]);

  const isVideoSlide = useMemo(
    () => slides?.find(slide => slide?.id === activeSlide)?.videoUrl,
    [slides, activeSlide]
  );
  const isVideoId = useMemo(
    () => slides?.find(slide => slide?.id === activeSlide),
    [slides, activeSlide]
  );

  const isGifSlide = useMemo(
    () => slides?.find(slide => slide?.id === activeSlide)?.gifUrl,
    [slides, activeSlide]
  );

  const isMusicSlide = useMemo(
    () => slides?.find(slide => slide?.id === activeSlide),
    [slides, activeSlide]
  );
  // const isBackgroundSlide = useMemo(
  //   () => slides.find(slide => slide?.id === activeSlide)?.gifUrl === "",
  //   [slides, activeSlide]
  // );
  // const handleAddSlideImage = () => {
  //   setisMultipe(true);
  //   setIsOpenImage(true);
  // };
  const finalSave = useCallback(
    clickSaveBtn => {
      const onSuccess = () => {
        dispatch(setLoadingSaveMessage(false));
      };
      dispatch(saveSlideshow(clickSaveBtn, onSuccess));
      handleAddSlideshowPoint({ state: "0" });
      dispatch(setLoadingSaveMessage(true));
    },
    [slides, dispatch, slideshow_id, settings]
  );
  useEffect(() => {
    if (!!debouncedSave && Array.isArray(debouncedSave)) {
      finalSave();
    }
  }, [debouncedSave]);

  useEffect(() => {
    if (!!debouncedSlides && Array.isArray(debouncedSlides)) {
      if (!["undo", "redo"].includes(action))
        dispatch(slidesChange(debouncedSlides));
      else action = "";
    }
  }, [debouncedSlides, dispatch]);
  useEffect(() => {
    const OS = getOS();
    const allowedOS = ["Mac OS", "Windows", "Linux"];
    const mainKey = OS === "Mac OS" ? "metaKey" : "ctrlKey";
    const keydownListener = e => {
      if (e.keyCode === 46 && !!activeField) {
        dispatch(textFieldDelete());
      }
      if (e[mainKey] && e.keyCode === 67 && !!activeField) {
        const slide = slides?.find(slide => slide.id === activeSlide);
        if (!!slide) {
          const field = slide[imageSelect ? "imageFields" : "textFields"].find(
            item => item.id === activeField
          );
          if (!!field) {
            dispatch(
              setGlobalCopyField({
                imageSelect,
                field,
              })
            );
            toast.success("Copied!");
          }
        }
      }
      if (e[mainKey] && e.keyCode === 86 && !!copy && !!copy.field) {
        if (isVideoSlide || isGifSlide) {
          setIsOpen(true);
        } else {
          dispatch(setGlobalPasteField());
        }
      }
      // Down Key
      if (e.keyCode === 40) {
        e.preventDefault();
        const nextSlideIndex =
          slides?.findIndex(slide => slide.id === activeSlide) + 1;
        if (nextSlideIndex >= 0 && slides?.length > nextSlideIndex) {
          const newSlideId = slides[nextSlideIndex]?.id;
          if (!!newSlideId) {
            dispatch(setActiveSlide(newSlideId));
          }
        }
      }
      // Up Key
      if (e.keyCode === 38) {
        e.preventDefault();
        const prevSlideIndex =
          slides?.findIndex(slide => slide.id === activeSlide) - 1;
        if (prevSlideIndex >= 0) {
          const newSlideId = slides[prevSlideIndex]?.id;
          if (!!newSlideId) {
            dispatch(setActiveSlide(newSlideId));
          }
        }
      }
      // Undo
      if (e[mainKey] && e.keyCode === 90 && !e.shiftKey && undo.length > 1) {
        action = "undo";
        dispatch(actionUndo());
      }
      // Redo
      if (
        (e.metaKey &&
          e.shiftKey &&
          e.keyCode === 90 &&
          !!redo.length &&
          OS === "Mac OS") ||
        (e.ctrlKey &&
          e.keyCode === 89 &&
          !!redo.length &&
          ["Windows", "Linux"].includes(OS))
      ) {
        action = "redo";
        dispatch(actionRedo());
      }
    };
    if (allowedOS.includes(OS))
      window.addEventListener("keydown", keydownListener);
    return () => {
      if (allowedOS.includes(OS))
        window.removeEventListener("keydown", keydownListener);
    };
  }, [
    activeField,
    activeSlide,
    imageSelect,
    slides,
    dispatch,
    copy,
    undo,
    redo,
    isVideoSlide,
    isGifSlide,
  ]);

  const handleUndo = () => {
    action = "undo";
    dispatch(actionUndo());
  };
  const handleRedo = () => {
    action = "redo";
    dispatch(actionRedo());
  };
  const handleAddText = () => {
    if (isVideoSlide || isGifSlide) {
      setAlertTypes("text");
      setIsOpen(true);
    } else {
      dispatch(addText());
    }
  };
  const handleAddImage = () => {
    if (isVideoSlide || isGifSlide) {
      setAlertTypes("image");
      setIsOpen(true);
    } else {
      imageRef.current.open();
    }
  };
  const handleAddVideo = () => {
    const currentVideo = slides?.find(
      slide => slide?.id === activeSlide
    )?.videoUrl;
    videoRef.current.open(currentVideo);
  };

  const handleAddMusic = () => {
    if (isVideoSlide || isGifSlide) {
      setAlertTypes("music");
      setIsOpen(true);
    } else {
      musicRef.current.open();
    }
  };
  const handleAddSlide = () => {
    try {
      dispatch(addSlide(slideshow_id));
      setIsOpen(false);
    } catch (error) {}
  };

  const handleSlideShowSettings = () => {
    slideshowSettingsRef.current.open();
  };
  const handleAddGif = () => {
    gifRef.current.open();
  };
  const handleAddBackground = () => {
    if (isVideoSlide || isGifSlide) {
      setAlertTypes("image");
      setIsOpen(true);
    } else {
      backgroundRef.current.open();
    }
  };
  const sorted = imageArray.sort((a, b) => {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  // const doubleClick = feed => {
  //   setOpenAddFeedModal(true);
  //   // setEditData(feed);
  // };

  // const closeHistoryPopup = () => {
  //   dispatch(setActiveHistory(false));
  // }

  const onSubmit = values => {
    if (!!imageRef.current?.isUploading && values.isBackgroundImage) {
      toast.warning("Please wait while image is uploading...");
      return true;
    }
    if (!!sorted.length) {
      Promise.all([...Array(sorted.length).keys()]).then(values => {
        sorted.forEach((element, i) => {
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
      });
    }
    onCloseImage();
    setImageArray([]);
  };
  const openHistory = () => {
    //setDropdownOpen(true);
    dispatch(setActiveHistory(true));
  };
  useEffect(() => {
    if (activeHistory) {
      dispatch(fetchSlideShowHistory(slideshow_id));
    }
  }, [activeHistory]);
  const onCloseImage = () => {
    setisMultipe(false);
    setImageArray([]);
    if (!!imageRef.current?.isUploading) {
      toast.warning("Please wait while image is uploading...");
      return true;
    }
    resetForm({
      values: { ...initialValues },
    });
    setIsOpen(false);
    setIsOpenImage(false);
  };
  const publish = () => {
    dispatch(
      publishSlideshow({
        slideshow_id: +slideshow_id,
        callBack: () => setIsOpenConfirmPublishModal(false),
      })
    );
  };
  const unPublish = () => {
    dispatch(
      UnPublishSlideshow({
        slideshow_id: +slideshow_id,
        callBack: () => {
          console.log("Unpublish executed");
        },
      })
    );
  };
  const handleCloseRenameSlideTitle = () => {
    setOpenAddFeedModal(false);
  };
  const handleCloseManualHistory = () => {
    setOpenAddManualHistoryModal(false);
  };

  const handleExport = () => {
    if (!isPublished) {
      setShowAlert(true);
      return;
    }
    const fileTitle = settings.title;
    setLoadingExport(true);
    handleDownloadZip(
      fileTitle,
      slideshow_id,
      (_, err) => {
        setLoadingExport(false);
        setExportProgress(0);
        if (!!err) {
          toast.error(err);
          return;
        }
      },
      percent => {
        setExportProgress(percent);
      }
    );
  };

  const initialValues = {
    img: [],
  };
  // const validationSchema = Yup.object().shape({
  //   img: Yup.array().min(1, "select at least 1 file"),
  // });
  const { handleSubmit, errors, resetForm } = useFormik({
    initialValues,
    // validationSchema,
    onSubmit,
  });

  const onCloseAlert = () => {
    setConfirmAlert(false);
    setAlertType(0);
  };
  const clickDeleteSlideShow = (feed_id, slideshow_id) => {
    setAlertType(2);
    setConfirmAlert(true);
    setDeleteSlideShowIds({
      feed_id: feed_id,
      slideshow_id: slideshow_id,
    });
  };
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === "Delete") {
        clickDeleteSlideShow();
      }
    };

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  //For delete slideshow
  const deleteCallback = () => {
    navigate(-1);
  };
  const confirmed = () => {
    if (alertType === 2) {
      dispatch(
        deleteSlideShow({
          feed_id: deleteSlideShowIds.feed_id,
          slideshow_id: deleteSlideShowIds.slideshow_id,
          callBack: deleteCallback,
        })
      );
    }
  };
  const menuRef = useRef();

  useOutsideClick(menuRef, () => {
    setIsOpenHeaderModal(false);
  });

  const historyRef = useRef();
  useOutsideClick(historyRef, () => {
    dispatch(setActiveHistory(false));
  });

  const handleRepeatSlideshow = () => {
    const payload = {
      ...settings,
      repeatSlideshow: !settings.repeatSlideshow,
    };
    dispatch(slideSettings({ payload }));
    // setIsOpenHeaderModal(false);
  };
  const handleGridLines = () => {
    const payload = {
      ...settings,
      grids: !settings.grids,
    };
    dispatch(slideSettings({ payload }));
    // setIsOpenHeaderModal(false);
  };

  const handleAddSlideshowPoint = async ({ state }) => {
    try {
      const currTime = moment().format("DD MMM, YYYY h:mm:s a");
      const payload = {
        slideshow_id: slideshow_id,
        title: editHistoryTitle.title || `New Point ` + currTime,
        description: JSON.stringify(slides),
        state: state,
      };
      const res = await axiosSlidr.post(SAVE_SLIDE_SHOW_HISTORY, payload);
      if (res.status === 200) {
        dispatch(fetchSlideShowHistory(slideshow_id));
        setEditHistoryTitle({ status: false });
      }
    } catch (err) {
      toast.error(err);
    }
  };

  //Delete slideshow history
  const clickDeleteHistory = historyId => {
    setHistoryId(historyId);
    setIsOpenAlert(true);
  };

  const handleCloseSlideHistory = () => {
    setHistoryId(0);
    setIsOpenAlert(false);
  };

  const handleDeleteSlideHistory = () => {
    const payload = {
      slideshow_history_id: historyId,
    };
    dispatch(
      deleteSlideShowHistory({
        payload,
      })
    );
    setHistoryId(0);
    setIsOpenAlert(false);
  };

  const handleOpenHeaderModal = () => {
    setIsOpenHeaderModal(prev => !prev);
  };
  const [rightBar, setRightBar] = useState(false);
  const [type, setType] = useState("");
  // const rightBarRef = useRef(false);

  const windowWidth = useWindowSize();
  // useOutsideClick(rightBarRef, () => {
  //   // setRightBar(false);
  // });
  const openRightBar = value => {
    setType(value);
    setRightBar(!rightBar);
  };

  const currentSlide = slides.find(slide => slide.id === activeSlide);
  const textField = useMemo(() => {
    if (currentSlide) {
      return currentSlide[imageSelect ? "imageFields" : "textFields"].find(
        field => field.id === activeField
      );
    }
    return null;
  }, [activeField, imageSelect, currentSlide]);

  const handleDelete = () => {
    dispatch(textFieldDelete());
  };
  const handleVideoDelete = () => {
    dispatch(setDeleteSlide(activeSlide));
  };
  const handleCopy = () => {
    dispatch(textFieldCopy());
  };
  const handleSetTop = () => {
    const maxZIndex = max([
      ...currentSlide.imageFields.map(i => i.zIndex),
      ...currentSlide.textFields.map(i => i.zIndex),
    ]);
    if (maxZIndex === textField.zIndex) return;
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
    if (minZIndex === textField.zIndex) return;
    const newZIndex = (minZIndex || 1000) - 10;
    dispatch(
      setTextFieldValue({
        key: "zIndex",
        value: newZIndex,
      })
    );
  };

  const [openInputField, setOpenInputField] = useState(false);
  const [showSlideshowTitle, setShowSlideshowTitle] = useState(settings.title);
  const debouncedSlideshowTitle = useDebounce(showSlideshowTitle, 500);
  const ref = useRef(null);
  const { id } = useParams();
  const editInputRef = useRef(null);
  const handleHeadingClick = () => {
    setOpenInputField(true);
  };

  useEffect(() => {
    if (!!settings?.title && !!debouncedSlideshowTitle && id === slideshow_id) {
      handleSubmitForm(debouncedSlideshowTitle);
    }
    // eslint-disable-next-line
  }, [debouncedSlideshowTitle, settings?.title]);

  useEffect(() => {
    if (editInputRef.current) {
      const input = editInputRef.current;
      const textWidth = getTextSize(showSlideshowTitle, input.style.font);
      input.style.width = textWidth + 32 + "px";
    }
  }, [showSlideshowTitle]);

  // Function to calculate the width of the text
  const getTextSize = (text, font) => {
    const inputField = document.createElement("canvas");
    const context = inputField.getContext("2d");
    context.font = font || getComputedStyle(document.body).font;
    const metrics = context.measureText(text);
    return metrics.width;
  };

  const handleSubmitForm = () => {
    dispatch(
      slideShowTitle(
        {
          slideshow_id: slideshow_id,
          title: showSlideshowTitle || defaultDocumentTitle,
        },
        () => {}
      )
    );
  };
  const handleInputChange = e => {
    setShowSlideshowTitle(e.target.value);
  };
  useEffect(() => {
    console.log("aHistory", activeHistory);
  }, [activeHistory]);
  return (
    <>
      <AddMusicModal
        ref={musicRef}
        slide_id={activeSlide}
        isMusicSlide={isMusicSlide}
      />
      <AddImageModal ref={imageRef} slideshow_id={slideshow_id} />
      <AddVideoModal
        ref={videoRef}
        slideshow_id={slideshow_id}
        type={isVideoSlide ? "0" : "1"}
        slideId={isVideoId}
      />
      <AddGifModal ref={gifRef} slideshow_id={slideshow_id} />
      <SlideBackgroundSettingsModal ref={backgroundRef} />
      <SlideshowSettingsModal ref={slideshowSettingsRef} />
      <ConfirmPublishModal
        isOpen={isOpenConfirmPublishModal}
        confirm={publish}
        onClose={() => setIsOpenConfirmPublishModal(false)}
      />

      <Alert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        alertHeaderText="Oops!"
        alertDescriptionText="Please publish this slideshow before you export the slides."
        confirmBtn={false}
      />
      <RenameSlideShowTitle
        isOpen={openAddFeedModal}
        handleClose={handleCloseRenameSlideTitle}
        editData={{ ...editData, slideshow_id: slideshow_id }}
      />
      <AddManualHistoryModal
        isOpen={openAddManualHistoryModal}
        handleClose={handleCloseManualHistory}
        handleAddSlideshowPoint={() =>
          handleAddSlideshowPoint({
            state: "1",
          })
        }
        slideshow_id={slideshow_id}
        setEditHistoryTitle={setEditHistoryTitle}
      />
      <div className="tool">
        <div className="tool-item">
          {/* <Dropdown
            className={`dropdown-folder dropdown-header-section border-0 header_menu_home topbarDrop_web`}
            toggle={handleOpenHeaderModal}
            isOpen={isOpenHeaderModal}
            onClick={() => {
              setIsOpenHeaderModal(true);
            }}
          >
            <DropdownToggle className="folder-menu-icon p-0">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip">Menu</Tooltip>}
              >
                <img
                  src={menuIcon}
                  alt="list"
                  id="Menu"
                  // className={`${dropdownEditorOpen ? "active" : " "}`}
                />
              </OverlayTrigger>
            </DropdownToggle>
            <DropdownMenu style={{ marginTop: "30px" }} isOpen={isOpen}>
              <div ref={menuRef}>
                <DropdownItem
                  className="d-flex gap-3"
                  onClick={e => {
                    e.stopPropagation();
                    handleRepeatSlideshow();
                  }}
                >
                  <img src={duplicateIcon} alt="" />
                  Repeat Slideshow
                </DropdownItem>
                <DropdownItem
                  className="d-flex gap-3"
                  onClick={e => {
                    e.stopPropagation();
                    doubleClick({
                      title: settings?.title,
                      id: settings?.id,
                    });
                  }}
                >
                  <img src={renameIcon} alt="" />
                  Rename
                </DropdownItem>
                <DropdownItem
                  className="d-flex gap-3"
                  onClick={e => {
                    e.stopPropagation();
                    window.open(`/slide-show/${slideshow_id}`);
                  }}
                >
                  <img src={previewIcon} alt="" />
                  Preview
                </DropdownItem>
                <DropdownItem
                  className="d-flex gap-3"
                  onClick={e => {
                    e.stopPropagation();
                    handleGridLines();
                  }}
                >
                  <img src={gridViewIcon} alt="" />
                  {settings.grids === true
                    ? "Hide Grid Line"
                    : "Show Grid Line"}
                </DropdownItem>
                <DropdownItem
                  className="d-flex gap-3 text-danger"
                  onClick={e => {
                    e.stopPropagation();
                    clickDeleteSlideShow(slides.feed_id, slideshow_id);
                    // clickDelete(slides.feed_id)
                  }}
                >
                  <img src={deleteIcon} alt="" />
                  Delete
                </DropdownItem>
              </div>
            </DropdownMenu>
          </Dropdown> */}
          <div className="back-arrow-title">
            <span
              className="back-arrow back-arrow-canvas"
              onClick={() => navigate(-1)}
            >
              {/* <i className="fa-solid fa-arrow-left"></i> */}
              <img src={leftIcon} alt="Back" />
            </span>

            <div
              className="slide-title canvas-title cursor-pointer"
              // title="Double click to edit Slideshow title"
              style={{
                // marginBottom: "5px",
                display: "flex",
                // alignItems: "center",
                justifyContent: "center",
              }}
              // ref={ref}
            >
              {/* <h2 onDoubleClick={doubleClick} className="mb-0">
                {settings.title}
              </h2> */}
              {openInputField ? (
                <form
                  onSubmit={e => e.preventDefault()}
                  name="changeSlideshowTitle"
                >
                  <input
                    ref={editInputRef}
                    className="slideshow-title-input-field me-2"
                    style={{width:"200px"}}
                    type="text"
                    onChange={handleInputChange}
                    value={showSlideshowTitle}
                    onBlur={e => {
                      handleSubmitForm(e.target.value);
                      setOpenInputField(false);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        handleSubmitForm(e.target.value);
                        setOpenInputField(false);
                      }
                    }}
                    autoFocus
                  />
                </form>
              ) : (
                <div ref={ref}>
                  <h2
                    onClick={() => {
                      handleHeadingClick();
                      setShowSlideshowTitle(settings.title);
                    }}
                    className={`slideshow-title-name mb-0 ${
                      settings && settings.title === "Untitled Slideshow"
                        ? "grey-slideshow-title"
                        : "black-slideshow-title"
                    }`}
                  >
                    {settings.title}
                  </h2>
                </div>
              )}

              {/* <p>{settings?.feedTitle}</p> */}
              <div onClick={() => finalSave(true)} className="save_slide_btn">
                <img src={saveIcon} alt="save" />
              </div>
              {showSavedMessage && (
                <span className="saved-changes">All changes saved</span>
              )}
            </div>

            {/* <Dropdown
              className={`dropdown-folder dropdown-header-section border-0 header_menu_home ${
                window.innerWidth > 992 ? "topbarDrop_web" : "topbarDrop"
              }`}
              toggle={handleOpenHeaderModal}
              isOpen={isOpenHeaderModal}
              onClick={() => {
                setIsOpenHeaderModal(true);
              }}
            >
              <DropdownToggle className="folder-menu-icon p-0">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip">Menu</Tooltip>}
                >
                  <img
                    src={menuIcon}
                    alt="list"
                    id="Menu"
                    // className={`${dropdownEditorOpen ? "active" : " "}`}
                  />
                </OverlayTrigger>
              </DropdownToggle>
              {result.width > 576 ? (
                <DropdownMenu style={{ marginTop: "30px" }} isOpen={isOpen}>
                  <div ref={menuRef}>
                    <DropdownItem
                      className="d-flex gap-3"
                      onClick={e => {
                        e.stopPropagation();
                        handleRepeatSlideshow();
                      }}
                    >
                      <img src={duplicateIcon} alt="" />
                      Repeat Slideshow
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex gap-3"
                      onClick={e => {
                        e.stopPropagation();
                        doubleClick({
                          title: settings?.title,
                          id: settings?.id,
                        });
                      }}
                    >
                      <img src={renameIcon} alt="" />
                      Rename
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex gap-3"
                      onClick={e => {
                        e.stopPropagation();
                        window.open(`/slide-show/${slideshow_id}`);
                      }}
                    >
                      <img src={previewIcon} alt="" />
                      Preview
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex gap-3"
                      onClick={e => {
                        e.stopPropagation();
                        handleGridLines();
                      }}
                    >
                      <img src={gridViewIcon} alt="" />
                      {settings.grids === true
                        ? "Hide Grid Line"
                        : "Show Grid Line"}
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex gap-3 text-danger"
                      onClick={e => {
                        e.stopPropagation();
                        clickDeleteSlideShow(slides.feed_id, slideshow_id);
                        // clickDelete(slides.feed_id)
                      }}
                    >
                      <img src={deleteIcon} alt="" />
                      Delete
                    </DropdownItem>
                  </div>
                </DropdownMenu>
              ) : (
                <SlidrHeaderModal
                  isOpen={isOpenHeaderModal}
                  onClose={() => setIsOpenHeaderModal(false)}
                  // slideshowTitle={slideshowTitle}
                  handleRepeatSlideshow={handleRepeatSlideshow}
                  handleGridLines={handleGridLines}
                  slideshow_id={slideshow_id}
                  clickDeleteSlideShow={() =>
                    clickDeleteSlideShow(slides.feed_id, slideshow_id)
                  }
                  // doubleClick={doubleClick}
                />
              )}
              <Alert
                isOpen={confirmAlert}
                onClose={onCloseAlert}
                confirmed={confirmed}
                redBtn={[1, 2].includes(alertType) ? true : false}
                loading={alertType === 2 ? loadingDeleteSlideshow : null}
                alertHeaderText={alertType === 2 ? "Delete Slideshow" : null}
                alertDescriptionText={`Are you sure you want to ${
                  alertType === 2 ? "Delete Slideshow" : null
                }?`}
              />
            </Dropdown> */}
            {window.innerWidth <= 576 && (
              <Dropdown
                className={`dropdown-folder dropdown-header-section border-0 header_menu_home header-three-dots-area slidrModal`}
                toggle={handleOpenHeaderModal}
                onClick={() => {
                  setIsOpenHeaderModal(true);
                }}
              >
                <DropdownToggle className="folder-menu-icon p-0">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip">Menu</Tooltip>}
                  >
                    <img src={menuIcon} alt="list" id="Menu" />
                  </OverlayTrigger>
                </DropdownToggle>
                <SlidrHeaderModal
                  isOpen={isOpenHeaderModal}
                  onClose={() => setIsOpenHeaderModal(false)}
                  // slideshowTitle={slideshowTitle}
                  handleRepeatSlideshow={handleRepeatSlideshow}
                  handleGridLines={handleGridLines}
                  slideshow_id={slideshow_id}
                  clickDeleteSlideShow={() =>
                    clickDeleteSlideShow(slides.feed_id, slideshow_id)
                  }
                  // doubleClick={doubleClick}
                />
                <Alert
                  isOpen={confirmAlert}
                  onClose={onCloseAlert}
                  confirmed={confirmed}
                  redBtn={[1, 2].includes(alertType) ? true : false}
                  loading={alertType === 2 ? loadingDeleteSlideshow : null}
                  alertHeaderText={alertType === 2 ? "Delete Slideshow" : null}
                  alertDescriptionText={`Are you sure you want to ${
                    alertType === 2 ? "Delete Slideshow" : null
                  }?`}
                />
              </Dropdown>
            )}
          </div>
          {/* <div className="tool2 d-flex"> */}

          <div className="tool-item1 d-flex">
            <div className="redo-undo">
              <ul className="slide-icon d-flex">
                {/* <div className="vertical-left-line"></div> */}
                <li
                  id="undo"
                  className={`undoRedioBtn no-undo-radio ${
                    undo.length <= 1 ? "disabled" : "active"
                  }`}
                  onClick={undo.length > 1 ? handleUndo : () => {}}
                >
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip">Undo</Tooltip>}
                  >
                    <span className="undo" id="Undo">
                      {/* <i className="bx bx-undo" /> */}
                      <img src={undoIcon} alt="Undo" />
                      Undo
                    </span>
                  </OverlayTrigger>
                </li>
                <li
                  id="redo"
                  className={`undoRedioBtn redo-btn no-undo-radio ${
                    redo.length === 0 ? "disabled" : "active"
                  }`}
                  onClick={redo.length === 0 ? () => {} : handleRedo}
                >
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip">Redo</Tooltip>}
                  >
                    <span className="undo" id="Redo">
                      {/* <i className="bx bx-redo" /> */}
                      <img src={undoIcon} alt="Redo" />
                      Redo
                    </span>
                  </OverlayTrigger>
                </li>
              </ul>
            </div>
            <div
              className={`vertical-right-line vertical_right_line_slide_icon ${
                settings.published_date_time ? "mobile-export-wrapper" : ""
              }`}
            ></div>
            <div
              className={`top-header-section d-flex ${
                settings.published_date_time ? "export-wrapper" : ""
              }`}
            >
              {/* <div className={`slides-settings d-flex `}> */}
              <div
                className={`slides-settings d-flex ${
                  isVideoSlide ? "setting-isVideoSlide" : ""
                }`}
              >
                <div className="header-wrapper d-flex">
                  {activeField && result.width < 576 ? (
                    <ul className="cust-center-menu-btn">
                      {/* <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="tooltip">Edit</Tooltip>}
                        >
                          <li
                            id="edit-font"
                            className="tools-icon border-radius-left-top-bottom"
                            onClick=""
                          >
                            <img src={editTextIcon} alt="textIcon" />
                            Edit
                          </li>
                        </OverlayTrigger> */}
                      {/* <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="tooltip">Font</Tooltip>}
                        > */}
                      {!imageSelect && (
                        <li
                          id="edit-font"
                          className="tools-icon border-radius-left-top-bottom"
                          onClick={log}
                        >
                          <img src={editIcon} alt="textIcon" />
                          Edit
                        </li>
                      )}
                      <li
                        id="edit-font"
                        className="tools-icon border-radius-left-top-bottom"
                        onClick={() => openRightBar("font")}
                      >
                        <img src={fontIcon} alt="textIcon" />
                        Font
                      </li>
                      {/* </OverlayTrigger> */}

                      {/* <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="tooltip">Border</Tooltip>}
                        > */}
                      <li
                        id="boarder-font"
                        className="tools-icon border-radius-left-top-bottom"
                        onClick={() => openRightBar("border")}
                      >
                        <img src={borderIcon} alt="textIcon" />
                        Border
                      </li>
                      {/* </OverlayTrigger> */}
                      {/* <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="tooltip">Opacity</Tooltip>}
                        > */}
                      <li
                        id="opacity-font"
                        className="tools-icon border-radius-left-top-bottom"
                        onClick={() => openRightBar("opacity")}
                      >
                        <img src={opacityIcon} alt="textIcon" />
                        Opacity
                      </li>
                      {/* </OverlayTrigger> */}

                      {/* <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="tooltip">Rotation</Tooltip>}
                        > */}
                      <li
                        id="rotation-font"
                        className="tools-icon border-radius-left-top-bottom"
                        onClick={() => openRightBar("rotation")}
                      >
                        <img src={rotationIcon} alt="textIcon" />
                        Rotation
                      </li>
                      {/* </OverlayTrigger> */}
                    </ul>
                  ) : isVideoSlide && result.width < 576 ? (
                    <ul className="cust-center-menu-btn videoSlide-menu">
                      <OverlayTrigger
                        placement={window.innerWidth > 992 ? "bottom" : "null"}
                        overlay={<Tooltip id="tooltip"> Replace Video</Tooltip>}
                      >
                        <li
                          id="add-video"
                          className="tools-icon border-radius-left-top-bottom"
                          onClick={handleAddVideo}
                        >
                          <img src={videoIcon} alt="videoIcon" />
                          Replace Video
                        </li>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement={window.innerWidth > 992 ? "bottom" : "null"}
                        overlay={<Tooltip id="tooltip">Delete</Tooltip>}
                      >
                        <li
                          id="delete"
                          className="tools-icon border-radius-left-top-bottom"
                          onClick={handleVideoDelete}
                          style={{ color: "red" }}
                        >
                          <img src={deleteIcon} alt="deleteIcon" />
                          Delete
                        </li>
                      </OverlayTrigger>
                    </ul>
                  ) : (
                    <ul className="cust-center-menu-btn">
                      <OverlayTrigger
                        placement={window.innerWidth > 992 ? "bottom" : "null"}
                        overlay={<Tooltip id="tooltip"> Add Text</Tooltip>}
                      >
                        <li
                          id="add-text"
                          className="tools-icon border-radius-left-top-bottom"
                          onClick={handleAddText}
                        >
                          <img src={textIcon} alt="textIcon" />
                          Text
                        </li>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement={window.innerWidth > 992 ? "bottom" : "null"}
                        overlay={<Tooltip id="tooltip">Add Image</Tooltip>}
                      >
                        <li
                          id="add-image"
                          className="tools-icon border-radius-left-top-bottom"
                          onClick={handleAddImage}
                        >
                          <img src={imageIcon} alt="imageIcon" />
                          Image
                        </li>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement={window.innerWidth > 992 ? "bottom" : "null"}
                        overlay={<Tooltip id="tooltip"> Add Video</Tooltip>}
                      >
                        <li
                          id="add-video"
                          className="tools-icon border-radius-left-top-bottom"
                          onClick={handleAddVideo}
                        >
                          <img src={videoIcon} alt="videoIcon" />
                          Video
                        </li>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement={window.innerWidth > 992 ? "bottom" : "null"}
                        overlay={<Tooltip id="tooltip">Add Background</Tooltip>}
                      >
                        <li
                          className="tools-icon border-radius-left-top-bottom"
                          id="add-background"
                          onClick={handleAddBackground}
                        >
                          <img src={bg} alt="background" />
                          Background
                        </li>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement={window.innerWidth > 992 ? "bottom" : "null"}
                        overlay={<Tooltip id="tooltip">Add Music</Tooltip>}
                      >
                        <li
                          id="add-music"
                          className="tools-icon border-radius-left-top-bottom"
                          onClick={handleAddMusic}
                        >
                          <img src={musicIcon} alt="musicIcon" />
                          Music
                        </li>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement={window.innerWidth > 992 ? "bottom" : "null"}
                        overlay={<Tooltip id="tooltip">Add Gif</Tooltip>}
                      >
                        <li
                          id="add-gif"
                          className="tools-icon border-radius-left-top-bottom"
                          onClick={handleAddGif}
                        >
                          <img src={gif} alt="gif" />
                          GiF
                        </li>
                      </OverlayTrigger>

                      <li className="tools-icon tools_icon_center border-radius-left-top-bottom vertical-right-line"></li>
                    </ul>
                  )}
                </div>
                {activeField && result.width < 576 ? (
                  <div className="mobile-position-cards">
                    <PositionCards
                      handleSetTop={handleSetTop}
                      handleSetBack={handleSetBack}
                      handleCopy={handleCopy}
                      handleDelete={handleDelete}
                    />
                  </div>
                ) : isVideoSlide && result.width < 576 ? (
                  <div></div>
                ) : (
                  <div className="settings d-flex setting_tab_new">
                    <div
                      id="music_playlist"
                      className="tools-icon border-radius-right-top-bottom"
                      onClick={() => {
                        setDropdownOpen(true) || openHistory();
                      }}
                      ref={historyRef}
                    >
                      <img src={historyIcon} alt="historyIcon" />
                      <span className="">History</span>
                      {result.width > 576 ? (
                        <Dropdown
                          className="history-toggle-dropdown"
                          isOpen={dropdownOpen}
                          toggle={() => {
                            setDropdownOpen(false);
                          }}
                          direction="up"
                        >
                          <DropdownMenu className="open-history-dropdown-from-bottom">
                            <div className="header">
                              <p>History</p>
                              <div className="playlist-tab row">
                                <ul className="nav">
                                  <li
                                    className="nav-item"
                                    onClick={() => setTabType(0)}
                                  >
                                    <div
                                      className={`nav-link ${
                                        tabType === 0 ? "active" : "non-active"
                                      }`}
                                    >
                                      Manual
                                    </div>
                                  </li>
                                  <li
                                    className="nav-item"
                                    onClick={() => setTabType(1)}
                                  >
                                    <div
                                      className={`nav-link ${
                                        tabType === 1 ? "active" : "non-active"
                                      }`}
                                    >
                                      Automatic
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            {tabType === 0 ? (
                              <div className="body">
                                <div className="body-top pb-2 px-1">
                                  {editHistoryTitle.status ? (
                                    ""
                                  ) : (
                                    // <div className="d-flex">
                                    //   <Input
                                    //     id="title"
                                    //     name="title"
                                    //     type="text"
                                    //     // onBlur={() => setEditHistoryTitle({status: false})}
                                    //     className="form-control right-editor-props"
                                    //     placeholder="Title"
                                    //     onChange={e =>
                                    //       setEditHistoryTitle(prev => ({
                                    //         ...prev,
                                    //         title: e.target.value,
                                    //       }))
                                    //     }
                                    //     value={editHistoryTitle.title}
                                    //     invalid={errors.title && !!errors.title}
                                    //   />
                                    //   <div
                                    //     className="history-save-btn"
                                    //     onClick={() =>
                                    //       handleAddSlideshowPoint({
                                    //         state: "1",
                                    //       })
                                    //     }
                                    //   >
                                    //     <img src={checkIcon} alt="submit" />
                                    //   </div>
                                    // </div>
                                    <>
                                      <i className="bx bx-plus" />
                                      <Label
                                        className="ms-2"
                                        // onClick={() =>
                                        //   setEditHistoryTitle({ status: true })
                                        // }
                                        onClick={() =>
                                          setOpenAddManualHistoryModal(true)
                                        }
                                      >
                                        Create New Point
                                      </Label>
                                    </>
                                  )}
                                </div>
                                <div className="body-bottom row px-1">
                                  {historyData?.manualHistory?.map(his => (
                                    <div
                                      className="list py-1" /**bg-light*/
                                      key={his.slideshow_history_id}
                                    >
                                      <i className="bx bx-radio-circle"></i>
                                      <div className="list-side d-block ms-2">
                                        <Label>{his?.title}</Label>
                                        <p className="mb-0">
                                          {moment(his.updated_datetime).format(
                                            "MMM DD, h:mm a"
                                          )}
                                        </p>
                                      </div>
                                      <>
                                        <div
                                          className="dropdown-icon"
                                          onClick={() =>
                                            setDropdownMenuOpen({
                                              status: !dropdownMenuOpen.status,
                                              id: his.slideshow_history_id,
                                            })
                                          }
                                        >
                                          <img
                                            src={menuIcon}
                                            alt="list"
                                            id="Menu"
                                          />
                                        </div>
                                        <Dropdown
                                          className="dropdown-folder dropdown-list pe-2 px-4"
                                          isOpen={
                                            dropdownMenuOpen.status &&
                                            dropdownMenuOpen.id ===
                                              his.slideshow_history_id
                                          }
                                          toggle={() =>
                                            setDropdownMenuOpen({
                                              status: !dropdownMenuOpen.status,
                                              id: his.slideshow_history_id,
                                            })
                                          }
                                          // direction="up"
                                        >
                                          <DropdownMenu className="history-dropdown history-dropdown-items">
                                            <DropdownItem
                                              className="d-flex gap-3 mb-3 dropdown-list-item "
                                              onClick={() => {
                                                dispatch(
                                                  setSlides(
                                                    JSON.parse(his.description)
                                                  )
                                                );
                                                dispatch(
                                                  saveSlideshow({
                                                    slides: JSON.parse(
                                                      his.description
                                                    ),
                                                    slideshow_id: slideshow_id,
                                                  })
                                                );
                                              }}
                                            >
                                              <img
                                                src={historyVersionIcon}
                                                alt="edit"
                                              />
                                              Restore
                                            </DropdownItem>
                                            <DropdownItem
                                              className="d-flex gap-3 text-danger dropdown-list-item"
                                              onClick={() =>
                                                clickDeleteHistory(
                                                  his.slideshow_history_id
                                                )
                                              }
                                            >
                                              <img
                                                src={deleteIcon}
                                                alt="delete"
                                              />
                                              Delete
                                            </DropdownItem>
                                          </DropdownMenu>
                                        </Dropdown>
                                      </>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="body">
                                <div className="body-top pb-2 px-1">
                                  <i className="bx bxs-circle current-version-icon" />
                                  <Label className="ms-2">
                                    Current Version
                                  </Label>
                                </div>
                                <div
                                  style={{ overflow: "scroll" }}
                                  className="body-bottom row px-1"
                                >
                                  {historyData?.automaticHistory?.map(hist => (
                                    <div className="list py-1">
                                      {/* bg-light */}
                                      <i className="bx bx-radio-circle"></i>
                                      <div className="list-side d-flex ms-2">
                                        <p className="mb-0">
                                          {moment(hist.updated_datetime).format(
                                            "MMM DD, h:mm a"
                                          )}
                                        </p>
                                        <img
                                          src={historyVersionIcon}
                                          alt="history version"
                                          title="Restore"
                                          onClick={() => {
                                            dispatch(
                                              setSlides(
                                                JSON.parse(hist.description)
                                              )
                                            );
                                            dispatch(
                                              saveSlideshow({
                                                slides: JSON.parse(
                                                  hist.description
                                                ),
                                                slideshow_id: slideshow_id,
                                              })
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      ) : (
                        activeHistory && (
                          <Card
                            className="shadow-sm bg-light-gray slidr-right-bar history-card"
                            style={{ borderRadius: "none" }}
                          >
                            <CardBody>
                              <Row>
                                <Col sm={12}>
                                  <div className="custom-switch-row d-flex align-items-center justify-content-between playlist-custom-switch">
                                    <h6
                                      className="mb-0 mx-2"
                                      htmlFor="is_arrow"
                                    >
                                      History
                                    </h6>

                                    {/* <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Close</Tooltip>}>
                                      <img
                                        className="cursor-pointer"
                                        id="Close"
                                        onClick={() => { setActiveHistory(false) }}
                                        src={closeIcon}
                                        alt="close"
                                        height={15}
                                        width={15}
                                      />
                                    </OverlayTrigger> */}
                                  </div>
                                  <hr />
                                  <div className="playlist-tab history-tab row">
                                    <ul className="nav">
                                      <li
                                        className="nav-item"
                                        onClick={() => setTabType(0)}
                                      >
                                        <div
                                          className={`nav-link ${
                                            tabType === 0
                                              ? "active"
                                              : "non-active"
                                          }`}
                                        >
                                          Manual
                                        </div>
                                      </li>
                                      <li
                                        className="nav-item"
                                        onClick={() => setTabType(1)}
                                      >
                                        <div
                                          className={`nav-link ${
                                            tabType === 1
                                              ? "active"
                                              : "non-active"
                                          }`}
                                        >
                                          Automatic
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                  {tabType === 0 ? (
                                    <div className="body">
                                      <div className="body-top-1 pb-2 px-1">
                                        {editHistoryTitle.status ? (
                                          ""
                                        ) : (
                                          // <div className="d-flex">
                                          //   <Input
                                          //     id="title"
                                          //     name="title"
                                          //     type="text"
                                          //     // onBlur={() => setEditHistoryTitle({status: false})}
                                          //     className="form-control right-editor-props"
                                          //     placeholder="Title"
                                          //     onChange={e =>
                                          //       setEditHistoryTitle(prev => ({
                                          //         ...prev,
                                          //         title: e.target.value,
                                          //       }))
                                          //     }
                                          //     value={editHistoryTitle.title}
                                          //     invalid={errors.title && !!errors.title}
                                          //   />
                                          //   <div
                                          //     className="history-save-btn"
                                          //     onClick={() =>
                                          //       handleAddSlideshowPoint({
                                          //         state: "1",
                                          //       })
                                          //     }
                                          //   >
                                          //     <img src={checkIcon} alt="submit" />
                                          //   </div>
                                          // </div>
                                          <>
                                            <i className="bx bx-plus" />
                                            <Label
                                              className="ms-2"
                                              // onClick={() =>
                                              //   setEditHistoryTitle({ status: true })
                                              // }
                                              onClick={() =>
                                                setOpenAddManualHistoryModal(
                                                  true
                                                )
                                              }
                                            >
                                              Create New Point
                                            </Label>
                                          </>
                                        )}
                                      </div>
                                      <div className="body-bottom-1 row px-1">
                                        {historyData?.manualHistory?.map(
                                          his => (
                                            <div
                                              className="list py-1" /**bg-light*/
                                              key={his.slideshow_history_id}
                                            >
                                              <i className="bx bx-radio-circle"></i>
                                              <div className="list-side d-block ms-2">
                                                <Label>{his?.title}</Label>
                                                <p className="mb-0">
                                                  {moment(
                                                    his.updated_datetime
                                                  ).format("MMM DD, h:mm a")}
                                                </p>
                                              </div>
                                              <>
                                                <div
                                                  className="dropdown-icon"
                                                  onClick={() =>
                                                    setDropdownMenuOpen({
                                                      status:
                                                        !dropdownMenuOpen.status,
                                                      id: his.slideshow_history_id,
                                                    })
                                                  }
                                                >
                                                  <img
                                                    src={menuIcon}
                                                    alt="list"
                                                    id="Menu"
                                                  />
                                                </div>
                                                <Dropdown
                                                  className="dropdown-folder dropdown-list pe-2 px-4"
                                                  isOpen={
                                                    dropdownMenuOpen.status &&
                                                    dropdownMenuOpen.id ===
                                                      his.slideshow_history_id
                                                  }
                                                  toggle={() =>
                                                    setDropdownMenuOpen({
                                                      status:
                                                        !dropdownMenuOpen.status,
                                                      id: his.slideshow_history_id,
                                                    })
                                                  }
                                                  // direction="up"
                                                >
                                                  <DropdownMenu className="history-dropdown history-dropdown-items">
                                                    <DropdownItem
                                                      className="d-flex gap-3 mb-3 dropdown-list-item "
                                                      onClick={() => {
                                                        dispatch(
                                                          setSlides(
                                                            JSON.parse(
                                                              his.description
                                                            )
                                                          )
                                                        );
                                                        dispatch(
                                                          saveSlideshow({
                                                            slides: JSON.parse(
                                                              his.description
                                                            ),
                                                            slideshow_id:
                                                              slideshow_id,
                                                          })
                                                        );
                                                      }}
                                                    >
                                                      <img
                                                        src={historyVersionIcon}
                                                        alt="edit"
                                                      />
                                                      Restore
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      className="d-flex gap-3 text-danger dropdown-list-item"
                                                      onClick={() =>
                                                        clickDeleteHistory(
                                                          his.slideshow_history_id
                                                        )
                                                      }
                                                    >
                                                      <img
                                                        src={deleteIcon}
                                                        alt="delete"
                                                      />
                                                      Delete
                                                    </DropdownItem>
                                                  </DropdownMenu>
                                                </Dropdown>
                                              </>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="body">
                                      <div className="body-top-2 pb-2 px-1">
                                        <i className="bx bxs-circle current-version-icon" />
                                        <Label className="ms-2">
                                          Current Version
                                        </Label>
                                      </div>
                                      <div
                                        style={{ overflow: "scroll" }}
                                        className="body-bottom-2 row px-1"
                                      >
                                        {historyData?.automaticHistory?.map(
                                          hist => (
                                            <div className="list py-1">
                                              {/* bg-light */}
                                              <i className="bx bx-radio-circle"></i>
                                              <div className="list-side d-flex ms-2">
                                                <p className="mb-0">
                                                  {moment(
                                                    hist.updated_datetime
                                                  ).format("MMM DD, h:mm a")}
                                                </p>
                                                <img
                                                  src={historyVersionIcon}
                                                  alt="history version"
                                                  title="Restore"
                                                  onClick={() => {
                                                    dispatch(
                                                      setSlides(
                                                        JSON.parse(
                                                          hist.description
                                                        )
                                                      )
                                                    );
                                                    dispatch(
                                                      saveSlideshow({
                                                        slides: JSON.parse(
                                                          hist.description
                                                        ),
                                                        slideshow_id:
                                                          slideshow_id,
                                                      })
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        )
                        // <Modal
                        // isOpen={openHistory}
                        // //toggle={closeHistoryPopup}
                        // >
                        //   <ModalHeader toggle={()=>setDropdownMenuOpen(false)}>Slideshow Setting</ModalHeader>
                        //   <ModalBody>
                        //     <div>hii</div>
                        //   </ModalBody>
                        // </Modal>
                      )}
                    </div>

                    <div
                      id="music_playlist"
                      className="tools-icon border-radius-right-top-bottom settingIconSize"
                      onClick={handleSlideShowSettings}
                    >
                      <img src={settingIcon} alt="settingsIcon" />
                      Settings
                    </div>
                    <div
                      id="music_playlist"
                      className="tools-icon border-radius-right-top-bottom playlistIconSize"
                      onClick={() => {
                        dispatch(setActivePlayList(true));
                      }}
                    >
                      <img src={playlistIcon} alt="playlistIcon" />
                      <span className="">Playlist</span>
                    </div>
                    {/* <div className="tools-icon border-radius-right-top-bottom"></div> */}
                  </div>
                )}
              </div>
              <div
                className="d-flex margin-auto export-wrapper-button"
                style={{ gap: "9px" }}
              >
                <div className="top-header-button d-flex">
                  {settings.published_date_time && (
                    <CommonButton
                      btnId="export-slideshow"
                      btnText={
                        loadingExport
                          ? `Exporting...${
                              exportProgress > 0
                                ? ` (${exportProgress.toFixed(0)}%)`
                                : ""
                            }`
                          : "Export"
                      }
                      btnClick={handleExport}
                      btnRounded={false}
                      btnDisabled={loadingExport}
                      btnCancel={true}
                      btnClass="ms-2"
                    />
                  )}
                  {/* <CommonButton
                    btnId="save"
                    btnText={loadingSaveSlideshow ? "Saving..." : "Save"}
                    btnClass="ms-2"
                    btnClick={() => finalSave(true)}
                    btnRounded={false}
                    btnCancel={true}
                    btnDisabled={loadingSaveSlideshow}
                  /> */}
                  {/* <CommonButton
                    btnId="publish-slideshow"
                    btnText="Publish"
                    btnClick={() => setIsOpenConfirmPublishModal(true)}
                    btnRounded={false}
                    btnClass="ms-2"
                    btnDisabled={isPublishDisable}
                  /> */}
                  {settings.published_date_time ? (
                    <CommonButton
                      btnId="publish-slideshow"
                      //btnImg={checkCircle}
                      btnText="Unpublish"
                      btnClick={unPublish}
                      btnRounded={false}
                      btnClass="ms-2"
                    />
                  ) : (
                    <CommonButton
                      btnId="publish-slideshow"
                      btnText="Publish"
                      btnClick={() => setIsOpenConfirmPublishModal(true)}
                      btnRounded={false}
                      btnClass="gap-6"
                      btnDisabled={isPublishDisable}
                    />
                  )}
                  {settings.published_date_time && (
                    <UncontrolledTooltip
                      target="publish-slideshow"
                      placement="bottom"
                    >
                      {"Last published at " +
                        moment(settings.published_date_time).format(
                          "MM/DD/YYYY hh:mm A"
                        )}
                    </UncontrolledTooltip>
                  )}
                </div>
                {/* <div class="vertical-right-line vertical_right_line_spacing"></div> */}
                {/* <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="tooltip">preview</Tooltip>}
                >
                  <div
                    className="top-playlist-icon"
                    onClick={() =>
                      window.open(`/slide-show/${slideshow_id}`)
                    }
                    id="top-playlist-icon"
                  >
                    <img src={vectorIcon} alt="vectorIcon" />
                  </div>
                </OverlayTrigger> */}
                <CommonButton
                  btnClass="top-playlist-button btn-text-black"
                  btnText={"Preview"}
                  btnOutline={true}
                  btnClick={() =>
                    window.open(`/slide-show-preview/${slideshow_id}`)
                  }
                  iconType={"play me-2"}
                  // style={{ color: "black" }}
                />
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
      {rightBar && windowWidth.width < 576 ? (
        <RightBar isActive={type} onClose={() => setRightBar(false)} />
      ) : null}
      {isOpen && (
        <Alert
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          alertHeaderText="Oops!"
          alertDescriptionText={getAlertDescriptionText()}
          confirmBtn={false}
          redBtn={false}
          redBtnOops={true}
          confirmBtnOops={true}
          btnClick={handleAddSlide}
        />
      )}
      {isOpenAlert && (
        <Alert
          isOpen={isOpenAlert}
          onClose={handleCloseSlideHistory}
          confirmed={handleDeleteSlideHistory}
          alertHeaderText="Delete History"
          alertDescriptionText="Are you sure you want to delete this history?"
        />
      )}
      <Modal isOpen={isOpenImage} centered backdrop="static">
        <ModalHeader toggle={onCloseImage}>Import Images</ModalHeader>
        <form
          onSubmit={handleSubmit}
          className="slidr-image-upload-form1"
          id="slidr-image-upload-form"
        >
          <ModalBody>
            <CustomDropZone
              // ref={imageRef}
              type="image"
              src={imageArray}
              value={JSON.stringify(imageArray)}
              multiple={isMultiple}
              handleOnDrop={url => {
                setImageArray(prev => [...prev, url]);
              }}
              handleRemove={url => {
                setImageArray(prev => prev.filter(item => item !== url));
              }}
              accept=".jpg,.jpeg,.png"
              folderName={process.env.REACT_APP_AWS_FOLDER_IMAGES}
              bucketName={process.env.REACT_APP_AWS_BUCKET_SLIDR}
              error={!!errors.img}
              errorMessage={errors.img}
              withBottomMargin={false}
              setIsUploadingFile={() => {}}
            />
          </ModalBody>
          <ModalFooter>
            <CommonButton
              btnType="submit"
              btnText="Import"
              btnDisabled={imageArray?.length === 0}
            />
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default Settings;
