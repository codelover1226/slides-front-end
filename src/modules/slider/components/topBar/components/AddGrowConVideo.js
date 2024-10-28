import {
  GET_ALL_GROW_CON_FOLDER,
  GET_GROWCON_VIDEOS_URL,
} from "helper/url_helper";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import ModalVideo from "react-modal-video";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { UncontrolledTooltip } from "reactstrap";
import { axiosAdmin } from "services/api";
import { videoField, replaceVideoField } from "modules/slider/store/actions";
import { handleAddKidsMusicLibrary } from "store/actions";
const sizePerPage = 10;

const AddGrowConVideo = ({ slideshow_id, onClose, type, slideId }) => {
  const [Videos, setVideos] = useState({ count: 0, rows: [] });
  const [loading, setLoading] = useState(false);
  const previewRef = useRef();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [folderList, setFolderList] = useState([]);
  const [active, setActive] = useState(1);

  const fetchFolder = async () => {
    try {
      const response = await axiosAdmin(GET_ALL_GROW_CON_FOLDER);
      if (!!response?.data) {
        setFolderList(response?.data?.data);
        if (response?.data?.data.length > 0)
          setActive(response?.data?.data[0]?.grow_con_folder_id);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something want's wrong!!"
      );
    }
  };

  useEffect(() => {
    fetchFolder();
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      if (+page === 1) setLoading(true);
      const payload = {
        search: "",
        page_no: page,
        page_record: sizePerPage,
        grow_con_folder_id: +active,
      };

      if (+active === 11) {
         await dispatch(handleAddKidsMusicLibrary());
       }

      const res = await axiosAdmin.post(GET_GROWCON_VIDEOS_URL, payload);
      if (!!res?.data) {
        setLoading(false);
        setVideos(prev => {
          return {
            count: res?.data?.data?.count,
            rows:
              page === 1
                ? res?.data?.data?.rows
                : [...prev?.rows, ...res?.data?.data?.rows],
          };
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something want's wrong!"
      );
    }
  }, [active,dispatch, page]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleAddVideo = video => {
    // dispatch(
    //   videoField({
    //     payload: {
    //       slideshow_id: slideshow_id,
    //       videoUrl: video.video_url,
    //       videoPreviewImageUrl: video?.thumbnail_url,
    //     },
    //   })
    // );
    // onClose();
    if (+type === 0) {
      dispatch(
        replaceVideoField({
          payload: {
            slideshow_id: slideshow_id,
            videoUrl: video.video_url,
            videoPreviewImageUrl: video?.thumbnail_url,
            slideId: slideId.id,
          },
        })
      );
    } else {
      dispatch(
        videoField({
          payload: {
            slideshow_id: slideshow_id,
            videoUrl: video.video_url,
            videoPreviewImageUrl: video?.thumbnail_url,
          },
        })
      );
    }

    onClose();
  };

  const handlePreview = video => {
    previewRef?.current?.handlePreview(video);
  };

  const next = () => {
    setPage(prev => prev + 1);
  };

  const hasMore = useMemo(
    () => sizePerPage * page < Videos?.count,
    [page, Videos?.count]
  );

  return (
    <div className="mt-3 h-75">
      <div>
        {folderList?.length > 0 ? (
          <div className="d-flex justify-content-start mb-2">
            <select
              className="form-select w-100"
              value={active}
              onChange={e => setActive(e.target.value)}
            >
              {folderList?.map(item => {
                return (
                  <option value={item?.grow_con_folder_id}>
                    {item?.folder_name}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <></>
        )}
        {loading ? (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center loader-test-center">
            <div>
              <Spinner
                animation="border"
                className="me-1"
                role="status"
                size="sm"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              Loading...
            </div>
          </div>
        ) : !loading && Videos?.count === 0 ? (
          <div className="w-100 h-100 d-flex justify-content-center align-items-center loader-test-center">
            Video not Found!!
          </div>
        ) : (
          <div className="d-flex">
            <div
              className="GrowCon-video-parent w-100"
              id="scrollableDiv"
              style={{
                height: "405px",
                overflow: "auto",
              }}
            >
              <InfiniteScroll
                dataLength={Videos?.count || 0}
                next={next}
                hasMore={hasMore}
                loader={
                  <div className="text-center">
                    <Spinner
                      animation="border"
                      className="me-1"
                      role="status"
                      size="sm"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    Loading...
                  </div>
                }
                scrollableTarget="scrollableDiv"
              >
                <Row>
                  {Videos?.rows?.map(item => (
                    <VideoCard
                      type={type}
                      videoData={item}
                      handleAddVideo={handleAddVideo}
                      handlePreview={handlePreview}
                      key={item?.grow_con_video_id}
                    />
                  ))}
                </Row>
                <div className="d-none"></div>
              </InfiniteScroll>
            </div>
          </div>
        )}
      </div>
      <PreviewVideo ref={previewRef} />
    </div>
  );
};

export default AddGrowConVideo;

const PreviewVideo = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [video, setVideo] = useState(null);

  const handleVideoModel = useCallback(() => {
    if (isOpen) setVideo(null);
    setIsOpen(prev => !prev);
  }, [isOpen]);

  useImperativeHandle(
    ref,
    () => ({
      handlePreview(data) {
        setVideo(data);
        handleVideoModel(true);
      },
    }),
    [handleVideoModel]
  );

  const videoMeta = useMemo(() => {
    const currentSlide = video?.video_url;
    if (!!currentSlide) {
      const videoUrl = currentSlide;
      const type = currentSlide.includes("youtube.com")
        ? "youtube"
        : currentSlide.includes("vimeo.com")
        ? "vimeo"
        : "custom";
      if (["youtube", "vimeo"].includes(type))
        return {
          videoId: videoUrl.split("/").pop(),
          channel: type,
        };
      else
        return {
          url: videoUrl,
          channel: type,
        };
    } else return null;
  }, [video?.video_url]);

  useEffect(() => {
    if (isOpen && videoMeta?.videoId?.includes("?")) {
      window.open(video?.video_url, "_blank");
      handleVideoModel(false);
    }
  }, [handleVideoModel, isOpen, video?.video_url, videoMeta?.videoId]);

  return videoMeta?.videoId?.includes("?") ? (
    <></>
  ) : (
    <ModalVideo
      {...videoMeta}
      isOpen={isOpen}
      onClose={() => handleVideoModel(false)}
      allowFullScreen={true}
    />
  );
});

const VideoCard = ({ type, videoData, handleAddVideo, handlePreview }) => {
  return (
    <Col lg={4} md={4} sm={6} xs={6} className="p-2">
      <div className="thumbnail-parent">
        <img
          src={videoData?.thumbnail_url}
          className="video-thumbnail"
          alt=""
        />
        <div className="video_hover">
          <button
            type="button"
            onClick={() => handleAddVideo(videoData)}
            id="plus-btn"
            className="btn btn-video btn-add"
          >
            <i class="fa-solid fa-plus"></i>

            {+type !== 0 ? (
              <UncontrolledTooltip target={`plus-btn`}>
                Add Video
              </UncontrolledTooltip>
            ) : (
              <UncontrolledTooltip target={`plus-btn`}>
                Replace Video
              </UncontrolledTooltip>
            )}
          </button>
          <button
            type="button"
            onClick={() => handlePreview(videoData)}
            id="preview-btn"
            className="btn btn-video btn-preview"
          >
            <i class="fa-solid fa-play"></i>
            <UncontrolledTooltip target={`preview-btn`}>
              Preview Video
            </UncontrolledTooltip>
          </button>
        </div>
      </div>
      <p className="video-title">{videoData?.title}</p>
    </Col>
  );
};
