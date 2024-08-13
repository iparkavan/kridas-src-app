import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useField } from "formik";
import React from "react";
import { useStateContext } from "../../../contexts/context-provider";

const TextBoxWithValidation = ({ name, size, rightIcon, ...props }) => {
  const [field, meta] = useField(name);
  const { currentMode } = useStateContext();

  return (
    <TextField
      name={name}
      variant="outlined"
      helperText={meta.error}
      size={size}
      error={meta.touched && meta.error}
      sx={{
        "& .MuiInputLabel-root": {
          color: currentMode === "Light" ? "gray" : "gray",
        },
        "& .MuiInput-underline:before": {
          borderColor: currentMode === "Light" ? "gray" : "gray",
        },
        "& .MuiOutlinedInput-root": {
          "& > fieldset": {
            borderColor: currentMode === "Light" ? "gray" : "gray",
          },
        },
      }}
      InputProps={{
        className: "dark:text-white",
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>{props.rightIcon}</IconButton>
          </InputAdornment>
        ),
      }}
      {...field}
      {...props}
    />
  );
};

export default TextBoxWithValidation;
