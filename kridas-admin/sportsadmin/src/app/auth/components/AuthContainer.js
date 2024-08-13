import React from "react";
import { makeStyles } from "@material-ui/styles";
import stock from "../../../assets/login-img.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    boxSizing: "border-box",
    height: "100vh",
    "&> div": {
      flexGrow: 1,
      width: "50%",
    },
  },
  imageContent: {
    background: `url(${stock}) center`,
    backgroundSize: "cover",
  },
  authContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&> div": {
      width: "70%",
    },
  },
}));

const AuthContainer = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.imageContent}></div>
      <div className={classes.authContent}>{props.children}</div>
    </div>
  );
};

export default AuthContainer;
