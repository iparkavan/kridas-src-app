import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

import AuthService from "../../service/AuthService";
import UserService from "../../service/UserService";
import classes from "./user.module.css";

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: "15px",
  },
}));

const UserSearch = (props) => {
  let history = useHistory();
  const classesLocal = useStyles();

  useEffect(() => {
    searchUsers();
  }, []);

  const searchUsers = () => {
    UserService.fetchAllUsersByCompanyId(AuthService.getLoggedInUserCompanyId())
      .then((response) => {
        const users = Array.isArray(response.data) ? response.data : [];
        props.onSearch(users);
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  const addUser = () => {
    history.push("/admin/users/add");
  };

  return (
    <>
      <div className={classes.UserSearch}>
        <div></div>
        <div></div>
        <div></div>
        <div className={classes.RightAlign}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classesLocal.button}
            onClick={addUser}
            startIcon={<AddIcon />}
          >
            Add User
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserSearch;
