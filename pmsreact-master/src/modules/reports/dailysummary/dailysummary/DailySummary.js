import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";
// import AllInvoicesPrint from "../allinvoices/AllInvoicesPrint";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
// import AllInvoicesDetailTable from "./AllInvoicesDetailTable";
import Button from "@material-ui/core/Button";
import PrintIcon from "@material-ui/icons/Print";
import DailySummaryDetails from "./DailySummaryDetails";

import DailySummaryPrint from "./DailySummaryPrint";

import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const DailySummaryReports = (props) => {
	const [dailySummaryReports, setDailySummaryReports] = useState([]);
	const [loading, setLoading] = useState(false);

	const componentRef = useRef();

	useEffect(() => {
		setDailySummaryReports(props.reportdata);

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
						<div style={{ alignSelf: "center" }}></div>
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

					<div style={{ display: "none" }}>
						{/* <UnSettledInvoicesPrint
							ref={componentRef}
							companyname={props.companyname}
							reportname={props.reportname}
							reportcurrency={props.reportcurrency}
							reportdata={unsettledInvoiceReports}
						/> */}
					</div>
				</>
			) : (
				""
			)}
			{loading ? <DailySummaryDetails reportdata={props.reportdata} reportlocale={props.reportlocale} reportcurrency={props.reportcurrency} /> : ""}{" "}
		</>
	);
};

export default DailySummaryReports;

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);