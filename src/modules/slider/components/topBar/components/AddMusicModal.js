import CustomDropZone from "common/CustomDropZone/CustomDropZone";
import CommonButton from "components/CommonButton";
import { useFormik } from "formik";
import { addEditSlideMusic } from "modules/slider/store/actions";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  FormFeedback,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  // Toast,
} from "reactstrap";
import * as Yup from "yup";

const initialValues = {
  music: "",
  duration: 0,
  autoplay: true,
};

const validationSchema = Yup.object().shape({
  music: Yup.string().required("Music is required."),
});

const AddMusicModal = forwardRef(({ isMusicSlide }, ref) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const musicRef = useRef();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const onSubmit = async values => {
    dispatch(
      addEditSlideMusic(
        {
          musicUrl: values.music,
          autoPlay: values.autoplay,
        },
        () => {
          onClose();
        }
      )
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
    }),
    []
  );

  const onClose = () => {
    setIsOpen(false);
    resetForm({
      values: {
        music: isMusicSlide?.audioUrl || "",
        duration: 0,
        autoplay: isMusicSlide?.audioAutoplay || true,
      },
    });
  };

  const { values, handleSubmit, setFieldValue, errors, resetForm } = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit,
  });

  useEffect(() => {
    resetForm({
      values: {
        music: isMusicSlide?.audioUrl || "",
        duration: 0,
        autoplay: isMusicSlide?.audioAutoplay || true,
      },
    });
  }, [isMusicSlide, resetForm]);

  const handleRemove = cb => {
    resetForm({
      values: {
        music: "",
        duration: 0,
        autoplay: true,
      },
    });

    cb();
  };

  const handleMusic = url => {
    if (url === "music") {
      handleRemove(() => {
        dispatch(
          addEditSlideMusic(
            {
              musicUrl: "",
              autoPlay: values.autoplay,
            },
            () => {}
          )
        );
      });
    } else {
      setFieldValue("music", url);
    }
  };

  const customSubmit = e => {
    e.preventDefault();
    if (!!musicRef.current?.isUploading) {
      toast.warning("Please wait while music is uploading...");
      return;
    }

    handleSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      centered
      className="slidr-modal add-video-modal slidr-slideshow-modal music_upload_modal_main"
      backdrop="static"
    >
      <ModalHeader toggle={onClose}>Upload Music</ModalHeader>
      <form onSubmit={customSubmit} id="slidr-image-upload-form">
        <ModalBody>
          <CustomDropZone
            ref={musicRef}
            type="music"
            src={values.music}
            handleOnDrop={handleMusic}
            // accept=".mp3"
            accept={{ "audio/*": [] }}
            folderName={process.env.REACT_APP_AWS_FOLDER_MUSIC}
            bucketName={process.env.REACT_APP_AWS_BUCKET_SLIDR}
            error={!!errors.music}
            errorMessage={errors.music}
            showPreview={false}
            handleSwitch={resetForm}
            handleKeyUp={() => {}}
            isUploadingFile={isUploadingFile}
            setIsUploadingFile={setIsUploadingFile}
            handleOnclose={() => {
              setIsOpen(false);
            }}
          />

          {!!errors.music && (
            <FormFeedback className="d-flex">{errors.music}</FormFeedback>
          )}

          {/* {values.music && (
            <MusicPreview
              src={values.music}
              cb={() => {
                handleRemove(() => {
                  dispatch(
                    addEditSlideMusic(
                      {
                        musicUrl: "",
                        autoPlay: values.autoplay,
                      },
                      () => {}
                    )
                  );
                });
              }}
            />
          )} */}
        </ModalBody>
        <ModalFooter>
          <div className="d-flex text-end gap-3 add-music-modal-style">
            <CommonButton
              btnClass="px-4"
              btnText="Cancel"
              btnClick={() => setIsOpen(false)}
              btnCancel
            />
            {values.music ? (
              <CommonButton
                CommonButton
                btnType="submit"
                btnForm="slidr-image-upload-form"
                btnClass="px-3"
                btnDisabled={false}
                btnText="Add music in slide"
                //btnClick={() => setIsOpen(false)}
              />
            ) : (
              <CommonButton
                btnType="submit"
                btnForm="slidr-image-upload-form"
                btnClass="px-3"
                btnDisabled={false}
                btnText={false ? "Loading..." : "Upload Music"}
              />
            )}
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
});

export default AddMusicModal;
