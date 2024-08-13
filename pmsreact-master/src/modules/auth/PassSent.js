import React from "react";

import Featured from "../../assets/images/featured.jpg";
import hallacademylogo from "../../assets/images/hallmark-physio-logo.png";
import { Link } from "react-router-dom";

import "./auth.scss";

const ForgotPass = () => {
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
            <form noValidate autoComplete="off">
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

                <div className="fdbck-msg">
                  Reset Password Link in sent to your register email id. Please
                  check it.
                </div>

                <div className="styl--center">
                  <div className="neuBtn">
                    <span>
                      <Link to="/">Back to Login</Link>
                    </span>
                  </div>
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
