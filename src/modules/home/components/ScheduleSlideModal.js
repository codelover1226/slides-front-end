import CommonButton from "components/CommonButton";
import { SCHEDULE_SLIDESHOW_URL } from "helper/url_helper";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { axiosSlidr } from "services/api";
import {
  fetchFeedsSlides,
  setSlideshowScheduleActiveDateTime,
} from "../store/actions";
import { useParams } from "react-router-dom";

const ScheduleActive = ({ scheduleActive, onClose }) => {
  const dispatch = useDispatch();
  const [dateTime, setDateTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const fromFeedId = params;
  useEffect(() => {
    if (scheduleActive.scheduleActiveDateTime) {
      setDateTime(new Date(scheduleActive.scheduleActiveDateTime));
    }
  }, [scheduleActive]);
  const saveScheduleActive = () => {
    if (moment(new Date()).isBefore(dateTime)) {
      setLoading(true);
      const payload = {
        feed_id: scheduleActive.feedId,
        slideshow_id: scheduleActive.slideShowId,
        schedule_active_date_time: moment(dateTime).utc().format(),
      };
      axiosSlidr
        .post(SCHEDULE_SLIDESHOW_URL, payload)
        .then(async res => {
          if (res.status) {
            dispatch(setSlideshowScheduleActiveDateTime(payload));
            setLoading(false);
            toast.success(res.data.message);
            await dispatch(fetchFeedsSlides({ payload: fromFeedId?.id }));
            onClose();
          }
        })
        .catch(err => {
          toast.error(err.response?.data?.message || err.message);
          setLoading(false);
        });
    } else {
      toast.warning("Please select future date time.");
    }
  };
  return (
    <Modal
      className="slidr-modal add-video-modal slidr-slideshow-modal slidr_schedule_modal"
      centered
      isOpen={scheduleActive.mode}
      toggle={onClose}
    >
      <ModalHeader toggle={onClose}>Schedule Activation</ModalHeader>
      <ModalBody className="schedule-slideshow">
        <DateTimePicker
          className="form-control"
          onChange={setDateTime}
          value={dateTime}
          format="MM-dd-y hh:mm a"
          minDate={new Date()}
        />
      </ModalBody>
      <ModalFooter>
        <div className="text-end d-flex">
          <CommonButton
            btnClass="px-4 me-2"
            btnText="Cancel"
            btnClick={onClose}
            btnCancel
          />
          <CommonButton
            btnClass="text-white"
            btnClick={saveScheduleActive}
            btnDisabled={loading}
            btnText={loading ? "Saving..." : "Save"}
          />
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ScheduleActive;
