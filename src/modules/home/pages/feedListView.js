import noThumbnailImg from "assets/images/new_no_thumbnail_img.jpg";
// import sortDownIcon from "assets/images/sortDown.svg";
// import sortUpIcon from "assets/images/sortUp.svg";
import sortIcon from "assets/images/sort.svg";
import moment from "moment/moment";
import { useState, useEffect } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { getSliderContent } from "utils/slider";
import ActionDropdown from "../components/ActionDropdown";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { fetchFeedsSlides } from "store/actions";

const FeedListView = ({ data, handleSlideStatusChange }) => {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState({ key: "title", direction: "asc" });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 992);
  const [isSharedValue, setIsSharedValue] = useState(null);
  const[tableData, setTableData] = useState(null)
  function sortSlideshowArray(slideshowArray) {
    return slideshowArray.sort((a, b) => {
        const titleA = a.title.toUpperCase(); // Convert titles to uppercase for case-insensitive comparison
        const titleB = b.title.toUpperCase();
        if (titleA < titleB) {
            return -1;
        }
        if (titleA > titleB) {
            return 1;
        }
        // Titles are equal, keep original order
        return 0;
    });
  }
  useEffect(() => {
    if (data && data.length > 0) {
      const firstItem = data[0];

      const isShared = firstItem?.is_shared;
      setIsSharedValue(isShared);
    }
  }, [data]);
  console.log("tableData"+tableData)
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const checkBackgroundImage = htmlString => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;
    const sectionElement = tempElement.querySelector("section");

    if (sectionElement) {
      const style = sectionElement.getAttribute("style");
      const hasBackgroundImage = style && style.includes("background-image");
      const hasImgTag = sectionElement.querySelector("img");

      if (hasBackgroundImage || hasImgTag) {
        return true;
      }
    }
    return false;
  };
  const columns = [
    {
      dataField: "title",
      text: "Name",
      formatter: (cellContent, row) => (
        <div className="d-flex feed-main-list-image">
          <div
            className="add-new-slide"
            onClick={() => navigate(`/slidr/${row.slideshow_id}`)}
          >
            {row &&
            row?.gs_slides &&
            row.gs_slides.length > 0 &&
            row.gs_slides[0].content ? (
              <div
                className="prv-html"
                dangerouslySetInnerHTML={{
                  __html: getSliderContent(row?.gs_slides[0]?.content || ""),
                }}
              />
            ) : (
              <img src={noThumbnailImg} alt="No" />
            )}
          </div>

          <span
            className="px-2 cursor-pointer"
            onClick={() => navigate(`/slidr/${row.slideshow_id}`)}
          >
            {row.title}
          </span>
        </div>
      ),
      headerClasses: (column, colIndex) => {
        return "feed-list-column-header";
      },
      sortOptions: true,
      // headerFormatter: handleSort,
    },
    {
      dataField: "updated_datetime",
      text: "Modified",
      sortOptions: true,
      formatter: (cellContent, row) => (
        <div className="d-flex feed-main-list-image py-3">
          <span>
            {moment(row.updated_datetime).format("MMM DD, YYYY, hh:mm a")}
          </span>
        </div>
      ),
      headerClasses: (column, colIndex) => {
        return "feed-list-column-header";
      },
      // headerFormatter: handleSort,
    },
    {
      dataField: "is_active",
      isSharedValue: isSharedValue,
      text: "Activate",
      formatter: (cellContent, row) => (
        <div className="form-check form-switch form-switch-md custom-switch mb-0 d-flex feed-main-list-image py-3">
          <div className="checkbox">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip">Activate</Tooltip>}
            >
              <input
                type="checkbox"
                className="form-check-input cursor-pointer mt-0 mb-0"
                checked={row.is_active === 1 ? true : false}
                onChange={e =>
                  handleSlideStatusChange(
                    row?.slideshow_id,
                    row?.is_active,
                    row?.feed_id
                  )
                }
              />
            </OverlayTrigger>
          </div>
        </div>
      ),
      headerClasses: (column, colIndex) => {
        return "feed-list-column-header action-btn";
      },
    },

    {
      dataField: "action",
      text: "Actions",
      isSharedValue: isSharedValue,
      headerClasses: (column, colIndex) => {
        return "feed-list-column-header action-btn";
      },
      formatter: (cellContent, row) => (
        <div className="d-flex py-2">
          <ActionDropdown slides={row} gs_slideshows={data} />
        </div>
      ),
    },
  ];

  const handleSort = key => {
    let direction = "desc";
    if (sortColumn.key === key && sortColumn.direction === "desc") {
      direction = "asc";
    }
    setSortColumn({ key, direction });
  };

  if (sortColumn.key && !!data?.length > 0) {
    data.sort((a, b) => {
      if (a[sortColumn.key] < b[sortColumn.key]) {
        return sortColumn.direction === "asc" ? -1 : 1;
      }
      if (a[sortColumn.key] > b[sortColumn.key]) {
        return sortColumn.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }
  return (
    <>
      <div className="responsive-table-container">
        <Table className="feed_list_view">
          <Thead>
            <Tr className="feed-list-column-header headerStyle">
              {columns.map((c, index) => (
                <Th key={`feed-list-item-${index}`} className={c?.isSharedValue ? "d-none" : `  `}>
                  <div className="d-flex">
                    {c.text}
                    <span
                      onClick={() => (c.sortOptions ? handleSort(c.dataField) : {})}
                      className="d-flex flex-column justify-content-center shortIcon"
                    >
                      {c.sortOptions ? (
                        <>
                          {/* <img src={sortUpIcon} alt="" className="mb-1" />
                          <img src={sortDownIcon} alt="" /> */}
                          <img src={sortIcon} alt="" />
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </Th>
              ))}
            </Tr>
          </Thead>
          {isMobileView && <hr className="mobileViewLine" />}
          {!!data?.length ? (
            <Tbody>
              {data?.map(x => (
                <Tr className="border-bottom">
                  <Td className=" feed-list-rowClasses listview">
                    {" "}
                    <div className="d-flex feed-main-list-image">
                      <div
                        className="add-new-slide"
                        onClick={() => {
                          if (x?.is_shared) {
                            window.open(`/slide-show-preview/${x.slideshow_id}`);
                          } else {
                            navigate(`/slidr/${x.slideshow_id}`);
                          }
                        }}
                      >
                        {x &&
                        x?.gs_slides &&
                        x.gs_slides.length > 0 &&
                        x.gs_slides[0].content &&
                        checkBackgroundImage(x?.gs_slides[0]?.content) ? (
                          <div
                            className="prv-html"
                            dangerouslySetInnerHTML={{
                              __html: getSliderContent(
                                x?.gs_slides[0]?.content || ""
                              ),
                            }}
                          />
                        ) : (
                          <img src={noThumbnailImg} alt="No" />
                        )}
                      </div>

                      <span
                        className="listTitle headTitle cursor-pointer "
                        onClick={() => {
                          if (x?.is_shared) {
                            window.open(`/slide-show-preview/${x.slideshow_id}`);
                          } else {
                            navigate(`/slidr/${x.slideshow_id}`);
                          }
                        }}
                      >
                        {x.title}
                      </span>
                    </div>
                  </Td>
                  <Td className="cursor-pointer feed-list-rowClasses listview modifiedDate">
                    {" "}
                    <div className="d-flex feed-main-list-image py-3">
                      <span className="listTitle" style={{marginLeft:"0px"}}>
                        {moment(x.updated_datetime).format(
                          "MMM DD, YYYY, hh:mm a"
                        )}
                      </span>
                    </div>
                  </Td>
                  {x?.is_shared ? (
                    <></>
                  ) : (
                    <Td className="feed-list-rowClasses listview toggleStatus">
                      {}
                      <div className="form-check form-switch form-switch-md custom-switch mb-0 d-flex feed-main-list-image py-3">
                        <div className="checkbox">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip">Activate</Tooltip>}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input cursor-pointer mt-0 mb-0"
                              checked={x.is_active === 1 ? true : false}
                              onChange={e =>
                                handleSlideStatusChange(
                                  x?.slideshow_id,
                                  x?.is_active,
                                  x?.feed_id
                                )
                              }
                            />
                          </OverlayTrigger>
                        </div>
                      </div>
                    </Td>
                  )}
                  {x?.is_shared ? (
                    <></>
                  ) : (
                    <Td className="feed-list-rowClasses listview listDrop">
                      <ActionDropdown slides={x} gs_slideshows={data} />
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={4}>
                  <div className="d-flex justify-content-center py-4">
                    No data found
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
      {/* <BootstrapTable
        keyField="slideshow_id"
        className="react-bootstrap-table"
        data={data}
        columns={columns}
        bordered={false}
        rowClasses={rowClasses}
        noDataIndication={<div className="py-4">No Data found</div>}
      /> */}
    </>
  );
};

export default FeedListView;
