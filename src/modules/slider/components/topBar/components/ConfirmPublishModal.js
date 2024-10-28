import CommonButton from "components/CommonButton";
import React from "react";
import { useSelector } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ConfirmPublishModal = ({ isOpen, confirm, onClose }) => {
  const { loadingPublishSlideshow } = useSelector(state => state.Slidr);

  return (
    <Modal
      centered
      isOpen={isOpen}
      backdrop="static"
      className="slidr-modal slidr-background-upload-modal slidr-slideshow-modal slidr-publish-modal"
    >
      <ModalHeader toggle={onClose}>Publish Slideshow</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          Are you sure you finished editing and ready to publish this Slideshow
          on the TV App?
        </div>
        <b>Note: This process will take few minutes to finish.</b>
      </ModalBody>
      <ModalFooter>
        <div className="text-end d-flex gap-3 common-button-responsive-style">
          <CommonButton
            btnClass="px-4"
            btnText="Cancel"
            btnClick={onClose}
            btnCancel
          />
          <CommonButton
            btnClass="publish-size"
            btnText={loadingPublishSlideshow ? "Publishing..." : "Publish"}
            btnClick={confirm}
            btnDisabled={loadingPublishSlideshow}
          />
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmPublishModal;
