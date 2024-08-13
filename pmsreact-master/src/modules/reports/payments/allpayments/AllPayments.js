import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import Button from "@material-ui/core/Button";
import PrintIcon from "@material-ui/icons/Print";

import AllPaymentsSummary from "./AllPaymentsSummary";
import AllPaymentsDetail from "./AllPaymentsDetail";
import AllPaymentsPrint from "./AllPaymentsPrint";

import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const AllPaymentsReports = (props) => {
	const [paymentsReports, setPaymentsReports] = useState([]);
	const [loading, setLoading] = useState(false);

	const componentRef = useRef();

	useEffect(() => {
		setPaymentsReports(props.reportdata);

		setLoading(true);
	}, [props.reportdata]);

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
						<AllPaymentsPrint
							ref={componentRef}
							companyname={props.companyname}
							reportname={props.reportname}
							reportcurrency={props.reportcurrency}
							reportlocale={props.reportlocale}
							reportdata={paymentsReports}
						/>
					</div>
				</>
			) : (
				""
			)}
			<div>
				{" "}
				{loading ? (
					<AllPaymentsSummary
						reportcurrency={props.reportcurrency}
						reportlocale={props.reportlocale}
						reportdata={paymentsReports?.paymentSummaryReport}
					/>
				) : (
					""
				)}{" "}
				<br />
				<br />
			</div>{" "}
			{loading ? <AllPaymentsDetail reportcurrency={props.reportcurrency} reportlocale={props.reportlocale} reportdata={paymentsReports} /> : ""}{" "}
		</>
	);
};

export default AllPaymentsReports;
const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);
