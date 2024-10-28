import React from "react";
import { ModalHeader } from "react-bootstrap";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import closeIcon from "assets/images/close.svg";
import { useDispatch } from "react-redux";
import { deleteFeed } from "../store/actions";
import { useNavigate } from "react-router-dom";
import CommonButton from "components/CommonButton";
const DeleteFeedModal = ({
  isOpen,
  handleClose,
  id,
  type = "",
  feedName = "",
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onClose = () => {
    handleClose();
  };

  const clickDelete = feed_id => {
    dispatch(deleteFeed({ feed_id: feed_id, callBack: onClose }));
    if (type === "list") {
      navigate("/");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        className="slidr-modal add-video-modal slidr-slideshow-modal"
        centered
        backdrop="static"
      >
        <ModalHeader className="cursor-pointer border-bottom-0">
          <h2>Delete Feed</h2>
          <img src={closeIcon} alt="" onClick={onClose} />
        </ModalHeader>
        <form>
          <ModalBody>
            <p>
              Are you sure you want to delete <strong>"{feedName}"</strong>{" "}
              feed?
            </p>
          </ModalBody>
          <ModalFooter className="border-top-0">
            <div className="d-flex text-end gap-3 delete-btn-style">
              <CommonButton
                btnClass="px-3"
                btnText="No, Cancel"
                btnClick={onClose}
                btnCancel
              />
              <Button
                className="btn btn-danger"
                color="white"
                onClick={() => clickDelete(id)}
              >
                Yes, I Am Sure
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default DeleteFeedModal;
