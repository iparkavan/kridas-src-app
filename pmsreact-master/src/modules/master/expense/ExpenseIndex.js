import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";

import ExpenseSearch from "./ExpenseSearch";
import ExpenseList from "./ExpenseList";

import classes from "../master.module.css";

const ExpenseIndex = (props) => {
  const [expenseList, setExpenseList] = useState([]);

  const searchResultHandler = (resultSet) => {
    setExpenseList(resultSet);
  };

  return (
    <>
      <div>
        <Typography variant="h5" gutterBottom>
          Expenses
        </Typography>
        <ExpenseSearch onSearch={searchResultHandler}></ExpenseSearch>
        <div className={classes.TopMargin}>
          <ExpenseList
            dataList={expenseList}
            editLink="/expense/edit/"
          ></ExpenseList>
        </div>
      </div>
    </>
  );
};

export default ExpenseIndex;
