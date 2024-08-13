import React from "react";
import Typography from "@material-ui/core/Typography";

import SettingsTab from "./SettingsTab";

const SettingsDetail = (props) => {
  return (
    <>
      <div>
        <Typography variant="h5" gutterBottom>
          <span>Settings</span>
        </Typography>
        <div>
          <SettingsTab />
        </div>
      </div>
    </>
  );
};

export default SettingsDetail;
