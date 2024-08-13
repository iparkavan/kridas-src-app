import React, { useEffect, useState, useRef } from "react";

import ReportsHeader from "../../ReportsHeader";
import Helper from "../../../helper/helper";

import { Bar } from "react-chartjs-2";

import "./../../ReportsPrint.scss";

export default function MonthlyInvoicesChart(props) {
	let chartData = {
		labels: [""],
		datasets: [
			{
				label: "Month Wise Invoice",
				backgroundColor: "rgba(255,99,132,0.2)",
				borderColor: "rgba(255,99,132,1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(255,99,132,0.4)",
				hoverBorderColor: "rgba(255,99,132,1)",
				data: [],
			},
		],
	};

	useEffect(() => {
		const monthArr = props.reportdata.map((x) => Helper.getFormattedDate(x.month, "MMM YYYY"));
		const invArr = props.reportdata.map((x) => x.totalInvoiceAmount);

		chartData.labels = monthArr;
		chartData.datasets[0].data = invArr;
	}, []);

	return (
		<div>
			<br />

			<h2>Chart Analysis</h2>

			<Bar
				data={chartData}
				height={250}
				options={{
					maintainAspectRatio: false,
				}}
			/>
		</div>
	);
}
