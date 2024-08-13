import React, { useState } from "react";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { useStateContext } from "../../contexts/context-provider";
import { IconButton, Tooltip } from "@mui/material";
import { LogOut } from "../UI/icon/icon";
import { useAuth } from "../../contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { DarkModeSwitch } from "../UI/switch/dark-mode-switch.";

const Navbar = (props) => {
  const { setMode, currentMode, sidebarToggle, setSidebarToggle } =
    useStateContext();
  const [error, setError] = useState();

  const { logOut } = useAuth();
  const navigate = useNavigate();

  const sidebarToggleHandler = () => {
    setSidebarToggle((prveStaus) => !prveStaus);
  };

  const logOutHandler = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  };

  return (
    <div
      className={
        sidebarToggle
          ? "mt-3 ml-1 duration-300"
          : "-ml-[185px] mt-3 duration-300"
      }
    >
      <div className="flex justify-between mr-8 p-4 ml-[16.5rem]">
        <div>
          <IconButton onClick={sidebarToggleHandler}>
            <MenuOpenRoundedIcon
              className={
                sidebarToggle ? "dark:text-white" : "dark:text-white rotate-180"
              }
            />
          </IconButton>
        </div>
        <div>
          <Tooltip>
            <IconButton>
              <DarkModeSwitch
                name="themeMode"
                value={currentMode === "Light" ? "Dark" : "Light"}
                onChange={(e) => setMode(e)}
                checked={currentMode === "Light"}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Log Out">
            <IconButton onClick={logOutHandler}>
              <LogOut className="dark:text-white" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
