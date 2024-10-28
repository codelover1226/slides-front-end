import {
  ADD_IMAGE,
  ADD_TEXT,
  CLEAR_SLIDES_STATE,
  DECREMENT_COUNT,
  FETCH_HISTORY_DATA,
  INCREMENT_COUNT,
  LOADING_GET_SLIDESHOW,
  REPLACE_VIDEO_FIELD,
  SET_ACTIVE_FIELD,
  SET_ACTIVE_HISTORY,
  SET_ACTIVE_PLAYLIST,
  SET_ACTIVE_SLIDE,
  SET_BACKGROUND_FIELD,
  SET_COPY_SLIDE,
  SET_DELETE_SLIDE,
  SET_GIF_FIELD,
  SET_GLOBAL_COPY_FIELD,
  SET_GLOBAL_PASTE_FIELD,
  SET_IMAGE_FIELD_VALUE,
  SET_IS_IMAGE_SELECT,
  SET_LOADING_COPY_SLIDE,
  SET_LOADING_DELETE_SLIDE,
  SET_LOADING_PUBLISH_SLIDESHOW,
  SET_LOADING_SAVE_SLIDESHOW,
  SET_LOADING_SLIDE_SETTINGS,
  SET_MODAL_PREVIEW,
  SET_PLAYLIST,
  SET_PUBLISHED_DATE_TIME,
  SET_SAVE_MESSAGE_SLIDE,
  SET_SLIDE,
  SET_SLIDES,
  SET_SLIDESHOW,
  SET_SLIDE_IMAGES,
  SET_SLIDE_MUSIC,
  SET_SLIDE_SETTINGS,
  SET_SLIDE_TITLE,
  SET_TEXT_FIELD_COPY,
  SET_TEXT_FIELD_DELETE,
  SET_TEXT_FIELD_VALUE,
  SET_VIDEO_FIELD,
  SLIDESHOW_TITLE,
  SLIDR_ACTION_REDO,
  SLIDR_ACTION_UNDO,
  SLIDR_SLIDES_CHANGE,
} from "./actionTypes";

import { toast } from "react-toastify";

import { axiosSlidr } from "services/api";
import { generateSlideString, getVideoType, rgbaToHexA } from "utils/slider";

import store from "store";

import {
  ADD_SLIDE_URL,
  DELETE_SLIDE_SHOW_HISTORY,
  DELETE_SLIDE_URL,
  FETCH_SLIDE_SHOW_HISTORY,
  GET_SLIDESHOW_URL,
  PUBLISH_SLIDESHOW_URL,
  UNPUBLISH_SLIDESHOW_URL,
  SAVE_SLIDESHOW_PLAYLIST,
  SAVE_SLIDESHOW_URL,
  SET_SETTINGS_URL,
  UPDATE_SLIDESHOW_TITLE_URL,
} from "helper/url_helper";

import { generateSlideObject } from "utils/slider";

