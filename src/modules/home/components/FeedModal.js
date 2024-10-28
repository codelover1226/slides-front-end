import closeIcon from "assets/images/close.svg";
import CommonButton from "components/CommonButton";
import { useFormik } from "formik";
import { useEffect } from "react";
import { ModalHeader } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FormFeedback, Input, Modal, ModalBody, ModalFooter } from "reactstrap";
import * as Yup from "yup";
import { addUpdateFeed, recentSlideShow } from "../store/actions";
const initialValues = {
  feed_name: "",
};
const validationSchema = Yup.object().shape({
  feed_name: Yup.string().trim().required("Feed name is required"),
});

const FeedModal = ({ isOpen, handleClose, modalType, editData }) => {
  const dispatch = useDispatch();
  const onClose = () => {
    handleClose();
    dispatch(recentSlideShow());
  };
  const { loadingAddUpdateFeed } = useSelector(state => state.Home);

  const onSubmit = val => {
    if ([1, 2, 4].includes(modalType)) {
      dispatch(
        addUpdateFeed({
          payload: {
            feed_id: modalType === 2 || modalType === 4 ? editData?.feed_id : 0,
            title: val.feed_name,
          },
          callBack: () => onClose(),
          isList: modalType === 4 ? true : false,
        })
      );
    }
    //  else {
    //   dispatch(
    //     updateSlideshow({
    //       feed_id: editData.feed_id,
    //       slideshow_id: editData.slideshow_id,
    //       title: val.feed_name,
    //       callBack: () => onClose(),
    //     })
    //   );
    // }
  };
  const {
    setFieldValue,
    resetForm,
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    resetForm();
    if ([2, 4].includes(modalType) && editData) {
      setFieldValue("feed_name", editData.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, isOpen, editData, setFieldValue]);

  return (
    <>
      <Modal
        className="slidr-modal add-edit-slide add-slideshow-modal slidr-slideshow-modal"
        isOpen={isOpen}
        centered
      >
        <ModalHeader className="cursor-pointer">
          <h2>
            {modalType === 1
              ? "Add Feed"
              : modalType === 2 || modalType === 4
              ? "Edit Feed"
              : modalType === 3
              ? "Move Slideshow"
              : ""}
          </h2>
          <img src={closeIcon} alt="" onClick={onClose} />
        </ModalHeader>
        <form>
          <ModalBody>
            <Input
              style={{ boxShadow: "none" }}
              name="feed_name"
              placeholder="Enter Feed Name"
              type="text"
              onChange={handleChange}
              value={values.feed_name}
              invalid={touched.feed_name && !!errors.feed_name}
              onBlur={handleBlur}
              className="form-control right-editor-props"
              id="feed_name"
            />
            <FormFeedback>{errors.feed_name}</FormFeedback>
            {/* <input type="text" className="form-control" /> */}
          </ModalBody>
          <ModalFooter>
            <div className="d-flex text-end gap-3">
              <CommonButton
                btnClass={`common-footer-button`}
                btnText={"Cancel"}
                btnClick={onClose}
                btnCancel
              />
              <CommonButton
                btnClass={`text-white`}
                btnClick={handleSubmit}
                btnDisabled={loadingAddUpdateFeed}
                btnText={
                  loadingAddUpdateFeed
                    ? "Saving..."
                    : modalType === 1
                    ? "Add Feed"
                    : modalType === 2 || modalType === 4
                    ? "Edit Feed"
                    : ""
                }
              />
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default FeedModal;
