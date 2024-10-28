import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { SERIES_DATA } from "store/Layout/actionTypes";

const SidebarTools = ({ data = null }) => {
  const { applicationLoading } = useSelector(state => state.Layout);

  return applicationLoading ? (
    <Loader />
  ) : (
    !!data && data?.map((item, i) => <MenuLink key={i} data={item} />)
  );
};

export default memo(SidebarTools);

const Loader = () => {
  return [...new Array(5)].map((item, i) => (
    <li key={i} className="left-content-list applicationLoading">
      {/* <Skeleton /> */}
    </li>
  ));
};

const MenuLink = ({ data }) => {
  const dispatch = useDispatch();
  const { series } = useSelector(state => state.Layout);
  return (
    <div
      className={`dashboard-menu ${
        data?.menu_type === "Grow Slides" ? "active-link" : ""
      }`}
      onClick={() => !!series && dispatch({ type: SERIES_DATA, payload: null })}
    >
      <NavLink to={data?.menu_type === "Grow Slides" ? "/" : data?.link}>
        <p>{data?.menu_type}</p>
      </NavLink>
    </div>
  );
};
