import CommonButton from "components/CommonButton";
import { useFormik } from "formik";
import { SAVE_SLIDE_SHOW_HISTORY } from "helper/url_helper";
import { fetchSlideShowHistory } from "modules/slider/store/actions";
import moment from "moment/moment";
import { useEffect } from "react";
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
import { axiosSlidr } from "services/api";
import * as Yup from "yup";

const initialValues = {
  name: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
});

const AddManualHistoryModal = ({
  isOpen,
  handleClose,
  slideshow_id,
  setEditHistoryTitle,
}) => {
  const dispatch = useDispatch();

  const { slides } = useSelector(state => state.Slidr);
  const onClose = () => {
    handleClose();
  };

  const onSubmit = async val => {
    try {
      const currTime = moment().format("DD MMM, YYYY h:mm:s a");
      const payload = {
        slideshow_id: slideshow_id,
        title: val.name || `New Point ` + currTime,
        description: JSON.stringify(slides),
        state: "1",
      };
      const res = await axiosSlidr.post(SAVE_SLIDE_SHOW_HISTORY, payload);
      if (res.status === 200) {
        dispatch(fetchSlideShowHistory(slideshow_id));
        setEditHistoryTitle({ status: false });
        resetForm();
        onClose();
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const { resetForm, handleSubmit, handleChange, values, errors, handleBlur } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });

  useEffect(() => {
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      centered
      className="slidr-modal add-video-modal"
      backdrop="static"
    >
      <ModalHeader toggle={onClose}>Create Manual History</ModalHeader>
      <form onSubmit={handleSubmit} id="slidr-image-upload-form">
        <ModalBody>
          <Label>Create manual history</Label>
          <div>
            <Input
              id="name"
              name="name"
              type="text"
              className="form-control right-editor-props"
              placeholder="Name"
              onChange={handleChange}
              value={values.title}
              onBlur={handleBlur}
              invalid={errors.name && !!errors.name}
            />
            <FormFeedback>{errors.name}</FormFeedback>
          </div>
        </ModalBody>
        <ModalFooter className="border-0 history-modal-footer">
          <div className="d-flex text-end gap-3 common-manual-history-button">
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
              btnText="Create"
            />
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AddManualHistoryModal;
