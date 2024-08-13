import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";

import ProcedureSearch from "./ProcedureSearch";
import ProcedureList from "./ProcedureList";

import classes from "../master.module.css";

const ProcedureIndex = (props) => {
  const [procedureList, setProcedureList] = useState([]);

  const searchResultHandler = (resultSet) => {
    setProcedureList(resultSet);
  };

  return (
    <>
      <div>
        <Typography variant="h5" gutterBottom>
          Procedures
        </Typography>
        <ProcedureSearch onSearch={searchResultHandler}></ProcedureSearch>
        <div className={classes.TopMargin}>
          <ProcedureList
            dataList={procedureList}
            editLink="/procedure/edit/"
          ></ProcedureList>
        </div>
      </div>
    </>
  );
};

export default ProcedureIndex;
