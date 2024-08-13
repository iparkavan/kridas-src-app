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

import ListItem from "@material-ui/core/ListItem";
import Menu from "@material-ui/core/Menu";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/icons/Edit";
import PrintIcon from "@material-ui/icons/Print";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

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
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const InvoiceSummary = (props) => {
  const classes = useStyles();
  const currencyCode = AuthService.getLoggedInCompanyCurrencyCode();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInvoiceMenu = (action, inv) => {
    handleClose();
    props.invoiceMenuHandler(action, inv);
  };

  const getPayMenuItem = () =>
    props.invoiceSummary.isCancelled === "NO" &&
    props.invoiceSummary.paidAmount !== props.invoiceSummary.totalAmount ? (
      <ListItem
        button
        onClick={() =>
          handleInvoiceMenu(
            MasterData.invoiceMenuActions.pay,
            props.invoiceSummary
          )
        }
      >
        <ListItemIcon>
          <MonetizationOnIcon />
        </ListItemIcon>
        <ListItemText primary="Pay" />
      </ListItem>
    ) : (
      ""
    );

  return (
    <>
      <div className={cssClasses.InvoiceSummaryHeader}>
        <div>
          <span className={cssClasses.RightMargin5}>
            {/* {Helper.getFormattedDate(
              Helper.getDateTimeFromUTC(props.invoiceSummary.invoiceDate),
              "ll"
            )} */}
            {Helper.getDateTimeFromUTC(props.invoiceSummary.invoiceDate, "ll")}
          </span>
        </div>
        <div>
          <span>Invoice No: {props.invoiceSummary.invoiceNo}</span>
        </div>
        <div>
          <span>
            Paid Amt:{" "}
            {Helper.getFormattedNumber(
              props.invoiceSummary.paidAmount === null
                ? "0.00"
                : props.invoiceSummary.paidAmount
            )}
          </span>
        </div>
        <div>
          <span>
            Due Amt:{" "}
            {Helper.getFormattedNumber(
              props.invoiceSummary.totalAmount -
                (props.invoiceSummary.paidAmount === null
                  ? 0
                  : props.invoiceSummary.paidAmount)
            )}
          </span>
        </div>
        <div>
          {props.invoiceSummary.isCancelled === "YS" ? (
            <span className={cssClasses.RedBoldText}>
              Cancelled on{" "}
              {/* {Helper.getFormattedDate(
                Helper.getDateTimeFromUTC(props.invoiceSummary.cancelledDate),
                "ll"
              )} */}
              {Helper.getDateTimeFromUTC(
                props.invoiceSummary.cancelledDate,
                "ll"
              )}
            </span>
          ) : (
            ""
          )}
        </div>
        <div className={cssClasses.RightAlign}>
          <IconButton aria-label="Action" size="small" onClick={handleClick}>
            <MoreVertIcon size="small" />
          </IconButton>

          {/*  {props.invoiceSummary.isCancelled === "NO" ? (
            AuthService.isAdmin() ? (
              <Tooltip title="Cancel Invoice">
                <IconButton
                  aria-label="Edit"
                  size="small"
                  onClick={() =>
                    props.cancelFunctionReference(props.invoiceSummary)
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
                Helper.getDateTimeFromUTC(props.invoiceSummary.cancelledDate),
                "ll"
              )}
            </span>
          )} */}
        </div>
        <div className={cssClasses.FiveColumnOverride}>
          <div>
            <span>Notes: {props.invoiceSummary.invoiceComments}</span>
          </div>
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
                <TableCell width="30%">Treatments/Products</TableCell>
                <TableCell align="right" width="10%">
                  Cost ({currencyCode})
                </TableCell>
                <TableCell align="right" width="15%">
                  Discount ({currencyCode})
                </TableCell>
                <TableCell align="right" width="10%">
                  Tax ({currencyCode})
                </TableCell>
                <TableCell align="right" width="10%">
                  Total ({currencyCode})
                </TableCell>
                <TableCell width="25%">Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.invoiceSummary.invoiceDetails.map((proc, index) => {
                return (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        {proc.procedureId !== null
                          ? proc.proceduresDTO.procedureName
                          : proc.itemMasterDTO.itemName}
                      </TableCell>

                      <TableCell align="right">
                        {Helper.getFormattedNumber(proc.quantity * proc.price)}
                      </TableCell>
                      <TableCell align="right">
                        {Helper.getFormattedNumber(proc.discountAmount)}
                      </TableCell>
                      <TableCell align="right">
                        {Helper.getFormattedNumber(proc.taxAmount)}
                      </TableCell>
                      <TableCell align="right">
                        {Helper.getFormattedNumber(proc.amount)}
                      </TableCell>
                      <TableCell>{proc.notes}</TableCell>
                    </TableRow>
                    {proc.treatmentCompletedBy !== null ||
                    proc.treatmentCompletionDate !== null ? (
                      <TableRow className={cssClasses.BottomMargin5}>
                        <TableCell colSpan="5">
                          {proc.treatmentCompletedBy !== null ? (
                            <>
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
                            </>
                          ) : (
                            <></>
                          )}
                          {proc.treatmentCompletionDate !== null ? (
                            <>
                              <span className={cssClasses.RightMargin5}>
                                on
                              </span>
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
                            </>
                          ) : (
                            <></>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {getPayMenuItem()}
        {props.invoiceSummary.isCancelled === "NO" &&
        AuthService.isAdmin() &&
        (props.invoiceSummary.paidAmount === null ||
          props.invoiceSummary.paidAmount === 0.0) ? (
          <ListItem
            button
            onClick={() =>
              handleInvoiceMenu(
                MasterData.invoiceMenuActions.edit,
                props.invoiceSummary
              )
            }
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </ListItem>
        ) : (
          ""
        )}

        {props.invoiceSummary.isCancelled === "NO" &&
        AuthService.isAdmin() &&
        (props.invoiceSummary.paidAmount === null ||
          props.invoiceSummary.paidAmount === 0.0) ? (
          <ListItem
            button
            onClick={() =>
              handleInvoiceMenu(
                MasterData.invoiceMenuActions.cancel,
                props.invoiceSummary
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
            handleInvoiceMenu(
              MasterData.invoiceMenuActions.print,
              props.invoiceSummary
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

export default InvoiceSummary;
