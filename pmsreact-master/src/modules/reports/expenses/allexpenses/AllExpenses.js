import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import Button from "@material-ui/core/Button";
import PrintIcon from "@material-ui/icons/Print";
import AllExpensesSummaryReports from "./AllExpensesSummary";
import AllExpensesDetailsReports from "./AllExpensesDetails";
import AllExpensesPrint from "./AllExpensesPrint";

const AllExpensesReports = (props) => {
	const [expenseReports, setExpenseReports] = useState([]);
	const [loading, setLoading] = useState(false);

	const componentRef = useRef();

	useEffect(() => {
		setExpenseReports(props.reportdata);
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
								<Button variant='contained' color='primary' size='small' type='submit' startIcon={<PrintIcon />}>
									Print
								</Button>
							)}
							content={() => componentRef.current}
						/>
					</div>

					<div style={{ display: "none" }}>
						<AllExpensesPrint
							ref={componentRef}
							companyname={props.companyname}
							reportname={props.reportname}
							reportcurrency={props.reportcurrency}
							reportdata={expenseReports}
						/>
					</div>
				</>
			) : (
				""
			)}
			<div>
				{" "}
				{loading ? (
					<AllExpensesSummaryReports
						reportdata={expenseReports?.expenseSummaryReport}
						reportcurrency={props.reportcurrency}
						reportlocale={props.reportlocale}
					/>
				) : (
					""
				)}{" "}
				<br />
				<br />
			</div>{" "}
			{loading ? (
				<AllExpensesDetailsReports reportdata={expenseReports} reportcurrency={props.reportcurrency} reportlocale={props.reportlocale} />
			) : (
				""
			)}{" "}
		</>
	);
};

export default AllExpensesReports;
