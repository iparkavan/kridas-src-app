import React, { Component, Fragment } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";

class ModeOfPaymentsPrint extends Component {
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

					<div style={txtStyle}>Payment Vendor</div>

					<div style={currStyle}>Total Payment ({this.props.reportcurrency})</div>

					<div style={currStyle}>Vendor Fees ({this.props.reportcurrency})</div>
					<div style={currStyle}>Net Payment ({this.props.reportcurrency})</div>
				</div>

				{this.props?.reportdata?.map((row, idx) => (
					<React.Fragment key={idx}>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>

							<div style={txtStyle}>{row.paymentMode}</div>

							<div style={currStyle}>{Helper.getFormattedNumber(row.totalPayment)}</div>

							<div style={currStyle}>{Helper.getFormattedNumber(row.vendorFees)}</div>
							<div style={currStyle}>{Helper.getFormattedNumber(row.netPayment)}</div>
						</div>
					</React.Fragment>
				))}
			</div>
		);
	}
}

export default ModeOfPaymentsPrint;

const tabRow = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr 1fr 1fr",
	width: "94%",
	margin: "0 auto",
	padding: "6px",
};

const tabHeader = {
	display: "grid",
	gridTemplateColumns: "50px 1fr 1fr 1fr 1fr",
	width: "94%",
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
