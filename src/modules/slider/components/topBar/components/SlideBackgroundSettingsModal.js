import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomDropZone from "common/CustomDropZone/CustomDropZone";
import CommonButton from "components/CommonButton";
import ColorPicker from "common/ColorPicker";
import { useDispatch, useSelector } from "react-redux";
import {
  backgroundRepeats,
  backgroundSizes,
  backgroundPositions,
} from "constants/slidr";
import { toast } from "react-toastify";
import {
  setBackgroundField,
  slideSettings,
} from "modules/slider/store/actions";
import Alert from "modules/home/components/Alert";

const initialValues = {
  backgroundImage: "",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#556ee6",
  isBackgroundImage: true,
};

const validationSchema = Yup.object().shape({
  backgroundImage: Yup.string().when("isBackgroundImage", {
    is: true,
    then: () => Yup.string().required("Image is required."),
  }),
});

const SlideBackgroundSettingsModal = forwardRef((_, ref) => {
  const imageRef = useRef();
  const dispatch = useDispatch();
  const [tabType, setTabType] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isBgValueChange, setIsBgValueChange] = useState(false);
  const [applyAlert, setApplyAlert] = useState(false);
  const { slides, activeSlide, settings } = useSelector(state => state.Slidr);
  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
    }),
    []
  );

  const onSubmit = values => {
    if (!!imageRef?.current?.isUploading && values.isBackgroundImage) {
      toast.error("Please wait while image is uploading...");
      return true;
    }
    if (isBgValueChange) {
      setApplyAlert(true);
    } else {
      setApplyAlert(false);
      dispatch(
        setBackgroundField({
          backgroundImage: values.backgroundImage,
          backgroundColor: values.backgroundColor,
          isBackgroundImage: values.isBackgroundImage,
          backgroundRepeat: values.backgroundRepeat,
          backgroundSize: values.backgroundSize,
          backgroundPosition: values.backgroundPosition,
        })
      );
      toggle();
    }
  };

  const confirmed = () => {
    if (values) {
      const payload = {
        ...settings,
        img: tabType === 0 ? values.backgroundImage : "",
        color: tabType === 1 ? values.backgroundColor : "",
        isBackgroundImage: values.isBackgroundImage,
        repeat: values.backgroundRepeat,
        size: values.backgroundSize,
        position: values.backgroundPosition,
        isBgValueChange: true,
      };
      dispatch(slideSettings({ payload }));
      setApplyAlert(false);
      toggle();
    }
  };

  const changeOption = e => {
    setFieldValue(e.target.name, e.target.value);
  };

  const { values, handleSubmit, setFieldValue, errors, resetForm, touched } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });

  const toggle = useCallback(() => {
    if (!!imageRef.current?.isUploading) {
      toast.error("Please wait while image is uploading...");
      return true;
    }
    resetForm({
      values: { ...initialValues },
    });
    setIsOpen(prev => !prev);
  }, [resetForm]);

  useEffect(() => {
    if (isOpen) {
      setIsBgValueChange(false);
      resetForm({
        values: {
          ...initialValues,
          ...settings,
        },
      });
    }
  }, [settings, isOpen, resetForm]);

  useEffect(() => {
    let slide = slides.find(slide => slide.id === activeSlide);
    if (slide) {
      setFieldValue("backgroundColor", slide.backgroundColor);
      setFieldValue("isBackgroundImage", slide.isBackgroundImage);
      setFieldValue("backgroundImage", slide.backgroundImage);
      setFieldValue("backgroundRepeat", slide.backgroundRepeat);
      setFieldValue("backgroundSize", slide.backgroundSize);
      setFieldValue("backgroundPosition", slide.backgroundPosition);
      if (tabType === 0) {
        setFieldValue("isBackgroundImage", true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide, isOpen, setFieldValue, slides]);

  return (
    <Modal
      isOpen={isOpen}
      centered
      className="slidr-modal slidr-background-upload-modal slidr-slideshow-modal slidr_background_add_popup"
      backdrop="static"
    >
      <ModalHeader toggle={toggle}>Slide Background Setting</ModalHeader>
      <form onSubmit={handleSubmit} id="slidr-background-upload-form">
        <ModalBody>
          <div className="playlist-tab playlist_option">
            <ul className="nav">
              <li
                className="nav-item"
                onClick={() => {
                  setFieldValue("isBackgroundImage", true);
                  setTabType(0);
                }}
              >
                <div
                  className={`nav-link ps-0 ${
                    tabType === 0 ? "active" : "non-active"
                  }`}
                >
                  Background Image
                </div>
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setFieldValue("isBackgroundImage", false);
                  setTabType(1);
                }}
              >
                <div
                  className={`nav-link ${
                    tabType === 1 ? "active" : "non-active"
                  }`}
                >
                  Background Color
                </div>
              </li>
            </ul>
          </div>
          {tabType === 0 ? (
            <>
              <div className="mb-3">
                <CustomDropZone
                  ref={imageRef}
                  type="image"
                  src={values.backgroundImage}
                  handleOnDrop={url => {
                    setFieldValue("backgroundImage", url);
                  }}
                  // accept=".jpg,.jpeg,.png"
                  accept={{ "image/*": [] }}
                  folderName={process.env.REACT_APP_AWS_FOLDER_IMAGES}
                  bucketName={process.env.REACT_APP_AWS_BUCKET_SLIDR}
                  error={!!(errors.backgroundImage && touched.backgroundImage)}
                  errorMessage={
                    touched.backgroundImage && errors.backgroundImage
                  }
                  withBottomMargin={false}
                  setIsUploadingFile={() => {}}
                />
                {!!(errors.backgroundImage && touched.backgroundImage) && (
                  <FormFeedback className="d-flex">
                    {errors.backgroundImage}
                  </FormFeedback>
                )}
              </div>
              <div className="d-flex row slidr-modal-drops">
                <div className="col-sm-4">
                  <Label>Repeat</Label>
                  <div>
                    <select
                      className="form-control right-editor-props"
                      name="backgroundRepeat"
                      onChange={changeOption}
                      value={values.backgroundRepeat}
                    >
                      {backgroundRepeats.map(bgr => (
                        <option key={bgr.value} value={bgr.value}>
                          {bgr.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <Label>Size</Label>
                  <div>
                    {" "}
                    <select
                      className="form-control right-editor-props"
                      onChange={changeOption}
                      name="backgroundSize"
                      value={values.backgroundSize}
                    >
                      {backgroundSizes.map(bgs => (
                        <option key={bgs.value} value={bgs.value}>
                          {bgs.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <Label>Position</Label>
                  <div>
                    <select
                      className="form-control right-editor-props"
                      value={values.backgroundPosition}
                      onChange={changeOption}
                      name="backgroundPosition"
                    >
                      {backgroundPositions.map(bgp => (
                        <option key={bgp.value} value={bgp.value}>
                          {bgp.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <ColorPicker
              type="rgba"
              disableAlpha={false}
              value={values.backgroundColor}
              onChange={value => {
                setFieldValue("backgroundColor", value);
              }}
              label="Choose Background Color"
              className="color-picker-slidr-modal bg-colorpicker"
            />
          )}
          <div className="d-flex gap-3 py-3 m-auto align-items-center checked-slide--bg-radio">
            <label htmlFor="applyAllSlides" className="fs-6 mb-0">
              <input
                type="checkbox"
                id="applyAllSlides"
                onChange={e => {
                  setIsBgValueChange(e.target.checked);
                }}
              />
              <span className="bg-checkbox-text">Apply to all slides</span>
            </label>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="text-end d-flex gap-3">
            <CommonButton
              btnClass="px-4"
              btnText="Cancel"
              btnClick={() => setIsOpen(false)}
              btnCancel
              btnType="button"
            />
            <CommonButton
              btnType="submit"
              btnForm="slidr-background-upload-form"
              btnClass="px-4"
              // btnDisabled={false}
              error={!!errors.backgroundImage}
              errorMessage={errors.backgroundImage}
              btnText="Save Settings"
            />
          </div>
        </ModalFooter>
      </form>
      <Alert
        isOpen={isBgValueChange && applyAlert}
        onClose={() => setApplyAlert(false)}
        alertHeaderText="Apply to all slides"
        confirmed={confirmed}
        alertDescriptionText="Are you sure you want to apply these settings to all slides?"
      />
    </Modal>
  );
});

export default SlideBackgroundSettingsModal;
