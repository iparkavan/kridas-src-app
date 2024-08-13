import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Button from "@material-ui/core/Button";

import auth from "../../service/AuthService";
import hallacademylogo from "../../assets/images/hallmark-physio-logo.png";

import searchlogo from "../../assets/images/search.svg";
import userlogo from "../../assets/images/user.svg";

import styles from "../../component/navbar/navbar.module.css";
import { useHistory } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const NavbarEnrol = props => {
  return (
    <div>
      <AppBar
        position="static"
        style={{ background: "#ffffff", position: "fixed" }}
      >
        <Toolbar>
          <div className={styles.toolbar__wrapper}>
            <div>
              <img
                src={hallacademylogo}
                height="50px"
                alt="hallmark academy logo"
                className={styles.imgstyle}
              />
            </div>

            <div className={styles.nav__left_section}>
              <div className={styles.nav__user__info}>
                <div className={styles.useremail}></div>
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavbarEnrol;
