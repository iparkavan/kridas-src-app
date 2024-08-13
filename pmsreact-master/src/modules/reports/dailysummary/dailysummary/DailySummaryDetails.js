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
	{ id: "patientName", label: "Name", minWidth: 100, align: "left" },
	{ id: "procedureName", label: "Treatments & Procedures", minWidth: 180, align: "left" },

	{ id: "invoiceAmount", label: "Inv. Amt", minWidth: 100, align: "left" },
	{ id: "discountAmount", label: "Disc. Amt", minWidth: 100, align: "left" },
	{ id: "taxAmount", label: "Tax Amt", minWidth: 100, align: "left" },
	{ id: "invoiceNo", label: "Inv. #", minWidth: 100, align: "left" },
	{ id: "invoiceAmount", label: "Inv Amt", minWidth: 100, align: "left" },
	{ id: "paymentMode", label: "Payment Mode", minWidth: 100, align: "left" },
	{ id: "payedInvoiceAmount", label: "Payed Inv Amt", minWidth: 100, align: "left" },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function DailySummaryDetails(props) {
	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [load, setLoad] = useState(false);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	useEffect(() => {
		columns[3].label = `Inv. Amt (${props?.reportcurrency})`;
		columns[3].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		columns[4].label = `Disc. Amt (${props?.reportcurrency})`;
		columns[4].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		columns[5].label = `taxAmount (${props?.reportcurrency})`;
		columns[5].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		columns[7].label = `Inv Amt (${props?.reportcurrency})`;
		columns[7].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		columns[9].label = `Payed Inv Amt (${props?.reportcurrency})`;
		columns[9].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		setLoad(true);
	}, []);

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
						{load &&
							props?.reportdata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								return (
									<TableRow hover role='checkbox' tabIndex={-1} key={index}>
										{columns.map((column, idx) => {
											let value = row[column.id];
											if (column.id === "patientName") {
												value = row["patientName"] + " [" + row["patientId"] + "]";
											}

											return (
												<React.Fragment key={idx}>
													<TableCell key={column.id} align={column.align}>
														{column.id === "sino" ? index + 1 : ""}
														{column.format && column.id !== "patientName" ? column.format(value) : value}
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
