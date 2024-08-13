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
	{ id: "sino", label: "S.No", minWidth: 60 },
	{
		id: "month",
		label: "Month",
		minWidth: 150,
		format: (value) => Helper.getFormattedDate(value, "MMM YYYY"),
	},
	{ id: "totalExpense", label: "Total Expense ", minWidth: 54, align: "right", format: (value) => Helper.getFormattedNumber(value) },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function MonthlyExpensesDetailsReports(props) {
	const classes = useStyles();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [totalExpense, setTotalExpense] = useState(0);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		console.log("props > " + props);

		columns[2].label = `Total Expense (${props?.reportcurrency})`;
		columns[2].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		setTotalExpense(props.reportdata.reduce((prev, cur) => prev + cur.totalExpense, 0));
		setLoading(true);
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
							{loading &&
								columns.map((column) => (
									<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
										{column.label}
									</TableCell>
								))}
						</TableRow>
					</TableHead>

					<TableBody>
						<TableRow>
							<TableCell>&nbsp;</TableCell>
							<TableCell style={txtBoldStyle}>Total</TableCell>
							<TableCell style={currBoldStyle}>{Helper.getFormattedNumber(totalExpense)}</TableCell>
						</TableRow>
					</TableBody>

					<TableBody>
						{loading &&
							props?.reportdata?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								return (
									<TableRow hover role='checkbox' tabIndex={-1} key={index}>
										{columns.map((column, idx) => {
											let value = row[column.id];

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
				count={props?.reportdata?.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

const txtBoldStyle = {
	textAlign: "left",
	fontSize: "12px",
	fontWeight: "bold",
};

const currBoldStyle = {
	textAlign: "right",
	fontSize: "12px",
	fontWeight: "bold",
};
