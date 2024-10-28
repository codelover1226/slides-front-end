//import checkIcon from "assets/images/Check.svg";
import uploadCloud from "assets/images/ic_upload.svg";
import loadingGIF from "assets/images/loading_20X20.gif";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import playbackIcon from "assets/images/playback speed.svg";
import downloadIcon from "assets/images/download_music.svg";
import deleteIcon from "assets/images/delete.svg";
import leftIcon from "assets/images/left.png";
import { BsThreeDots } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { IoPauseOutline } from "react-icons/io5";
import { CiVolumeHigh } from "react-icons/ci";
import { CiVolumeMute } from "react-icons/ci";
import { getCloudFrontImgUrl } from "constants/cloudFront";
import { useDispatch } from "react-redux";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormFeedback,
  Input,
  Label,
  Progress,
} from "reactstrap";
import { s3 } from "services/aws";
import { useRef } from "react";
import { addEditSlideMusic } from "modules/slider/store/actions";

const MusicPreview = ({ src, cb, handleOnDrop, handleOnclose }) => {
  const type = useMemo(
    () =>
      src.includes("www.youtube.com")
        ? "youtube"
        : src.includes("vimeo.com")
        ? "vimeo"
        : "aws",

    [src]
  );
  const [firstDropdownOpen, setFirstDropdownOpen] = useState(false);
  const [secondDropdownOpen, setSecondDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const toggleFirstDropdown = () => {
    setFirstDropdownOpen(!firstDropdownOpen);
  };

  const toggleSecondDropdown = () => {
    setSecondDropdownOpen(!secondDropdownOpen);
  };

  const handleFirstItemClick = () => {
    setSecondDropdownOpen(true);
  };

  const playerRef = useRef(null);

  const handleSpeedChange = speed => {
    playerRef.current.audio.current.playbackRate = speed;
  };

  const downloadMusic = () => {
    fetch(src)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "music-file.mp3");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(error => console.error("Error downloading music: ", error));
  };

  return type === "aws" ? (
    <div>
      {/* <div
        className="playlist-remove-modal"
        onClick={() => {
          cb("");
        }}
      >
        <i className="bx bx-x mt-1"></i>
      </div> */}
      {/* <audio controls style={{ width: "100%" }}>
        <source src={src} type="audio/ogg" />
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio> */}
      <div
        className="d-flex justify-content-end volume-dropdown"
        style={{ marginRight: "8px", cursor: "pointer" }}
      >
        <Dropdown isOpen={firstDropdownOpen} toggle={toggleFirstDropdown}>
          <DropdownToggle>
            <BsThreeDots color="black" />
          </DropdownToggle>
          <DropdownMenu className="dropdown_music">
            <DropdownItem
              className="d-flex gap-2"
              style={{ paddingBottom: "12px" }}
              onClick={handleFirstItemClick}
            >
              <div className="image-container-music">
                <img src={playbackIcon} alt="playback" />
              </div>
              <span> Playback Speed</span>
            </DropdownItem>
            <DropdownItem
              className="d-flex gap-2"
              onClick={downloadMusic}
              style={{ paddingBottom: "12px" }}
            >
              <div className="image-container-music">
                <img src={downloadIcon} alt="playback" />
              </div>
              <span> Export Music</span>
            </DropdownItem>
            <DropdownItem
              className="d-flex gap-2"
              // onClick={() => handleOnDrop(type === "music" ? type : "")}
              onClick={() => {
                handleOnDrop(type === "music" ? type : "");
                dispatch(
                  addEditSlideMusic(
                    {
                      musicUrl: "",
                      autoPlay: 1,
                    },
                    () => {
                      handleOnclose();
                    }
                  )
                );
              }}
            >
              <div className="image-container-music">
                <img src={deleteIcon} alt="playback" />
              </div>{" "}
              <span> Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown isOpen={secondDropdownOpen} toggle={toggleSecondDropdown}>
          <DropdownMenu className="playback-spped-menu">
            <DropdownItem header className="d-flex gap-2">
              <div
                className="image-container-music"
                onClick={() => {
                  toggleFirstDropdown();
                  toggleSecondDropdown();
                }}
              >
                <img src={leftIcon} alt="playback" />
              </div>{" "}
              <span className="playBackSpeed-mini-Container">
                {" "}
                Playback Speed
              </span>
            </DropdownItem>
            <hr />
            <DropdownItem
              className="ml-5 playbackspeed-dropdownitem"
              onClick={() => handleSpeedChange(0.25)}
            >
              0.25
            </DropdownItem>
            <DropdownItem
              className="ml-5 playbackspeed-dropdownitem"
              onClick={() => handleSpeedChange(0.5)}
            >
              0.5
            </DropdownItem>
            <DropdownItem
              className="ml-5 playbackspeed-dropdownitem"
              onClick={() => handleSpeedChange(0.75)}
            >
              0.75
            </DropdownItem>
            <DropdownItem
              className="ml-5 playbackspeed-dropdownitem"
              onClick={() => handleSpeedChange(1)}
            >
              Odinary
            </DropdownItem>
            <DropdownItem
              className="ml-5 playbackspeed-dropdownitem"
              onClick={() => handleSpeedChange(1.25)}
            >
              1.25
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <AudioPlayer
        ref={playerRef}
        src={src}
        customAdditionalControls={[]}
        showJumpControls={false}
        customIcons={{
          play: <FaPlay color="#AECF6D" size={20} />,
          pause: <IoPauseOutline color="#AECF6D" size={20} />,
          volume: <CiVolumeHigh color="black" size={20} />,
          volumeMute: <CiVolumeMute color="black" size={20} />,
        }}
        // playbackRate={playbackSpeed}
        showDownloadProgress={false}
      />
    </div>
  ) : (
    <>
      <iframe
        title="slidr-video"
        src={src}
        width="100%"
        height={320}
        frameBorder="0"
        allow="autoplay; picture-in-picture"
        allowFullScreen
      ></iframe>
    </>
  );
};

