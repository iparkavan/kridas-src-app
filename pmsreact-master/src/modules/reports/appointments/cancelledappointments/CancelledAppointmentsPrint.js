import React, { Component, Fragment } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";

class CancelledAppointmentsPrint extends Component {
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

				<div style={tabHeader}>
					<div style={txtStyle}>Si.No</div>
					<div style={txtStyle}>Appointment Status</div>
					<div style={txtStyle}>Total Appointments</div>
				</div>

				{this.props?.reportdata?.map((row, idx) => (
					<>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>
							<div style={txtStyle}>{row.appointmentStatus}</div>
							<div style={txtStyle}>{row.totalAppointments}</div>
						</div>
					</>
				))}
			</div>
		);
	}
}

export default CancelledAppointmentsPrint;

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
