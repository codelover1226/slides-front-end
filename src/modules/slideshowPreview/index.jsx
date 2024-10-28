import DomPurify from "dompurify";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import Reveal from "reveal.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";
import { generateSlideObject, hexToRgba, rgbaToHexA } from "utils/slider";
// import { CiVolumeHigh } from "react-icons/ci";
// import { CiVolumeMute } from "react-icons/ci";
// import { FaPlay } from "react-icons/fa";
// import { IoPauseOutline } from "react-icons/io5";
import { axiosSlidr } from "services/api";
import { GET_SLIDESHOW_PREVIEW_URL } from "../../helper/url_helper";
//import Loader from "common/Loader";
import Loader from "components/Loader";
import { isEmptyArray } from "formik";
import ReactPlayer from "react-player";
import { getCloudFrontImgUrl } from "utils/cloudFrontUrl";

const getBackgroundImageData = ({ url, position, repeat, size }) => {
  if (url.includes("%27") || url.includes("%26")) {
    return {
      //"data-background": `url(${url}) ${repeat} ${position}/${size}`,
      background: `url(${url}) ${repeat} ${position}/${size}`,
    };
  } else {
    return {
      // "data-background-image": `url(${decodeURI(url)})`,
      // "data-background-position": position,
      // "data-background-repeat": repeat,
      // "data-background-size": size,
      "background-image": `url(${decodeURI(url)})`,
      "background-position": position,
      "background-repeat": repeat,
      "background-size": size,
    };
  }
};
const getBackgroundColorData = color => ({
  "background-color": `${rgbaToHexA(color)}`,
});

const getYoutubeMaxResolutionImage = url => {
  const newUrl = url.split("/");
  return [...newUrl.slice(0, newUrl.length - 1), "maxresdefault.jpg"].join("/");
};

