import React, { useEffect, useState, useRef } from "react";

import Helper from "../../../helper/helper";

import { Bar } from "react-chartjs-2";

import "./../../ReportsPrint.scss";

export default function MonthlyAppointmentsChart(props) {
	const randomColorGenerator = function () {
		return "#" + (Math.random().toString(16) + "0000000").slice(2, 8);
	};

	let chartData = {
		labels: [""],
		datasets: [
			{
				label: "Monthly Appointments",
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
		const monthArr = props.reportdata.map((x) => Helper.getFormattedDate(x.appointmentStatus, "MMM YYYY"));
		const invArr = props.reportdata.map((x) => x.totalAppointments);
		const colors = props.reportdata.map((x) => randomColorGenerator());

		chartData.labels = monthArr;
		chartData.datasets[0].data = invArr;
		chartData.datasets[0].backgroundColor = colors;
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
					scales: {
						yAxes: [
							{
								display: true,
								ticks: {
									suggestedMin: 0, // minimum will be 0, unless there is a lower value.
									// OR //
									beginAtZero: true, // minimum value will be 0.
								},
							},
						],
					},
				}}
			/>
		</div>
	);
}

// var options = {
//     scales: {
//         yAxes: [{
//             display: true,
//             ticks: {
//                 suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
//                 // OR //
//                 beginAtZero: true   // minimum value will be 0.
//             }
//         }]
//     }
// };