const Video = ({ src }) => {
  return (
    <video controls className="video" key={src}>
      <source src={src} type="video/mp4" />
      <source src={src} type="video/ogg" />
      <source src={src} type="video/ogg" />
      <source src={src} type="video/ogg" />
    </video>
  );
};

const CustomDropZone = forwardRef(
  (
    {
      label,
      handleOnDrop,
      src,
      accept = "image/*",
      folderName,
      type = "image",
      bucketName,
      handleRemove = () => {},
      error,
      errorMessage,
      handleKeyUp,
      multiple = false,
      name,
      withBottomMargin = true,
      showPreview = true,
      handleSwitch = () => {},
      setIsUploadingFile,
      handleOnclose,
      title,
    },
    ref
  ) => {
    const [progress, setProgress] = useState({
      0: 0,
    });
    const [totalFiles, setTotalFiles] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isMusicLink] = useState(false);
    const [fileData, selectedFileData] = useState([]);
    useImperativeHandle(
      ref,
      () => ({
        isUploading,
      }),
      [isUploading]
    );

    const progressValue = useMemo(() => {
      const values = Object.values(progress);
      return values.reduce((a, b) => a + b, 0) / totalFiles;
    }, [progress, totalFiles]);

    // useEffect(() => {
    //   if (progressValue === 100 && isUploading) {
    //     setIsUploading(false);
    //     //setIsUploadingFile(false);
    //     setProgress({ 0: 0 });
    //     setTotalFiles(0);
    //   }
    // }, [progressValue, isUploading]);

    const formatBytes = bytes => {
      var kb = 1024;
      var ndx = Math.floor(Math.log(bytes) / Math.log(kb));
      var fileSizeTypes = [
        "bytes",
        "kb",
        "mb",
        "gb",
        "tb",
        "pb",
        "eb",
        "zb",
        "yb",
      ];

      return {
        size: +(bytes / kb / kb).toFixed(2),
        type: fileSizeTypes[ndx],
      };
    };

    const getSize = url => {
      var xhr = new XMLHttpRequest();

      xhr.open("HEAD", url, true);

      xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE) {
          const fsize = xhr.getResponseHeader("Content-Length")
            ? formatBytes(parseInt(xhr.getResponseHeader("Content-Length")))
            : 0;
          if (fsize) {
            selectedFileData(prev => ({
              ...prev,
              size: fsize.size + " " + fsize.type,
            }));
          }
        }
      };
      xhr.send();
    };

    useEffect(() => {
      if (!!src) {
        selectedFileData(prev => ({
          ...prev,
          fileName: src.substring(src.lastIndexOf("/") + 1),
        }));
        getSize(src);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    const onDrop = useCallback(
      acceptedFiles => {
        setTotalFiles(acceptedFiles.length);

        if (multiple) {
          const files = acceptedFiles;

          if (!!files?.length) {
            setIsUploading(true);
            setProgress({ 0: 0 });
            setIsUploadingFile(true);
            files.forEach((file, i) => {
              const fileName = file.name
                .split(".")
                .slice(0, -1)
                .join(".")
                .replace(/[\s()+]/g, "_")
                .replace(".", "_");

              const fileExtension = file.name.split(".").pop();

              const currentTime = file.lastModified;

              const getSize = formatBytes(file.size);
              const fileDetails = {
                fileName: fileName + "." + fileExtension,
                size: getSize.size + " " + getSize.type,
              };
              selectedFileData(fileDetails);

              const fileFullName =
                fileName + "_" + currentTime + "." + fileExtension;

              const params = {
                ACL: "public-read",
                Key: fileFullName,
                ContentType: file.type,
                Body: file,
              };

              s3(folderName, bucketName)
                .upload(params)
                .on("httpUploadProgress", function (evt) {
                  const value = Math.round((evt.loaded / evt.total) * 100);
                  setProgress(prev => ({
                    ...prev,
                    [i]: value,
                  }));
                })
                .send(function (err, data) {
                  if (err) {
                    return;
                  }
                  handleOnDrop(data.Location);
                });
            });
          }
        } else {
          const file = acceptedFiles[0];
          if (!!file) {
            setIsUploading(true);
            setProgress({ 0: 0 });
            setIsUploadingFile(true);
            const fileName = file.name
              .split(".")
              .slice(0, -1)
              .join(".")
              .replace(/[\s()+]/g, "_")
              .replace(".", "_");

            //formatBytes
            const fileExtension = file.name.split(".").pop();

            const currentTime = file.lastModified;

            const getSize = formatBytes(file.size);
            const fileDetails = {
              fileName: fileName + "." + fileExtension,
              size: getSize.size + " " + getSize.type,
            };
            selectedFileData(fileDetails);

            const fileFullName =
              fileName + "_" + currentTime + "." + fileExtension;

            const params = {
              ACL: "public-read",
              Key: fileFullName,
              ContentType: file.type,
              Body: file,
            };

            s3(folderName, bucketName)
              .upload(params)
              .on("httpUploadProgress", function (evt) {
                const value = Math.round((evt.loaded / evt.total) * 100);
                setProgress({ 0: value });
              })
              .send(function (err, data) {
                if (err) {
                  return;
                }
                handleOnDrop(data.Location);
                setIsUploading(false);
                //setIsUploadingFile(false);
              });
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [folderName, bucketName, handleOnDrop]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
      useDropzone({
        onDrop,
        accept,
        multiple,
      });
    useEffect(() => {
      if (
        fileRejections &&
        fileRejections.length &&
        fileRejections[0]?.errors[0]?.message
      ) {
        let fileType = fileRejections[0].errors[0].message;
        let fileTypeWithoutWildcard = fileType.replace(/\/\*/, "");
        toast.error(fileTypeWithoutWildcard + ".");
      }
    }, [fileRejections]);

    return (
      <div
        className={`${withBottomMargin ? "mb-3 w-100" : "w-100"} ${
          !!isUploading || !!src ? "uploadBox" : ""
        }`}
      >
        <div className="mb-2">
          {!!label && <Label className="mb-0">{label}</Label>}
          {/* {type === "video" && (
            <div className="custom-switch-row d-flex align-items-center justify-content-between">
              <div className="mb-0" htmlFor="is_arrow">
                Do you want to put video link instead ?
              </div>
              <div className="form-check form-switch form-switch-md custom-switch ms-1">
                <input
                  disabled={isUploading}
                  type="checkbox"
                  className="form-check-input cursor-pointer"
                  id="is_arrow"
                  checked={isVideoLink}
                  onChange={e => {
                    setIsVideoLink(e.target.checked);
                    handleSwitch();
                  }}
                />
              </div>
            </div>
          )} */}
        </div>

        {/* {isVideoLink ? (
          <>
            <div className="mb-3">
              <Input
                type="url"
                value={src}
                name={name || "video"}
                placeholder={"Video Link"}
                onKeyUp={handleKeyUp}
                onChange={e => {
                  handleOnDrop(e.target.value);
                }}
                invalid={error && !!errorMessage}
              />
              <FormFeedback>{errorMessage}</FormFeedback>
            </div>
          </>
        ) :  */}
        {isMusicLink ? (
          <>
            <div className="mb-3">
              <Input
                type="url"
                value={src}
                name={name || "music"}
                placeholder={"Music Link"}
                onKeyUp={handleKeyUp}
                onChange={e => {
                  handleOnDrop(e.target.value);
                }}
                invalid={error && !!errorMessage}
              />
              <FormFeedback>{errorMessage}</FormFeedback>
            </div>
          </>
        ) : (
          <>
            <div className={"dropzone-responsive"}>
              {!!isUploading && type !== "music" ? (
                <div className="image-container me-3">
                  <div className="loadingImg">
                    <img
                      src={loadingGIF}
                      alt="loading"
                      className="icon-image imgLoading"
                      style={{ width: "20px" }}
                    />
                  </div>
                </div>
              ) : !!src ? (
                type === "image" ? (
                  <div className="image-container me-3">
                    <div className="loadingImg">
                      <img
                        className="icon-image"
                        src={getCloudFrontImgUrl(src)}
                        alt="icon"
                      />
                    </div>
                  </div>
                ) : type === "video" && showPreview ? (
                  <div className="image-container me-3">
                    <div className="loadingImg">
                      <Video src={src} className="icon-video" />
                    </div>
                  </div>
                ) : null
              ) : null}
              {!!isUploading || !!src ? (
                <div
                  className={`${type === "music" ? "audiobox" : "filebox"}`}
                  style={{ paddingLeft: type === "music" ? "20px" : "" }}
                >
                  <div className="filelbl">
                    <span className="mediaName me-2">{fileData.fileName}</span>
                    {/* {isUploading === true ? (
                      <button type="button" className="delete-icon p-0">
                        <img src={pauseIcon} alt="pause-icon" />
                      </button>
                    ) : (
                      <button type="button" className="delete-icon p-0">
                        <img src={checkIcon} alt="pause-icon" />
                      </button>
                    )} */}
                    <div className="d-flex align-items-start">
                      {/* {!isUploading && (
                        <button type="button" className="delete-icon p-0">
                          <img
                            src={checkIcon}
                            alt="pause-icon"
                            style={{ width: "26px", height: "20px" }}
                          />
                        </button>
                      )} */}
                      {!isUploading && type !== "music" && (
                        <button
                          type="button"
                          className="delete-icon p-0 ms-2"
                          onClick={() => handleOnDrop()}
                        >
                          <i className="bx bx-trash" />
                        </button>
                      )}
                    </div>
                  </div>
                  {!isUploading &&
                    !!error &&
                    !!errorMessage &&
                    type !== "music" && (
                      <span className="text-danger text-capitalize text-center">
                        {errorMessage}
                        {fileData.size}
                      </span>
                    )}
                  <div className="mediaSize">
                    {isUploading ? (
                      <p className="">{fileData.size ? fileData.size : "-"}</p>
                    ) : (
                      // <p>{fileData.size}</p>
                      // <p>{`${type === "music" ? {fileData.size} : "Successfully uploaded"}`}</p>
                      <p>
                        {type === "video"
                          ? "Successfully uploaded"
                          : type === "music"
                          ? ""
                          : fileData.size}
                      </p>
                    )}
                  </div>

                  {!!isUploading && (
                    <div className="mt-1 progressBox">
                      <Progress
                        value={progressValue}
                        className="progress-xl"
                      ></Progress>
                      <span className="progressPer">
                        {progressValue.toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              ) : !src || !!error ? (
                <div
                  {...getRootProps()}
                  className="dropzone-area d-flex align-items-center justify-content-center"
                  style={{
                    borderColor: error
                      ? "#AECF6D" //"#F46A6A"
                      : isDragActive
                      ? "rgba(52, 195, 143)"
                      : "#AECF6D",
                    width: !!src || !!isUploading ? "75%" : "100%",
                  }}
                >
                  <input {...getInputProps()} disabled={isUploading} />
                  {/* {error && !!errorMessage ? (
                    <span className="text-danger text-capitalize text-center">
                      {errorMessage}
                    </span>
                  ) : isDragActive ? ( */}
                  {isDragActive ? (
                    <p className="mb-2 text-center">
                      <img src={uploadCloud} alt="Upload" />
                      <label>Drop {type} here</label>
                    </p>
                  ) : (
                    <>
                      <div className="mb-2">
                        {type === "video" ? (
                          <img
                            src={uploadCloud}
                            alt="Upload"
                            className="uploadIconVideo"
                          />
                        ) : (
                          <img
                            src={uploadCloud}
                            alt="Upload"
                            className="uploadIcon"
                          />
                        )}
                        <span className="mb-0 text-center d-flex align-items-center justify-content-center">
                          Drag and drop your {title === "gif" ? title : type}{" "}
                          here
                        </span>
                        {type === "video" && (
                          <p
                            className="mb-0 text-secondary text-center"
                            style={{ fontSize: "12px" }}
                          >
                            Recommended Video Length: 30 Seconds - 15 Minutes,
                            Video Quality: 1080P, Video Dimension: 16:9
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </div>
            {!!src && type === "music" && (
              <div className="w-100">
                <div className="">
                  <MusicPreview
                    src={src}
                    handleOnDrop={handleOnDrop}
                    handleOnclose={handleOnclose}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
export default CustomDropZone;
