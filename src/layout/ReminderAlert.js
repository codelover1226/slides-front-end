import React, { useState } from "react";
import { get, set } from "services/cookies";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import CommonButton from "components/CommonButton";

const ReminderPopupModel = ({
  handleSecurityClick,
  handleSecuritySetup,
  currDate,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const onCloseReminder = user_subscription_id => {
    let pData = get("securityPaymentCloseArr") || {};
    pData[user_subscription_id] = (pData[user_subscription_id] || 0) + 1;
    set("securityPaymentCloseArr", pData);
    handleSecurityClick(user_subscription_id);
    setIsOpen(false);
    //onClose()
  };

  const setupNow = () => {
    window.location.replace(
      process.env.REACT_APP_ACCOUNT_SITE_URL + "?security_question=true"
    );
    handleSecuritySetup(1);
    setIsOpen(false);
    //onClose()
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        className="slidr-modal slidr-background-upload-modal slidr-slideshow-modal slidr-publish-modal"
      >
        <ModalHeader toggle={onClose}>Reminder Alert</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            You can now set up your security question and answer to help you in
            case you forget your password.
          </div>
          {/* {" "}
          <span className="btn-link cursor-pointer" onClick={openChatmsg}>
            HERE
          </span>{" "}
          ! */}
        </ModalBody>
        <ModalFooter>
          <div className="text-end d-flex gap-3 common-button-responsive-style">
            <CommonButton
              btnClass="px-4"
              btnText="Maybe Next Time"
              btnClick={e => onCloseReminder(1 + currDate)}
            />
            <CommonButton
              btnText="Setup now"
              btnClick={e => setupNow()}
              btnClass="publish-size"
            />
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ReminderPopupModel;
