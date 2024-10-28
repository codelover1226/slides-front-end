import { ReactComponent as LeftArrow } from "assets/images/arrow-left.svg";
import { ReactComponent as RightArrow } from "assets/images/arrow-right.svg";
import { ReactComponent as Arrow } from "assets/images/arrow.svg";
import { ReactComponent as CloseIcon } from "assets/images/close.svg";
import { ReactComponent as CurriculumIcon } from "assets/images/curriculum.svg";
import { ReactComponent as HomeIcon } from "assets/images/home.svg";
import { ReactComponent as MenuIcon } from "assets/images/menu.svg";
import { ReactComponent as MessageIcon } from "assets/images/message-icon.svg";
import { ReactComponent as MoreStuffIocn } from "assets/images/more-stuff.svg";
import { ReactComponent as SettingIcon } from "assets/images/setting-icon.svg";
import { ReactComponent as YourStuffIcon } from "assets/images/your-stuff.svg";
import { useEffect, useState } from "react";
import { Collapse } from "react-collapse";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "store/actions";
import SidebarApplication from "./SidebarTools";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div
      className={`left_bar top_nav ${collapse ? "short-view" : "full-view"}`}
    >
      <div
        className={`left-bar-wrapper ${
          showMenu ? "link-menu-show" : "link-menu-hide"
        }`}
        // onClick={handleMenu}
      >
        <div className="menu-wrapper">
          <div className="welcome-text-wrapper">
            {collapse ? "" : <div className="menu-title">Welcome!</div>}
            <div
              className="collapse-icon"
              onClick={() => setCollapse(!collapse)}
            >
              {collapse ? <RightArrow /> : <LeftArrow />}
            </div>
          </div>
          <div
            className={`main-menu ${
              showMenu ? "link-menu-show" : "link-menu-hide"
            }`}
            // onClick={handleMenu}
          >
            <div className="dashboard-menu">
              <span
                onClick={() =>
                  window.location.replace(
                    process.env.REACT_APP_CURRICULUM_SITE_URL
                  )
                }
                // onClick={() => navigate("/")}
                className={collapse ? "ps-3" : ""}
              >
                <HomeIcon />
                {collapse ? "" : <p>Dashboard</p>}
              </span>
            </div>
            <CollapseSideMenu
              title={"Curriculum"}
              menu={"curriculum"}
              Icon={CurriculumIcon}
              isCollapse={collapse}
            />
            <CollapseSideMenu
              title={"Your Stuff"}
              menu={"your stuff"}
              Icon={YourStuffIcon}
              isCollapse={collapse}
            />
            <CollapseSideMenu
              title={"More Tools"}
              menu={"more stuff"}
              Icon={MoreStuffIocn}
              isCollapse={collapse}
            />
          </div>
        </div>
        <div>
          <div className="footer-icon-menu">
            <MessageIcon />
            {collapse ? "" : <p>Customer Support</p>}
          </div>
          <div
            className="footer-icon-menu cursor-pointer"
            onClick={() =>
              window.location.replace(
                process.env.REACT_APP_ACCOUNT_SITE_URL + "/?q=1"
              )
            }
          >
            <SettingIcon />
            {collapse ? "" : <p>Settings</p>}
          </div>
          {collapse ? (
            ""
          ) : (
            <div className="copyright">
              <p>© {new Date().getFullYear()} Stuff You Can Use</p>
            </div>
          )}
        </div>
      </div>
      <span className="icon" id="close" onClick={handleMenu}>
        {showMenu ? (
          <CloseIcon className="close-image" />
        ) : (
          <MenuIcon className="menu-image" />
        )}
      </span>
    </div>
  );
};

export default Sidebar;

export const CollapseSideMenu = ({ title, menu, Icon, isCollapse }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { applications } = useSelector(state => state.Layout);

  useEffect(() => {
    if (isCollapse) {
      setIsOpen(false);
    }
  }, [isCollapse]);

  const getMenu = type => {
    return (
      !!applications && applications?.find(item => item?.type === type)?.menu
    );
  };

  const handleCollapse = () => setIsOpen(prev => !prev);
  return getMenu(menu)?.length > 0 ? (
    <div className="sub-menu-wrapper">
      <div className="dashboard-menu" onClick={handleCollapse}>
        <span className={isCollapse ? "ps-3" : ""}>
          <Icon />
          {isCollapse ? "" : <p>{title}</p>}
          {isCollapse ? (
            ""
          ) : (
            <Arrow
              className={isOpen ? "rotate_img_180" : "rotate_img_0"}
              src={Arrow}
              alt=""
            />
          )}
        </span>
      </div>
      <div className={isCollapse ? "responsive-sidebar" : "w-100"}>
        <Collapse isOpened={isOpen}>
          <SidebarApplication is_from_more_stuff={false} data={getMenu(menu)} />
        </Collapse>
      </div>
    </div>
  ) : (
    <></>
  );
};
