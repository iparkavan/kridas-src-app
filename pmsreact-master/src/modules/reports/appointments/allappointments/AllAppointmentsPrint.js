import React, { Component } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";
import AllAppointmentsSummary from "./AllAppointmentsSummary";

class AllAppointmentsPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<ReportsHeader companyname={this.props.companyname} reportname={this.props.reportname} />
				<AllAppointmentsSummary reportcurrency={this.props.reportcurrency} reportdata={this.props.reportdata?.incomeSummaryReport} />

				<br />
				<br />
				<br />

				<div style={tabHeader}>
					<div style={txtStyle}>Si.No</div>
					<div style={txtStyle}>Date</div>
					<div style={txtStyle}>Scheduled At</div>
					<div style={txtStyle}>Check-in At</div>
					<div style={txtStyle}>Waited For (hh:mm:ss)</div>
					<div style={txtStyle}>Engaged At</div>
					<div style={txtStyle}>Checkout At</div>
					<div style={txtStyle}>Patient</div>
					<div style={txtStyle}>Doctor</div>
					<div style={txtStyle}>Category</div>
				</div>

				{this.props?.reportdata?.appointmentDetailReports.map((row, idx) => (
					<>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>
							<div style={txtStyle}>{Helper.getDateTimeFromUTC(row.appointmentDate, "DD MMM YYYY")}</div>
							<div style={txtStyle}>{Helper.getDateTimeFromUTC(row.appointmentStarttime, "hh:mm a")}</div>
							<div style={txtStyle}>{Helper.getDateTimeFromUTC(row.checkinTime, "hh:mm a")}</div>
							<div style={txtStyle}>{row.waitedTime}</div>
							<div style={currStyle}>{Helper.getDateTimeFromUTC(row.engageStartTime, "hh:mm a")}</div>
							<div style={currStyle}>{Helper.getDateTimeFromUTC(row.checkoutTime, "hh:mm a")}</div>
							<div style={currStyle}>{row.patientName}</div>
							<div style={currStyle}>{row.doctorName}</div>
							<div style={currStyle}>{row.category}</div>
						</div>
					</>
				))}
			</div>
		);
	}
}

export default AllAppointmentsPrint;

const tabRow = {
	display: "grid",
	gridTemplateColumns: "50px 100px 120px 1fr 1fr 70px 70px 70px 70px 70px",
	width: "90%",
	margin: "0 auto",
	padding: "6px",
};

const tabHeader = {
	display: "grid",
	gridTemplateColumns: "50px 100px 120px 1fr 1fr 70px 70px 70px 70px 70px",
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
