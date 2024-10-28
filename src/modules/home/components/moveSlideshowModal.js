import folderIcon from "assets/images/folder.svg";
import CommonButton from "components/CommonButton";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { fetchFeedsSlides, moveSlideshow } from "../store/actions";

const MoveSlideshowModal = ({
  isOpen,
  onClose,
  fromFeedId,
  fromSlideshowId,
}) => {
  const dispatch = useDispatch();

  const { feeds, loadingMoveSlideshow } = useSelector(state => state.Home);
  const [checkedSlide, setCheckedSlide] = useState(0);

  const feedsOption = useMemo(
    () =>
      feeds && feeds?.length
        ? feeds
            .filter(feed => ![fromFeedId].includes(feed.feed_id))
            .map(feed => ({
              label: feed.title,
              value: feed.feed_id,
              size: feed.gs_slideshows.length,
            }))
        : "",
    [feeds, fromFeedId]
  );

  const onSubmit = () => {
    dispatch(
      moveSlideshow({
        from_feed_id: fromFeedId,
        to_feed_id: checkedSlide,
        slideshow_id: fromSlideshowId,
        callback: handleClose,
      })
    );
  };

  const handleClose = () => {
    dispatch(fetchFeedsSlides({ payload: fromFeedId }));
    onClose();
  };
  return (
    <Modal centered isOpen={isOpen} backdrop="static" size="md">
      <ModalHeader toggle={handleClose}>Move Slideshow</ModalHeader>
      <ModalBody className="slideshow-modelbody">
        {!!feedsOption ? (
          feedsOption?.map(feed => (
            <div
              className="feeds-move-to cursor-pointer"
              key={feed.value}
              onClick={() => setCheckedSlide(feed.value)}
            >
              <div className="folder-wrapper d-flex">
                <img src={folderIcon} alt="" />
                <div className="d-block ms-3">
                  <h6 className="mb-0">{feed.label}</h6>
                  <span className="slide-size">{feed.size} slides</span>
                </div>
                <input
                  className="checked-slide--move-radio"
                  type="radio"
                  checked={checkedSlide === feed.value ? true : false}
                />
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </ModalBody>
      <ModalFooter>
        <div>
          <CommonButton
            btnClass="text-white move-footer-button"
            btnClick={onSubmit}
            btnDisabled={
              checkedSlide === 0 || loadingMoveSlideshow ? true : false
            }
            btnText={loadingMoveSlideshow ? "Moving..." : "Move Slideshow"}
          />
        </div>
      </ModalFooter>
    </Modal>
  );
};
export default MoveSlideshowModal;
