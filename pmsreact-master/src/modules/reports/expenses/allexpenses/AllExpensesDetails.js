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
		id: "expenseDate",
		label: "Date",
		minWidth: 150,
		format: (value) => Helper.getFormattedDate(value, "DD MMM YYYY"),
	},

	{ id: "expenseAmount", label: "Expense Amount ", minWidth: 54, align: "right", format: (value) => Helper.getFormattedNumber(value) },
	{ id: "expenseType", label: "Expense Type", minWidth: 54, align: "right" },
	{ id: "paymentMode", label: "Mode Of Payment", minWidth: 54, align: "right" },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function AllExpensesDetailsReports(props) {
	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		console.log("props > " + props);
		columns[2].label = `Expense Amount (${props?.reportcurrency})`;
		columns[2].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		setLoading(true);
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, props?.reportdata?.expenseDetailReports.length - page * rowsPerPage);

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
						{loading &&
							props?.reportdata?.expenseDetailReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								return (
									<TableRow hover role='checkbox' tabIndex={-1} key={index}>
										{columns.map((column, idx) => {
											let value = row[column.id];

											return (
												<React.Fragment key={idx}>
													<TableCell key={column.id} align={column.align}>
														{column.id === "sino" ? index + 1 : ""}
														{column.format && column.id !== "invoiceNo" ? column.format(value) : value}
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
				count={props?.reportdata?.expenseDetailReports.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
