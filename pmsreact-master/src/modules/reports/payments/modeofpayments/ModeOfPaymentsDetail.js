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

export default function ModeOfPaymentsDetail(props) {
	const classes = useStyles();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [sumTotalPayments, setSumTotalPayments] = useState(0);
	const [sumVendorFee, setSumVendorFee] = useState(0);
	const [netPayment, setNetPayment] = useState(0);
	const [load, setLoad] = useState(false);

	useEffect(() => {
		console.log("props > " + props.reportdata);

		columns[2].label = `Total Payment (${props?.reportcurrency})`;
		columns[2].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		columns[3].label = `Vendor Fees (${props?.reportcurrency})`;
		columns[3].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		columns[4].label = `Net Payment (${props?.reportcurrency})`;
		columns[4].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		const data = props.reportdata || [];

		let sumTotalPayments = data
			.map((item) => {
				return item.totalPayment;
			})
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		setSumTotalPayments(sumTotalPayments);

		let sumVendorFee = data
			.map((item) => {
				return item.vendorFee;
			})
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		setSumVendorFee(sumVendorFee);

		let netPayment = data
			.map((item) => {
				return item.netPayment;
			})
			.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		setNetPayment(netPayment);
		setLoad(true);
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
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						<TableRow>
							<TableCell>&nbsp;</TableCell>
							<TableCell>TOTAL</TableCell>
							<TableCell style={{ textAlign: "right" }}>{Helper.getFormattedNumber(sumTotalPayments)}</TableCell>
							<TableCell style={{ textAlign: "right" }}>{Helper.getFormattedNumber(sumVendorFee)}</TableCell>
							<TableCell style={{ textAlign: "right" }}>{Helper.getFormattedNumber(netPayment)}</TableCell>
						</TableRow>
						{load &&
							props?.reportdata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								return (
									<TableRow hover role='checkbox' tabIndex={-1} key={index}>
										{columns.map((column, idx) => {
											let value = row[column.id];

											if (column.id === "treatmentName") {
												value =
													(row["treatmentName"] === null ? "" : row["treatmentName"]) + "," + (row["productName"] === null ? "" : row["productName"]);
											}

											return (
												<React.Fragment key={idx}>
													<TableCell key={column.id} align={column.align}>
														{column.id === "sino" ? index + 1 : ""}
														{column.format && (column.id !== "invoiceNo" || column.id !== "patientName" || column.id !== "treatmentName")
															? column.format(value)
															: value}
													</TableCell>
												</React.Fragment>
											);
										})}
									</TableRow>
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
				count={props?.reportdata.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
