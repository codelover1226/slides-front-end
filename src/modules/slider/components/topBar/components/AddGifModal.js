import DownArrow from "assets/images/DownArrow.png";
import UpArrow from "assets/images/UpArrow.png";
import CheckMark from "assets/images/Vector.svg";
import crossIcon from "assets/images/cross.svg";
import CustomDropZone from "common/CustomDropZone/CustomDropZone";
import CommonButton from "components/CommonButton";
import { useFormik } from "formik";
import { gifField } from "modules/slider/store/actions";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FormFeedback,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import * as Yup from "yup";

const AddGifModal = forwardRef(({ slideshow_id }, ref) => {
  const [showContent, setShowContent] = useState(false);
  const initialValues = {
    img: "",
  };

  const validationSchema = Yup.object().shape({
    img: Yup.string().required("Image is required."),
  });

  const videoSupportInfoData = [
    {
      id: 1,
      label: "Apple TV",
      gif: true,
      caption: "",
    },
    {
      id: 2,
      label: "Android TV",
      gif: true,
      caption: "",
    },
    {
      id: 3,
      label: "Amazon Devices (Firestick, FireTV)",
      gif: true,
      caption: "",
    },
    {
      id: 4,
      label: "Roku",
      gif: false,
      caption: "",
    },
  ];
  const dispatch = useDispatch();
  const gifRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const { slides, activeSlide } = useSelector(state => state.Slidr);
  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
    }),
    []
  );

  const onSubmit = values => {
    if (!!gifRef.current?.isUploading) {
      toast.warning("Please wait while gif is uploading...");
      return true;
    }
    dispatch(
      gifField({
        payload: {
          slideshow_id: slideshow_id,
          gifUrl: values.img,
        },
      })
    );

    onClose();
  };

  const onClose = () => {
    if (!!gifRef.current?.isUploading) {
      toast.warning("Please wait while gif is uploading...");
      return true;
    }
    resetForm({
      values: { ...initialValues },
    });
    setIsOpen(false);
  };

  const { values, handleSubmit, setFieldValue, errors, resetForm } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    let slide = slides.find(slide => slide.id === activeSlide);
    if (slide) {
      resetForm({
        values: {
          img: slide?.gifUrl || "",
          isBackgroundImage: !!slide.backgroundImage ? true : false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide, isOpen, setFieldValue, slides]);

  return (
    <Modal
      className="slidr-modal add-video-modal slidr-slideshow-modal gif_upload_modal_main"
      isOpen={isOpen}
      centered
      backdrop="static"
      size="md"
    >
      <ModalHeader toggle={onClose}>Upload Gif</ModalHeader>
      <form onSubmit={handleSubmit} id="slidr-image-upload-form">
        <ModalBody>
          <CustomDropZone
            ref={gifRef}
            type="image"
            src={values.img}
            handleOnDrop={url => {
              setFieldValue("img", url);
            }}
            // accept=".gif"
            accept={{ "image/gif": [] }}
            folderName={process.env.REACT_APP_AWS_FOLDER_GIF}
            bucketName={process.env.REACT_APP_AWS_BUCKET_SLIDR}
            error={!!errors.img}
            errorMessage={errors.img}
            withBottomMargin={false}
            setIsUploadingFile={() => {}}
            title={"gif"}
          />
          {!!errors.img && (
            <FormFeedback className="d-flex">{errors.img}</FormFeedback>
          )}
          {!values.img && (
            <>
              {/* <br /> */}
              <br />
              <Label className="cursor-pointer">
                <button
                  onClick={() => setShowContent(prev => !prev)}
                  className="bg-white"
                  type="button"
                >
                  <img src={`${showContent ? UpArrow : DownArrow}`} alt="" />
                </button>
                Supported GIF formats by devices
              </Label>
              <div className="table-responsive">
                {showContent ? (
                  <table className="video-support-info-table table">
                    <thead>
                      <tr>
                        <th>Devices</th>
                        <th className="text-center">GIF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videoSupportInfoData.map(
                        ({ id, caption, label, gif }) => (
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
                              <div className="flex-column">
                                {gif ? (
                                  <img src={CheckMark} alt="comment-check" />
                                ) : (
                                  <img src={crossIcon} alt="close-icon" />
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : null}
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter className="history-modal-footer">
          <div className="d-flex text-end gap-3 gif-modal-footer-innerdiv">
            <CommonButton
              btnClass="px-4"
              btnText="Cancel"
              btnClick={() => setIsOpen(false)}
              btnCancel
            />
            {values.img ? (
              <CommonButton btnType="submit" btnText="Add gif in slide" />
            ) : (
              <CommonButton
                btnType="submit"
                btnText={false ? "Loading..." : "Upload Gif"}
              />
            )}
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
});

export default AddGifModal;
