import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomDropZone from "common/CustomDropZone/CustomDropZone";
import CommonButton from "components/CommonButton";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addImage } from "modules/slider/store/actions";

const AddImageModal = forwardRef((_, ref) => {
  const initialValues = {
    img: "",
  };

  const validationSchema = Yup.object().shape({
    img: Yup.string().required("Image is required."),
  });
  const dispatch = useDispatch();
  const imageRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
    }),
    []
  );

  const onSubmit = values => {
    if (!!imageRef.current?.isUploading) {
      toast.warning("Please wait while image is uploading...");
      return true;
    }
    dispatch(addImage(values.img));
    onClose();
  };

  const onClose = () => {
    if (!!imageRef.current?.isUploading) {
      toast.warning("Please wait while image is uploading...");
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

  return (
    <Modal
      isOpen={isOpen}
      centered
      className="slidr-modal add-video-modal slidr-slideshow-modal img_upload_modal_main"
      backdrop="static"
    >
      <ModalHeader toggle={onClose}>Upload Image</ModalHeader>
      <form onSubmit={handleSubmit} id="slidr-image-upload-form">
        <ModalBody>
          <CustomDropZone
            ref={imageRef}
            type="image"
            src={values.img}
            handleOnDrop={url => {
              setFieldValue("img", url);
            }}
            // accept=".jpg,.jpeg,.png,.gif"
            accept={{ "image/*": [] }}
            folderName={process.env.REACT_APP_AWS_FOLDER_IMAGES}
            bucketName={process.env.REACT_APP_AWS_BUCKET_SLIDR}
            error={!!errors.img}
            errorMessage={errors.img}
            withBottomMargin={false}
            setIsUploadingFile={() => {}}
          />
          {!!errors.img && (
            <FormFeedback className="d-flex">{errors.img}</FormFeedback>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="d-flex text-end gap-3">
            <CommonButton
              btnClass="px-4"
              btnText="Cancel"
              btnClick={() => setIsOpen(false)}
              btnCancel
            />
            <CommonButton
              btnForm="slidr-image-upload-form"
              btnClass="px-3"
              btnType="submit"
              btnText="Upload Image"
            />
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
});

export default AddImageModal;
