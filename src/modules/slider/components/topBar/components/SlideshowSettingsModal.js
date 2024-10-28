import CommonButton from "components/CommonButton";
import {
  autoSlideTimes,
  defaultDocumentTitle,
  presentationSizes,
} from "constants/slidr";
import { useFormik } from "formik";
import { slideSettings } from "modules/slider/store/actions";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Alert from "modules/home/components/Alert";
import {
  Col,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import * as Yup from "yup";

const initialValues = {
  id: 0,
  title: "",
  feedCode: "",
  presentationSize: "1280*720",
  autoSlide: 0,
  img: "",
  size: "cover",
  position: "center",
  repeat: "no-repeat",
  repeatSlideshow: false,
  slideNumbers: false,
  grids: false,
  color: {
    r: "255",
    g: "255",
    b: "255",
    a: "1",
  },
  isImage: false,
};
const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
});

const SlideshowSettingsModal = forwardRef((_, ref) => {
  const dispatch = useDispatch();
  const imageRef = useRef();
  const { settings, loadingSlideSettings } = useSelector(state => state.Slidr);

  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const [presentation, setPresentation] = useState(null);
  const [isBgValueChange, setIsBgValueChange] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
    }),
    []
  );

  const onSubmit = values => {
    if (!!imageRef?.current?.isUploading && values.isImage) {
      toast.error("Please wait while image is uploading...");
      return true;
    }
    values.title = values.title || defaultDocumentTitle;
    dispatch(slideSettings({ payload: { ...values, isBgValueChange } }));
    setIsOpen(false);
  };

  const {
    setFieldValue,
    resetForm,
    handleSubmit,
    handleChange,
    values,
    errors,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

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

  const toggle = () => {
    if (!!imageRef.current?.isUploading) {
      toast.error("Please wait while image is uploading");
      return true;
    }
    setIsOpen(false);
  };

  const handleAlert = e => {
    setPresentation(e.target.value);
    setAlert(true);
  };
  const confirmed = () => {
    setFieldValue("presentationSize", +presentation);
    setPresentation(null);
    setAlert(false);
  };

  return (
    <>
      {" "}
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered
        className="slidr-modal slidr-slideshow-modal open-modal-bottom slideshow-setting-wrapper"
        backdrop="static"
      >
        <ModalHeader toggle={toggle}>Slideshow Setting</ModalHeader>
        <form onSubmit={handleSubmit} id="slidr-slideshow-form">
          <ModalBody className="setting-model">
            <Row className="">
              <Row className="slidr-modal-drops">
                <Col sm={6} className="spaceCol">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Enter Title"
                    value={values.title}
                    onChange={handleChange}
                    className="form-control right-editor-props"
                    invalid={errors.title && !!errors.title}
                  />
                  <FormFeedback>{errors.title}</FormFeedback>
                </Col>
                <Col sm={6} className="spaceCol feed-code">
                  <Label htmlFor="feedCode">Feed Code</Label>
                  <Input
                    id="feedCode"
                    type="text"
                    disabled={true}
                    name="feedCode"
                    placeholder="Enter Feed Code"
                    value={values.feedCode}
                    onChange={handleChange}
                    className="right-editor-props"
                  />
                </Col>
              </Row>

              <Row className="slidr-modal-drops">
                <Col sm={6} className="spaceCol present-right">
                  <Label htmlFor="presentationSize">Presentation Size</Label>
                  <select
                    className="form-control right-editor-props"
                    id="presentationSize"
                    type="text"
                    name="presentationSize"
                    value={values.presentationSize}
                    onChange={e => handleAlert(e)}
                  >
                    <option value={0} disabled>
                      Select Presentation Size
                    </option>
                    {presentationSizes.map(size => (
                      <option value={size.value} key={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col sm={6} className="spaceCol">
                  <Label htmlFor="autoSlide">Auto Slide</Label>
                  <select
                    className="form-control right-editor-props"
                    id="autoSlide"
                    type="text"
                    name="autoSlide"
                    value={values.autoSlide}
                    onChange={e => setFieldValue("autoSlide", +e.target.value)}
                  >
                    {autoSlideTimes.map(autoSlide => (
                      <option value={autoSlide.value} key={autoSlide.value}>
                        {autoSlide.label}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
              <Col sm={12} className="mb-2">
                <div className="custom-switch-row d-flex align-items-center slidr-bg">
                  <div className="form-check form-switch form-switch-md custom-switch setting-switch">
                    <input
                      type="checkbox"
                      className="form-check-input cursor-pointer"
                      id="repeatSlideshow"
                      checked={values.repeatSlideshow}
                      onChange={e => {
                        setFieldValue("repeatSlideshow", e.target.checked);
                      }}
                    />
                  </div>
                  <Label className="mb-0" htmlFor="repeatSlideshow">
                    Repeat Slideshow
                  </Label>
                </div>
              </Col>
              <Col sm={12} className="mb-2">
                <div className="custom-switch-row d-flex align-items-center slidr-bg">
                  <div className="form-check form-switch form-switch-md custom-switch setting-switch">
                    <input
                      type="checkbox"
                      className="form-check-input cursor-pointer"
                      id="slideNumbers"
                      checked={values.slideNumbers}
                      onChange={e => {
                        setFieldValue("slideNumbers", e.target.checked);
                      }}
                    />
                  </div>
                  <Label className="mb-0" htmlFor="slideNumbers">
                    Slide Number
                  </Label>
                </div>
              </Col>
              <Col sm={12} className="mb-2">
                <div className="custom-switch-row d-flex align-items-center slidr-bg">
                  <div className="form-check form-switch form-switch-md custom-switch setting-switch">
                    <input
                      type="checkbox"
                      className="form-check-input cursor-pointer "
                      id="grids"
                      checked={values.grids}
                      onChange={e => {
                        setFieldValue("grids", e.target.checked);
                      }}
                    />
                  </div>
                  <Label className="mb-0" htmlFor="grids">
                    Show Grid lines
                  </Label>
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="history-modal-footer">
            <div className="d-flex gap-3 text-end common-button-responsive-style">
              <CommonButton
                btnClass="px-4"
                btnText="Cancel"
                btnClick={() => setIsOpen(false)}
                btnCancel
              />
              <CommonButton
                btnType="submit"
                btnForm="slidr-slideshow-form"
                btnClass="px-4"
                btnText={`${
                  loadingSlideSettings ? "Saving..." : "Save Settings"
                }`}
                btnDisabled={loadingSlideSettings}
              />
            </div>
          </ModalFooter>
        </form>
      </Modal>
      <Alert
        isOpen={alert}
        onClose={() => setAlert(false)}
        alertHeaderText="Change Presentation Size"
        alertDescriptionText="Are you sure you want to change presentation size?"
        confirmed={confirmed}
        fromSlideShowSetting={true}
      />
    </>
  );
});

export default SlideshowSettingsModal;
