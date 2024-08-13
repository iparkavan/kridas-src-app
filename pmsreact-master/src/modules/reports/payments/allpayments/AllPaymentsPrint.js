import React, { Component, Fragment } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";
import AllPaymentsSummary from "./AllPaymentsSummary";

class AllPaymentsPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<ReportsHeader companyname={this.props.companyname} reportname={this.props.reportname} />
				<AllPaymentsSummary reportdata={this.props.reportdata?.paymentSummaryReport} />

				<br />
				<br />
				<br />

				<div style={tabHeader}>
					<div style={txtStyle}>Si.No</div>
					<div style={txtStyle}>Date</div>
					<div style={txtStyle}>Patient</div>
					<div style={txtStyle}>Receipt Number</div>

					<div style={txtStyle}>Invoice(s)</div>

					<div style={txtStyle}>Treatments & Products</div>

					<div style={currStyle}>Amt Paid ({this.props.reportcurrency})</div>

					<div style={currStyle}>Advance Amount ({this.props.reportcurrency})</div>
					<div style={currStyle}>Payment Info </div>
					<div style={currStyle}>Vendor Fees ({this.props.reportcurrency})</div>
				</div>

				{this.props?.reportdata?.paymentDetailReports.map((row, idx) => (
					<React.Fragment key={idx}>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>
							<div style={txtStyle}>{Helper.getFormattedDate(row.paymentDate, "DD MMM YYYY")}</div>
							<div style={txtStyle}>{row.patientName}</div>
							<div style={txtStyle}>{row.receiptNo}</div>

							<div style={currStyle}>{row.invoiceNo}</div>

							<div style={currStyle}>{row.treatmentName}</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.amountPaid, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>

							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.advanceAmount, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>

							<div style={currStyle}>{row.paymentMode}</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.vendorFees, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
						</div>
					</React.Fragment>
				))}
			</div>
		);
	}
}

export default AllPaymentsPrint;

const tabRow = {
	display: "grid",
	gridTemplateColumns: "50px 100px 120px 1fr 1fr 1fr 70px 70px 70px 70px",
	width: "94%",
	margin: "0 auto",
	padding: "6px",
};

const tabHeader = {
	display: "grid",
	gridTemplateColumns: "50px 100px 120px 1fr 1fr 1fr 70px 70px 70px 70px",
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
