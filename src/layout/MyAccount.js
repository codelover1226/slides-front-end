/* eslint-disable jsx-a11y/anchor-is-valid */
import ContactIcon from "assets/images/contact.svg";
import SettingIcon from "assets/images/setting.svg";
import SignOutIcon from "assets/images/sign-out.svg";
import TutorialIcon from "assets/images/tutorial.svg";
import DashboardIcon from "assets/images/dashboard.svg";
import {
  default as dummyUserIcon,
  default as UserIcon,
} from "assets/images/user-circle.svg";
// import dummyUserIcon from "assets/images/user-circle.svg"
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "store/actions";
import { getCloudFrontImgUrl } from "utils/cloudFrontUrl";

const MyAccount = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.Auth);
  const handleLogout = () => {
    dispatch(logOutUser());
  };

  const redirectionHandler = value => {
    window.location.replace(
      process.env.REACT_APP_ACCOUNT_SITE_URL + "?q=" + value
    );
  };

  return (
    <div className="user">
      <Dropdown
        onMouseLeave={() => setShowDropdown(false)}
        onMouseOver={() => setShowDropdown(true)}
      >
        <Dropdown.Toggle
          id="dropdown-autoclose-true"
          className="profile-image-dummy"
          style={{ width: "30px", height: "30px" }}
        >
          <img
            src={
              user?.profile_image
                ? getCloudFrontImgUrl(user.profile_image)
                : dummyUserIcon
            }
            alt="user"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu show={showDropdown}>
          <ul>
            <li>
              <span
                className="dropdown-item cursor-pointer"
                onClick={() =>
                  window.location.replace(
                    process.env.REACT_APP_CURRICULUM_SITE_URL
                  )
                }
              >
                <img src={DashboardIcon} alt="" />
                Grow Dashboard
              </span>
            </li>
            <li>
              <span
                className="dropdown-item cursor-pointer user-icon-img"
                onClick={() => redirectionHandler("1")}
              >
                <img src={UserIcon} alt="" />
                My Account
              </span>
            </li>
            <li>
              <span
                className="dropdown-item cursor-pointer"
                onClick={() => redirectionHandler("2")}
              >
                <img src={SettingIcon} alt="" />
                Billing & Subscriptions
              </span>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <span
                className="dropdown-item cursor-pointer"
                onClick={() =>
                  window.location.replace(
                    "https://growcurriculum.org/tutorials/"
                  )
                }
                // onClick={() => redirectionHandler("4")}
              >
                <img src={TutorialIcon} alt="" />
                Tutorials
              </span>
            </li>
            <li>
              <span
                className="dropdown-item cursor-pointer"
                onClick={() => redirectionHandler("5")}
              >
                <img src={ContactIcon} alt="" />
                Contact
              </span>
            </li>
            <li>
              <span
                className="dropdown-item cursor-pointer"
                onClick={() =>
                  window.location.replace("https://growcurriculum.org/faqs")
                }
              >
                <img src={TutorialIcon} alt="" /> {/* Change icon later */}
                FAQs
              </span>
            </li>
            {/* <li>
              <span
                className="dropdown-item cursor-pointer"
                onClick={() =>
                  window.location.replace(
                    "https://support.stuffyoucanuse.org/home"
                  )
                }
              >
                <img src={ContactIcon} alt="" /> 
                Support Forum
              </span>
            </li> */}
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li onClick={handleLogout}>
              <span className="dropdown-item cursor-pointer">
                <img src={SignOutIcon} alt="" />
                Sign out
              </span>
            </li>
          </ul>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default MyAccount;
