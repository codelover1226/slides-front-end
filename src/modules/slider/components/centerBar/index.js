import { Editor } from "@tinymce/tinymce-react";
import copyToIcon from "assets/images/copyToBar.svg";
import deleteIcon from "assets/images/delete.svg";
import musicIcon from "assets/images/music-white.svg";
import playIcon from "assets/images/play.png";
import toBackIcon from "assets/images/toBack.svg";
import toFrontIcon from "assets/images/toFront.svg";
import {
  getCloudFrontImgUrl,
  getCloudFrontThumbnailUrl,
} from "constants/cloudFront";
import { fontFamilyInString } from "constants/slidr";
import DomPurify from "dompurify";
import useWindowSize from "hooks/useWindowSize";
import max from "lodash/max";
import min from "lodash/min";
import {
  addEditSlideMusic,
  setActiveField,
  setIsImageSelect,
  setModalPreview,
  setTextFieldValue,
  textFieldCopy,
  textFieldDelete,
} from "modules/slider/store/actions";
import { Resizable } from "re-resizable";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ContextMenuTrigger, MenuItem } from "react-contextmenu";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "reactstrap";

let resize = {
  x: 0,
  y: 0,
  height: "0px",
  width: "0px",
};

let drag = {
  x: 0,
  y: 0,
};

const Div = ({
  isActive,
  size,
  onResizeStop,
  onDragStop,
  children,
  onResize,
  onResizeStart,
  withDrag,
  ...rest
}) => {
  return isActive && withDrag ? (
    <Resizable
      bounds="parent"
      size={size}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
      handleClasses={{
        top: "resize resize-top",
        bottom: "resize resize-bottom",
        left: "resize resize-left",
        right: "resize resize-right",
        topLeft: "resize resize-top-left",
        topRight: "resize resize-top-right",
        bottomLeft: "resize resize-bottom-left",
        bottomRight: "resize resize-bottom-right",
      }}
      {...rest}
    >
      {children}
    </Resizable>
  ) : (
    <div {...rest}>{children}</div>
  );
};

