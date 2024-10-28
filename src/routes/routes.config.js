import _404 from "components/_404";
import lazy from "utils/lazy";
import RequiredAuth from "utils/RequiredAuth";

const Home = lazy(() =>
  import(/* webpackChunkName: "Home" */ "modules/home/pages/")
);

const Slideshow = lazy(() =>
  import(/* webpackChunkName: 'Slideshow' */ "modules/slideshow")
);

const SlideshowPreview = lazy(() =>
  import(/* webpackChunkName: 'Slideshow' */ "modules/slideshowPreview")
);

const FeedSlideshow = lazy(() =>
  import(/* webpackChunkName: "Home" */ "modules/home/pages/feedLists")
);

const ComingSoon = lazy(() =>
  import(/* webpackChunkName: "ComingSoon" */ "components/ComingSoon")
);
const Faq = lazy(() => import(/* webpackChunkName: 'FAQs' */ "layout/Faq"));
const Tutorial = lazy(() =>
  import(/* webpackChunkName: 'FAQs' */ "layout/Tutorial")
);
const Slidr = lazy(() =>
  import(/* webpackChunkName: 'Slidr' */ "modules/slider")
);

const Subscription = lazy(() =>
  import(/* webpackChunkName: 'Slidr' */ "modules/subscription")
);
const routesConfig = {
  common: [
    {
      path: "/slide-show-preview/:id",
      component: Slideshow,
    },
    {
      path: "/slide-show-preview-2/:id",
      component: Slideshow,
    },
    {
      path: "/slide-show/:id",
      component: SlideshowPreview,
    },
    { path: "*", component: _404 },
  ],
  private: [
    {
      path: "/",
      component: RequiredAuth,
      children: [
        {
          index: true,
          component: Home,
        },
        {
          path: "slideshows/:id",
          component: FeedSlideshow,
        },
        {
          path: "/faq",
          component: Faq,
          checkAuth: true,
        },
        {
          path: "/tutorial",
          component: Tutorial,
          checkAuth: false,
        },

        {
          path: "/slidr/:slideshow_id",
          component: Slidr,
        },
        {
          path: "/subscription",
          component: Subscription,
        },
        {
          path: ":id",
          component: () => <>Slug Page</>,
        },
        { path: "coming-soon", component: ComingSoon },
        {
          path: "category/:category_id/:id",
          component: () => <>Details</>,
        },
      ],
    },
  ],
  public: [
    {
      path: "*",
      component: RequiredAuth,
    },
  ],
};

export default routesConfig;
