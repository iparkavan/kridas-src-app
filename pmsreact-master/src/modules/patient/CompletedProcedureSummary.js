import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import Helper from "../helper/helper";
import AuthService from "../../service/AuthService";
import cssClasses from "./patient.module.css";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const CompletedProcedureSummary = (props) => {
  const classes = useStyles();
  const currencyCode = AuthService.getLoggedInCompanyCurrencyCode();

  return (
    <>
      <div className={cssClasses.TwoColumnGrid}>
        <div>
          {/* {Helper.getFormattedDate(
            Helper.getDateTimeFromUTC(props.procedureSummary.treatmentDate),
            "ll"
          )} */}
          {Helper.getDateTimeFromUTC(
            props.procedureSummary.treatmentDate,
            "ll"
          )}
        </div>
        <div className={cssClasses.RightAlign}>
          <Tooltip title="Edit">
            <IconButton
              aria-label="Edit"
              size="small"
              onClick={() =>
                props.editFunctionReference(props.procedureSummary.id)
              }
            >
              <EditIcon size="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell width="35%">Procedure</TableCell>
                <TableCell align="right" width="10%">
                  Cost ({currencyCode})
                </TableCell>
                <TableCell align="right" width="15%">
                  Discount ({currencyCode})
                </TableCell>
                <TableCell align="right" width="10%">
                  Total ({currencyCode})
                </TableCell>
                <TableCell width="30%">Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.procedureSummary.treatmentProcedures.map((proc, index) => {
                return (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{proc.proceduresDTO.procedureName}</TableCell>
                      <TableCell align="right">
                        {Helper.getFormattedNumber(proc.quantity * proc.price)}
                      </TableCell>
                      <TableCell align="right">
                        {Helper.getFormattedNumber(proc.discountAmount)}
                      </TableCell>
                      <TableCell align="right">
                        {Helper.getFormattedNumber(proc.amount)}
                      </TableCell>
                      <TableCell>{proc.procedureNotes}</TableCell>
                    </TableRow>
                    <TableRow className={cssClasses.BottomMargin5}>
                      <TableCell colSpan="5">
                        <span className={cssClasses.RightMargin5}>
                          Completed By
                        </span>
                        <span
                          className={`${cssClasses.RightMargin5} ${cssClasses.BoldText}`}
                        >
                          {proc.userDTO.firstName}
                        </span>
                        <span
                          className={`${cssClasses.RightMargin5} ${cssClasses.BoldText}`}
                        >
                          {proc.userDTO.lastName}
                        </span>
                        <span className={cssClasses.RightMargin5}>on</span>
                        <span>
                          {/* {Helper.getFormattedDate(
                            Helper.getDateTimeFromUTC(
                              proc.treatmentCompletionDate
                            ),
                            "ll"
                          )} */}
                          {Helper.getDateTimeFromUTC(
                            proc.treatmentCompletionDate,
                            "ll"
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default CompletedProcedureSummary;
