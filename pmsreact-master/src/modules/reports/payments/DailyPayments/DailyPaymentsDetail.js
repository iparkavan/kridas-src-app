import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Helper from "../../../helper/helper";

const columns = [
	{ id: "sino", label: "S.No", minWidth: 40 },
	{ id: "paymentMode", label: "Payment Vendor", minWidth: 180, align: "left" },
	{ id: "totalPayment", label: "Total Payment ", minWidth: 54, align: "right", format: (value) => Helper.getFormattedNumber(value) },
	{ id: "vendorFee", label: "Vendor Fees ", minWidth: 54, align: "right", format: (value) => Helper.getFormattedNumber(value) },
	{ id: "netPayment", label: "Net Payment ", minWidth: 54, align: "right", format: (value) => Helper.getFormattedNumber(value) },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function DailyPaymentsDetail(props) {
	const classes = useStyles();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [paymentValues1, setPaymentValues1] = useState(0);
	const [paymentValues2, setPaymentValues2] = useState(0);
	const [paymentValues3, setPaymentValues3] = useState(0);
	const [paymentValues4, setPaymentValues4] = useState(0);
	const [paymentValues5, setPaymentValues5] = useState(0);
	const [paymentValues6, setPaymentValues6] = useState(0);
	const [paymentValues7, setPaymentValues7] = useState(0);
	const [paymentValues8, setPaymentValues8] = useState(0);
	let myVar = "paymentValues";

	useEffect(() => {
		console.log("props > " + props);

		columns[2].label = `Total Payment (${props?.reportcurrency})`;
		columns[2].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		if (props.reportdata.paymentReceivedDetailReports.length > 0) {
			let paymentValues1 = props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues1;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);

			setPaymentValues1(paymentValues1);

			let paymentValues2 = props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues2;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			setPaymentValues2(paymentValues2);

			let paymentValues3 = props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues3;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			setPaymentValues3(paymentValues3);

			let paymentValues4 = props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues4;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			setPaymentValues4(paymentValues4);

			let paymentValues5 = props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues5;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			setPaymentValues5(paymentValues5);

			let paymentValues6 = props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues6;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			setPaymentValues6(paymentValues6);

			let paymentValues7 = props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues7;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			setPaymentValues7(paymentValues7);

			let paymentValues8 = props.reportdata.paymentReceivedDetailReports
				.map((item) => {
					return item.paymentValues8;
				})
				.reduce((accumulator, currentValue) => accumulator + currentValue);
			setPaymentValues8(paymentValues8);
		}
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, props?.reportdata?.length - page * rowsPerPage);

	return (
		<Paper className={classes.root}>
			<div style={{ padding: "10px 10px", backgroundColor: "lightgrey" }}>DETAILS</div>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label='sticky table' size='small'>
					<TableHead>
						<TableRow>
							{props?.reportdata.paymentModes.map((column, idx) => (
								<TableCell key={idx} align={column.align} style={{ minWidth: column.minWidth }}>
									{column}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						<TableRow>
							<TableCell>&nbsp;</TableCell>

							{props?.reportdata.paymentModes.map((column, idx) =>
								idx < props?.reportdata.paymentModes.length - 1 ? (
									<TableCell key={idx} align={column.align} style={{ minWidth: column.minWidth }}>
										{Helper.getFormattedNumberBasedOnLocale(eval(`${myVar}${idx + 1}`), props?.reportlocale, props?.reportcurrency)}
									</TableCell>
								) : (
									""
								),
							)}
						</TableRow>
						{props?.reportdata.paymentReceivedDetailReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
							return (
								<React.Fragment key={index}>
									<TableRow hover role='checkbox' tabIndex={-1} key={index}>
										{Object.entries(row).map(([key, value], idx) => {
											return (
												<React.Fragment key={idx}>
													{idx === 0 ? (
														<TableCell>{Helper.getDateTimeFromUTC(value, "DD-MMM-YYYY")}</TableCell>
													) : idx < props?.reportdata.paymentModes.length ? (
														<TableCell>{Helper.getFormattedNumber(value)}</TableCell>
													) : (
														""
													)}
												</React.Fragment>
											);
										})}
									</TableRow>
								</React.Fragment>
							);
						})}
						{emptyRows > 0 && (
							<TableRow style={{ height: 33 * emptyRows }}>
								<TableCell colSpan={10} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component='div'
				count={props?.reportdata.paymentReceivedDetailReports.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
