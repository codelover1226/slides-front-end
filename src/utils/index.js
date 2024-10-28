import { EXPORT_SLIDESHOW_IMAGES } from "helper/url_helper";
import { axiosSlidr } from "services/api";
import JSZipUtils from "./jsZIPUtils";
const saveAs = require("js-file-download");
const JSZip = require("jszip");

export const urlToPromise = (url, progress) =>
  new Promise(function (resolve, reject) {
    JSZipUtils.getBinaryContent(url, {
      callback: (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
      progress,
    });
  });

const isVimeoOrYoutubeVideo = url => {
  let check = false;
  ["https://player.vimeo.com/video", "https://www.youtube.com/embed"].forEach(
    link => {
      if (url.startsWith(link)) check = true;
    }
  );

  return check;
};

export const getSlideshowImages = async slideshowId => {
  if (!!!slideshowId) return;
  try {
    const res = await axiosSlidr.post(EXPORT_SLIDESHOW_IMAGES, {
      slideshowid: slideshowId,
    });

    if (res.status) {
      if (res.data?.data?.rows?.length) {
        const data = res.data.data.rows.map(data => ({
          imgUrl: data.published_slide_image_url,
          isVideoSlide:
            !!data.video_url && !isVimeoOrYoutubeVideo(data.video_url),
          videoUrl: data.video_url,
        }));
        return data;
      } else {
        throw new Error("No slides found!");
      }
    }
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

const getExt = url => url?.split(".").pop();

export const handleDownloadZip = async (
  zipFolderName,
  slideshowId,
  cb,
  progressCB
) => {
  if (!!!slideshowId) return;

  try {
    const files = await getSlideshowImages(slideshowId);
    var zip = new JSZip();
    const folder = zip.folder(zipFolderName);
    let count = 1;

    const progress = {};

    files.forEach(file => {
      const fileData = {
        url: file.isVideoSlide ? file.videoUrl : file.imgUrl,
        ext: file.isVideoSlide ? getExt(file.videoUrl) : getExt(file.imgUrl),
      };
      const data = urlToPromise(fileData.url, data => {
        progress[data.path] = data.percent;
        const values = [...Object.values(progress)];
        progressCB(values.reduce((a, b) => a + b, 0) / files.length);
      });
      folder.file(`${count}.${fileData.ext}`, data, { binary: true });
      count += 1;
    });

    zip
      .generateAsync({ type: "blob" })
      .then(function (content) {
        saveAs(content, `${zipFolderName}.zip`);
        cb(true, null);
      })
      .catch(() => {
        cb(false, "Something went wrong! please try again later.");
      });
  } catch (err) {
    cb(false, err.message);
  }
};
