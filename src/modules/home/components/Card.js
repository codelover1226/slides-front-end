import copyIcon from "assets/images/DuplicateCopy.svg";
import deleteIcon from "assets/images/delete.svg";
import menuIcon from "assets/images/ellipsis.svg";
import folderIcon from "assets/images/folder_closed.svg";
import editIcon from "assets/images/pencil.svg";
import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import DeleteFeedModal from "./DeleteFeedModal";
const Card = ({ feed, editFeed, className }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const [openDeleteFeedModal, setOpenDeleteFeedModal] = useState(false);
  const clickDeleteFeed = () => {
    setOpenDeleteFeedModal(true);
  };
  const handleCloseDeleteFeed = () => {
    setOpenDeleteFeedModal(false);
  };

  return (
    <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
      <div
        className={`feed-card ${className}`}
        style={{ backgroundColor: "#F2F3F5" }}
      >
        <div
          className="folder-up"
          key={feed.feed_id}
          onClick={() =>
            navigate(`slideshows/${feed.feed_id}`, {
              state: { data: feed },
            })
          }
        >
          <div className="folder-wrapper">
            <span className="folder-icon">
              <img src={folderIcon} alt="" />
            </span>
          </div>
          <h4 className="folder-title">{feed?.title}</h4>
          <p className="folder-subtitle">
            
            {feed?.slideshows_count}{" "}

            {feed?.slideshows_count > 1 ? "slideshows" : "slideshow"}
          </p>
        </div>
        <div className="folder-down">
          <>
            <hr />
            <div className="folder-tag-header d-flex align-items-center justify-content-between">
              <div className="folder-code">
                Code: <strong>{feed?.code}</strong>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip">Copy</Tooltip>}
                >
                  <CopyToClipboard
                    text={feed?.code || "test"}
                    onCopy={() => {
                      toast.success("Code copied to clipboard");
                    }}
                  >
                    <img
                      className="ms-2 mb-1"
                      src={copyIcon}
                      alt="copy"
                      id="CopyIcon"
                    />
                  </CopyToClipboard>
                </OverlayTrigger>
              </div>
              {feed?.is_shared ? (
                <></>
              ) : (
                <Dropdown
                  // className="dropdown-folder"
                  className={`dropdown-folder p-0 ${
                    dropdownOpen ? "active" : ""
                  }`}
                  isOpen={dropdownOpen}
                  toggle={toggle}
                  direction="up"
                >
                  <DropdownToggle className="folder-menu-icon p-0">
                    {/* <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip">Menu</Tooltip>}
                  > */}
                    <img src={menuIcon} alt="list" />
                    {/* </OverlayTrigger> */}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      className="d-flex gap-3 mb-3"
                      onClick={e => editFeed(feed)}
                    >
                      <img src={editIcon} alt="edit" />
                      Rename
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex gap-3 text-danger"
                      onClick={clickDeleteFeed}
                    >
                      <img src={deleteIcon} alt="delete" />
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </>
        </div>
        <DeleteFeedModal
          isOpen={openDeleteFeedModal}
          handleClose={handleCloseDeleteFeed}
          id={feed.feed_id}
          feedName={feed?.title || ""}
        />
      </div>
    </div>
  );
};

export default Card;
