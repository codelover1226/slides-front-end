import {
  ACTIVE_DE_ACTIVE_SLIDESHOW_URL,
  ADD_FEED_URL,
  ADD_KIDS_MUSIC_INTO_LIBRARY,
  ADD_SLIDESHOW_BY_SERIES_URL,
  ADD_SLIDESHOW_URL,
  DELETE_FEED_URL,
  DELETE_SLIDESHOW_URL,
  DUPLICATE_SLIDESHOW,
  FETCH_FEEDS_SLIDE,
  FETCH_FEEDS_URL,
  FETCH_SLIDE_SHOW_URL,
  GET_USER_VOLUMES_SLIDES_COUNT,
  MOVE_SLIDESHOW_URL,
  UPDATE_SLIDESHOW_TITLE_URL,
} from "helper/url_helper";
import { toast } from "react-toastify";
import { axiosAdmin, axiosSlidr } from "services/api";
import {
  COPY_SLIDESHOW,
  DELETE_FEED_SUCCESS,
  DELETE_SLIDESHOW_SUCCESS,
  FETCH_FEED_SLIDES,
  FETCH_FEED_SLIDES_LOADING,
  FETCH_USER_VOLUMES_COUNTS,
  LOADING_ACTIVE_DE_ACTIVE,
  LOADING_ADD_GROW_SLIDESHOW,
  LOADING_ADD_SLIDESHOW,
  LOADING_COPY_SLIDESHOW,
  LOADING_DELETE_FEED,
  LOADING_DELETE_SLIDESHOW,
  LOADING_UPDATE_SLIDESHOW,
  PUBLISHED,
  SET_ADD_FEED_SUCCESS,
  SET_FEEDS,
  SET_LOADING_ADD_UPDATE_FEED,
  SET_LOADING_FEEDS,
  SET_LOADING_MOVE_SLIDESHOW,
  SET_LOADING_RECENT_SLIDE_SHOW_STATUS,
  SET_LOADING_SLIDE_SHOW,
  SET_LOADING_SLIDE_SHOW_STATUS,
  SET_MOVE_SLIDESHOW,
  SET_RECENT_SLIDE_SHOW_STATUS,
  SET_SLIDESHOW_SCHEDULE_ACTIVE_DATE_TIME,
  SET_SLIDE_SHOW,
  SET_SLIDE_SHOW_STATUS,
  SET_SLIDE_TITLE,
  SET_UPDATE_FEED_SUCCESS,
  SHARE_DASHBOARD_ACCESS,
  UPDATE_SLIDESHOW_SUCCESS,
} from "./actionTypes";

export const fetchFeeds = () => async dispatch => {
  try {
    dispatch(setLoadingFeeds(true));
    const res = await axiosSlidr.get(FETCH_FEEDS_URL);
    if (res?.data?.statusCode && res?.data?.data?.feeds) {
      dispatch(setLoadingFeeds(false));
      dispatch(setFeeds(res.data.data.feeds));
      dispatch(
        setDashboardAccess(res.data?.data?.sharedDashboardAccess || false)
      );
    }
  } catch (err) {
    dispatch(setLoadingFeeds(false));
    toast.error(err.response?.data?.message || err.message);
  }
};

