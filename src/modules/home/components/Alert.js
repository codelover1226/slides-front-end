import CommonButton from "components/CommonButton";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const Alert = ({
  onClose,
  isOpen,
  confirmed,
  loading,
  alertHeaderText,
  alertDescriptionText,
  confirmBtn = true,
  redBtn = true,
  redBtnOops = false,
  confirmBtnOops = false,
  fromSlideShowSetting,
  isDelete = false,
  btnClick,
}) => {
  return (
    <Modal
      centered
      isOpen={isOpen}
      backdrop="static"
      className={`slidr-modal add-video-modal add-video-alert-modal ${
        isDelete ? "delete-modal" : ""
      }`}
    >
      <ModalHeader toggle={onClose}>{alertHeaderText}</ModalHeader>
      <ModalBody className="m-0">
        {alertDescriptionText}{" "}
        {fromSlideShowSetting && (
          <div className="mt-4">
            <p>
              <b>
                <span className="text-theme">Note:</span>
              </b>
              If you are changing this size after preparing all slides then it
              maybe possible that your contents position get change according to
              presentation size and won't look proper. So you have to
              rearrange/resize them manually.
            </p>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="border-top-0 delete-slideshow-responsive">
        {redBtn && (
          <CommonButton
            btnClass="px-3"
            btnText="No, Cancel"
            btnClick={onClose}
            btnCancel
          />
        )}
        {redBtnOops && (
          <CommonButton
            btnClass="px-3"
            btnText="Cancel"
            btnClick={onClose}
            btnCancel
          />
        )}
        {confirmBtnOops && (
          <CommonButton
            btnClass="alertStyle"
            btnText="Add A New Slide"
            btnClick={btnClick}
            //className={`alertStyle`}
          />
        )}
        {confirmBtn && (
          <button
            className={`text-white ${redBtn ? "btn btn-danger" : ""}  `}
            //btnClick={confirmed}
            disabled={loading}
            //btnText={loading ? "Loading..." : alertHeaderText}
            onClick={confirmed}
          >
            {loading
              ? "Loading..."
              : redBtn
              ? "Yes, I Am Sure"
              : alertHeaderText}
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
};
export default Alert;
