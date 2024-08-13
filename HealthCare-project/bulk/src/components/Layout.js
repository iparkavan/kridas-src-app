import { Switch } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import SignIn from "./SignIn";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import IdleTimer from "react-idle-timer";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Dashboard from "./Dashboard";
import MyDetails from "./MyDetails";
import Remoteonboarding from "./Remoteonboarding";
import RemoteonboardingSent from "./RemoteonboardingSent";
import onBoardedSuccesfully from "./onBoardedSuccesfully";
import ManualOnboarding from "./ManualOnboarding";
import MonitoringDashboard from "./MonitoringDashboard";
import { GuardProvider, GuardedRoute } from "react-router-guards";
import { isUserAuthenticated, isRememberMeActive} from "../service/IsAuthenticated";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle
      disableTypography
      style={{ background: "#C72C35", color: "white" }}
      {...other}
    >
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      userLoggedIn: false,
      isTimedOut: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this._onIdle = this._onIdle.bind(this);
    this.requireLogin = this.requireLogin.bind(this);
    this.stayActive = this.stayActive.bind(this);
    this.sessionTimerRef = React.createRef();
  }

  requireLogin(to, from, next) {
    if (to.meta.auth) {
      if (isUserAuthenticated() || isRememberMeActive()) {
        next();
      }
      next.redirect("/SignIn");
    } else {
      next();
    }
  }

  handleClose() {
    this.setState({ showModal: false });
    sessionStorage.clear();
    localStorage.clear();
    this.props.history.push("/");
  }

  _onIdle() {
    if (!isRememberMeActive()) {
      this.setState({ showModal: true });
      this.sessionTimerRef.current = setTimeout(this.handleClose, 18000);
    }
  }

  stayActive() {
    clearTimeout(this.sessionTimerRef.current);
    this.setState({ showModal: false });
  }

  render() {
    return (
      <>
        <div className="">
          <Dialog
            open={this.state.showModal}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Beats Health"}</DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                Due to security reasons, you have been signed out
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleClose}
                style={{ background: "#C72C35", color: "white" }}
              >
                Log Out
              </Button>
              <Button
                onClick={this.stayActive}
                style={{ background: "#C72C35", color: "white" }}
                autoFocus
              >
                Keep Me Logged In!
              </Button>
            </DialogActions>
          </Dialog>
          <GuardProvider guards={[this.requireLogin]} error={SignIn}>
            <Switch>
              <GuardedRoute
                path="/Dashboard"
                exact
                component={Dashboard}
                meta={{ auth: true }}
              />
              <GuardedRoute
                path="/MyDetails"
                exact
                component={MyDetails}
                meta={{ auth: true }}
              />
              <GuardedRoute
                path="/ManualOnboarding"
                exact
                component={ManualOnboarding}
                meta={{ auth: true }}
              />
              <GuardedRoute
                path="/Remoteonboarding"
                exact
                component={Remoteonboarding}
                meta={{ auth: true }}
              />
              <GuardedRoute
                path="/MonitoringDashboard"
                exact
                component={MonitoringDashboard}
                meta={{ auth: true }}
              />
              <GuardedRoute
                path="/RemoteonboardingSent"
                exact
                component={RemoteonboardingSent}
                meta={{ auth: true }}
              />
              <GuardedRoute
                path="/onBoardedSuccesfully"
                exact
                component={onBoardedSuccesfully}
                meta={{ auth: true }}
              />
              <GuardedRoute path="*" component={SignIn} />
            </Switch>
          </GuardProvider>
          <IdleTimer
            id="mounter"
            startOnMount={true}
            ref={this.idleTimer}
            onActive={this._onActive}
            onIdle={this._onIdle}
            timeout={1800* 1000}
          >
            {" "}
          </IdleTimer>
        </div>
      </>
    );
  }
}
export default Layout;
