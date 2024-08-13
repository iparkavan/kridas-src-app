import React, { useState } from "react";
import useAuthForm from "./useAuthForm";
import { validateFgtPass, fgtpassFields } from "./validateAuth";
import Featured from "../../assets/images/featured.jpg";
import hallacademylogo from "../../assets/images/hallmark-physio-logo.png";
import { Link } from "react-router-dom";
import { Button } from "../../elements/ui/Button";

import "./auth.scss";
import TextField from "@material-ui/core/TextField";

import AuthService from "../../service/AuthService";
import { useHistory } from "react-router-dom";

const ForgotPass = () => {
  let history = useHistory();
  const { handleChange, handleSubmit, values, errors } = useAuthForm(
    submit,
    validateFgtPass,
    fgtpassFields
  );
  const [msg, setMsg] = useState("");

  function submit() {
    console.log("Submitted Succesfully");
    const credentials = { userEmail: values.email };
    AuthService.passwordEmail(credentials).then(res => {
      console.log("Result..." + res.data.userEmail);

      if (!res.data.success) {
        setMsg("Not a registered email");
      }

      if (res.data.success && res.status === 200) {
        history.push("/pass-sent");
      }
    });
  }

  return (
    <div>
      <div className="login_wrap">
        <div className="login_left">
          <img
            src={Featured}
            alt="hallmark academy logo"
            className="left_img"
          />
        </div>
        <div className="login_right">
          <div className="form_block">
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              <div className="forgot_pass_container">
                <div className="login_caps">
                  <img
                    src={hallacademylogo}
                    alt="hallmark academy logo"
                    className="imgstyle"
                  />
                  <div className="academy__name">
                    Hallmark Physiotherapy Academy
                  </div>
                </div>
                <div>
                  <TextField
                    type="text"
                    label="Enter Email"
                    fullWidth
                    margin="normal"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="fdbck-msg">
                  <span className="error">{msg}</span>
                </div>

                <div className="styl--center">
                  <Button
                    type="submit"
                    buttonStyle="btn--neo--solid"
                    buttonSize="btn--medium"
                  >
                    <span>Reset Password</span>
                  </Button>
                </div>
                <div className="login_signup">
                  Back to&nbsp;
                  <span className="login_links">
                    <Link to="/">Sign In</Link>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
