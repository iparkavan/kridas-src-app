import React from "react";
import Typography from "@material-ui/core/Typography";
import "./namevaluecustomdisplay.css";

const nameValueCustomDisplay = props => {
  return (
    <Typography variant="body2" gutterBottom>
      <span className="heading_style">{props.labelName}:</span>
      {props.labelValue}
    </Typography>
  );
};

export default nameValueCustomDisplay;
