import React, { useEffect } from "react";
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
import * as moment from "moment";

const columns = [
	{ id: "sino", label: "S.No", minWidth: 40 },
	{
		id: "appointmentDate",
		label: "Date",
		minWidth: 140,
		format: (value) => Helper.getDateTimeFromUTC(value, "DD-MMM-YYYY"),
	},

	{
		id: "appointmentStarttime",
		label: "Scheduled At",
		minWidth: 150,
		align: "left",

		format: (value) => Helper.getDateTimeFromUTC(value, "hh:mm a"),
	},

	{ id: "checkinTime", label: "Check-in At", minWidth: 150, align: "left", format: (value) => Helper.getDateTimeFromUTC(value, "hh:mm a") },

	{ id: "waitedTime", label: "Waited For(mm:ss)", minWidth: 80, align: "left" },
	{ id: "engageStartTime", label: "Engaged At", minWidth: 54, align: "right", format: (value) => Helper.getDateTimeFromUTC(value, "hh:mm a") },
	{ id: "checkoutTime", label: "Checkout At", minWidth: 54, align: "right", format: (value) => Helper.getDateTimeFromUTC(value, "hh:mm a") },

	{ id: "patientName", label: "Patient", minWidth: 180, align: "left" },

	{ id: "doctorName", label: "Doctor", minWidth: 54, align: "right" },

	{ id: "category", label: "category", minWidth: 54, align: "right" },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function AllAppointmentsDetail(props) {
	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	useEffect(() => {
		console.log("props > " + props);
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, props?.reportdata?.appointmentDetailReports.length - page * rowsPerPage);

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
						{props?.reportdata?.appointmentDetailReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
							return (
								<TableRow hover role='checkbox' tabIndex={-1} key={index}>
									{columns.map((column, idx) => {
										let value = row[column.id];
										return (
											<React.Fragment key={idx}>
												<TableCell key={column.id} align={column.align}>
													{column.id === "sino" ? index + 1 : ""}
													{column.format &&
													(column.id === "appointmentDate" ||
														column.id === "checkinTime" ||
														column.id === "appointmentStarttime" ||
														column.id === "engageStartTime" ||
														column.id === "checkoutTime")
														? value === null
															? ""
															: column.format(value)
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
				count={props?.reportdata?.appointmentDetailReports.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
