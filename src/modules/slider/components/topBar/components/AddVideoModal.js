/* eslint-disable no-unused-vars */
import DownArrow from "assets/images/DownArrow.png";
import UpArrow from "assets/images/UpArrow.png";
import CheckMark from "assets/images/Vector.svg";
import crossIcon from "assets/images/cross.svg";
import noThumbnail from "assets/images/no-thumbnail.svg";
import axios from "axios";
import CustomDropZone from "common/CustomDropZone/CustomDropZone";
import CommonButton from "components/CommonButton";
import { useFormik } from "formik";
import { replaceVideoField, videoField } from "modules/slider/store/actions";
import AddGrowConVideo from "./AddGrowConVideo";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

import * as Yup from "yup";

const initialValues = {
  video: "",
};

const validationSchema = Yup.object().shape({
  video: Yup.string().required("Video is required."),
});

const videoSupportInfoData = [
  {
    id: 1,
    label: "Apple TV",
    youtube: true,
    vimeo: true,
    mp4: true,
    caption: "",
  },
  {
    id: 2,
    label: "Android TV",
    youtube: false,
    vimeo: true,
    mp4: true,
    caption: "",
  },
  {
    id: 3,
    label: "Amazon Devices",
    youtube: false,
    vimeo: true,
    mp4: true,
    caption: "(Firestick, FireTV)",
  },
  {
    id: 4,
    label: "Roku",
    youtube: false,
    vimeo: true,
    mp4: true,
    caption: "",
  },
];

const VideoPreview = ({ src }) => {
  const type = useMemo(
    () =>
      src.includes("www.youtube.com")
        ? "youtube"
        : src.includes("vimeo.com")
        ? "vimeo"
        : "aws",

    [src]
  );
  return type === "aws" ? (
    <video className="slidr-video-preview icon-video" controls key={src}>
      <source src={src} type="video/mp4" />
      <source src={src} type="video/ogg" />
      <source src={src} type="video/ogg" />
      <source src={src} type="video/ogg" />
    </video>
  ) : (
    <>
      <iframe
        title="slidr-video"
        src={src}
        width="100%"
        height={320}
        frameBorder="0"
        allow="autoplay; picture-in-picture"
        allowFullScreen
      ></iframe>
    </>
  );
};

const getPreviewImage = async url => {
  const type = url.includes("www.youtube.com")
    ? "youtube"
    : url.includes("vimeo.com")
    ? "vimeo"
    : url.includes("amazonaws.com")
    ? "aws"
    : "default";

  switch (type) {
    case "youtube":
      const youtubeVideoId = url.split("/").pop();
      return `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
    case "vimeo":
      const vimeoVideoId = url.split("/").pop();
      try {
        const res = await axios.get(
          `https://vimeo.com/api/v2/video/${vimeoVideoId}.json`
        );
        if (res.status) {
          return res.data[0]?.thumbnail_large;
        }
      } catch (err) {
        return noThumbnail;
      }
      break;

    case "aws":
      const data = url.split(".");
      data.pop();
      const awsThumbUrl = `${data
        .join(".")
        .replace(".s3.us-east", "-thumbnails.s3.us-east")}.jpg`;
      return awsThumbUrl;
    default:
      return noThumbnail;
  }
};

