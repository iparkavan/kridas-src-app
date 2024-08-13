import React from "react";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { IconButton, Tooltip } from "@mui/material";
import { useStateContext } from "../../contexts/context-provider";

const DashboardLayout = (props) => {
  const { heading, isBackButton = false, onAction } = props;
  const { sidebarToggle } = useStateContext();
  return (
    <div
      className={
        sidebarToggle ? "p-20 pl-[17rem] duration-300" : "p-20  duration-700"
      }
    >
      <div className="flex items-center gap-2 pl-3">
        {isBackButton && (
          <Tooltip title="Back">
            <IconButton onClick={onAction}>
              <ArrowBackIosNewRoundedIcon className="dark:text-white" />
            </IconButton>
          </Tooltip>
        )}
        <h2 className="text-2xl dark:text-white font-medium">{heading}</h2>
      </div>
      <div className="w-full mx-10 rounded-3xl p-6">{props.children}</div>
    </div>
  );
};

export default DashboardLayout;
