import React, { Component, Fragment } from "react";

import AllInvoicesSummary from "./AllInvoicesSummary";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";

class AllInvoicesToPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<ReportsHeader companyname={this.props.companyname} reportname={this.props.reportname} />
				<AllInvoicesSummary reportcurrency={this.props.reportcurrency} reportdata={this.props.reportdata?.incomeSummaryReport} />

				<br />
				<br />
				<br />

				<div style={tabHeader}>
					<div style={txtStyle}>Si.No</div>
					<div style={txtStyle}>Date</div>
					<div style={txtStyle}>Invoice No.</div>
					<div style={txtStyle}>Patient Name</div>
					<div style={txtStyle}>Treatment & Procedures</div>
					<div style={currStyle}>Cost ({this.props.reportcurrency})</div>
					<div style={currStyle}>Discount ({this.props.reportcurrency})</div>
					<div style={currStyle}>Tax ({this.props.reportcurrency})</div>
					<div style={currStyle}>Inv Amt ({this.props.reportcurrency})</div>
					<div style={currStyle}>Amt Paid ({this.props.reportcurrency})</div>
				</div>

				{this.props?.reportdata?.incomeDetailReports.map((row, idx) => (
					<React.Fragment key={idx}>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>
							<div style={txtStyle}>{Helper.getFormattedDate(row.invoiceDate, "DD MMM YYYY")}</div>
							<div style={txtStyle}>{row.invoiceNo}</div>
							<div style={txtStyle}>{row.patientName}</div>
							<div style={txtStyle}>{Helper.removeStartEndComma(row.treatmentName + ", " + row.productName)}</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.subTotal, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.totalDiscount, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.totalTax, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.totalAmount, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.amountPaid, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
						</div>
					</React.Fragment>
				))}
			</div>
		);
	}
}

export default AllInvoicesToPrint;

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
