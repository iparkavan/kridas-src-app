import { useState } from "react";
import React from "react";

import LogInImage from "../../assets/login-image.svg";
import {
  Alert,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@mui/material";
import Button from "../UI/button";
import { MailIcon, VisibleIcon } from "../UI/icon/icon";
import { useAuth } from "../../contexts/auth-context";
import { getAuth } from "firebase/auth";

const SignUpPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  const onChangeHandler = (e) => {
    switch (e.target.name) {
      case "user_email":
        setUserEmail(e.target.value);
        break;
      case "user_password":
        setUserPassword(e.target.value);
        break;
      case "confirm_user_password":
        setUserConfirmPassword(e.target.value);
        break;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (userPassword !== userConfirmPassword) {
      return setError("Password do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signUp(userEmail, userPassword);
    } catch {
      setError("Faild to create account");
    }

    setLoading(false);

    setUserEmail("");
    setUserPassword("");
    setUserConfirmPassword("");
  };

  return (
    <div className="flex w-full items-center mt-36 justify-center gap-20">
      <img className="w-[30%]" src={LogInImage} alt="LogInImage" />
      <div className="w-[26%] rounded-3xl bg-white">
        <form onSubmit={submitHandler} className="p-12">
          <h2 className="text-4xl">Sign In</h2>
          {error && (
            <Alert className="mt-4" severity="error">
              {error}
            </Alert>
          )}
          <div className="mt-4 bg-[#e8e8e8] rounded-xl p-6 flex flex-col gap-4">
            <TextField
              className="w-full"
              name="user_email"
              value={userEmail}
              label="Username"
              type="email"
              variant="standard"
              onChange={onChangeHandler}
              InputProps={{
                disableUnderline: "true",
                endAdornment: (
                  <InputAdornment position="end">
                    {<MailIcon className="text-2xl" />}
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="w-full"
              name="user_password"
              value={userPassword}
              id="filled-basic"
              type="password"
              label="Password"
              variant="standard"
              onChange={onChangeHandler}
              InputProps={{
                disableUnderline: "true",
                endAdornment: (
                  <InputAdornment position="end">
                    {<VisibleIcon className="text-2xl" />}
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className="w-full"
              name="confirm_user_password"
              value={userConfirmPassword}
              id="filled-basic"
              type="password"
              label="Confirm Password"
              variant="standard"
              onChange={onChangeHandler}
              InputProps={{
                disableUnderline: "true",
                endAdornment: (
                  <InputAdornment position="end">
                    {<VisibleIcon className="text-2xl" />}
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-5">
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

export default SignUpPage;
