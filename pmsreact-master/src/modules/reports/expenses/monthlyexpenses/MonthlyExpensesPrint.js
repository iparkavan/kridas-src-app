import React, { Component, Fragment } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";

class MonthlyExpensesPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<ReportsHeader companyname={this.props.companyname} reportname={this.props.reportname} />

				<br />
				<br />
				<br />

				<div style={tabHeader}>
					<div style={txtStyle}>Si.No</div>
					<div style={txtStyle}>Date</div>
					<div style={currStyle}>Total Expense ({this.props.reportcurrency})</div>
				</div>

				<div style={summaryHeader}>
					<div>&nbsp;</div>
					<div style={txtBoldStyle}>Total</div>
					<div style={currBoldStyle}>
						{Helper.getFormattedNumber(this.props.reportdata.reduce((prev, cur) => prev + cur.totalExpense, 0))}
					</div>
				</div>

				{this.props?.reportdata?.map((row, idx) => (
					<>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>
							<div style={txtStyle}>{Helper.getFormattedDate(row.invoiceDate, "DD MMM YYYY")}</div>
							<div style={currStyle}>{Helper.getFormattedNumber(row.totalExpense)}</div>
						</div>
					</>
				))}
			</div>
		);
	}
}

export default MonthlyExpensesPrint;

const tabRow = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "6px",
};

const tabHeader = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr",
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

const txtBoldStyle = {
	textAlign: "left",
	fontSize: "12px",
	fontWeight: "bold",
};

const summaryHeader = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "5px",
};

const currBoldStyle = {
	textAlign: "right",
	fontSize: "12px",
	fontWeight: "bold",
};