const DraggableDiv = ({
  children,
  withDrag,
  onStop,
  onStart,
  isDisabled,
  position,
  onDrag,
}) => {
  return withDrag ? (
    <Draggable
      position={position}
      bounds="parent"
      onStop={onStop}
      onStart={onStart}
      disabled={isDisabled}
      handle="#handle"
      onDrag={onDrag}
      grid={[5, 5]}
      // cancel="#handle"
      allowAnyClick
    >
      {children}
    </Draggable>
  ) : (
    children
  );
};
const Input = ({ textField, setInputField, maxHeight }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const result = useWindowSize();
  const [height, setHeight] = useState(+textField.height.replace("px", ""));

  useEffect(() => {
    if (+textField.height.replace("px", "") !== height)
      dispatch(
        setTextFieldValue({
          key: "height",
          value: `${height}px`,
          id: textField.id,
        })
      );
  }, [height, textField, dispatch]);
  const changeText = e => {
    dispatch(
      setTextFieldValue({
        id: textField.id,
        key: "text",
        value: e,
      })
    );
  };

  // const isWebview = [
  //   'undo redo | fontselect fontsizesele forecolor backcolor alignleft italic underline bold',
  // ];

  // const MobileView = [
  //   "fontselect fontsizeselect",
  //   "alignleft",
  //   "italic underline bold",
  // ];

  return (
    <div
      style={{
        height: "100%",
        ...(!!textField.backgroundColor
          ? {
              backgroundColor: `rgb(${Object.values(
                textField.backgroundColor
              ).join(",")})`,
            }
          : {}),
      }}
    >
      <Editor
        // apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
        tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
        ref={ref}
        inline={true}
        // value={hideText === "" ? "" : textField.text}
        value={textField.text}
        onEditorChange={changeText}
        onClick={e => e.stopPropagation()}
        onKeyUp={e => {
          setHeight(e.target.offsetHeight);
          ref.current.elementRef.current.scrollTop =
            ref.current.elementRef.current.scrollHeight;
        }}
        onKeyDown={e => {
          e.stopPropagation();
        }}
        onFocus={() => {
          ref.current.editor.selection.select(
            ref.current.editor.getBody(),
            true
          );
          ref.current.editor.selection.collapse(false);
          ref.current.elementRef.current.scrollTop =
            ref.current.elementRef.current.scrollHeight;
        }}
        onBlur={e => {
          e.stopImmediatePropagation();
          setInputField("");
          ref.current.editor.remove();
        }}
        init={{
          selector: "#textArea",
          toolbar:
            result.width > 576
              ? "undo redo fontselect fontsizeselect forecolor backcolor alignleft italic underline bold"
              : "fontselect fontsizeselect alignleft italic underline bold",
          //toolbar: "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
          toolbar_mode: "scrolling",
          // mobile: {
          //   theme: "mobile",
          //   plugins: "autosave lists autolink",
          //   toolbar:
          //     "fontselect fontsizeselect alignleft italic underline bold",
          //   toolbar_mode: "scrolling",
          // },
          formats: {
            bold: {
              inline: "span",
              styles: { "font-weight": "bold" },
            },
            italic: {
              inline: "span",
              styles: { "font-style": "italic" },
            },
          },
          font_formats: fontFamilyInString,
          // "Andale Mono=andalemono; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Marvin=marvin-round, sans-serif; Futura-PT=futura-pt, sans-serif; Erica-One=Erica One, sans-serif; Paralucent-Condensed=paralucent-condensed, sans-serif; Catseye=catseye, sans-serif; Marvin Regular=marvin, sans-serif; Freude Regular=freude, sans-serif; HWT Artz Regular=hwt-artz, sans-serif; Pain de Mie Regular=pain-de-mie, sans-serif; OmnesGeorgian Bold=omnes-georgian, sans-serif; ScriptoramaMarkdownJF Regular=scriptorama-markdown-jf, sans-serif;",
          menubar: false,
          lineheight_formats: "14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
          fontsize_formats:
            "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 30pt 36pt 42pt 48pt 60pt 72pt 84pt 96pt 108pt 114pt 120pt 125pt",
          auto_focus: true,
          plugins: "importcss",
          //plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
          content_style: `.mce-content-body { 
                        outline: none;
                        border : none;
                        text-align: ${textField.textAlign};
                        font-family: ${textField.fontFamily};
                        font-size: ${textField.fontSize};
                        line-height: ${textField.lineHeight};
                        color: ${textField.color};
                        scroll-behavior: smooth;
                        max-height: ${maxHeight}px;
                        overflow-y: auto;
                        opacity: ${textField.opacity}%;
                        border-color: ${textField.borderColor};
                        border-width: ${textField.borderWidth};
                        border-radius: ${textField.borderRadius};
                        border-style: ${textField.borderStyle};
                        transform: rotate(${textField.rotate}deg);
                        ${textField.isBold ? "font-weight: bold;" : ""};
                        ${
                          textField.isUnderline
                            ? "text-decoration: underline;"
                            : ""
                        };
                        ${textField.isItalic ? "font-style: italic;" : ""}
                      },`,
        }}
      />
    </div>
  );
};
const TextField = ({
  textField,
  dispatch,
  withDrag,
  activeField,
  dragged,
  changeDrag,
}) => {
  const [dragging, setDragging] = useState("");
  const [inputFieldId, setInputField] = useState("");

  // const [hideText, setHideText] = useState(textField.text);
  const onResize = (e, direction, ref, d) => {
    const height = +resize.height.replace("px", "") + d.height;
    const width = +resize.width.replace("px", "") + d.width;
    handleChange("height", `${height}px`);
    handleChange("width", `${width}px`);
    if (["top", "topRight"].includes(direction)) {
      handleChange("translate", {
        x: resize.x,
        y: resize.y - d.height,
      });
    } else if (direction === "topLeft") {
      handleChange("translate", {
        x: resize.x - d.width,
        y: resize.y - d.height,
      });
    } else if (["left", "bottomLeft"].includes(direction)) {
      handleChange("translate", {
        x: resize.x - d.width,
        y: resize.y,
      });
    } else {
    }
  };
  const onDragStart = (e, data) => {
    drag.x = data.x;
    drag.y = data.y;
  };
  const onDragStop = (e, data, id) => {
    if (drag.x !== data.x || drag.y !== data.y)
      dispatch(
        setTextFieldValue({
          key: "translate",
          value: { x: data.x, y: data.y },
          id,
          isImage: false,
        })
      );
    setDragging("");
  };

  const onResizeStart = textField => {
    resize.x = textField.translate.x;
    resize.y = textField.translate.y;
    resize.height = textField.height;
    resize.width = textField.width;
  };
  const onResizeStop = () => {
    resize.x = 0;
    resize.y = 0;
    resize.height = "0px";
    resize.width = "0px";
  };

  const handleTextFieldClick = id => {
    dispatch(setActiveField(id));
  };

  const handleChange = (key, value) => {
    dispatch(
      setTextFieldValue({
        key,
        value,
      })
    );
  };
  const maxHeight = useMemo(
    () => 720 - textField.translate.y,
    [textField.translate.y]
  );
  const handleDelete = () => {
    dispatch(textFieldDelete());
  };
  return (
    <DraggableDiv
      position={{
        x: textField.translate.x,
        y: textField.translate.y,
      }}
      withDrag={withDrag}
      key={textField.id}
      onDrag={(e, data) => {
        e.stopPropagation();
        setDragging(textField.id);
        changeDrag(textField.id);
      }}
      onStart={onDragStart}
      onStop={(e, data) => onDragStop(e, data, textField.id)}
      isDisabled={inputFieldId === textField.id}
    >
      <Div
        withDrag={withDrag}
        onResize={onResize}
        onResizeStart={() => onResizeStart(textField)}
        onResizeStop={onResizeStop}
        size={{
          width: textField.width,
          height: textField.height,
        }}
        id="textArea"
        isActive={textField.id === activeField}
        className={`${
          textField.id === activeField && withDrag ? "border border-theme" : ""
        } `}
        style={{
          position: textField.position,
          transform: `translate(${textField.translate.x}px,${textField.translate.y}px)`,
          zIndex: textField.zIndex,
          width: textField.width,
          height: textField.height,
        }}
      >
        {inputFieldId === textField.id ? (
          <Input
            textField={textField}
            setInputField={setInputField}
            maxHeight={maxHeight}
            // hideText={hideText}
            // setHideText={setHideText}
          />
        ) : (
          <>
            <div
              onMouseUp={e => {
                e.stopPropagation();
                if (!!!dragged) {
                  dispatch(setIsImageSelect(false));
                  if (activeField !== textField.id) {
                    handleTextFieldClick(textField.id);
                  }
                } else {
                  if (dragged === textField.id) changeDrag(0);
                }
              }}
              onClick={e => {
                e.stopPropagation();
              }}
              onDoubleClick={e => {
                e.stopPropagation();
                setInputField(textField.id);
              }}
              onTouchStart={e => {
                e.stopPropagation();
                setInputField(textField.id);
                dispatch(setActiveField(textField.id));
              }}
              onBlur={() => setInputField("")}
              id="handle"
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
                transform: `${
                  !!textField.rotate ? `rotate(${textField.rotate}deg)` : ""
                }`,
                ...(textField.isBold ? { fontWeight: "bold" } : {}),
                ...(textField.isUnderline
                  ? { textDecoration: "underline" }
                  : {}),
                ...(textField.isItalic ? { fontStyle: "italic" } : {}),
                width: "100%",
                height: "100%",
              }}
              dangerouslySetInnerHTML={{
                __html:
                  !!textField.text && !["<p></p>", ""].includes(textField.text)
                    ? DomPurify.sanitize(textField.text)
                    : `<p>${textField.placeholder}</p>`,
              }}
            />
          </>
        )}
        {textField.id === activeField && withDrag && (
          <button
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
            title="Delete Text"
            className="btn p-0"
            onClick={handleDelete}
          >
            <i
              class="fa-solid fa-xmark text-danger"
              style={{ fontSize: "30px" }}
            ></i>
            {/* <i className="bx bx- text-danger" /> */}
          </button>
        )}
        {dragging === textField.id && (
          <>
            <span className="slidr-border-top" />
            <span className="slidr-border-right" />
            <span className="slidr-border-bottom" />
            <span className="slidr-border-left" />
          </>
        )}
      </Div>
    </DraggableDiv>
  );
};
const TextFields = ({
  dispatch,
  slide,
  withDrag,
  activeField,
  presentationSize,
  dragged,
  changeDrag,
}) => {
  return (
    <>
      {!!slide &&
        slide?.textFields &&
        slide.textFields.length > 0 &&
        slide.textFields.map(textField => (
          <TextField
            key={textField.id}
            textField={textField}
            dispatch={dispatch}
            withDrag={withDrag}
            presentationSize={presentationSize}
            activeField={activeField}
            dragged={dragged}
            changeDrag={changeDrag}
          />
        ))}
    </>
  );
};

