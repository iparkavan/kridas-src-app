import React, { Component, Fragment } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";
import NewPatientsSummary from "./NewPatientsSummary";

class NewPatientsPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<ReportsHeader companyname={this.props.companyname} reportname={this.props.reportname} />
				<NewPatientsSummary reportcurrency={this.props.reportcurrency} reportdata={this.props.reportdata?.patientSummaryReport} />

				<br />
				<br />
				<br />

				<div style={tabHeader}>
					<div style={txtStyle}>Si.No</div>
					<div style={txtStyle}>Date</div>

					<div style={txtStyle}>Patient Name</div>
					<div style={txtStyle}>Patient Number</div>
				</div>

				{this.props?.reportdata?.patientDetailReports.map((row, idx) => (
					<React.Fragment key={idx}>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>
							<div style={txtStyle}>{Helper.getFormattedDate(row.createdDate, "DD MMM YYYY")}</div>

							<div style={txtStyle}>{row.patientName}</div>
							<div style={txtStyle}>{row.patientId}</div>
						</div>
					</React.Fragment>
				))}
			</div>
		);
	}
}

export default NewPatientsPrint;

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
