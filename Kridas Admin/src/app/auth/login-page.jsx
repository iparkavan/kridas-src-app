import { useState } from "react";
import React from "react";

import LogInImage from "../../assets/login-image.svg";
import {
  Alert,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Button from "../UI/button";
import { MailIcon, VisibleIcon, VisibleOffIcon } from "../UI/icon/icon";
import { useAuth } from "../../contexts/auth-context";
import { useNavigate } from "react-router-dom";

const LogInPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { currentUser, signIn } = useAuth();
  const navigate = useNavigate();

  const passwordVisiblityHandler = () => {
    setShowPassword((show) => !show);
  };

  const onChangeHandler = (e) => {
    switch (e.target.name) {
      case "user_email":
        setUserEmail(e.target.value);
        break;
      case "user_password":
        setUserPassword(e.target.value);
        break;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // const userCredentials = {
    //   email: userEmail,
    //   password: userPassword,
    // };

    try {
      setError("");
      setLoading(true);
      await signIn(userEmail, userPassword);
      navigate("/analytics");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);

    setUserEmail("");
    setUserPassword("");
  };

  return (
    <div className="flex w-full h-screen items-center pb-64 justify-center gap-20 dark:bg-main-dark-bg">
      <img className="w-[30%]" src={LogInImage} alt="LogInImage" />
      <div className="w-[26%] rounded-3xl bg-white dark:bg-secondary-dark-bg">
        <form onSubmit={submitHandler} className="p-12">
          <h2 className="text-4xl dark:text-white">Sign In</h2>
          {error && (
            <Alert className="mt-4" severity="error">
              {error}
            </Alert>
          )}
          <div className="mt-4 dark:bg-main-dark-bg bg-[#e8e8e8] rounded-xl p-6 flex flex-col gap-4">
            <TextField
              className="w-full"
              name="user_email"
              value={userEmail}
              label="Username"
              type="email"
              variant="standard"
              onChange={onChangeHandler}
              sx={{
                "& label": {
                  color: "#2f80ed",
                },
              }}
              InputProps={{
                className: "dark:text-white",
                disableUnderline: "true",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      {<MailIcon className="dark:text-white" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="w-full"
              name="user_password"
              value={userPassword}
              id="filled-basic"
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="standard"
              onChange={onChangeHandler}
              sx={{
                "& label": {
                  color: "#2f80ed",
                },
              }}
              InputProps={{
                disableUnderline: "true",
                className: "dark:text-white",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={passwordVisiblityHandler}>
                      {showPassword ? (
                        <VisibleOffIcon className="dark:text-white" />
                      ) : (
                        <VisibleIcon className=" dark:text-white" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="flex items-center justify-between dark:text-white mt-5">
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember Me"
            />
            <p className="underline">Forgot Password</p>
          </div>
          <div className="mt-5">
            <Button
              disabled={loading}
              className="w-full"
              sx={{
                backgroundColor: "#2f80ed"
              }}
              type="submit"
              size="large"
            >
              Log In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogInPage;
