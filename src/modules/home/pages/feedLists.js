import duplicateIcon from "assets/images/DuplicateCopy.svg";
import gridViewIcon from "assets/images/ListView.svg";
import deleteIcon from "assets/images/delete.svg";
import menuIcon from "assets/images/ellipsis.svg";
import editIcon from "assets/images/pencil.svg";
// import searchIcon from "assets/images/search.svg";
import listViewIcon from "assets/images/section.svg";
import CommonButton from "components/CommonButton";
import Breadcrumb from "modules/slider/components/Breadcrumb";
import { useEffect, useMemo, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import AddSlideshowModal from "../components/AddSlideshowModal";
import DeleteFeedModal from "../components/DeleteFeedModal";
import FeedModal from "../components/FeedModal";
import { activeDeactiveSlideShow, fetchFeedsSlides } from "../store/actions";
import FeedGridView from "./feedGridView";
import FeedListView from "./feedListView";

const FeedLists = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { feedSlides, sharedDashboardAccess } = useSelector(
    state => state.Home
  );
  const [searchVal, setSearchVal] = useState("");
  const [selected, isSelected] = useState(0);
  const [addSlideshowModalPopup, setAddSlideshowModalPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [openAddFeedModal, setOpenAddFeedModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [modalType, setModalType] = useState(0);
  const [openDeleteFeedModal, setOpenDeleteFeedModal] = useState(false);
  const { user } = useSelector(state => state.Auth);
  const { subscriptionStatus } = useSelector(state => state.Profile);
  useEffect(() => {
    dispatch(fetchFeedsSlides({ payload: parseInt(id) }));
  }, [dispatch, id]);

  // const clickOpenFeed = () => {
  //   setModalType(1);
  //   setOpenAddFeedModal(true);
  // };

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === "Delete") {
        clickDeleteFeed();
      }
    };

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleCloseAddUpdateFeed = () => {
    setOpenAddFeedModal(false);
  };

  const editFeed = feed => {
    setModalType(4);
    setOpenAddFeedModal(true);
    setEditData(feed);
  };

  const clickDeleteFeed = () => {
    setOpenDeleteFeedModal(true);
  };
  const handleCloseDeleteFeed = () => {
    setOpenDeleteFeedModal(false);
  };

  const feedList = useMemo(() => {
    console.log(feedSlides)
    return feedSlides?.gs_slideshows?.filter(item => {
      console.log()
      const query = searchVal?.toLowerCase();

      return (
        item?.title?.toLowerCase().indexOf(query) >= 0 ||
        item?.code?.toLowerCase().indexOf(query) >= 0
      );
    });
  }, [feedSlides, searchVal]);

  const handleSlideStatusChange = (slideshow_id, is_active, feed_id) => {
    const payload = {
      slideshow_id: slideshow_id,
      is_active: is_active ? 0 : 1,
    };
    dispatch(
      activeDeactiveSlideShow({
        payload,
        feed_id,
      })
    );
  };
  const isSubscribed = useMemo(
    () => [1, 2].includes(user?.user_role) || subscriptionStatus,
    [subscriptionStatus, user]
  );

  const handleAddSlideshow = () => {
    if (
      isSubscribed ||
      feedSlides?.gs_slideshows?.length === 0 ||
      sharedDashboardAccess
    ) {
      setAddSlideshowModalPopup(true);
    } else {
      toast.error(
        "You need to purchase subscription before proceeding further"
      );
    }
  };

  const toggle = e => {
    e.preventDefault();
    setDropdownOpen(prevState => !prevState);
  };

  return (
    <div className="right_bar feed-detail-page">
      <Breadcrumb
        data={feedSlides?.title}
        link={`${`/slideshows/${parseInt(id)}`}`}
      />
      <div className="hello_title ">
        FEED: <p className="sub">{feedSlides?.title}</p> Code:{" "}
        <p className="sub">{feedSlides?.code}</p>
         {/* <h1 className="hello_title ">{feedSlides?.title}</h1> */}
      </div>
      <div className="right-main-card">
        <div className="container-fluid">
          <div className="search">
            <div className="d-flex position-relative">
              {/* <input
                type="text"
                label="Search"
                placeholder="Search ..."
                className="pe-5 right-editor-props"
                onChange={e => setSearchVal(e.target.value)}
              />
              <img src={searchIcon} alt="" className="search-icon" /> */}
              <h2>Slideshows</h2>
            </div>
            <div className="d-flex align-items-center justify-content-between text-center folder-code slideshow-button folder-dropdown-menu">
              <div className="d-flex addslideshow d-none">
                <p className="text-center m-auto"> 
                Code: <strong>{feedSlides?.code}</strong>
                </p>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip">Copy</Tooltip>}
                  show={false}
                >
                  <CopyToClipboard
                    text={feedSlides?.code}
                    onCopy={() => {
                      toast.success("Code copied to clipboard");
                    }}
                  >
                    <img
                      className="ms-2 mt-1"
                      src={duplicateIcon}
                      alt="copy"
                      id="CopyTop"
                    />
                  </CopyToClipboard>
                </OverlayTrigger>
              </div>
              <div className="d-flex align-items-center addfeedbtn">
                <div className="feed-menu-section">
                  <button
                    className={`${
                      selected === 0 ? "active" : "bg-transparent"
                    } feed-view-icon`}
                    onClick={() => isSelected(0)}
                  >
                     <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip">List view</Tooltip>}
                    >
                      <img src={gridViewIcon} alt="list view" id="list" />
                    </OverlayTrigger>
                  </button>
                  <button
                    className={`${
                      selected === 1 ? "active" : "bg-transparent"
                    } feed-view-icon`}
                    onClick={() => isSelected(1)}
                  >
                   <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip">Grid view</Tooltip>}
                    >
                      <img src={listViewIcon} alt="grid view" id="grid" />
                    </OverlayTrigger>
                  </button>
                </div>
                {feedSlides?.is_shared ? (
                  <></>
                ) : (
                  <Dropdown
                    className="dropdown-folder dropdown-list dropdown_list_main_home"
                    isOpen={dropdownOpen}
                    toggle={toggle}
                    direction="up"
                  >
                    <DropdownToggle className="folder-menu-icon folder_menu_icon_home">
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="tooltip">Menu</Tooltip>}
                      >
                        <img src={menuIcon} alt="list" id="Menu" />
                      </OverlayTrigger>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        className="d-flex gap-3 mb-3 dropdown-list-item"
                        onClick={e =>
                          editFeed({
                            title: feedSlides?.title,
                            feed_id: feedSlides?.feed_id,
                          })
                        }
                      >
                        <img src={editIcon} alt="edit" />
                        Rename
                      </DropdownItem>
                      <DropdownItem
                        className="d-flex gap-3 text-danger dropdown-list-item"
                        onClick={clickDeleteFeed}
                      >
                        <img src={deleteIcon} alt="delete" />
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
              {feedSlides?.is_shared ? (
                <></>
              ) : (
                <div className="addslideshowbtn">
                  <CommonButton
                    btnClass="text-white slideshowcommonbtn"
                    btnClick={handleAddSlideshow}
                    btnText={"Add Slideshow"}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="search-icon">
            <span></span>
          </div>
        </div>
        {selected === 1 ? (
          <>
            <hr className="feedGridLine" />
            <FeedGridView
              gs_slideshows={feedList}
              handleSlideStatusChange={handleSlideStatusChange}
            />
          </>
        ) : (
          <FeedListView
            data={feedList}
            handleSlideStatusChange={handleSlideStatusChange}
          />
        )}
      </div>

      <AddSlideshowModal
        isOpen={addSlideshowModalPopup}
        onClose={() => setAddSlideshowModalPopup(false)}
        feedId={parseInt(id)}
      />

      <FeedModal
        isOpen={openAddFeedModal}
        handleClose={handleCloseAddUpdateFeed}
        editData={editData}
        modalType={modalType}
      />
      <DeleteFeedModal
        isOpen={openDeleteFeedModal}
        handleClose={handleCloseDeleteFeed}
        id={parseInt(id)}
        type="list"
        feedName={feedSlides?.title || ""}
      />
    </div>
  );
};

export default FeedLists;