const ImageFields = ({
  slide,
  withDrag,
  dispatch,
  activeField,
  presentationSize,
  dragged,
  changeDrag,
}) => {
  return (
    <>
      {slide &&
        slide?.imageFields &&
        slide.imageFields.length > 0 &&
        slide.imageFields.map(image => (
          <ImageField
            key={image.id}
            image={image}
            withDrag={withDrag}
            dispatch={dispatch}
            activeField={activeField}
            presentationSize={presentationSize}
            dragged={dragged}
            changeDrag={changeDrag}
            slide={slide}
          />
        ))}
    </>
  );
};

const ImageField = ({
  image,
  withDrag,
  dispatch,
  activeField,
  presentationSize,
  dragged,
  changeDrag,
  slide,
}) => {
  const [dragging, setDragging] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const { imageSelect } = useSelector(state => state.Slidr);
  const onImageDragStart = (e, data) => {
    drag.x = data.x;
    drag.y = data.y;
  };
  const onImageDragStop = (e, data, id) => {
    let payload = {
      key: "translate",
      value: { x: data.x, y: data.y },
      id: id,
      isImage: true,
    };
    dispatch(setTextFieldValue(payload));
    setDragging("");
  };
  const onResizeImage = (e, direction, ref, d) => {
    const height = +resize.height.replace("px", "") + d.height;
    const width = +resize.width.replace("px", "") + d.width;
    handleChange("height", `${height}px`);
    handleChange("width", `${width}px`);
    if (["top", "topRight"].includes(direction)) {
      handleChange("translate", {
        x: resize.x,
        y: resize.y - d.height,
      });
    } else if (direction === "topLeft") {
      handleChange("translate", {
        x: resize.x - d.width,
        y: resize.y - d.height,
      });
    } else if (["left", "bottomLeft"].includes(direction)) {
      handleChange("translate", {
        x: resize.x - d.width,
        y: resize.y,
      });
    } else {
    }
  };
  const onImageResizeStart = imageField => {
    resize.x = imageField.translate.x;
    resize.y = imageField.translate.y;
    resize.height = imageField.height;
    resize.width = imageField.width;
  };

  const onImageResizeStop = () => {
    resize.x = 0;
    resize.y = 0;
    resize.height = "0px";
    resize.width = "0px";
  };
  const maxZIndex = max([
    ...slide.imageFields.map(i => i.zIndex),
    ...slide.textFields.map(i => i.zIndex),
  ]);
  const minZIndex = min([
    ...slide.imageFields.map(i => i.zIndex),
    ...slide.textFields.map(i => i.zIndex),
  ]);
  const handleTextFieldClick = id => {
    dispatch(setActiveField(id));
  };
  const handleChange = (key, value) => {
    dispatch(
      setTextFieldValue({
        key,
        value,
      })
    );
  };

  const textField = useMemo(() => {
    if (slide) {
      return slide[imageSelect ? "imageFields" : "textFields"].find(
        field => field.id === activeField
      );
    }
    return null;
  }, [activeField, imageSelect, slide]);

  const handleDelete = () => {
    dispatch(textFieldDelete());
    setShowMenu(false);
  };

  const handleCopy = () => {
    dispatch(textFieldCopy());
    setShowMenu(false);
  };

  const handleSetTop = () => {
    if (maxZIndex === textField?.zIndex) return;
    const newZIndex = (maxZIndex || 1000) + 10;
    dispatch(
      setTextFieldValue({
        key: "zIndex",
        value: newZIndex,
      })
    );
    setShowMenu(false);
  };
  const handleSetBack = () => {
    if (minZIndex === textField?.zIndex) return;
    const newZIndex = (minZIndex || 1000) - 10;
    dispatch(
      setTextFieldValue({
        key: "zIndex",
        value: newZIndex,
      })
    );
    setShowMenu(false);
  };

  useEffect(() => {
    if (image.id !== activeField) {
      setShowMenu(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeField]);

  return (
    <DraggableDiv
      position={{
        x: image.translate.x,
        y: image.translate.y,
      }}
      withDrag={withDrag}
      key={image.id}
      onDrag={() => {
        setDragging(image.id);
        changeDrag(image.id);
      }}
      onStart={onImageDragStart}
      onStop={(e, data) => onImageDragStop(e, data, image.id)}
    >
      <Div
        onResize={onResizeImage}
        onResizeStart={() => onImageResizeStart(image)}
        onResizeStop={onImageResizeStop}
        withDrag={withDrag}
        size={{
          width: image.width,
          height: image.height,
        }}
        isActive={image.id === activeField}
        className={`${image.id === activeField ? "border border-theme" : ""} `}
        style={{
          position: image.position,
          transform: `translate(${image.translate.x}px,${image.translate.y}px)`,
          zIndex: image.zIndex,
          width: image.width,
          height: image.height,
        }}
      >
        <div
          onClick={e => {
            e.stopPropagation();
          }}
          onMouseUp={e => {
            e.stopPropagation();
            if (!!!dragged) {
              handleTextFieldClick(image.id);
              dispatch(setIsImageSelect(true));
            } else {
              if (dragged === image.id) changeDrag(0);
            }
          }}
          id="handle"
          style={{
            textAlign: image.textAlign,
            fontFamily: image.fontFamily,
            fontSize: image.fontSize,
            lineHeight: image.lineHeight,
            color: image.color,

            transform: `${!!image.rotate ? `rotate(${image.rotate}deg)` : ""}`,
            width: "100%",
            height: "100%",
          }}
        >
          <img
            alt="imageField"
            onContextMenu={e => {
              e.preventDefault();
              dispatch(setIsImageSelect(true));
              dispatch(setActiveField(image.id));
              if (activeField === image.id) {
                setShowMenu(true);
              } else {
                setShowMenu(false);
              }
            }}
            onTouchStart={e => {
              e.stopPropagation();
              dispatch(setIsImageSelect(true));
              dispatch(setActiveField(image.id));
            }}
            onBlur={() => setActiveField("")}
            className="user-drag-none"
            src={getCloudFrontImgUrl(image.src)}
            style={{
              height: "100%",
              width: "100%",
              // objectFit: "cover",
              // objectPosition: "center",

              opacity: `${image.opacity}%`,

              borderColor: image.borderColor,
              borderWidth: image.borderWidth,
              borderRadius: image.borderRadius,
              borderStyle: image.borderStyle,
            }}
          />
        </div>
        {dragging === image.id && (
          <>
            <span className="slidr-border-top" />
            <span className="slidr-border-right" />
            <span className="slidr-border-bottom" />
            <span className="slidr-border-left" />
          </>
        )}
        {showMenu ? (
          <nav
            className="react-contextmenu react-contextmenu--visible"
            style={{
              position: "fixed",
              opacity: "1",
              top: "120px",
              left: "100px",
              zIndex: 99999999999999,
            }}
          >
            <MenuItem data={{ foo: "bar" }} onClick={handleSetTop}>
              <img className="me-2" src={toFrontIcon} alt="bring front" /> To
              Front
            </MenuItem>
            <MenuItem data={{ foo: "bar" }} onClick={handleSetBack}>
              <img className="me-2" src={toBackIcon} alt="send back" /> To Back
            </MenuItem>
            <MenuItem data={{ foo: "bar" }} onClick={handleCopy}>
              <img className="me-2" src={copyToIcon} alt="copy to" /> Copy
            </MenuItem>
            <MenuItem data={{ foo: "bar" }} onClick={handleDelete}>
              <img className="me-2" src={deleteIcon} alt="duplicate" /> Delete
            </MenuItem>
          </nav>
        ) : (
          // </ContextMenu>
          <></>
        )}
      </Div>
    </DraggableDiv>
  );
};

const VideoField = ({ slide, dispatch }) => {
  return (
    <>
      {" "}
      {slide && slide?.videoUrl && (
        <React.Fragment>
          <img
            onClick={() => dispatch(setModalPreview(true))}
            src={playIcon}
            alt=""
            style={{
              color: "white",
              position: "absolute",
              top: "45%",
              left: "45%",
              cursor: "pointer",
              fontSize: "200px",
              zIndex: 9999,
            }}
          />
          {/*<i
              onClick={() => dispatch(setModalPreview(true))}
              className="bx bx-play-circle"
              style={{
                color: "white",
                position: "absolute",
                top: "35%",
                left: "43%",
                cursor: "pointer",
                fontSize: "200px",
                zIndex: 9999,
              }}
            ></i>*/}
          <img
            alt="videoPreviewImage"
            src={getCloudFrontThumbnailUrl(slide.videoPreviewImageUrl)}
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              inset: 0,
              objectPosition: "center",
              objectFit: "contain",
              top: 0,
              left: 0,
            }}
          />
        </React.Fragment>
      )}
    </>
  );
};

