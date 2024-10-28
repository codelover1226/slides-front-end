/* eslint-disable no-unused-vars */
import React, {
  useCallback,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { FormFeedback, Input, Label, Progress } from "reactstrap";
import { useDropzone } from "react-dropzone";
import { s3 } from "services/aws";
import { getCloudFrontImgUrl } from "utils/cloudFrontUrl";
import { toast } from "react-toastify";
import { isEmptyArray } from "formik";
import uploadCloud from "assets/images/ic_upload.svg";
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

const CutomeDropZoneMultiple = forwardRef(
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
      isSlider = false,
      isLink = false,
      customPlaceHolder = "",
    },
    ref
  ) => {
    const [progress, setProgress] = useState({
      0: 0,
    });
    const [totalFiles, setTotalFiles] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isVideoLink, setIsVideoLink] = useState(false);
    const [isMusicLink, setIsMusicLink] = useState(false);

    useEffect(() => {
      if (!!isLink && !!isSlider) {
        setIsVideoLink(true);
      }
    }, [isLink, isSlider]);

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

    useEffect(() => {
      if (progressValue === 100 && isUploading) {
        setIsUploading(false);
        setProgress({ 0: 0 });
        setTotalFiles(0);
      }
    }, [progressValue, isUploading]);

    const onDrop = useCallback(
      acceptedFiles => {
        setTotalFiles(acceptedFiles.length);

        if (multiple) {
          const files = acceptedFiles;

          if (!!files?.length) {
            setIsUploading(true);
            files.forEach((file, i) => {
              const fileName = file.name
                .split(".")
                .slice(0, -1)
                .join(".")
                .replace(/[\s()+]/g, "_")
                .replace(".", "_");

              const fileExtension = file.name.split(".").pop();

              const currentTime = file.lastModified;

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
            const fileName = file.name
              .split(".")
              .slice(0, -1)
              .join(".")
              .replace(/[\s()+]/g, "_")
              .replace(".", "_");

            const fileExtension = file.name.split(".").pop();

            const currentTime = file.lastModified;

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
      <div className={`${withBottomMargin ? "mb-3" : ""}`}>
        <div className="mb-2">
          {!!label && <Label className="mb-0">{label}</Label>}
          {type === "video" && (
            <>
              {!!!isSlider && (
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
              )}
            </>
          )}
        </div>

        {isVideoLink ? (
          <>
            <div className="mb-3">
              <Input
                type="url"
                value={src}
                name={name || "video"}
                placeholder={
                  !!customPlaceHolder ? customPlaceHolder : "Video Link"
                }
                // onKeyUp={handleKeyUp}
                onChange={e => {
                  handleOnDrop(e.target.value);
                }}
                invalid={error && !!errorMessage}
              />
              <FormFeedback>{errorMessage}</FormFeedback>
            </div>
          </>
        ) : isMusicLink ? (
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
            <div className={"d-flex align-items-center flex-column"}>
              <div
                {...getRootProps()}
                className="dropzone-area d-flex align-items-center justify-content-center w-100"
                style={{
                  borderColor: error
                    ? "#F46A6A"
                    : isDragActive
                    ? "rgba(52, 195, 143)"
                    : "#ced4da",
                }}
              >
                <input {...getInputProps()} disabled={isUploading} />
                {error && !!errorMessage ? (
                  <span className="text-danger text-capitalize text-center">
                    {errorMessage}
                  </span>
                ) : isDragActive ? (
                  <p className="mb-2 text-center">
                    <img src={uploadCloud} alt="Upload" />
                    <label>Drop {type} here</label>
                  </p>
                ) : (
                  <div>
                    <img
                      src={uploadCloud}
                      alt="Upload"
                      className="uploadIcon"
                    />
                    <p
                      className="mb-0 text-center"
                      style={{ fontSize: "16px", color: "#334266" }}
                    >
                      Drag and drop your {type} here
                    </p>
                    <p
                      className="mb-0 text-center"
                      style={{
                        fontSize: "12px",
                        paddingTop: "8px",
                        color: "#888E9A",
                      }}
                    >
                      Supported files: JPG, PNG, GIF, or WebP
                    </p>
                  </div>
                )}
              </div>
              {!multiple &&
                !!src &&
                (type === "image" ? (
                  <div
                    className="image-container me-2"
                    style={{ width: "125px" }}
                  >
                    <img
                      className="ms-2 icon-image"
                      src={getCloudFrontImgUrl(src)}
                      alt="icon"
                    />
                    <button
                      type="button"
                      className="close-icon text-white p-0 bg-danger"
                      onClick={() => handleOnDrop("")}
                    >
                      <i className="bx bx-x" />
                    </button>
                  </div>
                ) : type === "video" && showPreview ? (
                  <div className="video-box ms-2">
                    <Video src={src} className="icon-video" />
                    <button
                      type="button"
                      className="close-icon text-white p-0 bg-danger me-2"
                      onClick={() => handleOnDrop("")}
                    >
                      <i className="bx bx-x" />
                    </button>
                  </div>
                ) : type === "zip" ? (
                  <div className="image-container ms-2 ">
                    <div className="h-100 w-100 d-flex align-items-center justify-content-center">
                      <i className="fas fa-file-archive fa-6x" />
                    </div>
                    <button
                      type="button"
                      className="close-icon text-white p-0 bg-danger me-2"
                      onClick={() => handleOnDrop("")}
                    >
                      <i className="bx bx-x" />
                    </button>
                  </div>
                ) : type === "document" ? (
                  <></>
                ) : type === "music" ? (
                  <></>
                ) : null)}
              {multiple && showPreview && !isEmptyArray(src) && (
                <div
                  style={{
                    border: "1px solid #AECF6D",
                    width: "100%",
                    borderRadius: "10px",
                    marginTop: "24px",
                    padding: "16px 0px 10px 10px",
                  }}
                >
                  <div className="d-flex pb-1 gap-3 overflow-x-auto overflow-y-hidden multiple-image">
                    {src
                      ?.filter(item => item !== "")
                      .map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            {type === "image" ? (
                              <div
                                className="image-container"
                                style={{ width: "125px", height: "76px" }}
                              >
                                <img
                                  className="icon-image"
                                  style={{ width: "125px", height: "76px" }}
                                  src={getCloudFrontImgUrl(item)}
                                  alt="icon"
                                />
                                <button
                                  type="button"
                                  className="close-icon text-white p-0 me-2 bg-danger"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    position: "absolute",
                                    top: "3px",
                                    right: "-6px",
                                  }}
                                  onClick={() => handleRemove(item)}
                                >
                                  <i className="bx bx-x " />
                                </button>
                              </div>
                            ) : null}
                          </React.Fragment>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
            {isUploading && (
              <div className="mt-1">
                <Progress value={progressValue} className="progress-xl">
                  {progressValue.toFixed(0)}%
                </Progress>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
export default CutomeDropZoneMultiple;
