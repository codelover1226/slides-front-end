import React from "react";
import folderSVG from "assets/images/folder.svg";

const MobileViewAddSlideshowModal = props => {
  const {
    ministries,
    volumes,
    series,
    changeMinistryType,
    changeGameType,
    gameSlideShow,
    gamesCount,
    changeVolume,
    setSeriesId,
    volumeId,
    seriesId,
    ministryType,
    userCount,
    loadingVolume,
    loadingSeries,
  } = props;

  return (
    <>
      {!volumeId && !seriesId && !ministryType && (
        <>
          {ministries.map(ministry => (
            <div
              className="series-card-header"
              id="heading-1"
              key={ministry.id}
            >
              <label
                className={`justify-content-between cursor-pointer ${
                  ministryType === ministry.id ? "active" : ""
                }`}
              >
                <div onClick={e => changeMinistryType(e, ministry.id)}>
                  <div className="d-flex align-items-center gap-3">
                    <i
                      className={`bx ${
                        ministryType === ministry.id
                          ? "bxs-up-arrow"
                          : "bxs-right-arrow"
                      } menu-arrow`}
                    ></i>
                    <img src={folderSVG} alt="folder" />
                    <div>{ministry.label}</div>
                  </div>
                </div>

                {loadingVolume && ministryType === ministry.id ? (
                  <i className="bx bx-loader bx-spin"></i>
                ) : (
                  <div className="userVolumeCount">
                    {(userCount &&
                      Object.values(userCount)?.find(
                        x => x?.ministry_type === ministry.id
                      )?.count) ||
                      0}
                  </div>
                )}
              </label>
            </div>
          ))}

          <div className="series-card-header" id="heading-1">
            <div className="cursor-pointer" onClick={() => changeGameType(4)}>
              <label className="justify-content-between cursor-pointer">
                <div className="d-flex align-items-center gap-3">
                  <i
                    className={`bx ${
                      gameSlideShow.length ? "bxs-up-arrow" : "bxs-right-arrow"
                    } menu-arrow`}
                  ></i>
                  <img className="imgHover" src={folderSVG} alt="folder" />
                  <div>Grow Games</div>
                </div>

                <div className="userVolumeCount">{gamesCount || 0}</div>
              </label>
            </div>
          </div>
        </>
      )}
      {!seriesId && ministryType && loadingVolume ? (
        <div>
          <i className="bx bx-loader bx-spin"></i> Loading...
        </div>
      ) : !volumeId ? (
        volumes?.map((volume, i) => (
          <>
            <div
              className="series-card-header child cursor-pointer"
              key={volume.category_id}
              onClick={e => changeVolume(e, volume.category_id)}
            >
              <label
                className={`d-flex justify-content-between cursor-pointer ${
                  volumeId === volume.category_id ? "active" : ""
                }`}
              >
                <div className="d-flex align-items-center gap-3">
                  <i
                    className={`bx ${
                      volumeId === volume.category_id
                        ? "bxs-up-arrow"
                        : "bxs-right-arrow"
                    }`}
                  ></i>
                  <img src={folderSVG} alt="folder" />
                  {volume.category_title}
                </div>

                {loadingSeries && volumeId === volume.category_id ? (
                  <i className="bx bx-loader bx-spin"></i>
                ) : (
                  <div className="userVolumeCount">
                    {/* {Object.values(userCount)?.find(
                        x => x?.ministry_type === ministryType
                      )?.volumes[i].category_id === volume.category_id
                        ? Object.values(userCount)?.find(
                            x => x?.ministry_type === ministryType
                          )?.volumes[i].count
                        : 0} */}
                    {volume?.count}
                  </div>
                )}
              </label>
            </div>
          </>
        ))
      ) : null}

      {ministryType && volumeId ? (
        loadingSeries ? (
          <div>
            <i className="bx bx-loader bx-spin"></i> Loading...
          </div>
        ) : (
          series?.map(ser => (
            <div
              className="series-card-header series-child cursor-pointer"
              key={ser.category_id}
              onClick={() => setSeriesId(ser.category_id)}
            >
              <label
                className={`d-flex justify-content-between cursor-pointer ${
                  seriesId === ser.category_id ? "active" : ""
                }`}
              >
                <div className="d-flex align-items-center gap-3">
                  <i
                    className={`bx ${
                      seriesId === ser.category_id
                        ? "bxs-up-arrow"
                        : "bxs-right-arrow"
                    }`}
                  ></i>
                  <img src={folderSVG} alt="folder" />
                  {ser.category_title}
                </div>
                <div className="userVolumeCount">{ser.count || 0}</div>
              </label>
            </div>
          ))
        )
      ) : null}
    </>
  );
};

export default MobileViewAddSlideshowModal;
