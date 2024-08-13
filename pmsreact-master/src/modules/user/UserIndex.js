import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";

import UserSearch from "./UserSearch";
import UserList from "./UserList";

import classes from "./user.module.css";

const UserIndex = (props) => {
  const [userList, setUserList] = useState([]);

  const searchResultHandler = (resultSet) => {
    setUserList(resultSet);
  };

  return (
    <>
      <div>
        <Typography variant="h5" gutterBottom>
          Users
        </Typography>
        <UserSearch onSearch={searchResultHandler}></UserSearch>
        <div className={classes.TopMargin}>
          <UserList
            userList={userList}
            viewLink="/admin/users/edit/"
          ></UserList>
        </div>
      </div>
    </>
  );
};

export default UserIndex;
