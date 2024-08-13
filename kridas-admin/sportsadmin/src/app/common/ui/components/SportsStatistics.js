import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import InputField from "../../ui/components/InputField";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useHistory } from "react-router";
import SaveIcon from "@material-ui/icons/Save";
import {
  statsFunctn,
  cricketFields,
  softBall,
} from "../../../master/sportsStatistics/config/sportsStatsConfig";
import sportsApiConfig from "../../../master/sportsStatistics/config/sportsApiConfig";
import useHttp from "../../../../hooks/useHttp";
import CancelIcon from "@material-ui/icons//Cancel";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles((theme) => ({
  fieldAlign: {
    marginTop: "20px",
  },

  fieldAlign1: {
    marginTop: "20px",
    marginLeft: "20px",
    width: "300px",
  },

  field: {
    width: "250px",
    margin: "16px",
  },
  btn: {
    padding: "2--px",
    margin: "15px",
  },
  linkAlign: {
    margin: "20px",
  },
  errorMsg: {
    color: "red",
  },
  addbtn: {
    marginLeft: "20px",
  },
}));

export default function SportsStatistics(props) {
  const classes = useStyles();
  const { sendRequest } = useHttp();
  const history = useHistory();
  const {
    name,
    userStatistics,
    userStaticInfo,
    statsInfo,
    setStatsInfo,
    mode,
  } = props;
  const [sportsStats, setSportsStats] = useState({});
  const [userStatisticsInfo, setUserStatisticsInfo] = useState(userStaticInfo);
  const [snackError, setSnackError] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);

  //FETCHING DATA
  useEffect(async () => {
    let defaultFormdata = await statsFunctn(name);
    setSportsStats(defaultFormdata);
    const config = sportsApiConfig.fetchUserStatistics(userStatistics);
    const transformUserData = (data) => {
      setUserStatisticsInfo(data.data);
    };
    sendRequest(config, transformUserData);
  }, [name, userStatistics]);

  //HANDLE EVENTS
  const handleIncrese = () => {
    setStatsInfo([...statsInfo, { statsSubInfo: {} }]);
  };

  const removeLastValue = (index) => {
    let newValues = [...statsInfo];
    if (newValues.length > 1) {
      newValues.pop();
      setStatsInfo(newValues);
    } else {
      setSnackError("warning");
      setSnackMsg("Fields must have atleast one data ");
      setSnackOpen(true);
    }
  };

  const handleChange = (e, index, name = null) => {
    if (name !== null) {
      let arr = [...statsInfo];
      arr[index]["statsSubInfo"][e.target.name] = e.target.value;
      setStatsInfo([...arr]);
    } else {
      let arr = [...statsInfo];
      arr[index][e.target.name] = e.target.value;
      setStatsInfo([...arr]);
    }
  };

  const handleSubmit = () => {
    let requestObj = {
      ...userStatisticsInfo,
      sportwise_statistics: {
        ...userStatisticsInfo.sportwise_statistics,
        statsInfo: [...statsInfo],
      },
    };

    const addConfig = sportsApiConfig.editUserStatistics(requestObj);
    const transformData = (data) => {
      setUserStatisticsInfo(data);
      history.push(`/user/userStatisticsEdit/${userStatistics}`);
    };
    sendRequest(addConfig, transformData);

    setSnackError("success");
    setSnackMsg("Statistics updated successfully");
    setSnackOpen(true);
  };

  const handleCancel = (e, userStatistics) => {
    history.push(`/user/userStatisticsEdit/${userStatistics}`);
  };
  const handleBack = (e, userStatistics) => {
    history.push(`/user/userStatisticsView/${userStatistics}`);
  };

  return (
    <>
      <div className={classes.fieldAlign}>
        {statsInfo &&
          statsInfo.length > 0 &&
          statsInfo?.map((data, idx) => {
            return (
              <div>
                {sportsStats?.items?.map((item, index) => {
                  if (item.type === "dropDown") {
                    return (
                      <>
                        <Dropdown
                          key={index}
                          label={item.label}
                          value={
                            statsInfo[idx][item.name] !== undefined
                              ? statsInfo[idx][item.name]
                              : ""
                          }
                          name={item.name}
                          List={item.options}
                          onChange={(e) => handleChange(e, idx)}
                          disabled={mode === "View" ? true : false}
                        />
                      </>
                    );
                  } else if (item.type === "text") {
                    return (
                      <>
                        <InputField
                          className={classes.fieldAlign1}
                          name={item.name}
                          label={item.label}
                          value={statsInfo[idx][item.name]}
                          key={index}
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) => handleChange(e, idx)}
                          disabled={mode === "View" ? true : false}
                        />
                      </>
                    );
                  }
                })}
                {sportsStats !== "" &&
                  sportsStats?.sportsCode?.toUpperCase() === "SPOR05" && (
                    <div>
                      {cricketFields[statsInfo[idx]?.role_type]?.map(
                        (field, index) => {
                          return (
                            <>
                              <InputField
                                className={classes.fieldAlign1}
                                name={field.name}
                                label={field.label}
                                value={
                                  statsInfo[idx]["statsSubInfo"][field.name] !==
                                  undefined
                                    ? statsInfo[idx]["statsSubInfo"][field.name]
                                    : ""
                                }
                                InputLabelProps={{ shrink: true }}
                                key={index}
                                onChange={(e) => handleChange(e, idx, "sub")}
                                disabled={mode === "View" ? true : false}
                              />
                            </>
                          );
                        }
                      )}
                    </div>
                  )}
                {sportsStats !== "" &&
                  sportsStats?.sportsCode?.toUpperCase() === "SPOR12" && (
                    <div>
                      {softBall[statsInfo[idx]?.softBallStatic]?.map(
                        (field, index) => {
                          return (
                            <>
                              <InputField
                                className={classes.fieldAlign1}
                                name={field.name}
                                label={field.label}
                                value={
                                  statsInfo[idx]["statsSubInfo"][field.name] !==
                                  undefined
                                    ? statsInfo[idx]["statsSubInfo"][field.name]
                                    : ""
                                }
                                InputLabelProps={{ shrink: true }}
                                key={index}
                                onChange={(e) => handleChange(e, idx, "sub")}
                                disabled={mode === "View" ? true : false}
                              />
                            </>
                          );
                        }
                      )}
                    </div>
                  )}

                {sportsStats !== "" &&
                  sportsStats?.sportsCode?.toUpperCase() === "SPOR13" && (
                    <div>
                      {softBall[statsInfo[idx]?.baseBallStatic]?.map(
                        (field, index) => {
                          return (
                            <>
                              <InputField
                                className={classes.fieldAlign1}
                                name={field.name}
                                label={field.label}
                                value={
                                  statsInfo[idx]["statsSubInfo"][field.name] !==
                                  undefined
                                    ? statsInfo[idx]["statsSubInfo"][field.name]
                                    : ""
                                }
                                InputLabelProps={{ shrink: true }}
                                key={index}
                                onChange={(e) => handleChange(e, idx, "sub")}
                                disabled={mode === "View" ? true : false}
                              />
                            </>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>
            );
          })}

        <div className={classes.linkAlign}>
          {mode === "View"
            ? null
            : sportsStats?.multiple && (
                <Button onClick={() => handleIncrese()}>Add More...</Button>
              )}

          {mode === "View"
            ? null
            : sportsStats?.multiple && (
                <Button
                  className={classes.addbtn}
                  onClick={(index) => removeLastValue(index)}
                >
                  Remove
                </Button>
              )}
        </div>
        <div>
          {mode === "View" ? null : (
            <Button
              className={classes.btn}
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<SaveIcon />}
              onClick={(e) => handleSubmit(e)}
            >
              Save
            </Button>
          )}

          <Button
            className={classes.btn}
            variant="contained"
            type="submit"
            startIcon={mode === "View" ? <ArrowBackIosIcon /> : <CancelIcon />}
            onClick={
              mode === "View"
                ? (e) => handleBack(e, userStatistics)
                : (e) => handleCancel(e, userStatistics)
            }
          >
            {mode === "View" ? "Back" : "Cancel"}
          </Button>
        </div>

        <Snackbar
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
        >
          <MuiAlert
            elevation={6}
            onClose={() => setSnackOpen(false)}
            variant="filled"
            severity={snackError}
          >
            {snackMsg}
          </MuiAlert>
        </Snackbar>
      </div>
    </>
  );
}
