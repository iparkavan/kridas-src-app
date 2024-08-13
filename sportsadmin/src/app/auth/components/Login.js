import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { Divider, TextField } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "../../common/ui/components/Button";
import AuthContainer from "./AuthContainer";
import PasswordTextField from "../../common/ui/components/PasswordTextField";
import ErrorLabel from "../../common/ui/components/ErrorLabel";
import useHttp from "../../../hooks/useHttp";
import helper from "../../../utils/helper";
import authConfig from "../config/authConfig";
import { authActions } from "../../../store/authSlice";

const useStyles = makeStyles((theme) => ({
  pageHeading: {
    ...theme.pageHeading,
  },
  loginFields: {
    display: "flex",
    flexDirection: "column",
    "&> div": {
      marginTop: "1.5rem",
    },
  },
  rightAlign: {
    textAlign: "right",
    verticalAlign: "middle",
  },
  buttonContainer: {
    marginTop: "1.5rem",
  },
  headingContainer: {
    display: "flex",
    alignItems: "center",

    "&> div": {
      flexGrow: 1,
      width: "50%",
    },
  },
  linkContainer: {
    display: "flex",
    width: "100%",
    "&> div": {
      flexGrow: 1,
    },
  },
  center:{
    textAlign:"center",
    padding:"5px"
  }
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();

  const [userPassword, setUserPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isError,setIsError]=useState(false)
  const [erMessage, setErMessage] = useState('');
  

  const { isLoading, error, sendRequest: loginUser } = useHttp(false);
  const dispatch = useDispatch();

  const onChangeHandler = (event) => {
    switch (event.target.name) {
      case "userEmail":
        setUserEmail(event.target.value);
        break;
      case "userPassword":
        setUserPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  const validateFields = () => {
    let submitForm = true;

    if (userEmail.trim().length === 0) {
      setEmailError("Email is required");
      submitForm = false;
    } else if (!helper.validateEmail(userEmail)) {
      setEmailError("Email is invalid");
      submitForm = false;
    } else {
      setEmailError("");
    }

    if (userPassword.trim().length === 0) {
      setPasswordError("Password is required");
      submitForm = false;
    } else {
      setPasswordError("");
    }

    return submitForm;
  };
  const showError = (flag, data) => {
    setErMessage(data);
    setIsError(flag);
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!validateFields()) {
      return;
    }

    const requestConfig = authConfig.getSignInConfig({
      email: userEmail,
      password: userPassword,
      returnSecureToken: true,
    }); 

    const transformData = (data) => {
      //Update state
      //let dt = new Date();
      //dt.setSeconds(dt.getSeconds() + +data.expiresIn);   

       if(data.isAuthSuccess && data?.user?.user_status === 'AC' && data?.user?.user_type.includes('ADM') ) {
        dispatch(
          authActions.setAuthToken({
            token: data.token,
            tokenExpirationTime: "",
          })
        );
        history.replace("/home");
      }else{
        showError(true,"Invalid email or password")
      }
    };

    await loginUser(requestConfig, transformData);
  };



  return (
    <>
      <AuthContainer>
        <div>
          <form onSubmit={submitHandler} noValidate>
            <div className={classes.headingContainer}>
              <div className={classes.pageHeading}>Login</div>
              <div>
                <div className={classes.linkContainer}></div>
              </div>
            </div>
            <div>
              <Divider></Divider>
            </div>
            {/* {error && error.trim().length > 0 ? (
               <ErrorLabel>{error}</ErrorLabel>
            ) : (
              ""
            )} */}
            <div className={classes.loginFields}>
              <div>
                <TextField
                  id="userEmail"
                  name="userEmail"
                  label="Your Email"
                  variant="outlined"
                  fullWidth
                  required
                  size="small"
                  type="email"
                  onChange={onChangeHandler}
                  error={emailError.length > 0}
                  helperText={emailError}
                />
              </div>
              <div>
                <PasswordTextField
                  size="small"
                  id="userPassword"
                  name="userPassword"
                  value={userPassword}
                  passwordChangeHandler={onChangeHandler}
                  required={true}
                  errorMsg={passwordError}
                >
                  Your Password
                </PasswordTextField>
              </div>
            </div>

            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                fullWidth
                size="large"
                endIcon={<ArrowForwardIcon />}
                type="submit"
                disabled={isLoading}
              >
                Continue
              </Button>
            </div>
            {isError&& <ErrorLabel className={classes.center}>{erMessage}</ErrorLabel>}
             {error && error.trim().length > 0 ? (
               <ErrorLabel className={classes.center}>{error}</ErrorLabel>
            ) : (
              ""
            )}
          </form>
        </div>
      </AuthContainer>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Login;
