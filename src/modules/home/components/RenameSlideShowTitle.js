import CommonButton from "components/CommonButton";
import { useFormik } from "formik";
import { slideShowTitle } from "modules/slider/store/actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  title: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
});

const RenameSlideShowTitle = ({ isOpen, handleClose, editData }) => {
  const { settings } = useSelector(state => state.Slidr);
  const dispatch = useDispatch();

  const onClose = () => {
    handleClose();
  };

  const onSubmit = val => {
    dispatch(
      slideShowTitle(
        {
          slideshow_id: editData.slideshow_id,
          title: val.title,
        },
        () => {
          handleClose();
          // dispatch(getSlideshow(editData.slideshow_id));
        }
      )
    );
  };
  const {
    setFieldValue,
    resetForm,
    handleSubmit,
    handleChange,
    values,
    errors,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    resetForm();
    if (editData) {
      // setFieldValue("title", slideshowTitle);
      setFieldValue("title", settings.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editData, setFieldValue]);

  return (
    <Modal
      isOpen={isOpen}
      centered
      className="slidr-modal add-video-modal"
      backdrop="static"
    >
      <ModalHeader toggle={onClose}>Rename Slideshow</ModalHeader>
      <form onSubmit={handleSubmit} id="slidr-image-upload-form">
        <ModalBody>
          <Label>Title</Label>
          <div>
            <Input
              id="title"
              name="title"
              type="text"
              className="form-control right-editor-props"
              placeholder="Title"
              onChange={handleChange}
              value={values.title}
              onBlur={handleBlur}
              invalid={errors.title && !!errors.title}
            />
            <FormFeedback>{errors.title}</FormFeedback>
          </div>
        </ModalBody>
        <ModalFooter className="border-0">
          <div className="d-flex text-end gap-3">
            <CommonButton
              btnClass="px-4"
              btnText="Cancel"
              btnClick={onClose}
              btnCancel
            />
            <CommonButton
              btnForm="slidr-image-upload-form"
              btnClass="px-3"
              btnType="submit"
              btnText="Rename"
              // btnClick={onClose}
            />
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default RenameSlideShowTitle;
