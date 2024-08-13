import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import Menu from "@material-ui/core/Menu";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import PrintIcon from "@material-ui/icons/Print";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import Helper from "../../helper/helper";
import AuthService from "../../../service/AuthService";
import cssClasses from "../patient.module.css";
import MasterData from "../../helper/masterdata";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const PaymentSummary = (props) => {
  const classes = useStyles();
  const currencyCode = AuthService.getLoggedInCompanyCurrencyCode();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePaymentMenu = (action, inv) => {
    handleClose();
    props.paymentMenuHandler(action, inv);
  };

  return (
    <>
      <div className={cssClasses.PaymentSummaryHeader}>
        <div>
          <span className={cssClasses.RightMargin5}>
            {/*             {Helper.getFormattedDate(
              Helper.getDateTimeFromUTC(props.paymentSummary.paymentDate),
              "ll"
            )} */}
            {Helper.getDateTimeFromUTC(props.paymentSummary.paymentDate, "ll")}
          </span>
        </div>
        <div>
          <span>Payment No: {props.paymentSummary.paymentNo}</span>
        </div>
        <div>
          <span>
            Payment Mode: {props.paymentSummary.paymentModeDTO.paymentModeName}
          </span>
          {props.paymentSummary.bankName !== null ? (
            <span>
              <br></br>Bank: {props.paymentSummary.bankName}
            </span>
          ) : (
            ""
          )}
          {props.paymentSummary.paymentRefNo !== null ? (
            <span>
              <br></br>Ref No: {props.paymentSummary.paymentRefNo}
            </span>
          ) : (
            ""
          )}
        </div>
        <div>
          <span>
            Payment:{" "}
            {Helper.getFormattedNumber(props.paymentSummary.paymentNowAmount)}
          </span>
        </div>
        <div>
          <span>
            Credit Used:{" "}
            {Helper.getFormattedNumber(props.paymentSummary.advanceAmountUsed)}
          </span>
        </div>

        <div className={cssClasses.RightAlign} style={{ marginBottom: "5px" }}>
          <IconButton aria-label="Action" size="small" onClick={handleClick}>
            <MoreVertIcon size="small" />
          </IconButton>
          {/* {props.paymentSummary.isCancelled === "NO" ? (
            AuthService.isAdmin() ? (
              <Tooltip title="Cancel Payment">
                <IconButton
                  aria-label="Edit"
                  size="small"
                  onClick={() =>
                    props.cancelFunctionReference(props.paymentSummary)
                  }
                >
                  <CancelIcon size="small" />
                </IconButton>
              </Tooltip>
            ) : (
              ""
            )
          ) : (
            <span className={cssClasses.RedBoldText}>
              Cancelled on{" "}
              {Helper.getFormattedDate(
                Helper.getDateTimeFromUTC(props.paymentSummary.cancelledDate),
                "ll"
              )}
            </span>
          )} */}
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
                <TableCell width="25%">Invoice No</TableCell>
                <TableCell width="25%">Invoice Date</TableCell>
                <TableCell align="right" width="25%">
                  Invoice Amount ({currencyCode})
                </TableCell>
                <TableCell align="right" width="25%">
                  Paid Amount ({currencyCode})
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.paymentSummary.paymentDetails.map((inv, index) => {
                return (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{inv.invoiceDTO.invoiceNo}</TableCell>
                      <TableCell>
                        {/*  {Helper.getFormattedDate(
                          Helper.getDateTimeFromUTC(inv.invoiceDTO.invoiceDate),
                          "ll"
                        )} */}
                        {Helper.getDateTimeFromUTC(
                          inv.invoiceDTO.invoiceDate,
                          "ll"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {Helper.getFormattedNumber(inv.invoiceDTO.totalAmount)}
                      </TableCell>
                      <TableCell align="right">
                        {Helper.getFormattedNumber(inv.appliedAmount)}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div
        className={cssClasses.PaymentSummaryHeader}
        style={{ marginTop: "5px" }}
      >
        <div className={cssClasses.OneTwoColumnOverride}>
          <span>
            Entered By: {props.paymentSummary.userDTO.firstName}{" "}
            {props.paymentSummary.userDTO.lastName}
          </span>
        </div>
        <div className={cssClasses.ThreeTwoColumnOverride}>
          <span>Notes: {props.paymentSummary.notes}</span>
        </div>
        <div className={cssClasses.FiveTwoColumnOverride}>
          {props.paymentSummary.isCancelled === "YS" ? (
            <span className={cssClasses.RedBoldText}>
              Cancelled on{" "}
              {/* {Helper.getFormattedDate(
                Helper.getDateTimeFromUTC(props.paymentSummary.cancelledDate),
                "ll"
              )} */}
              {Helper.getDateTimeFromUTC(
                props.paymentSummary.cancelledDate,
                "ll"
              )}
            </span>
          ) : (
            ""
          )}
        </div>
      </div>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.paymentSummary.isCancelled === "NO" ? (
          AuthService.isAdmin() ? (
            <ListItem
              button
              onClick={() =>
                handlePaymentMenu(
                  MasterData.paymentMenuActions.cancel,
                  props.paymentSummary
                )
              }
            >
              <ListItemIcon>
                <CancelIcon />
              </ListItemIcon>
              <ListItemText primary="Cancel" />
            </ListItem>
          ) : (
            ""
          )
        ) : (
          ""
        )}

        {/* <ListItem button>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Email" />
        </ListItem> */}
        <ListItem
          button
          onClick={() =>
            handlePaymentMenu(
              MasterData.paymentMenuActions.print,
              props.paymentSummary
            )
          }
        >
          <ListItemIcon>
            <PrintIcon />
          </ListItemIcon>
          <ListItemText primary="Print" />
        </ListItem>
      </StyledMenu>
    </>
  );
};

export default PaymentSummary;
