import React, { Component, Fragment } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";

class MonthlyInvoicesPrint extends Component {
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

					<div style={currStyle}>Cost ({this.props.reportcurrency})</div>
					<div style={currStyle}>Discount ({this.props.reportcurrency})</div>
					<div style={currStyle}>Inc. after Discount ({this.props.reportcurrency})</div>
					<div style={currStyle}>Tax ({this.props.reportcurrency})</div>
					<div style={currStyle}>Inv Amt ({this.props.reportcurrency})</div>
				</div>

				<div style={summaryHeader}>
					<div style={txtStyle}></div>
					<div style={txtBoldStyle}>Total</div>

					<div style={currBoldStyle}>
						{Helper.getFormattedNumberBasedOnLocale(
							this.props.reportdata.reduce((prev, cur) => prev + cur.totalCost, 0),
							this.props?.reportlocale,
							this.props?.reportcurrency,
						)}
					</div>
					<div style={currBoldStyle}>
						{Helper.getFormattedNumberBasedOnLocale(
							this.props.reportdata.reduce((prev, cur) => prev + cur.totalDiscount, 0),
							this.props?.reportlocale,
							this.props?.reportcurrency,
						)}
					</div>
					<div style={currBoldStyle}>
						{Helper.getFormattedNumberBasedOnLocale(
							this.props.reportdata.reduce((prev, cur) => prev + cur.totalAfterDiscount, 0),
							this.props?.reportlocale,
							this.props?.reportcurrency,
						)}
					</div>
					<div style={currBoldStyle}>
						{Helper.getFormattedNumberBasedOnLocale(
							this.props.reportdata.reduce((prev, cur) => prev + cur.totalTax, 0),
							this.props?.reportlocale,
							this.props?.reportcurrency,
						)}
					</div>
					<div style={currBoldStyle}>
						{Helper.getFormattedNumberBasedOnLocale(
							this.props.reportdata.reduce((prev, cur) => prev + cur.totalInvoiceAmount, 0),
							this.props?.reportlocale,
							this.props?.reportcurrency,
						)}
					</div>
				</div>

				{this.props?.reportdata?.map((row, idx) => (
					<React.Fragment key={idx}>
						<div key={idx} style={tabRow}>
							<div style={txtStyle}>{idx + 1}</div>
							<div style={txtStyle}>{Helper.getFormattedDate(row.invoiceDate, "MMM YYYY")}</div>

							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.totalCost, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.totalDiscount, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.totalAfterDiscount, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.totalTax, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
							<div style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(row.totalInvoiceAmount, this.props?.reportlocale, this.props?.reportcurrency)}
							</div>
						</div>
					</React.Fragment>
				))}
			</div>
		);
	}
}

export default MonthlyInvoicesPrint;

const tabRow = {
	display: "grid",
	gridTemplateColumns: "50px 120px 1fr 1fr 1fr 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "6px",
};

const tabHeader = {
	display: "grid",
	gridTemplateColumns: "50px 120px 1fr 1fr 1fr 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "5px",
	backgroundColor: "#fafafa",
};

const currStyle = {
	textAlign: "right",
	fontSize: "12px",
};
const currBoldStyle = {
	textAlign: "right",
	fontSize: "12px",
	fontWeight: "bold",
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
	gridTemplateColumns: "50px 120px 1fr 1fr 1fr 1fr 1fr",
	width: "90%",
	margin: "0 auto",
	padding: "5px",
};