export const addUpdateFeed =
  ({ payload, callBack, isList = false }) =>
  async dispatch => {
    try {
      dispatch(setLoadingAddUpdateFeed(true));
      const res = await axiosSlidr.post(ADD_FEED_URL, payload);
      if (res.status) {
        dispatch(setLoadingAddUpdateFeed(false));
        if (payload.feed_id) {
          let payData = { ...payload, isList: isList };
          dispatch(setUpdateFeedSuccess(payData));
          toast.success("Feed updated successfully");
        } else {
          dispatch(setAddFeedSuccess(res.data?.data));
          dispatch(fetchFeeds());
          toast.success("New feed added successfully");
        }
        callBack();
        // toast.success("New feed added successfully");
      }
    } catch (err) {
      dispatch(setLoadingAddUpdateFeed(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const deleteFeed =
  ({ feed_id, callBack }) =>
  async dispatch => {
    try {
      dispatch(setLoadingFeedsDelete(true));
      const res = await axiosSlidr.delete(`${DELETE_FEED_URL}/${feed_id}`);
      if (res.status) {
        dispatch(setLoadingFeedsDelete(false));
        dispatch(setDeleteFeedSuccess(feed_id));
        dispatch(recentSlideShow());
        callBack();
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      dispatch(setLoadingFeedsDelete(false));
    }
  };

export const deleteSlideShow =
  ({ slideshow_id, feed_id, callBack }) =>
  async dispatch => {
    try {
      dispatch(setDeleteSlideshowSuccess({ slideshow_id, feed_id }));
      dispatch(setLoadingDeleteSlideshow(true));
      const res = await axiosSlidr.delete(
        `${DELETE_SLIDESHOW_URL}/${slideshow_id}`
      );
      if (res.status) {
        dispatch(setLoadingDeleteSlideshow(false));
        dispatch(setDeleteSlideshowSuccess({ slideshow_id, feed_id }));
        callBack();
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      dispatch(setLoadingDeleteSlideshow(false));
    }
  };

//For updating title
// export const updateSlideshow =
//   ({ slideshow_id, feed_id, title, callBack }) =>
//   async dispatch => {
//     try {
//       dispatch(setLoadingUpdateSlideshow(true));
//       const res = await axiosSlidr.put(UPDATE_SLIDESHOW_TITLE_URL, {
//         title,
//         slideshow_id,
//       });
//       if (res.status) {
//         dispatch(setUpdateSlideshowSuccess({ slideshow_id, feed_id, title }));
//         toast.success(res.data.message);
//         callBack();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//       dispatch(setLoadingUpdateSlideshow(false));
//     }
//   };

export const slideShowTitle =
  (data, cb = () => {}) =>
  async dispatch => {
    try {
      const res = await axiosSlidr.put(UPDATE_SLIDESHOW_TITLE_URL, data);
      if (res.statusCode === 200) {
        cb();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const setSlideTiltle = data => ({
  type: SET_SLIDE_TITLE,
  payload: data,
});

export const copySlideShow =
  ({ slideshow_id, feed_id, callBack }) =>
  async dispatch => {
    try {
      dispatch(setLoadingCopySlideShow(true));
      const res = await axiosSlidr.post(
        `${DUPLICATE_SLIDESHOW}/${slideshow_id}`
      );
      if (res.status && res.data?.data?.slideshow_id) {
        dispatch(setLoadingCopySlideShow(false));
        dispatch(
          setCopySlideshow({
            feed_id,
            copied_slideshow_id: slideshow_id,
            new_slideshow_id: res.data.data.slideshow_id,
          })
        );
        toast.success(res.data.message);
        callBack();
      }
    } catch (err) {
      dispatch(setLoadingCopySlideShow(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const activeDeActiveSlideshow =
  ({ slideshow_id, feed_id, is_active }) =>
  async dispatch => {
    try {
      dispatch(setLoadingActiveDeActive(true));
      const res = await axiosSlidr.put(ACTIVE_DE_ACTIVE_SLIDESHOW_URL, {
        is_active: is_active,
        slideshow_id,
      });
      if (res.status) {
        dispatch(setLoadingActiveDeActive(false));
        dispatch(setActiveDeActive({ slideshow_id, feed_id, is_active }));
      }
    } catch (err) {
      dispatch(setLoadingActiveDeActive(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };
export const moveSlideshow =
  ({ from_feed_id, to_feed_id, slideshow_id, callback }) =>
  async dispatch => {
    try {
      dispatch(setLoadingMoveSlideshow(true));
      const res = await axiosSlidr.put(MOVE_SLIDESHOW_URL, {
        slideshow_id: slideshow_id,
        feed_id: to_feed_id,
      });
      if (res.status) {
        dispatch(setLoadingMoveSlideshow(false));
        toast.success(res.data.message);
        dispatch(
          setMoveSlideshow({
            from_feed_id,
            to_feed_id,
            slideshow_id,
          })
        );
        callback();
      }
    } catch (err) {
      dispatch(setLoadingMoveSlideshow(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const addSlideshow =
  ({ payload, navigate }) =>
  async dispatch => {
    try {
      dispatch(setLoadingAddSlideshow(true));
      const res = await axiosSlidr.post(ADD_SLIDESHOW_URL, payload);
      if (res.status && res.data?.data) {
        dispatch(setLoadingAddSlideshow(false));
        dispatch(fetchFeeds());
        navigate("/slidr/" + res.data.data.slideshow_id);
      }
    } catch (err) {
      dispatch(setLoadingAddSlideshow(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const addGrowSlideshow =
  ({ slideshow_id, feed_id, navigate }) =>
  async dispatch => {
    try {
      dispatch(setLoadingAddGrowSlideshow(true));
      const res = await axiosSlidr.post(ADD_SLIDESHOW_BY_SERIES_URL, {
        slideshow_id,
        feed_id,
      });
      if (res.status && res.data?.data?.slideShow?.slideshow_id) {
        dispatch(setLoadingAddGrowSlideshow(false));
        dispatch(fetchFeeds());
        navigate("/slidr/" + res.data.data.slideShow.slideshow_id);
      }
    } catch (err) {
      dispatch(setLoadingAddGrowSlideshow(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

// export const fetchUserVolumesCount = () => async dispatch => {
//   try {
//     const res = await axiosAdmin.get(GET_USER_VOLUMES_COUNT);
//     if (res?.data?.statusCode && res?.data?.data) {
//       dispatch(fetchUserVolumesCounts(res.data.data));
//     }
//   } catch (err) {
//     toast.error(err.response?.data?.message || err.message);
//   }
// };

export const fetchUserVolumesSlidesCount = () => async dispatch => {
  try {
    const res = await axiosSlidr.get(GET_USER_VOLUMES_SLIDES_COUNT);
    if (res?.data?.statusCode && res?.data?.data) {
      dispatch(fetchUserVolumesCounts(res.data.data));
    }
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

export const handleAddKidsMusicLibrary = () => {
  return async dispatch => {
    try {
      const res = await axiosAdmin.post(ADD_KIDS_MUSIC_INTO_LIBRARY);
      return res;
    } catch (err) {
      throw err;
    }
  };
};

//for displaying counts in grow slideshow
export const fetchUserVolumesCounts = data => ({
  type: FETCH_USER_VOLUMES_COUNTS,
  payload: data,
});

export const setLoadingFeeds = data => ({
  type: SET_LOADING_FEEDS,
  payload: data,
});

export const setFeeds = data => ({
  type: SET_FEEDS,
  payload: data,
});

export const setAddFeedSuccess = data => ({
  type: SET_ADD_FEED_SUCCESS,
  payload: data,
});
export const setUpdateFeedSuccess = data => ({
  type: SET_UPDATE_FEED_SUCCESS,
  payload: data,
});
export const setLoadingAddUpdateFeed = data => ({
  type: SET_LOADING_ADD_UPDATE_FEED,
  payload: data,
});
export const setLoadingFeedsDelete = data => ({
  type: LOADING_DELETE_FEED,
  payload: data,
});
export const setDeleteFeedSuccess = data => ({
  type: DELETE_FEED_SUCCESS,
  payload: data,
});

//get Recent Slide
export const recentSlideShow = () => async dispatch => {
  try {
    dispatch(setLoadingRecentSlideShow(true));
    const res = await axiosSlidr.post(FETCH_SLIDE_SHOW_URL);
    if (res?.data?.statusCode && res?.data?.data?.data) {
      dispatch(setLoadingRecentSlideShow(false));
      dispatch(setRecentSlideShow(res.data.data?.data));
    }
  } catch (err) {
    dispatch(setLoadingRecentSlideShow(false));
    toast.error(err.response?.data?.message || err.message);
  }
};

export const fetchFeedsSlides =
  ({ payload }) =>
  async dispatch => {
    try {
      dispatch(setFeedSlideLoading(true));
      const res = await axiosSlidr.get(`${FETCH_FEEDS_SLIDE}/${payload}`);
      if (res?.data?.statusCode && res?.data) {
        dispatch(setFeedSlideLoading(false));
        dispatch(setDashboardAccess(res.data.data.sharedDashboardAccess));
        if (res.data.data.feeds && Array.isArray(res.data.data.feeds.gs_slideshows)) {
          console.log("Before Sorting:", res.data.data.feeds);
      
          // Explicitly handle null or undefined titles
          res.data.data.feeds.gs_slideshows.sort((a, b) => {
              if (!a.title || !b.title) {
                  // Handle titles being null or undefined
                  return 0; // Keep relative order if titles are missing
              }
      
              if (a.title.toLowerCase() < b.title.toLowerCase()) {
                  return -1;
              } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                  return 1;
              }
              return 0;
          });
      
          console.log("After Sorting:", res.data.data.feeds);
        }
        
        // Ensure dispatch is called after sorting
        dispatch(getFeedSlides(res.data.data.feeds));
      }
    } catch (err) {
      dispatch(setFeedSlideLoading(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const setLoadingRecentSlideShow = data => ({
  type: SET_LOADING_SLIDE_SHOW,
  payload: data,
});

export const setRecentSlideShow = data => ({
  type: SET_SLIDE_SHOW,
  payload: data,
});

//Recent slideshow status change
export const activeDeactiveRecentSlideShow =
  ({ payload, feed_id = 0 }) =>
  async dispatch => {
    try {
      dispatch(setLoadingActiveDeactiveRecentSlideShow(true));
      const res = await axiosSlidr.put(ACTIVE_DE_ACTIVE_SLIDESHOW_URL, payload);
      if (res?.data?.statusCode) {
        if (res.data?.statusCode === 200) {
          let data = { ...payload, feed_id };
          dispatch(setActiveDeactiveRecentSlideShow(data));
        }
        dispatch(setLoadingActiveDeactiveRecentSlideShow(false));
      }
    } catch (err) {
      dispatch(setLoadingActiveDeactiveRecentSlideShow(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const setLoadingActiveDeactiveRecentSlideShow = data => ({
  type: SET_LOADING_RECENT_SLIDE_SHOW_STATUS,
  payload: data,
});

export const setActiveDeactiveRecentSlideShow = data => ({
  type: SET_RECENT_SLIDE_SHOW_STATUS,
  payload: data,
});

//List Page slide status change
export const activeDeactiveSlideShow =
  ({ payload, feed_id = 0 }) =>
  async dispatch => {
    try {
      dispatch(setLoadingActiveDeactiveSlideShow(true));
      const res = await axiosSlidr.put(ACTIVE_DE_ACTIVE_SLIDESHOW_URL, payload);
      if (res?.data?.statusCode) {
        if (res.data?.statusCode === 200) {
          let data = { ...payload, feed_id: feed_id };
          dispatch(setActiveDeactiveSlideShow(data));
        }
        dispatch(setLoadingActiveDeactiveSlideShow(false));
      }
    } catch (err) {
      dispatch(setLoadingActiveDeactiveSlideShow(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const setLoadingActiveDeactiveSlideShow = data => ({
  type: SET_LOADING_SLIDE_SHOW_STATUS,
  payload: data,
});

export const setActiveDeactiveSlideShow = data => ({
  type: SET_SLIDE_SHOW_STATUS,
  payload: data,
});

export const setLoadingAddGrowSlideshow = data => ({
  type: LOADING_ADD_GROW_SLIDESHOW,
  payload: data,
});
export const setLoadingAddSlideshow = data => ({
  type: LOADING_ADD_SLIDESHOW,
  payload: data,
});

export const setSlideshowScheduleActiveDateTime = data => ({
  type: SET_SLIDESHOW_SCHEDULE_ACTIVE_DATE_TIME,
  payload: data,
});

export const setDeleteSlideshowSuccess = data => ({
  type: DELETE_SLIDESHOW_SUCCESS,
  payload: data,
});

export const setLoadingUpdateSlideshow = data => ({
  type: LOADING_UPDATE_SLIDESHOW,
  payload: data,
});
export const setUpdateSlideshowSuccess = data => ({
  type: UPDATE_SLIDESHOW_SUCCESS,
  payload: data,
});

export const setLoadingCopySlideShow = data => ({
  type: LOADING_COPY_SLIDESHOW,
  payload: data,
});
export const setCopySlideshow = data => ({
  type: COPY_SLIDESHOW,
  payload: data,
});

export const setLoadingActiveDeActive = data => ({
  type: LOADING_ACTIVE_DE_ACTIVE,
  payload: data,
});
export const setActiveDeActive = data => ({
  type: PUBLISHED,
  payload: data,
});
export const setMoveSlideshow = data => ({
  type: SET_MOVE_SLIDESHOW,
  payload: data,
});
export const setLoadingMoveSlideshow = data => ({
  type: SET_LOADING_MOVE_SLIDESHOW,
  payload: data,
});
export const setLoadingDeleteSlideshow = data => ({
  type: LOADING_DELETE_SLIDESHOW,
  payload: data,
});
export const getFeedSlides = data => ({
  type: FETCH_FEED_SLIDES,
  payload: data,
});

export const setFeedSlideLoading = data => ({
  type: FETCH_FEED_SLIDES_LOADING,
  payload: data,
});

export const setDashboardAccess = data => ({
  type: SHARE_DASHBOARD_ACCESS,
  payload: data,
});
