import closeIcon from "assets/images/close.svg";
import CustomDropZone from "common/CustomDropZone/CustomDropZone";
import useDebounce from "hooks/useDebounce";
import Alert from "modules/home/components/Alert";
import { savePlaylist, setActivePlayList } from "modules/slider/store/actions";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Row } from "reactstrap";
import playicon from "assets/images/play.svg";

const array_move = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};

const AddPlaylistBar = ({ slides }) => {
  const musicRef = useRef();
  const dispatch = useDispatch();
  const { loadingDeleteSlide } = useSelector(state => state.Slidr);
  const [tabType, setTabType] = useState(0);
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [musicArray, setMusicArray] = useState([]);
  const debouncedSave = useDebounce(musicArray, 5000);
  const { playlistArray } = useSelector(state => state.Slidr);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [hoveredSong, setHoveredSong] = useState(null);
  const [isOpenAlert, setIsOpenAlert] = useState({ open: false, data: "" });
  useEffect(() => {
    if (!!debouncedSave && Array.isArray(debouncedSave)) {
      dispatch(
        savePlaylist({
          audio: debouncedSave,
          autoplay: isAutoPlay,
          is_playlist: isPlaylist,
        })
      );
    }
  }, [debouncedSave, dispatch, isAutoPlay, isPlaylist]);

  useEffect(() => {
    setMusicArray(playlistArray.audio || []);
    setIsPlaylist(playlistArray.is_playlist);
    setIsAutoPlay(playlistArray.autoplay || true);
  }, [playlistArray]);

  const onDragEnd = useCallback(({ source, destination }) => {
    setMusicArray(prev =>
      array_move([...prev], source.index, destination.index)
    );
  }, []);

  const confirmed = () => {
    setMusicArray(prev => {
      return prev.filter(item => item !== isOpenAlert.data);
    });
    setIsOpenAlert({ open: false, data: "" });
    toast.success("Music Deleted successfully");
  };

  const handleDelete = music => {
    setIsOpenAlert({ open: true, data: music });
  };

  return (
    <>
      <Card className="shadow-sm bg-light-gray slidr-right-bar">
        <CardBody>
          <Row>
            <Col sm={12}>
              <div className="custom-switch-row d-flex align-items-center justify-content-between playlist-custom-switch">
                <h4 className="mb-0 mx-2" htmlFor="is_arrow">
                  Playlist
                </h4>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip">Close</Tooltip>}
                >
                  <img
                    className="cursor-pointer"
                    id="Close"
                    onClick={() => dispatch(setActivePlayList(false))}
                    src={closeIcon}
                    alt="close"
                    height={15}
                    width={15}
                  />
                </OverlayTrigger>
              </div>
              <hr className="bg-light" />
              <div className="custom-switch-row d-flex align-items-center justify-content-between">
                <p className="mb-0" htmlFor="is_arrow">
                  You want to add playlist?
                </p>
                <div className="form-check form-switch form-switch-md custom-switch ms-1">
                  <input
                    // disabled={isUploading}
                    type="checkbox"
                    className="form-check-input cursor-pointer"
                    id="is_arrow"
                    checked={isPlaylist}
                    onChange={e => {
                      setIsPlaylist(!isPlaylist);
                    }}
                  />
                </div>
              </div>

              <div className="playlist-tab playlist-modal-menu-tab">
                <ul className="nav">
                  <li className="nav-item" onClick={() => setTabType(0)}>
                    <div
                      className={`nav-link ${
                        tabType === 0 ? "active" : "non-active"
                      }`}
                    >
                      Library
                    </div>
                  </li>
                  <li className="nav-item" onClick={() => setTabType(1)}>
                    <div
                      className={`nav-link ${
                        tabType === 1 ? "active" : "non-active"
                      }`}
                    >
                      Upload Music
                    </div>
                  </li>
                </ul>
              </div>

              {tabType === 0 ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <ul
                        className="payListArray mt-2"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {!!musicArray.length ? (
                          musicArray.map((music, index) => {
                            return (
                              <React.Fragment key={"test_" + index}>
                                <Draggable
                                  draggableId={"list_" + index}
                                  index={index}
                                >
                                  {provided => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <li
                                          className="play-item"
                                          onMouseEnter={() => {
                                            if (window.innerWidth > 1180) {
                                              setHoveredSong(index);
                                            }
                                          }}
                                          onMouseLeave={() => {
                                            if (window.innerWidth > 1180) {
                                              setHoveredSong(null);
                                            }
                                          }}
                                        >
                                          {/* <i className="bx bx-play"></i> */}
                                          <img src={playicon} alt="img"></img>
                                          <div style={{ width: "100%" }}>
                                            <span>
                                              {music?.split("music/")[1]}
                                            </span>
                                          </div>

                                          {hoveredSong === index ||
                                          window.innerWidth < 1180 ? (
                                            <div
                                              className="playlist-remove"
                                              onClick={() =>
                                                handleDelete(music)
                                              }
                                            >
                                              <i
                                                className="bx bx-trash small text-danger me-2"
                                                id="Delete"
                                              />
                                            </div>
                                          ) : null}
                                        </li>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <div className="d-flex justify-content-center text-muted">
                            No music found in library
                          </div>
                        )}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <CustomDropZone
                  ref={musicRef}
                  multiple={true}
                  type="music"
                  src={""}
                  handleOnDrop={url => {
                    setMusicArray(prev => [...prev, url]);
                    setTabType(0);
                    toast.success("Music added successfully");
                  }}
                  // accept=".mp3"
                  accept={{ "audio/*": [] }}
                  folderName={process.env.REACT_APP_AWS_FOLDER_MUSIC}
                  bucketName={process.env.REACT_APP_AWS_BUCKET_SLIDR}
                  error={false}
                  errorMessage={"errors.video"}
                  showPreview={false}
                  handleSwitch={() => {}}
                  handleKeyUp={() => {}}
                  isUploadingFile={isUploadingFile}
                  setIsUploadingFile={setIsUploadingFile}
                />
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Alert
        isOpen={isOpenAlert.open}
        onClose={() => setIsOpenAlert(isOpenAlert.data)}
        alertHeaderText="Delete Music"
        confirmed={confirmed}
        alertDescriptionText="Are you sure you want to delete this Music?"
        loading={loadingDeleteSlide}
        isDelete
      />
    </>
  );
};

export default AddPlaylistBar;
