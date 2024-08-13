import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { useStateContext } from "../../contexts/context-provider";

const UserLayout = (props) => {
  const { sidebarToggle } = useStateContext();

  return (
    <div className="w-screen bg-[#edf2f7] dark:bg-main-dark-bg h-screen">
      <div className="bg-[#edf2f7] dark:bg-main-dark-bg h-auto w-auto">
        {sidebarToggle ? (
          <div className="w-64 left-3 top-3 bottom-4 fixed bg-white duration-300 rounded-xl dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        ) : (
          <div className="w-16 top-3 bottom-3 left-4 fixed bg-white duration-300 rounded-xl dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div className="w-full z-50 fixed">
          <Navbar />
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
