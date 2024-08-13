import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";

import PatientSearch from "./PatientSearch";
import PatientList from "./PatientList";

import classes from "./patient.module.css";

const PatientIndex = (props) => {
  const [patientList, setPatientList] = useState([]);

  const searchResultHandler = (resultSet) => {
    setPatientList(resultSet);
  };

  return (
    <>
      <div>
        <Typography variant="h5" gutterBottom>
          Patients
        </Typography>
        <PatientSearch onSearch={searchResultHandler}></PatientSearch>
        <div className={classes.TopMargin}>
          <PatientList
            patientList={patientList}
            viewLink="/patient/detail/"
          ></PatientList>
        </div>
      </div>
    </>
  );
};

export default PatientIndex;