const AddVideoModal = forwardRef(({ slideshow_id, type, slideId }, ref) => {
  const dispatch = useDispatch();
  const { slides, activeSlide } = useSelector(state => state.Slidr);
  const videoRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabType, setTabType] = useState(0);
  const [initialVideoUrl, setInitialVideoUrl] = useState("");
  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     open: () => setIsOpen(true),
  //   }),
  //   []
  // );
  useImperativeHandle(ref, () => ({
    open: videoUrl => {
      setInitialVideoUrl(videoUrl);
      setIsOpen(true);
    },
  }));
  const isVideoSlide = useMemo(
    () => slides?.find(slide => slide?.id === activeSlide)?.videoUrl,
    [slides, activeSlide]
  );
  const isVideoId = useMemo(
    () => slides?.find(slide => slide?.id === activeSlide),
    [slides, activeSlide]
  );
  const onSubmit = async values => {
    const thumbUrl = await getPreviewImage(values.video);
    if (thumbUrl.includes("amazonaws.com")) checkImage(values, thumbUrl);
    else onSubmitSuccess(values, thumbUrl);
  };

  const onSubmitSuccess = (values, url) => {
    setLoading(false);
    if (+type === 0) {
      dispatch(
        replaceVideoField({
          payload: {
            slideshow_id: slideshow_id,
            videoUrl: values.video,
            videoPreviewImageUrl: url,
            slideId: slideId.id,
          },
        })
      );
    } else {
      dispatch(
        videoField({
          payload: {
            slideshow_id: slideshow_id,
            videoUrl: values.video,
            videoPreviewImageUrl: url,
          },
        })
      );
    }

    onClose();
  };

  const onClose = () => {
    if (videoRef.current?.isUploading) {
      toast.warning("Please wait while video is uploading...");
      return true;
    }
    resetForm({
      values: { ...initialValues },
    });
    setIsOpen(false);
  };

  const checkImage = (values, url) => {
    let count = 0;
    const checkThumb = async () => {
      count += 1;
      setLoading(true);
      try {
        const res = await axios.get(url);
        if (res.status) {
          onSubmitSuccess(values, url);
        }
      } catch (err) {
        if (count < 5) {
          setTimeout(() => {
            checkThumb(values, url);
          }, 1000);
        } else {
          setLoading(false);
          toast.error("Something went wrong, please try again");
        }
      }
    };
    checkThumb();
  };

  const { values, handleSubmit, setFieldValue, errors, resetForm } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleVideo = url => {
    setFieldValue("video", url);
    handleKeyUp(url);
  };
  const getYoutubeVideoId = url => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };
  const handleKeyUp = url => {
    // let url = e.target?.value;
    if (url) {
      if (
        ["www.youtube.com", "youtu.be", "youtube.com"].some(item =>
          url.includes(item)
        )
      ) {
        const code = getYoutubeVideoId(url);
        const newUrl = `https://www.youtube.com/embed/${code || ""}`;
        setFieldValue("video", newUrl);
      } else if (["vimeo.com"].some(item => url.includes(item))) {
        // const code = url.split("/").pop();
        const code = url.match(/(\d+)/)[0];
        const newUrl = `https://player.vimeo.com/video/${code}`;
        setFieldValue("video", newUrl);
      } else setFieldValue("video", url);
    }
  };

  useEffect(() => {
    resetForm({
      values: {
        video: slideId?.videoUrl || initialVideoUrl || "",
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, setFieldValue, initialVideoUrl, resetForm]);
  // useEffect(() => {
  //   if (isOpen) {
  //     resetForm({
  //       values: {
  //         video: slideId?.videoUrl || initialVideoUrl || "",
  //       },
  //     });
  //   }
  // }, [isOpen, initialVideoUrl, resetForm]);

  const customSubmit = e => {
    e.preventDefault();
    if (!!videoRef.current?.isUploading) {
      toast.warning("Please wait while video is uploading...");
      return;
    }
    handleSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      centered
      // className="slidr-modal add-video-modal slidr-slideshow-modal video_upload_modal_main"
      className={`slidr-modal add-video-modal slidr-slideshow-modal video_upload_modal_main ${
        tabType === 2 ? "video_upload_modal_main-2" : ""
      }`}
      backdrop="static"
    >
      <ModalHeader toggle={onClose}>
        {+type === 0 ? "Replace Video" : "Upload Video"}
      </ModalHeader>
      <form onSubmit={customSubmit} id="slidr-image-upload-form">
        <ModalBody>
          <div className="playlist-tab video-tab">
            <ul className="nav">
              <li className="nav-item" onClick={() => setTabType(0)}>
                <div
                  className={`nav-link ${
                    tabType === 0 ? "active" : "non-active"
                  }`}
                >
                  {+type === 0 ? "Replace video" : "Upload video"}
                </div>
              </li>
              <li className="nav-item" onClick={() => setTabType(1)}>
                <div
                  className={`nav-link ${
                    tabType === 1 ? "active" : "non-active"
                  }`}
                >
                  Import from URL
                </div>
              </li>
              <li className="nav-item" onClick={() => setTabType(2)}>
                <div
                  className={`nav-link ${
                    tabType === 2 ? "active" : "non-active"
                  }`}
                >
                  Import from Grow
                </div>
              </li>
            </ul>
          </div>
          {tabType === 0 ? (
            <>
              <CustomDropZone
                ref={videoRef}
                type="video"
                src={values?.video}
                handleOnDrop={handleVideo}
                // accept=".mp4"
                accept={{ "video/mp4": [".mp4", ".MP4", ".mov"] }}
                folderName={process.env.REACT_APP_AWS_FOLDER_VIDEOS}
                bucketName={process.env.REACT_APP_AWS_BUCKET_SLIDR}
                error={!!errors.video}
                errorMessage={errors.video}
                showPreview={true}
                handleSwitch={resetForm}
                // handleKeyUp={handleKeyUp}
                setIsUploadingFile={() => {}}
              />
              {!!errors.video && +type !== 0 && (
                <FormFeedback className="d-flex">{errors.video}</FormFeedback>
              )}
            </>
          ) : tabType === 1 ? (
            <div className="my-3 videoURL">
              <div className="mb-0" htmlFor="is_arrow">
                Import from URL
              </div>
              <Input
                type="url"
                value={values?.video}
                name={"video"}
                className="mb-2"
                placeholder={"Enter link"}
                onKeyUp={e => {
                  handleKeyUp(e.target.value);
                }}
                onChange={e => {
                  handleVideo(e.target.value);
                }}
                invalid={+type !== 0 && errors.video && !!errors.video}
              />
              {+type !== 0 && (
                <FormFeedback className="d-flex">{errors.video}</FormFeedback>
              )}
              {values.video && <VideoPreview src={values.video} />}
              {!values.video && (
                <>
                  <br />
                  <p className="info mb-3 text-secondary">
                    (Recommended Video Length: 30 Seconds - 15 Minutes, Video
                    Quality: 1080P, Video Dimension: 16:9)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div>
              <AddGrowConVideo
                slideshow_id={slideshow_id}
                onClose={onClose}
                type={isVideoSlide ? "0" : "1"}
                slideId={isVideoId}
              />
            </div>
          )}

          {!values.video && (tabType === 0 || tabType === 1) ? (
            <Label className="cursor-pointer">
              <button
                onClick={() => setShowContent(prev => !prev)}
                className="bg-white"
                type="button"
              >
                <img src={`${showContent ? UpArrow : DownArrow}`} alt="" />
              </button>
              Supported video formats by devices
            </Label>
          ) : null}
          <div className="table-responsive video_support_info_main">
            {showContent ? (
              <table className="video-support-info-table table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="text-center">Youtube</th>
                    <th className="text-center">Vimeo</th>
                    <th className="text-center">.Mp4</th>
                  </tr>
                </thead>
                <tbody>
                  {videoSupportInfoData.map(
                    ({ id, caption, label, mp4, vimeo, youtube }) => (
                      <tr key={id}>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="heading">{label}</span>
                            {!!caption && (
                              <span className="sub-heading">{caption}</span>
                            )}
                          </div>
                        </td>
                        <td className="text-center">
                          {youtube ? (
                            <img src={CheckMark} alt="comment-check" />
                          ) : (
                            // <i className="bx bx-comment-check text-success" />
                            <img src={crossIcon} alt="close-icon" />
                            // <i className="bx bx-x text-gray" />
                          )}
                        </td>
                        <td className="text-center">
                          {vimeo ? (
                            <img src={CheckMark} alt="comment-check" />
                          ) : (
                            <img src={crossIcon} alt="close-icon" />
                          )}
                        </td>
                        <td className="text-center">
                          {mp4 ? (
                            <img src={CheckMark} alt="comment-check" />
                          ) : (
                            <img src={crossIcon} alt="close-icon" />
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : null}
          </div>
        </ModalBody>
        {tabType === 0 || tabType === 1 ? (
          <ModalFooter>
            <div className="d-flex text-end gap-3 upload-video-modal">
              <CommonButton
                btnClass="px-4"
                btnText="Cancel"
                btnClick={() => setIsOpen(false)}
                btnCancel
              />
              <CommonButton
                btnType="submit"
                btnForm="slidr-image-upload-form"
                btnClass="px-3"
                btnDisabled={loading}
                btnText={
                  loading
                    ? "Loading..."
                    : +type === 0
                    ? "Replace video in slide"
                    : "Add video in slide"
                }
              />
            </div>
          </ModalFooter>
        ) : null}
      </form>
    </Modal>
  );
});

export default AddVideoModal;
