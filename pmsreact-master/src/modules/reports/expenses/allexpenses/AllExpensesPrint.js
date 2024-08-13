import React, { Component, Fragment } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";
import AllExpensesSummaryReports from "./AllExpensesSummary";

class AllExpensesPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<ReportsHeader companyname={this.props.companyname} reportname={this.props.reportname} />

				<AllExpensesSummaryReports reportcurrency={this.props.reportcurrency} reportdata={this.props.reportdata?.expenseSummaryReport} />
				<br />
				<br />
				<br />

				<div style={tabHeader}>
					<div style={txtStyle}>Si.No</div>
					<div style={txtStyle}>Date</div>
					<div style={currStyle}>Expense Amount ({this.props.reportcurrency})</div>
					<div style={txtStyle}>Expense Type</div>
					<div style={txtStyle}>Mode Of Payment</div>
				</div>

				{this.props?.reportdata?.expenseDetailReports.map((row, idx) => (
					<>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>
							<div style={txtStyle}>{Helper.getFormattedDate(row.invoiceDate, "DD MMM YYYY")}</div>
							<div style={currStyle}>{Helper.getFormattedNumber(row.expenseAmount)}</div>
							<div style={txtStyle}>{row.expenseType}</div>
							<div style={txtStyle}>{row.paymentMode}</div>
						</div>
					</>
				))}
			</div>
		);
	}
}

export default AllExpensesPrint;

const tabRow = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "6px",
};

const tabHeader = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "5px",
	backgroundColor: "#fafafa",
};

const currStyle = {
	textAlign: "right",
	fontSize: "12px",
};

const txtStyle = {
	textAlign: "left",
	fontSize: "12px",
};
