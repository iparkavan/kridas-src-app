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
	{
		id: "paymentDate",
		label: "Date",
		minWidth: 140,
		format: (value) => Helper.getFormattedDate(value, "DD MMM YYYY"),
	},
	{ id: "patientName", label: "Patient", minWidth: 180, align: "left" },
	{ id: "receiptNo", label: "Receipt Number", minWidth: 170, align: "left" },

	{ id: "invoiceNo", label: "Invoice(s)", minWidth: 200, align: "left" },

	{ id: "treatmentName", label: "Treatments & Products", minWidth: 200, align: "left", format: (value) => Helper.removeStartEndComma(value) },
	{ id: "amountPaid", label: "Amount Paid ", minWidth: 54, align: "right", format: "" },
	{ id: "advanceAmount", label: "Advance Amount ", minWidth: 54, align: "right", format: "" },
	{ id: "paymentMode", label: "Payment Info", minWidth: 54, align: "right" },

	{ id: "vendorFees", label: "Vendor Fees ", minWidth: 54, align: "right", format: "" },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function AllPaymentsDetail(props) {
	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [load, setLoad] = useState(false);

	useEffect(() => {
		columns[6].label = `Amount Paid (${props?.reportcurrency})`;
		columns[7].label = `Advance Amount (${props?.reportcurrency})`;
		columns[9].label = `Vendor Fees (${props?.reportcurrency})`;

		columns[6].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[7].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[9].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		setLoad(true);
	}, [props]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, props?.reportdata?.paymentDetailReports.length - page * rowsPerPage);

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
						{props?.reportdata?.paymentDetailReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
							return (
								<TableRow hover role='checkbox' tabIndex={-1} key={index}>
									{load &&
										columns.map((column, idx) => {
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
				count={props?.reportdata?.paymentDetailReports.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
