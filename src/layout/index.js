import { Outlet } from "react-router-dom";
import Header from "./Header";
import Separator from "components/Separator";

const Layout = () => {
  return (
    <>
      <Separator />
      <Header />
      <div className="main_part">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