export const Container = ({ slide, withDrag = true, grids = true }) => {
  const { activeField, settings } = useSelector(state => state.Slidr);
  const [dragged, setDragged] = useState(0);
  const dispatch = useDispatch();

  const handleOutsideClick = () => {
    if (!!!dragged) {
      dispatch(setActiveField(""));
      dispatch(setIsImageSelect(false));
    } else {
      setDragged(0);
    }
  };

  const gridSize = useMemo(
    () =>
      settings.presentationSize === 1
        ? (1280 * 720) / 6400
        : (960 * 720) / 6400,
    [settings]
  );

  const changeDrag = useCallback(value => {
    setDragged(value);
  }, []);

  return (
    <React.Fragment>
      {slide ? (
        <section
          id={slide.id}
          className={`main-container ${
            settings.presentationSize === 2 ? "new-change-size" : ""
          }`}
          onClick={handleOutsideClick}
          style={{
            ...(slide.backgroundType === "image"
              ? !!slide.backgroundImage
                ? {
                    backgroundImage: `url("${slide.backgroundImage}")`,
                    backgroundPosition: slide.backgroundPosition,
                    backgroundSize: slide.backgroundSize,
                    backgroundRepeat: slide.backgroundRepeat,
                  }
                : {}
              : !!slide.backgroundColor
              ? {
                  backgroundColor:
                    typeof slide.backgroundColor === "string"
                      ? slide.backgroundColor
                      : `rgba(${Object.values(slide.backgroundColor).join(
                          ","
                        )})`,
                }
              : {}),
            height: "",
            width: settings.presentationSize === 1 ? "1280px" : "960px",
          }}
        >
          {settings.grids && grids && (
            <>
              {[...Array(gridSize).keys()].map((x, index) => (
                <div key={index} className="grid-block"></div>
              ))}
            </>
          )}
          <TextFields
            withDrag={withDrag}
            dispatch={dispatch}
            activeField={activeField}
            slide={slide}
            presentationSize={settings.presentationSize}
            dragged={dragged}
            changeDrag={changeDrag}
          />
          <ImageFields
            slide={slide}
            dispatch={dispatch}
            withDrag={withDrag}
            activeField={activeField}
            dragged={dragged}
            changeDrag={changeDrag}
          />
          <VideoField slide={slide} dispatch={dispatch} />
        </section>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

const CenterBar = () => {
  const dispatch = useDispatch();
  const { slides, activeSlide, activeField, activePlaylist } = useSelector(
    state => state.Slidr
  );

  // const currentSlide = useMemo(
  //   () => slides.find(slide => slide.id === activeSlide),
  //   [slides, activeSlide]
  // );
  const currentSlide = slides.find(slide => slide.id === activeSlide);

  return (
    <>
      <Card className="slidr-center-bar bg-light flex-grow-1 d-flex align-items-center">
        {!!currentSlide?.audioUrl && (
          <div className="slideAudioCard d-flex">
            <div className="audioIconBox">
              <img src={musicIcon} alt="audio" />
            </div>
            <div className="audio-text">
              {currentSlide?.audioUrl.substring(
                currentSlide?.audioUrl.lastIndexOf("/") + 1
              )}
            </div>
          </div>
        )}
        <div
          className={`slidr-container shadow-lg rounded ${
            !!activeField || !!activePlaylist ? "selected" : ""
          }`}
        >
          {activeSlide && currentSlide?.videoUrl ? (
            <>
              <ContextMenuTrigger
                id={currentSlide?.id?.toString()}
                holdToDisplay={-1}
              >
                <Container slide={currentSlide} />
              </ContextMenuTrigger>
            </>
          ) : (
            <Container slide={currentSlide} />
          )}
        </div>
        {!!currentSlide?.audioUrl && (
          <div className="slideBottomCard d-flex">
            <audio
              controls
              style={{ width: "100%" }}
              controlsList="nodownload noplaybackrate"
              className="audio-player-control"
            >
              <source src={currentSlide?.audioUrl} type="audio/ogg" />
              <source src={currentSlide?.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button
              type="button"
              className="delete-icon"
              onClick={() =>
                dispatch(
                  addEditSlideMusic(
                    {
                      musicUrl: "",
                      autoPlay: 1,
                    },
                    () => {}
                  )
                )
              }
            >
              <i className="bx bx-trash" />
            </button>
          </div>
        )}
      </Card>
    </>
  );
};

export default CenterBar;
