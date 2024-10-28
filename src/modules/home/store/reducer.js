import { defaultDocumentTitle } from "constants/slidr";
import produce from "immer";
import {
  DELETE_FEED_SUCCESS,
  FETCH_FEED_SLIDES,
  FETCH_FEED_SLIDES_LOADING,
  FETCH_USER_VOLUMES_COUNTS,
  LOADING_ADD_GROW_SLIDESHOW,
  LOADING_ADD_SLIDESHOW,
  LOADING_DELETE_FEED,
  SET_ADD_FEED_SUCCESS,
  SET_FEEDS,
  SET_LOADING_ADD_UPDATE_FEED,
  SET_LOADING_FEEDS,
  SET_LOADING_RECENT_SLIDE_SHOW_STATUS,
  SET_LOADING_SLIDE_SHOW,
  SET_LOADING_SLIDE_SHOW_STATUS,
  SET_RECENT_SLIDE_SHOW_STATUS,
  SET_SLIDESHOW_SCHEDULE_ACTIVE_DATE_TIME,
  SET_SLIDE_SHOW,
  SET_SLIDE_SHOW_STATUS,
  SET_SLIDE_TITLE,
  SET_UPDATE_FEED_SUCCESS,
  SHARE_DASHBOARD_ACCESS,
} from "./actionTypes";

const initialState = {
  loadingFeeds: false,
  feeds: [],
  loadingAddUpdateFeed: false,
  loadingDeleteFeed: false,
  loadingDeleteSlideshow: false,
  loadingUpdateSlideshow: false,
  loadingCopySlideshow: false,
  loadingActiveDeActive: false,
  loadingMoveSlideshow: false,
  loadingAddGrowSlideshow: false,
  loadingAddSlideshow: false,
  feedSlides: [],
  feedSlideLoading: false,
  loadingSlideshow: false,
  slideShow: [],
  loadingSlideshowStatus: false,
  sharedDashboardAccess: false,
  slideShowStatus: false,
  settings: {
    id: 0,
    title: defaultDocumentTitle,
    feedCode: "",
    presentationSize: 1,
    autoSlide: 0,
    isImage: false,
    img: "",
    size: "cover",
    position: "center",
    repeat: "no-repeat",
    repeatSlideshow: false,
    slideNumbers: false,
    grids: false,
    color: null,
    published_date_time: "",
  },
  fetchCounts: [],
};

const feedsReducer = produce((state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_LOADING_FEEDS:
      state.loadingFeeds = payload;
      break;
    case SET_FEEDS:
      state.feeds = payload;
      break;
    case SET_LOADING_ADD_UPDATE_FEED:
      state.loadingAddUpdateFeed = payload;
      break;
    case SET_ADD_FEED_SUCCESS:
      state.feeds.push(payload);
      break;
    case SET_UPDATE_FEED_SUCCESS:
      if (payload.isList) {
        state.feeds.forEach(x => {
          if (x.feed_id === payload.feed_id) {
            x.title = payload.title;
          }
        });
        if (state.feedSlides.feed_id === payload.feed_id) {
          state.feedSlides.title = payload.title;
        }
      } else {
        state.feeds.forEach(x => {
          if (x.feed_id === payload.feed_id) {
            x.title = payload.title;
          }
        });
      }

      break;
    case LOADING_DELETE_FEED:
      state.loadingDeleteFeed = payload;
      break;
    case DELETE_FEED_SUCCESS:
      state.feeds = state.feeds.filter(x => x.feed_id !== payload);
      break;
    //get recent slide show
    case SET_LOADING_SLIDE_SHOW:
      state.loadingSlideshow = payload;
      break;
    case SET_SLIDE_SHOW:
      state.slideShow = payload;
      break;
    //For rename slideshow
    case SET_SLIDE_TITLE:
      return {
        ...state,
        settings: {
          ...state.settings,
          title: payload,
        },
      };
    case FETCH_FEED_SLIDES:
      state.feedSlides = payload;
      break;
    case FETCH_FEED_SLIDES_LOADING:
      state.feedSlideLoading = payload;
      break;

    //set recent slide active deactive slide show
    case SET_LOADING_RECENT_SLIDE_SHOW_STATUS:
      state.loadingSlideshow = payload;
      break;
    case SET_RECENT_SLIDE_SHOW_STATUS:
      state.slideShow.forEach(feed => {
        if (
          feed.feed_id === payload.feed_id &&
          feed.slideshow_id === payload.slideshow_id
        ) {
          feed.is_active = payload.is_active;
        }
      });
      break;

    //set list page active deactive slide show
    case SET_LOADING_SLIDE_SHOW_STATUS:
      state.loadingSlideshowStatus = payload;
      break;
    case SET_SLIDE_SHOW_STATUS:
      state.feedSlides.gs_slideshows.forEach(ss => {
        if (
          ss.feed_id === payload.feed_id &&
          ss.slideshow_id === payload.slideshow_id
        ) {
          ss.is_active = payload.is_active;
        }
      });
      break;
    case LOADING_ADD_GROW_SLIDESHOW:
      state.loadingAddGrowSlideshow = payload;
      break;
    case LOADING_ADD_SLIDESHOW:
      state.loadingAddSlideshow = payload;
      break;
    case SET_SLIDESHOW_SCHEDULE_ACTIVE_DATE_TIME:
      state.feeds.forEach(feed => {
        if (feed.feed_id === payload.feed_id) {
          feed.gs_slideshows.forEach(ss => {
            if (ss.slideshow_id === payload.slideshow_id) {
              ss.schedule_active_date_time = payload.schedule_active_date_time;
              ss.is_scheduled = 1;
            }
          });
        }
      });
      break;
    //For displaying counts in grow slideshow
    case FETCH_USER_VOLUMES_COUNTS:
      state.fetchCounts = payload;
      break;
      case SHARE_DASHBOARD_ACCESS:
        state.sharedDashboardAccess = payload;
        break;
    default:
      return state;
  }
});
export default feedsReducer;
