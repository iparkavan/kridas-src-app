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

const ExpenseSearch = (props) => {
  let history = useHistory();
  const classesLocal = useStyles();

  useEffect(() => {
    searchExpenses();
  }, []);

  const searchExpenses = () => {
    MasterService.fetchAllExpensesByCompanyId(
      AuthService.getLoggedInUserCompanyId()
    )
      .then((response) => {
        const expenses = Array.isArray(response.data) ? response.data : [];
        props.onSearch(expenses);
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  const addExpense = () => {
    history.push("/expense/add");
  };

  return (
    <>
      <div className={classes.ExpenseSearch}>
        <div></div>
        <div></div>
        <div></div>
        <div className={classes.RightAlign}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classesLocal.button}
            onClick={addExpense}
            startIcon={<AddIcon />}
          >
            Add Expense
          </Button>
        </div>
      </div>
    </>
  );
};

export default ExpenseSearch;
