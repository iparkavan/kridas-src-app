import { FormLabel } from "@mui/material";
import React from "react";

const CustomFormLabel = (props) => {
  return (
    <FormLabel
      color="primary"
      fontSize="sm"
      fontWeight="medium"
      mb={1}
      {...props}
    />
  );
};

export default CustomFormLabel;
