import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";

import SideMenu from "./SideMenu";
import Button from "../../ui/components/Button";
import { authActions } from "../../../../store/authSlice";
import kridas from "../../../../assets/kridas.png"

const useStyles = makeStyles((theme) => ({
  toolbar: {
    //...theme.mixins.toolbar,
    paddingRight: 24,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  buttonContainer: {
    marginLeft: "auto",
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
  drawer: {
    width: theme.drawerWidth,
    flexShrink: 0,
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: theme.spacing(0, 1),
  },
  appBarShift: {
    marginLeft: theme.drawerWidth,
    width: `calc(100% - ${theme.drawerWidth}px)`,
    // width: `100%`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: "none",
  },
  headerBorder: {
    height: "0.5rem",
    backgroundColor: theme.palette.primary.main,
  },
}));

function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const Header = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const [openDrawer, setOpenDrawer] = useState(false);

  const drawerOpenHandler = () => {
    setOpenDrawer(true);
    props.drawerHandler(true);
  };

  const drawerCloseHandler = () => {
    setOpenDrawer(false);
    props.drawerHandler(false);
  };

  const logoutHandler = () => {
    dispatch(authActions.logout());
    history.replace("/");
  };

  const toDashboard = () => {
    history.push(`/`);
  }

  if (!isLoggedIn) {
    return <></>;
  }

  return (
    <>
      <ElevationScroll>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, openDrawer && classes.appBarShift)}
          color="primary"
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={drawerOpenHandler}
              edge="start"
              className={clsx(classes.menuButton, openDrawer && classes.hide)}
            >
              <MenuIcon />
            </IconButton>

            <div onClick={() => toDashboard()}>
              <img src={kridas} alt="logo" width="200" />
            </div>
            <div className={classes.buttonContainer}>
              <Button onClick={logoutHandler} color="secondary">
                Logout
              </Button>
            </div>
          </Toolbar>
          {/* <div className={classes.headerBorder}></div> */}
        </AppBar>
      </ElevationScroll>
      <SideMenu
        open={openDrawer}
        drawerCloseHandler={drawerCloseHandler}
        drawerOpenHandler={drawerOpenHandler}
      />
    </>
  );
};

export default Header;