export const getSlideshow = slideshow_id => async (dispatch, getState) => {
  try {
    dispatch(setLoadingSlideshow(true));
    const res = await axiosSlidr.get(`${GET_SLIDESHOW_URL}/${slideshow_id}`);
    if (res.status && res?.data?.data) {
      dispatch(setLoadingSlideshow(false));
      dispatch(
        setSlideshow({ data: res.data.data, slideshow_id: slideshow_id })
      );
      if (res.data?.data?.slides) {
        const slides = res.data.data.slides
          .filter(slide => !!slide.content)
          .map(slide =>
            generateSlideObject(slide.content, slide.slide_id, slide.audio)
          )
          .filter(slide => !!slide);
        if (!!slides.length) {
          dispatch(setSlides(slides));
          dispatch(setActiveSlide(slides[0].id));
          dispatch(setSlideshowTitle(res.data.data.slideShowSetting.title));
        } else {
          dispatch(addSlide(slideshow_id));
          const state = getState();
          if (state.Slidr.slides.length) {
            dispatch(setActiveSlide(state.Slidr.slides[0].id));
          }
        }
      }

      if (res.data?.data?.slideshowPlaylist) {
        dispatch(setPlayList(res.data?.data?.slideshowPlaylist));
      }
    }
  } catch (err) {
    dispatch(setLoadingSlideshow(false));
    toast.error(err.response?.data?.message || err.message);
  }
};
export const videoField =
  ({ payload }) =>
  async dispatch => {
    try {
      const res = await getSlideId(payload.slideshow_id);
      if (res?.status && res.data.data.slide_id) {
        dispatch(
          setVideoField({ ...payload, slide_id: res.data.data.slide_id })
        );
        dispatch(setActiveSlide(res.data.data.slide_id));
        dispatch(saveSlideshow());
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const replaceVideoField =
  ({ payload }) =>
  async (dispatch, getStore) => {
    try {
      dispatch(setLoadingSaveSlideshow(true));
      dispatch(setReplaceVideoField({ ...payload, slide_id: payload.slideId }));
      dispatch(setActiveSlide(payload.slideId));
      dispatch(saveSlideshow());
    } catch (err) {
      dispatch(setLoadingSaveSlideshow(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const gifField =
  ({ payload }) =>
  async dispatch => {
    try {
      const res = await getSlideId(payload.slideshow_id);
      if (res?.status && res.data.data.slide_id) {
        dispatch(setGifField({ ...payload, slide_id: res.data.data.slide_id }));
        dispatch(setActiveSlide(res.data.data.slide_id));
        dispatch(saveSlideshow());
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const getSlideId = async (slideshow_id, copy = 0) => {
  try {
    if (!copy) {
      store.dispatch(incrementCount());
    }
    const res = await axiosSlidr.post(`${ADD_SLIDE_URL}/${slideshow_id}`);
    if (res.status) {
      if (!copy) {
        store.dispatch(decrementCount());
      }
      return res;
    }
  } catch (err) {
    if (!copy) {
      store.dispatch(decrementCount());
    }
    toast.error(err.response?.data?.message || err.message);
  }
};
export const copySlide =
  ({ slide_id, slideshow_id }) =>
  async dispatch => {
    try {
      dispatch(setLoadingCopySlide({ slide_id: slide_id, status: true }));
      const res = await getSlideId(slideshow_id, 1);
      if (res?.status && res.data.data.slide_id) {
        dispatch(setLoadingCopySlide({ slide_id: 0, status: false }));
        dispatch(
          setCopySlide({
            copy_slide_id: slide_id,
            new_slide_id: res.data.data.slide_id,
          })
        );
        dispatch(saveSlideshow());
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };
export const addSlide = slideshow_id => async dispatch => {
  try {
    const res = await getSlideId(slideshow_id);
    if (res?.status && res.data.data.slide_id) {
      dispatch(setAddSlide({ id: res.data.data.slide_id }));
      dispatch(saveSlideshow());
    }
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

export const addSlideImage =
  (slideshow_id, slide_id = 0, cb = () => {}) =>
  async dispatch => {
    try {
      const res = await getSlideId(slideshow_id.slideshow_id);
      if (res?.status && res.data.data.slide_id) {
        dispatch(
          setAddSlideImage({ id: res.data.data.slide_id, slide_id: slide_id })
        );
        cb(res.data.data.slide_id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const deleteSlide =
  ({ slide_id, callBack }) =>
  async dispatch => {
    try {
      dispatch(setLoadingDeleteSlide(true));
      const res = await axiosSlidr.delete(`${DELETE_SLIDE_URL}/${slide_id}`);
      if (res.status) {
        toast.success(res.data.message);
        dispatch(setLoadingDeleteSlide(false));
        dispatch(setDeleteSlide(slide_id));
        callBack();
      }
    } catch (err) {
      dispatch(setLoadingDeleteSlide(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

//fetch slideshow history------------
export const fetchSlideShowHistory = slideshow_id => async dispatch => {
  try {
    const res = await axiosSlidr.get(
      `${FETCH_SLIDE_SHOW_HISTORY}/${slideshow_id}`
    );
    if (res.status === 200) {
      dispatch(setHistoryData(res.data.data));
    }
  } catch (err) {
    toast.error(err);
  }
};

//delete slideshow history
export const deleteSlideShowHistory =
  ({ payload }) =>
  async (dispatch, getStore) => {
    try {
      const { Slidr } = getStore();
      dispatch(setLoadingDeleteSlide(true));
      const res = await axiosSlidr.post(
        `${DELETE_SLIDE_SHOW_HISTORY}`,
        payload
      );
      if (res.status) {
        toast.success(res.data.message);
        dispatch(setHistoryData());
        dispatch(setLoadingDeleteSlide(false));
        dispatch(fetchSlideShowHistory(Slidr.slideshowId));
      }
    } catch (err) {
      dispatch(setLoadingDeleteSlide(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const saveSlideshow =
  (clickSaveBtn, onSuccess = () => {}) =>
  async (dispatch, getStore) => {
    try {
      const { Slidr } = getStore();
      let payload = {};
      if (!!Slidr?.slides) {
        payload = Slidr.slides?.map((slide, index) => ({
          slide_id: slide.id,
          content: generateSlideString(slide, Slidr.settings.presentationSize),
          sort_order: index + 1,
          slide_type: !!slide.gifUrl ? 3 : !!slide.videoUrl ? 2 : 1,
          gif_url: !!slide.gifUrl ? slide.gifUrl : "",
          video_url: !!slide.videoUrl ? slide.videoUrl : "",
          video_type: !!slide.videoUrl ? getVideoType(slide.videoUrl) : 0,
          audio_url: !!slide.audioUrl ? slide.audioUrl : "",
          audio_duration: !!slide.audioDuration ? slide.audioDuration : "",
          audio_autoplay: 1,
        }));
      }
      dispatch(setLoadingSaveSlideshow(true));

      const res = await axiosSlidr.post(SAVE_SLIDESHOW_URL, {
        slides: payload,
        slideshow_id: Slidr.slideshowId,
      });
      if (res.status) {
        if (clickSaveBtn) {
          toast.success(res.data.message);
        }
        onSuccess();
      }
    } catch (err) {
      dispatch(setLoadingSaveSlideshow(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };
export const publishSlideshow =
  ({ slideshow_id, callBack }) =>
  async dispatch => {
    try {
      dispatch(setLoadingPublishSlideshow(true));
      const res = await axiosSlidr.put(PUBLISH_SLIDESHOW_URL, {
        slideshow_id: slideshow_id,
        published_url:
          process.env.REACT_APP_SLIDR_SITE_URL + "slide-show/" + slideshow_id,
      });
      if (res.status) {
        dispatch(setLoadingPublishSlideshow(false));
        if (res.data?.data?.published_datetime) {
          dispatch(setPublishedDateTime(res.data.data.published_datetime));
        }
        toast.success(res.data.message);
        callBack();
      }
    } catch (err) {
      dispatch(setLoadingPublishSlideshow(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };
export const UnPublishSlideshow =
  ({ slideshow_id, callBack }) =>
  async dispatch => {
    try {
      const res = await axiosSlidr.put(UNPUBLISH_SLIDESHOW_URL, {
        slideshow_id: slideshow_id,
      });
      if (res.status) {
        toast.success(res.data.message);
        dispatch(setPublishedDateTime(""));
        callBack();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };
export const slideSettings =
  ({ payload }) =>
  async dispatch => {
    let {
      autoSlide,
      slideNumbers,
      repeat,
      size,
      position,
      repeatSlideshow,
      grids,
      presentationSize,
      color,
      img,
      id,
      title,
    } = payload;
    try {
      let apiPayload = {
        title: title,
        slideshow_setting_id: id,
        auto_slide: autoSlide,
        show_slide_no: slideNumbers ? 1 : 0,
        background_repeat: repeat,
        background_all: size,
        background_position: position,
        slideshow_repeat: repeatSlideshow ? 1 : 0,
        slideshow_gridlines: grids ? 1 : 0,
        presentation_size: presentationSize === 1 ? "1280*720" : "960*720",
        background_color: color ? rgbaToHexA(color) : "",
        background_image: img,
      };
      dispatch(setLoadingSlideSettings(true));
      const res = await axiosSlidr.put(SET_SETTINGS_URL, apiPayload);
      if (res.status) {
        dispatch(setLoadingSlideSettings(false));
        dispatch(setSlideSettings(payload));
        toast.success(res.data.message);
      }
    } catch (err) {
      dispatch(setLoadingSlideSettings(false));
      toast.error(err.response?.data?.message || err.message);
    }
  };

export const slideShowTitle = (data, cb) => async dispatch => {
  try {
    const res = await axiosSlidr.put(UPDATE_SLIDESHOW_TITLE_URL, data);
    if (res.status === 200) {
      // dispatch(setSlideshowTitle(data.title));
      dispatch(setSlideSettings(data));
      cb();
      // dispatch(saveSlideshow());
    }
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

export const setSlideTiltle = data => ({
  type: SET_SLIDE_TITLE,
  payload: data,
});

export const setActiveSlide = data => ({
  type: SET_ACTIVE_SLIDE,
  payload: data,
});

export const setAddSlide = data => ({
  type: SET_SLIDE,
  payload: data,
});

export const setAddSlideImage = data => ({
  type: SET_SLIDE_IMAGES,
  payload: data,
});

export const setDeleteSlide = data => ({
  type: SET_DELETE_SLIDE,
  payload: data,
});

export const setSlides = data => ({
  type: SET_SLIDES,
  payload: data,
});

export const addEditSlideMusic =
  (data, cb = () => {}) =>
  async dispatch => {
    try {
      // const res = await getSlideId(slideshow_id.slideshow_id);
      // if (res?.status && res.data.data.slide_id) {
      dispatch(addEditSlideMusicSuccess(data));
      dispatch(saveSlideshow());
      cb();
      // }
    } catch (err) {
      toast.error(err.message);
    }
  };

export const addEditSlideMusicSuccess = data => ({
  type: SET_SLIDE_MUSIC,
  payload: data,
});

export const setActiveField = data => ({
  type: SET_ACTIVE_FIELD,
  payload: data,
});

export const setTextFieldValue = data => ({
  type: SET_TEXT_FIELD_VALUE,
  payload: data,
});
export const textFieldDelete = () => ({
  type: SET_TEXT_FIELD_DELETE,
});
export const textFieldCopy = () => ({
  type: SET_TEXT_FIELD_COPY,
});

export const addText = () => ({
  type: ADD_TEXT,
});

export const addImage = data => ({
  type: ADD_IMAGE,
  payload: data,
});

export const setImageFieldValue = data => ({
  type: SET_IMAGE_FIELD_VALUE,
  payload: data,
});

export const setIsImageSelect = data => ({
  type: SET_IS_IMAGE_SELECT,
  payload: data,
});
export const setVideoField = data => ({
  type: SET_VIDEO_FIELD,
  payload: data,
});

export const setReplaceVideoField = data => ({
  type: REPLACE_VIDEO_FIELD,
  payload: data,
});

export const setBackgroundField = data => ({
  type: SET_BACKGROUND_FIELD,
  payload: data,
});

export const setGifField = data => ({
  type: SET_GIF_FIELD,
  payload: data,
});

export const setModalPreview = data => ({
  type: SET_MODAL_PREVIEW,
  payload: data,
});

export const setSlideSettings = data => ({
  type: SET_SLIDE_SETTINGS,
  payload: data,
});
export const setLoadingSlideSettings = data => ({
  type: SET_LOADING_SLIDE_SETTINGS,
  payload: data,
});

export const setGlobalCopyField = data => ({
  type: SET_GLOBAL_COPY_FIELD,
  payload: data,
});

export const setGlobalPasteField = data => ({
  type: SET_GLOBAL_PASTE_FIELD,
  payload: data,
});

export const slidesChange = data => ({
  type: SLIDR_SLIDES_CHANGE,
  payload: data,
});
export const actionUndo = () => ({
  type: SLIDR_ACTION_UNDO,
});
export const actionRedo = () => ({
  type: SLIDR_ACTION_REDO,
});
export const setSlideshow = data => ({
  type: SET_SLIDESHOW,
  payload: data,
});
export const setLoadingPublishSlideshow = data => ({
  type: SET_LOADING_PUBLISH_SLIDESHOW,
  payload: data,
});
export const setPublishedDateTime = data => ({
  type: SET_PUBLISHED_DATE_TIME,
  payload: data,
});

export const clearSlidesState = () => ({
  type: CLEAR_SLIDES_STATE,
});
export const setLoadingDeleteSlide = data => ({
  type: SET_LOADING_DELETE_SLIDE,
  payload: data,
});
export const setLoadingSaveMessage = data => ({
  type: SET_SAVE_MESSAGE_SLIDE,
  payload: data,
});
export const setCopySlide = data => ({
  type: SET_COPY_SLIDE,
  payload: data,
});
export const setLoadingCopySlide = data => ({
  type: SET_LOADING_COPY_SLIDE,
  payload: data,
});
export const setLoadingSaveSlideshow = data => ({
  type: SET_LOADING_SAVE_SLIDESHOW,
  payload: data,
});

export const incrementCount = () => ({
  type: INCREMENT_COUNT,
});
export const decrementCount = () => ({
  type: DECREMENT_COUNT,
});
export const setLoadingSlideshow = data => ({
  type: LOADING_GET_SLIDESHOW,
  payload: data,
});

export const setActivePlayList = data => ({
  type: SET_ACTIVE_PLAYLIST,
  payload: data,
});

export const setActiveHistory = data => ({
  type: SET_ACTIVE_HISTORY,
  payload: data,
});

export const setPlayList = data => ({
  type: SET_PLAYLIST,
  payload: data,
});

export const setHistoryData = data => ({
  type: FETCH_HISTORY_DATA,
  payload: data,
});

export const setSlideshowTitle = data => ({
  type: SLIDESHOW_TITLE,
  payload: data,
});

export const savePlaylist = data => async (dispatch, getStore) => {
  try {
    const { Slidr } = getStore();

    let payload = {};
    if (!!Slidr?.slideshowId && !!data.audio) {
      payload.slideshow_id = Slidr.slideshowId;
      payload.playlist = data;
      const res = await axiosSlidr.post(SAVE_SLIDESHOW_PLAYLIST, payload);
      if (res.status) {
        dispatch(setPlayList(payload.playlist));
      }
    }
  } catch (err) {
    // dispatch(setLoadingSaveSlideshow(false));
    toast.error(err.response?.data?.message || err.message);
  }
};
