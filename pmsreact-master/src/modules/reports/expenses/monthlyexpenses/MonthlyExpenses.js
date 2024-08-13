import React, { useEffect, useState, useRef } from "react";
import ReactToPrint from "react-to-print";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import Button from "@material-ui/core/Button";
import PrintIcon from "@material-ui/icons/Print";
import MonthlyExpensesDetailsReports from "./MonthlyExpensesDetails";
import MonthlyExpensesPrint from "./MonthlyExpensesPrint";
import MonthlyExpensesChart from "./MonthlyExpensesChart";

const MonthlyExpensesReports = (props) => {
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
					<div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0px 20px 0px" }}>
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
						<MonthlyExpensesPrint
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
			{loading ? (
				<MonthlyExpensesDetailsReports reportdata={expenseReports} reportlocale={props.reportlocale} reportcurrency={props.reportcurrency} />
			) : (
				""
			)}{" "}
			{loading ? (
				<div style={{ width: "600px", height: "400px", margin: "0 auto", overflow: "hidden" }}>
					<MonthlyExpensesChart reportdata={expenseReports} reportcurrency={props.reportcurrency} />
				</div>
			) : (
				""
			)}
		</>
	);
};

export default MonthlyExpensesReports;
