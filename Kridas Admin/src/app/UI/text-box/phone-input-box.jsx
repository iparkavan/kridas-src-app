import { TextField } from "@mui/material";
import { useField } from "formik";
import React from "react";
import { useStateContext } from "../../../contexts/context-provider";

const PhoneInputBox = (name, props, ref) => {
  const [field, meta] = useField(name);

  const { currentMode } = useStateContext();

  return (
    <TextField
      helperText={meta.error}
      error={meta.touched}
      {...props}
      label="Contact No"
      variant="outlined"
      inputProps={{
        className: "dark:text-white",
      }}
      sx={{
        "& .MuiInputLabel-root": {
          color: currentMode === "Light" ? "gray" : "gray",
        },
        "& .MuiOutlinedInput-root": {
          "& > fieldset": {
            borderColor: currentMode === "Light" ? "gray" : "gray",
          },
        },
      }}
      inputRef={ref}
      {...field}
    />
  );
};

export default React.forwardRef(PhoneInputBox);
