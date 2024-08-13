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

let columns = [
	{ id: "sino", label: "S.No", minWidth: 50 },
	{
		id: "invoiceDate",
		label: "Date",
		minWidth: 120,
		format: (value) => Helper.getFormattedDate(value, "DD-MMM-YYYY"),
	},
	{ id: "invoiceNo", label: "Invoice Number", minWidth: 170, align: "left" },
	{ id: "patientName", label: "Patient", minWidth: 200, align: "left" },
	{ id: "treatmentName", label: "Treatments & Products", minWidth: 200, align: "left", format: (value) => Helper.removeStartEndComma(value) },
	{ id: "subTotal", label: "Cost ", minWidth: 54, align: "right", format: "" },
	{ id: "totalDiscount", label: "Discount ", minWidth: 54, align: "right", format: "" },
	{ id: "totalTax", label: "Tax ", minWidth: 54, align: "right", format: "" },
	{ id: "totalAmount", label: "Inv Amount ", minWidth: 54, align: "right", format: "" },
	{ id: "amountPaid", label: "Amount Paid ", minWidth: 54, align: "right", format: "" },
];

const useStyles = makeStyles({
	root: {
		width: "92%",
		margin: "0 auto",
	},
	container: {
		maxHeight: 440,
	},
});

export default function AllInvoicesDetails(props) {
	const classes = useStyles();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [count, setCount] = useState(0);

	const [load, setLoad] = useState(false);

	useEffect(() => {
		console.log("props > " + props);
		console.log("props > " + props?.reportdata?.incomeDetailReports.length);
		setCount(props?.reportdata?.incomeDetailReports.length);

		columns[5].label = `Cost (${props?.reportcurrency})`;
		columns[6].label = `Discount (${props?.reportcurrency})`;
		columns[7].label = `Tax (${props?.reportcurrency})`;
		columns[8].label = `Inv Amount (${props?.reportcurrency})`;
		columns[9].label = `Amount Paid (${props?.reportcurrency})`;

		columns[5].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[6].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[7].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[8].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[9].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		setLoad(true);
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, props?.reportdata?.incomeDetailReports.length - page * rowsPerPage);

	return (
		<Paper className={classes.root}>
			<div style={{ padding: "10px 10px", backgroundColor: "lightgrey" }}>DETAILS</div>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label='sticky table' size='small'>
					<TableHead>
						<TableRow>
							{load &&
								columns.map((column) => (
									<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
										{column.label}
									</TableCell>
								))}
						</TableRow>
					</TableHead>

					<TableBody>
						{props?.reportdata?.incomeDetailReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
							return (
								<TableRow hover role='checkbox' tabIndex={-1} key={index}>
									{columns.map((column, idx) => {
										let value = row[column.id];

										if (column.id === "treatmentName") {
											value =
												(row["treatmentName"] === null ? "" : row["treatmentName"]) + ", " + (row["productName"] === null ? "" : row["productName"]);
										}

										return (
											<React.Fragment key={idx}>
												<TableCell key={column.id} align={column.align}>
													{column.id === "sino" ? index + 1 : ""}
													{column.format && (column.id !== "invoiceNo" || column.id !== "patientName") ? column.format(value) : value}
												</TableCell>
											</React.Fragment>
										);
									})}
								</TableRow>
							);
						})}

						<TableRow style={{ height: 33 * emptyRows }}>
							<TableCell colSpan={10} />
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component='div'
				count={count === undefined ? 0 : count}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
