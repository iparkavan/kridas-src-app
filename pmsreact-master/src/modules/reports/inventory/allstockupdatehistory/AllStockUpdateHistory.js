import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";
// import AllInvoicesPrint from "../allinvoices/AllInvoicesPrint";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
// import AllInvoicesDetailTable from "./AllInvoicesDetailTable";
import Button from "@material-ui/core/Button";
import PrintIcon from "@material-ui/icons/Print";
// import AllInvoicesSummaryTable from "./AllInvoicesSummaryTable";
import AllStockUpdateHistoryDetail from "./AllStockUpdateHistoryDetail";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const AllStockUpdateHistory = (props) => {
	const classesLocal = useStyles();
	const [allStockUpdateHistoryReports, setAllStockUpdateHistoryReports] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");

	const componentRef = useRef();

	useEffect(() => {
		setAllStockUpdateHistoryReports(props.reportdata);

		setLoading(true);
	}, []);

	return (
		<>
			{loading ? (
				<>
					<div style={{ textAlign: "center", padding: "20px 0px 0px 0px" }}>
						<h3>{props.reportname}</h3>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0px" }}>
						<div style={{ alignSelf: "left", display: "flex" }}>
							<div>
								<TextField
									label='Item Name'
									id='searchString'
									value={searchText}
									onChange={(event) => {
										setSearchText(event.target.value);
									}}
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<SearchIcon></SearchIcon>
											</InputAdornment>
										),
									}}
								/>
							</div>
							<div>
								&nbsp;&nbsp;
								<Button
									variant='contained'
									color='primary'
									size='small'
									className={classesLocal.button}
									// onClick={searchPatients}
									startIcon={<SearchIcon />}>
									Filter
								</Button>
							</div>
						</div>
						<div>
							<ReactToPrint
								trigger={() => (
									<HtmlTooltip
										placement='top'
										title={
											<React.Fragment>
												<Typography color='inherit'>Print in Landscape Mode</Typography>
												<em>{"Export: "}</em> <b>{"PDF"}</b> <u>{"via print dialog"}</u>.
											</React.Fragment>
										}>
										<Button variant='contained' color='primary' size='small' type='submit' startIcon={<PrintIcon />}>
											Print
										</Button>
									</HtmlTooltip>
								)}
								content={() => componentRef.current}
							/>
						</div>
					</div>

					<div style={{ display: "none" }}>{/* <AllInvoicesPrint ref={componentRef} reportdata={paymentsReports} /> */}</div>
				</>
			) : (
				""
			)}
			<div>{/* {loading ? <AllPaymentsSummary reportdata={paymentsReports?.paymentSummaryReport} /> : ""} <br /> */}</div>{" "}
			{loading ? <AllStockUpdateHistoryDetail reportdata={allStockUpdateHistoryReports} /> : ""}{" "}
		</>
	);
};

export default AllStockUpdateHistory;

const useStyles = makeStyles((theme) => ({
	button: {
		marginTop: "25px",
	},
}));

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);
