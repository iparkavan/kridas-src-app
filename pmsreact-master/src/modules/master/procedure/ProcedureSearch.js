import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

import AuthService from "../../../service/AuthService";
import MasterService from "../../../service/MasterService";
import classes from "../master.module.css";

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: "15px",
  },
}));

const ProcedureSearch = (props) => {
  let history = useHistory();
  const classesLocal = useStyles();

  useEffect(() => {
    searchProcedures();
  }, []);

  const searchProcedures = () => {
    MasterService.fetchAllProceduresByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const procedures = Array.isArray(response.data) ? response.data : [];
        props.onSearch(procedures);
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  const addProcedure = () => {
    history.push("/procedure/add");
  };

  return (
    <>
      <div className={classes.ProcedureSearch}>
        <div></div>
        <div></div>
        <div></div>
        <div className={classes.RightAlign}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classesLocal.button}
            onClick={addProcedure}
            startIcon={<AddIcon />}
          >
            Add Procedure
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProcedureSearch;
