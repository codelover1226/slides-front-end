import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { fetchSlideShowHistory, getSlideshow } from "./store/actions";
import useWindowSize from "hooks/useWindowSize";
import { useLocation } from "react-router";
import CenterBar from "./components/centerBar";
import VideoPreview from "./components/centerBar/videoPreview";
import LeftBar from "./components/leftBar";
import RightBar from "./components/rightBar";
import Settings from "./components/topBar";
import AddPlaylistBar from "./components/topBar/components/AddPlaylistBar";
import Loader from "components/Loader";

const Slidr = ({ match }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const windowWidth = useWindowSize();
  const slideshow_id = !!location.pathname
    ? location.pathname.split("/")[2]
    : 0;
  const { activeField, loadingGetSlideshow, activePlaylist } = useSelector(
    state => state.Slidr
  );

  useEffect(() => {
    if (slideshow_id) {
      dispatch(getSlideshow(slideshow_id));
      dispatch(fetchSlideShowHistory(slideshow_id));
    }
  }, [slideshow_id, dispatch]);

  return (
    <>
      {loadingGetSlideshow ? (
        <Loader />
      ) : (
        <div className="slidr h-100 w-100">
          <div className="slidr-width">
            <VideoPreview />
            <Settings slideshow_id={slideshow_id} />
            <div className="d-flex">
              <DndProvider backend={HTML5Backend}>
                <LeftBar slideshow_id={slideshow_id} />
                <CenterBar />
              </DndProvider>

              {!!activeField && windowWidth.width > 576 && <RightBar />}
              {/* <RightBar style={{display: (!!activeField && windowWidth.width > 576) ? "block" : "none"}}/> */}

              {!!activePlaylist && <AddPlaylistBar />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Slidr;
