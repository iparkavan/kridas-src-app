import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState, useRef, Children, useReducer } from "react";

import "./incomereports.scss";

import ReportsService from "../../../service/ReportsService";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
// theme css file
import "react-date-range/dist/theme/default.css";

import UserService from "../../../service/UserService";

import AuthService from "../../../service/AuthService";

import { addDays } from "date-fns";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

import ReactToPrint from "react-to-print";
import ComponentToPrint from "../ComponentToPrint";

import { Bar } from "react-chartjs-2";
import BarChart from "../charts/barchart";

const IncomeReports = (props) => {
	const componentRef = useRef();

	const [selectedDoc, setSelectedDoc] = useState("");
	const [incomeReports, setIncomeReports] = useState([]);

	useEffect(() => {
		reloadDoctorsList();
		incomereports("", "", "", "");
	}, []);

	// Reload Appointments
	const incomereports = (companyid, startDate, endDate, userId) => {
		let formObject = {
			companyId: "1",
			startDate: "2020-04-21",
			endDate: "2020-05-21",
			userId: 1,
		};
		// fetch all appointments
		ReportsService.fetchIncomeReports(formObject).then((res) => {
			let resArr = res.data;
			setIncomeReports(res.data);
			console.log("print" + JSON.stringify(resArr));
		});
	};

	const classes = useStyles();
	const [doctors, setDoctors] = useState([]);

	const handleSelect = (item) => {
		setState([item.selection]);
		console.log("start date >> " + item.selection.startDate);
		console.log("end date >> " + item.selection.endDate);
	};

	const [state, setState] = useState([
		{
			startDate: new Date(),
			endDate: addDays(new Date(), 7),
			key: "selection",
		},
	]);

	function reloadDoctorsList() {
		UserService.fetchAllDoctors(AuthService.getUserInfo().companyDTO.id).then((res) => {
			setDoctors(res.data);
		});
	}

	const handleChange = (event) => {
		setSelectedDoc(event.target.value);
	};

	return (
		<>
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
				<div>
					<DateRangePicker
						// onChange={(item) => setState([item.selection])}
						onChange={handleSelect}
						showSelectionPreview={true}
						moveRangeOnFirstSelection={false}
						months={1}
						ranges={state}
						direction='horizontal'
					/>
				</div>

				<div>
					<FormControl variant='outlined' className={classes.formControl}>
						<InputLabel>Doctors</InputLabel>
						<Select value={selectedDoc} onChange={handleChange} displayEmpty className={classes.selectEmpty}>
							<MenuItem value=''>
								<em>All</em>
							</MenuItem>

							{doctors.map((doc, i) => (
								<MenuItem key={i} value={doc}>
									{doc.firstName}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
			</div>
			<div>
				<div>
					<div>SUMMARY</div>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}>
						<div>Cost (SGD)</div>
						<div>Discount (SGD)</div>
						<div>Income after Discount (SGD)</div>
						<div>Tax (SGD)</div>
						<div>Invoice Amount (SGD)</div>
					</div>
					{incomeReports ? (
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}>
							<div>{incomeReports?.incomeSummaryReport?.totalCost}</div>
							<div>{incomeReports?.incomeSummaryReport?.totalDiscount}</div>
							<div>{incomeReports?.incomeSummaryReport?.totalAfterDiscount}</div>
							<div>{incomeReports?.incomeSummaryReport?.totalTax}</div>
							<div>{incomeReports?.incomeSummaryReport?.totalInvoiceAmount}</div>
						</div>
					) : (
						""
					)}
					<div>Details</div>
					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr" }}>
						<div>S.No.</div>
						<div>Date</div>
						<div>Invoice Number</div>
						<div>Patient</div>
						<div>Treatments & Products</div>
						<div>Cost (SGD)</div>
						<div>Discount (SGD)</div>
						<div>Tax (SGD)</div>
						<div>Invoice Amount (SGD)</div>
						<div>Amount Paid</div>
					</div>

					{incomeReports?.incomeDetailReports ? (
						<>
							{incomeReports?.incomeDetailReports.map((item, i) => (
								<>
									<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr" }}>
										<div></div>
										<div>{item?.invoiceDate}</div>
										<div>{item?.invoiceNo}</div>
										<div>{item?.patientName}</div>
										<div>{item?.patientId}</div>
										<div>{item?.subTotal}</div>

										<div>{item?.totalDiscount}</div>
										<div>{item?.totalTax}</div>
										<div>{item?.totalAmount}</div>
										<div>{item?.amountPaid}</div>
									</div>
								</>
							))}
						</>
					) : (
						""
					)}
				</div>

				<div>
					<ReactToPrint trigger={() => <button>Print this out!</button>} content={() => componentRef.current} />
					<ComponentToPrint ref={componentRef} reportdata={incomeReports} />
				</div>

				<BarChart data={data} />
			</div>
		</>
	);
};

export default IncomeReports;

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

const data = {
	labels: ["January", "February", "March", "April", "May", "June", "July"],
	datasets: [
		{
			label: "My First dataset",
			backgroundColor: "rgba(255,99,132,0.2)",
			borderColor: "rgba(255,99,132,1)",
			borderWidth: 1,
			hoverBackgroundColor: "rgba(255,99,132,0.4)",
			hoverBorderColor: "rgba(255,99,132,1)",
			data: [65, 59, 80, 81, 56, 55, 40],
		},
	],
};
