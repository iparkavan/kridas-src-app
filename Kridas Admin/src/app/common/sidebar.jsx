import React from "react";
import KridasLogo from "../../assets/kridas-logo.svg";
import KridasLogoLight from "../../assets/kridas-logo-light.png";

import { NavLink, useLocation, useParams } from "react-router-dom";
import listItems from "../data/sidebar-menu-lists";
import { useStateContext } from "../../contexts/context-provider";
import { useEffect } from "react";

const Sidebar = () => {
  const location = useLocation();

  const { sidebarToggle, setSidebarToggle, expand, setExpand } =
    useStateContext();


  useEffect(() => {
    const { pathname } = location;
    const index = listItems.findIndex((item) => pathname.includes(item.path));
    if (index !== -1) {
      setExpand(index);
    }
  }, []);

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex items-center hover:bg-gray-200 gap-5 pl-4 pt-3 pb-2.5 dark:text-white rounded-lg text-md text-gray-600 dark:text-gray-200 dark:hover:text-black m-2";

  return (
    <div className="ml-2 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {sidebarToggle ? (
        <div>
          <img
            src={KridasLogo}
            className={
              sidebarToggle
                ? "max-w-[220px] transition-all mt-5 ml-2 fixed duration-300"
                : ""
            }
            alt="Kridas Logo"
          />
        </div>
      ) : (
        <div>
          <img
            src={KridasLogoLight}
            className={
              sidebarToggle
                ? ""
                : "max-w-[45px] mt-3 ml-[1px] fixed rounded-md duration-300"
            }
            alt=""
          />
        </div>
      )}

      <div className="mt-24">
        {listItems.map((item, index) => (
          <div
            className="cursor-pointer"
            key={item.name}
            id="Test"
            // onClick={() => {
            //   setExpand(index === expand ? null : index);
            // }}
            onClick={() => {
              setExpand(index);
              setSidebarToggle(true);
            }}
          >
            <p className="dark:text-gray-900 text-gray m-3 mt-8 flex gap-6 uppercase">
              {item.icon}
              {item.name}
            </p>
            {index === expand && (
              <div>
                {item.sub.map((link) => (
                  <NavLink
                    to={`/${link.path}`}
                    key={link.name}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "#2f80ed" : "",
                    })}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <div className="flex items-center gap-4 ml-8 hover:scale-125 duration-300 transition-all">
                      {link.icon}
                      <span className="capitalize">{link.name}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