const SlideshowPreview = () => {
  const { id } = useParams();
  const location = useLocation();
  const slideshowId = id ? id : 0;
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);
  const [settings, setSettings] = useState(null);
  const dispatch = useDispatch();
  const ref = useRef();
  const [audioIndex, setAudioIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [isPlaylistPlaying, setIsPlaylistPlaying] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sources, setSource] = useState([]);
  const [slideAudio, setSlideAudio] = useState([]);
  const [isFullScreen] = useState(true);
  const [volume] = useState(1);

  const isPreviewRoute = useMemo(
    () => location.pathname.startsWith("/slide-show"),
    [location]
  );
  const isPreviewVideo = false;
  // const playerRef = useRef(null);

  // const handleVolumeChange = (event) => {
  //   playerRef.current.audio.current.volume = parseFloat(event.target.value);
  // };

  // useEffect(() => {
  //   console.log("Control", playerRef.current?.audio);
  // }, [slideAudio]);
  useEffect(() => {
    if (!!settings && !loading) {
      ref.current = new Reveal({
        slideNumber: false, //slideNumber: settings.slideNumbers && isPreviewRoute ? "c/t" : false,
        width: settings.presentationSize === 1 ? 1280 : 960,
        height: 720,
        hash: true,
        loop: settings.repeatSlideshow,
        autoSlide: !isPreviewRoute ? 0 : settings.autoSlide,
        center: true,
        progress: false,
        controls: false,
      });
      ref.current.initialize();
      ref.current.on("slidechanged", event => {
        setCurrentIndex(event.indexh);
        setIsAudioPlaying(true);
      });

      ref.current.on("ready", event => {
        setCurrentIndex(event.indexh);
      });
    }
    return () => {
      if (!!ref.current) ref.current.destroy();
    };
  }, [settings, loading, isPreviewRoute]);

  useEffect(() => {
    if (slideshowId !== undefined) {
      setLoading(true);
      (async () => {
        try {
          const res = await axiosSlidr.get(
            `${GET_SLIDESHOW_PREVIEW_URL}/${slideshowId}`
          );
          if (res.status) {
            if (res.data?.data?.slideShowSetting) {
              const slideShowSetting = res.data.data.slideShowSetting;
              const values = {
                title: slideShowSetting?.title || "Untitled Slideshow",
                feedCode: slideShowSetting?.feedCode || "",
                presentationSize:
                  slideShowSetting?.presentation_size === "960*720" ? 2 : 1,
                autoSlide: slideShowSetting?.auto_slide || 0,
                img: slideShowSetting?.background_image || "",
                size: slideShowSetting?.background_size || "cover",
                position: slideShowSetting?.background_position || "center",
                repeat: slideShowSetting?.background_repeat || "no-repeat",
                repeatSlideshow: !!slideShowSetting?.slideshow_repeat,
                slideNumbers: !!slideShowSetting?.show_slide_no,
                grids: !!slideShowSetting.slideshow_gridlines,
                color: !!slideShowSetting.background_color
                  ? typeof slideShowSetting.background_color === "string"
                    ? hexToRgba(slideShowSetting.background_color)
                    : slideShowSetting.background_color
                  : {
                      r: "255",
                      g: "255",
                      b: "255",
                      a: "1",
                    },
                isImage: !!slideShowSetting?.background_image,
              };
              setSettings(values);
            }
            if (res.data?.data?.slides) {
              setSlideAudio(
                res.data.data.slides.map(slide => {
                  return {
                    url: slide.audio.audio_url,
                    audio: new Audio(slide.audio.audio_url),
                  };

                  // return slide.audio.url;
                })
              );
              const slides = res.data.data.slides
                .filter(slide => !!slide.content)
                .map(slide =>
                  generateSlideObject(
                    slide.content.replace(
                      "https://sycu-slidr.s3.us-east-2.amazonaws.com/",
                      "https://d2g6srkw70dncs.cloudfront.net/"
                    ),
                    slide.slide_id,
                    slide.audio
                  )
                );

              if (!!slides.filter(slide => !!slide).length) {
                setSlides(slides);
              }
            }
            if (Object.keys(res.data?.data?.slideshowPlaylist).length !== 0) {
              res.data?.data?.slideshowPlaylist.is_playlist &&
                setSource(
                  res.data?.data?.slideshowPlaylist
                    ? res.data?.data?.slideshowPlaylist?.audio?.map(url => {
                        return {
                          url,
                          audio: new Audio(url),
                        };
                      })
                    : []
                );
            }
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
        }
      })();
    }
  }, [slideshowId, dispatch]);

  useEffect(() => {
    if (!isEmptyArray(slideAudio) && slideAudio[currentIndex]?.url !== "") {
      // Pause all other audio
      slideAudio?.forEach(singleAudio => {
        singleAudio.audio.pause();
        singleAudio.audio.currentTime = 0;
      });

      // Play audio for the current slide if it exists
      const currentSlideAudio = slideAudio[currentIndex]?.audio;
      if (currentSlideAudio) {
        currentSlideAudio.volume = volume; // Set volume for the current audio
        currentSlideAudio.play();

        // Add event listener for when the audio ends
        currentSlideAudio.addEventListener("ended", () => {
          currentSlideAudio.play();
        });
      }

      // Pause any playlist audio if it exists
      !isEmptyArray(sources) && sources[audioIndex].audio.pause();
    } else if (!isEmptyArray(sources)) {
      // Reset all audio for the current slide
      slideAudio?.forEach(singleAudio => {
        singleAudio.audio.pause();
        singleAudio.audio.currentTime = 0;
      });

      // Start playing the playlist audio with the updated volume if it exists
      setIsAudioPlaying(true);
      if (isPlaylistPlaying) {
        const currentPlaylistAudio = sources[audioIndex]?.audio;
        if (currentPlaylistAudio) {
          currentPlaylistAudio.volume = volume; // Set volume for playlist audio
          currentPlaylistAudio.play();
        }
      } else {
        sources[audioIndex].audio.pause();
      }

      // Add event listener for when playlist audio ends
      sources[audioIndex].audio.addEventListener("ended", () => {
        if (sources.length === audioIndex + 1) {
          sources.length === 1
            ? sources[audioIndex].audio.play()
            : setAudioIndex(0);
        } else {
          setAudioIndex(audioIndex + 1);
        }
      });
    }
  }, [
    currentIndex,
    audioIndex,
    slideAudio,
    sources,
    isAudioPlaying,
    isPlaylistPlaying,
    volume,
  ]);

  return (
    <div className="main_part ">
      <div className="reveal">
        <div className="slides">
          {/* <div className={!!isPreviewVideo ? "slides-2" : "slides"}> */}
          {loading ? (
            <section>
              {" "}
              <Loader withFullscreen={false} />{" "}
            </section>
          ) : (
            slides.map((slide, index) => (
              <section
                key={slide.id}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  ...(slide.backgroundType === "image"
                    ? {
                        ...getBackgroundImageData({
                          url: slide.backgroundImage,
                          position: slide.backgroundPosition,
                          repeat: slide.backgroundRepeat,
                          size: slide.backgroundSize,
                        }),
                      }
                    : slide.backgroundType === "color"
                    ? {
                        ...getBackgroundColorData(slide.backgroundColor),
                      }
                    : settings.isImage
                    ? {
                        ...getBackgroundImageData({
                          url: settings.img,
                          position: settings.position,
                          repeat: settings.repeat,
                          size: settings.size,
                        }),
                      }
                    : { ...getBackgroundColorData(settings.color) }),
                }}
                // style={{
                // width: "100%",
                // height: "100%",
                // position: "relative",
                // overflow: "hidden",
                // }}
              >
                {!!slide.videoUrl ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    {!!isPreviewVideo ? (
                      <ReactPlayer
                        key={currentIndex}
                        url={slide.videoUrl}
                        controls
                        playing={currentIndex === index ? true : false}
                        width="100%"
                        height="100%"
                        //className="video-preview-view"
                        className={
                          isFullScreen
                            ? "video-preview-view"
                            : "video-preview-view-1"
                        }
                        // id="video-view"
                      />
                    ) : (
                      <>
                        <img
                          alt="videoPreviewImage"
                          data-src={
                            slide.videoPreviewImageUrl.includes(
                              "img.youtube.com"
                            )
                              ? getYoutubeMaxResolutionImage(
                                  getCloudFrontImgUrl(
                                    slide.videoPreviewImageUrl
                                  )
                                )
                              : getCloudFrontImgUrl(slide.videoPreviewImageUrl)
                          }
                          style={{
                            height: "100%",
                            width: "100%",
                            objectPosition: "center",
                            objectFit: "contain",
                          }}
                        />
                        <Link
                          className="bg-video--play-image"
                          target="__blank"
                          to={{ pathname: slide.videoUrl }}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    {slide.textFields
                      .filter(field => !["", "<p></p>"].includes(field.text))
                      .map(textField => (
                        <div
                          key={textField.id}
                          style={{
                            position: textField.position,
                            zIndex: textField.zIndex,
                            width: textField.width,
                            height: textField.height,
                            top: `${textField.translate.y}px`,
                            left: `${textField.translate.x}px`,
                          }}
                        >
                          <div
                            style={{
                              textAlign: textField.textAlign,
                              fontFamily: textField.fontFamily,
                              fontSize: textField.fontSize,
                              lineHeight: textField.lineHeight,
                              color: textField.color,
                              ...(textField.backgroundColor
                                ? {
                                    backgroundColor: `rgba(${Object.values(
                                      textField.backgroundColor
                                    ).join(",")})`,
                                  }
                                : {}),
                              opacity: `${textField.opacity}%`,
                              borderColor: textField.borderColor,
                              borderWidth: textField.borderWidth,
                              borderRadius: textField.borderRadius,
                              borderStyle: textField.borderStyle,
                              ...(textField.isBold
                                ? { fontWeight: "bold" }
                                : {}),
                              ...(textField.isUnderline
                                ? { textDecoration: "underline" }
                                : {}),
                              ...(textField.isItalic
                                ? { fontStyle: "italic" }
                                : {}),
                              width: "100%",
                              height: "100%",
                              transform: `rotate(${textField.rotate}deg)`,
                            }}
                            dangerouslySetInnerHTML={{
                              __html: DomPurify.sanitize(textField.text),
                            }}
                            // dangerouslySetInnerHTML={{
                            //   __html:
                            //     !!textField.text &&
                            //     !["<p></p>", ""].includes(textField.text)
                            //       ? DomPurify.sanitize(textField.text)
                            //       : `<p>${textField.placeholder}</p>`,
                            // }}
                          />
                        </div>
                      ))}
                    {slide.imageFields.map(imageField => (
                      <div
                        key={imageField.id}
                        style={{
                          position: imageField.position,
                          zIndex: imageField.zIndex,
                          width: imageField.width,
                          height: imageField.height,
                          top: `${imageField.translate.y}px`,
                          left: `${imageField.translate.x}px`,
                        }}
                      >
                        <div
                          style={{
                            opacity: `${imageField.opacity}%`,
                            borderColor: imageField.borderColor,
                            borderWidth: imageField.borderWidth,
                            borderRadius: imageField.borderRadius,
                            borderStyle: imageField.borderStyle,
                            width: "100%",
                            height: "100%",
                            transform: `rotate(${imageField.rotate}deg)`,
                            overflow: imageField.overflow,
                          }}
                        >
                          <img
                            data-src={decodeURI(
                              getCloudFrontImgUrl(imageField.src)
                            )}
                            alt="img"
                            className="slide-show-img"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default SlideshowPreview;
