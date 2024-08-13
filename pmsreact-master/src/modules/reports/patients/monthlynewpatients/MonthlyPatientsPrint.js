import React, { Component, Fragment } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";

class MonthlyPatientsPrint extends Component {
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
					<div style={txtStyle}>Month</div>

					<div style={txtStyle}>Total Patients </div>
				</div>

				<div style={summaryHeader}>
					<div style={txtStyle}>&nbsp;</div>
					<div style={txtStyle}>Total</div>

					<div style={txtStyle}>{this.props.reportdata.reduce((prev, cur) => prev + cur.totalPatients, 0)} </div>
				</div>

				{this.props?.reportdata?.map((row, idx) => (
					<React.Fragment key={idx}>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>
							<div style={txtStyle}>{Helper.getFormattedDate(row.createdDate, "MMM YYYY")}</div>

							<div style={txtStyle}>{row.totalPatients}</div>
						</div>
					</React.Fragment>
				))}
			</div>
		);
	}
}

export default MonthlyPatientsPrint;

const tabRow = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "6px",
};

const tabHeader = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "5px",
	backgroundColor: "#fafafa",
};

const txtStyle = {
	textAlign: "left",
	fontSize: "12px",
};

const summaryHeader = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "5px",
};
