import duplicateIcon from "assets/images/Duplicate.svg";
import deleteIcon from "assets/images/delete.svg";
import downloadIcon from "assets/images/download.svg";
import menuIcon from "assets/images/ellipsis.svg";
import moveIcon from "assets/images/move.svg";
import editIcon from "assets/images/pencil.svg";
import previewIcon from "assets/images/preview.svg";
import scheduleIcon from "assets/images/schedule.svg";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { handleDownloadZip } from "utils";
import {
  copySlideShow,
  deleteFeed,
  deleteSlideShow,
  fetchFeeds,
  fetchFeedsSlides,
} from "../store/actions";
import Alert from "./Alert";
import ScheduleActive from "./ScheduleSlideModal";
import MoveSlideshowModal from "./moveSlideshowModal";

const ActionDropdown = ({ slides, gs_slideshows }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.Auth);
  const { subscriptionStatus } = useSelector(state => state.Profile);
  const { loadingDeleteFeed, loadingDeleteSlideshow, loadingCopySlideshow ,sharedDashboardAccess} =
    useSelector(state => state.Home);
  const [dropdownOpen, setDropdownOpen] = useState({ status: false, id: null });
  const navigate = useNavigate();
  const [alertType, setAlertType] = useState(0);
  const [loadingExport, setLoadingExport] = useState(false);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [deleteSlideShowIds, setDeleteSlideShowIds] = useState({
    feed_id: 0,
    slideshow_id: 0,
  });
  const [deleteFeedId] = useState(0);
  const [fromSlideshowId, setFromSlideshowId] = useState(0);
  const [fromFeedId, setFromFeedId] = useState(0);
  const [scheduleActive, setScheduleActive] = useState({
    mode: false,
    slideShowId: 0,
    feedId: 0,
  });
  const [openMoveSlideshowModal, setOpenMoveSlideshowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const isSubscribed = useMemo(
    () => [1, 2].includes(user?.user_role) || subscriptionStatus,
    [subscriptionStatus, user]
  );

  const redirectingToSubscription = () => {
    toast.error("You need to purchase subscription before proceeding further");
    navigate("/subscription");
  };

  const clickDeleteSlideShow = (feed_id, slideshow_id) => {
    setAlertType(2);
    setConfirmAlert(true);
    setDeleteSlideShowIds({
      feed_id: feed_id,
      slideshow_id: slideshow_id,
    });
    setFromFeedId(feed_id);
  };

  const clickCopySlideShow = ({ feed_id, slideshow_id, slideshow_length }) => {
    if (isSubscribed || slideshow_length === 0 || sharedDashboardAccess) {
      setEditData({
        feed_id,
        slideshow_id,
      });
      setFromFeedId(feed_id);
      setConfirmAlert(true);
      setAlertType(3);
    } else {
      redirectingToSubscription();
    }
  };

  const moveSlideshow = ({ slideShowId, feedId, slideshowLength }) => {
    if (isSubscribed || slideshowLength === 0) {
      setFromSlideshowId(slideShowId);
      setFromFeedId(feedId);
      setOpenMoveSlideshowModal(true);
      dispatch(fetchFeeds());
    } else {
      redirectingToSubscription();
    }
  };

  const handleExport = ss => {
    if (!ss.published_datetime) {
      toast.warning(
        "Please publish this slideshow before you export the slides."
      );
      return;
    }
    const fileTitle = ss.title;
    setLoadingExport(true);
    handleDownloadZip(
      fileTitle,
      ss.slideshow_id,
      (_, err) => {
        setLoadingExport(false);
        if (!!err) {
          toast.error(err.response?.data?.message || err.message);
          return;
        }
      },
      percent => {}
    );
  };

  const confirmed = () => {
    if (alertType === 1) {
      dispatch(deleteFeed({ feed_id: deleteFeedId, callBack: onCloseAlert }));
    } else if (alertType === 2) {
      dispatch(
        deleteSlideShow({
          feed_id: deleteSlideShowIds.feed_id,
          slideshow_id: deleteSlideShowIds.slideshow_id,
          callBack: onCloseAlert,
        })
      );
    } else if (alertType === 3) {
      dispatch(
        copySlideShow({
          feed_id: editData.feed_id,
          slideshow_id: editData.slideshow_id,
          callBack: onCloseAlert,
        })
      );
    }
  };

  const onCloseAlert = () => {
    setConfirmAlert(false);
    setAlertType(0);
    dispatch(fetchFeedsSlides({ payload: fromFeedId }));
  };

  // const clickActiveDeActiveSlideshow = ({
  //   is_active,
  //   feed_id,
  //   slideshow_id,
  // }) => {
  //   dispatch(
  //     activeDeActiveSlideshow({
  //       slideshow_id: slideshow_id,
  //       feed_id: feed_id,
  //       is_active: is_active,
  //     })
  //   );
  // };

  return (
    <>
      <ScheduleActive
        scheduleActive={scheduleActive}
        onClose={() =>
          setScheduleActive({
            mode: false,
            slideShowId: 0,
            feedId: 0,
            scheduleActiveDateTime: "",
          })
        }
      />
      <Dropdown
        className="dropdown-folder feed-slider feed-dropdown-button action_dropdown_home"
        isOpen={
          dropdownOpen.status && dropdownOpen.id === slides.slideshow_id
            ? true
            : false
        }
        toggle={() =>
          setDropdownOpen({
            status: !dropdownOpen.status,
            id: slides.slideshow_id,
          })
        }
        direction="end"
      >
        <DropdownToggle className="folder-menu-icon p-0">
          {/* <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip">Menu</Tooltip>}
        > */}
          <img src={menuIcon} alt="list" id="menu" />
          {/* </OverlayTrigger> */}
        </DropdownToggle>
        <DropdownMenu style={{ width: "187px" }}>
          <DropdownItem
            className="d-flex gap-2 dropdownitem"
            onClick={() =>
              clickCopySlideShow({
                feed_id: slides.feed_id,
                slideshow_length: gs_slideshows.length,
                slideshow_id: slides.slideshow_id,
              })
            }
          >
            <img src={duplicateIcon} alt="duplicate" />
            Duplicate
          </DropdownItem>
          <DropdownItem
            className="d-flex gap-2 dropdownitem"
            onClick={() => navigate(`/slidr/${slides.slideshow_id}`)}
          >
            <img src={editIcon} alt="edit" />
            Edit
          </DropdownItem>
          <DropdownItem
            className="d-flex gap-2 dropdownitem"
            // disabled={isFeedOne}
            onClick={() => {
              moveSlideshow({
                slideShowId: slides.slideshow_id,
                slideshowLength: slides.length,
                feedId: slides.feed_id,
              });
            }}
          >
            <img src={moveIcon} alt="move" />
            Move
          </DropdownItem>
          <DropdownItem
            className="d-flex gap-2 dropdownitem"
            onClick={() => window.open(`/slide-show-preview/${slides.slideshow_id}`)}
          >
            <img src={previewIcon} alt="preview" />
            Preview
          </DropdownItem>
          <DropdownItem
            className="d-flex gap-2 dropdownitem"
            toggle={false}
            onClick={() => handleExport(slides)}
            disabled={loadingExport}
          >
            <img src={downloadIcon} alt="export" />
            Export Slides
          </DropdownItem>
          <DropdownItem
            className="d-flex gap-2 dropdownitem"
            toggle={false}
            disabled={!!slides.is_active}
            onClick={() =>
              setScheduleActive({
                mode: true,
                slideShowId: slides.slideshow_id,
                scheduleActiveDateTime: slides.schedule_active_date_time,
                feedId: slides.feed_id,
              })
            }
          >
            <img src={scheduleIcon} alt="export" />
            Schedule Activation
          </DropdownItem>
          <DropdownItem
            className="d-flex gap-2 dropdownitem text-danger"
            onClick={
              () => clickDeleteSlideShow(slides.feed_id, slides.slideshow_id)
              // clickDelete(slides.feed_id)
            }
          >
            <img src={deleteIcon} alt="delete" />
            Delete
          </DropdownItem>
        </DropdownMenu>
        <Alert
          isOpen={confirmAlert}
          onClose={onCloseAlert}
          confirmed={confirmed}
          redBtn={[1, 2].includes(alertType) ? true : false}
          loading={
            alertType === 1
              ? loadingDeleteFeed
              : alertType === 2
              ? loadingDeleteSlideshow
              : loadingCopySlideshow
          }
          alertHeaderText={
            alertType === 1
              ? "Delete Feed"
              : alertType === 2
              ? "Delete Slideshow"
              : "Duplicate Slideshow "
          }
          alertDescriptionText={`Are you sure you want to ${
            alertType === 1
              ? "Delete Feed"
              : alertType === 2
              ? "Delete Slideshow"
              : "Duplicate Slideshow"
          }?`}
        />
        <MoveSlideshowModal
          isOpen={openMoveSlideshowModal}
          onClose={() => setOpenMoveSlideshowModal(false)}
          fromSlideshowId={fromSlideshowId}
          fromFeedId={fromFeedId}
        />
      </Dropdown>
    </>
  );
};

export default ActionDropdown;
