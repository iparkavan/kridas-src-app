import React, { Component, Fragment } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import "./../../ReportsPrint.scss";

class DailyPaymentsPrint extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paymentValues1: 0,
			paymentValues2: 0,
			paymentValues3: 0,
			paymentValues4: 0,
			paymentValues5: 0,
			paymentValues6: 0,
			paymentValues7: 0,
			paymentValues8: 0,
		};
	}

	componentDidMount() {
		if (this.props.reportdata.paymentReceivedDetailReports.length > 0) {
			let paymentValues1 = this.props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues1;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			this.setState({ paymentValues1: paymentValues1 });

			let paymentValues2 = this.props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues3;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			this.setState({ paymentValues2: paymentValues2 });

			let paymentValues3 = this.props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues3;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			this.setState({ paymentValues3: paymentValues3 });

			let paymentValues4 = this.props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues4;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			this.setState({ paymentValues4: paymentValues4 });

			let paymentValues5 = this.props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues5;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			this.setState({ paymentValues5: paymentValues5 });

			let paymentValues6 = this.props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues6;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			this.setState({ paymentValues6: paymentValues6 });

			let paymentValues7 = this.props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues7;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			this.setState({ paymentValues7: paymentValues7 });

			let paymentValues8 = this.props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues8;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			this.setState({ paymentValues8: paymentValues8 });
		}
	}

	render() {
		return (
			<div>
				<ReportsHeader companyname={this.props.companyname} reportname={this.props.reportname} />

				<br />

				<div style={tabHeader}>
					{this.props?.reportdata.paymentModes.map((column, idx) => (
						<div key={idx} align={column.align} style={{ minWidth: column.minWidth }}>
							{column}
						</div>
					))}
				</div>

				{this.props?.reportdata.paymentReceivedDetailReports.map((row, index) => {
					return (
						<React.Fragment key={index}>
							<div tabIndex={-1} key={index} style={tabRow}>
								{Object.entries(row).map(([key, value], idx) => {
									return (
										<React.Fragment key={idx}>
											{idx === 0 ? (
												<div>{Helper.getDateTimeFromUTC(value, "YYYY/MM/DD")}</div>
											) : idx < this.props?.reportdata.paymentModes.length ? (
												<div>{Helper.getFormattedNumber(value)}</div>
											) : (
												""
											)}
										</React.Fragment>
									);
								})}
							</div>
						</React.Fragment>
					);
				})}
			</div>
		);
	}
}

export default DailyPaymentsPrint;

const tabRow = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(80px,1fr)",
	width: "94%",
	margin: "0 auto",
	padding: "6px",
};

const tabHeader = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(80px,1fr)",
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
