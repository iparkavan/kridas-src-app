import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const PasswordTextField = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((toggled) => !toggled);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl
      variant="outlined"
      fullWidth
      required={props.required}
      size={props.size}
      error={props.errorMsg.length > 0}
    >
      <InputLabel htmlFor={props.id}>Your Password</InputLabel>
      <OutlinedInput
        id={props.id}
        name={props.name}
        type={showPassword ? "text" : "password"}
        value={props.value}
        onChange={props.passwordChangeHandler}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        labelWidth={125}
      />
      <FormHelperText id="userPasswordHelperText">
        {props.errorMsg.length > 0 ? props.errorMsg : ""}
      </FormHelperText>
    </FormControl>
  );
};

export default PasswordTextField;
