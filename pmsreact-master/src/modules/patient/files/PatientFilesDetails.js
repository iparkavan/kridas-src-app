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
import Helper from "../../helper/helper";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PatientService from "../../../service/PatientService";
import { useHistory, useParams } from "react-router-dom";
import NotificationDialog from "../../../elements/ui/Dialog/NotificationDialog";

const columns = [
	{ id: "sino", label: "S.No", minWidth: 60 },
	{
		id: "fileDate",
		label: "Date",
		minWidth: 150,
		format: (value) => Helper.getFormattedDate(value, "DD MMM YYYY"),
	},
	{ id: "fileName", label: "File Name", minWidth: 170, align: "left" },
	{ id: "action", label: "", minWidth: 170, align: "center" },
	{ id: "id", label: "", minWidth: 170, align: "center" },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function PatientFilesDetails(props) {
	const classes = useStyles();
	let history = useHistory();

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [open, setOpen] = React.useState(false);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleChange = (fileURL) => {
		window.open(fileURL);
	};

	const handleDelete = (id) => {
		console.log("object" + id);
		PatientService.deleteMediaFile(id).then((res) => {
			if (res.data.success) {
				setOpen(true);
			}
		});
	};

	const handleClose = (event, reason) => {
		setOpen(false);
		history.goBack();
	};

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, props?.reportdata?.length - page * rowsPerPage);

	return (
		<>
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
							{props?.reportdata?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								return (
									<TableRow hover role='checkbox' tabIndex={-1} key={index}>
										{columns.map((column, idx) => {
											let value = row[column.id];
											let filepath = "";
											if (column.id === "action") {
												filepath = row["filePath"];
											}
											return (
												<React.Fragment key={idx}>
													<TableCell key={column.id} align={column.align}>
														{column.id === "sino" ? index + 1 : ""}
														{column.format && column.id === "fileDate" ? column.format(value) : ""}
														{column.id === "fileName" ? value : ""}
														{column.id === "action" ? (
															<div style={{ cursor: "pointer" }}>
																<IconButton onClick={() => handleChange(filepath)}>
																	<VisibilityIcon />
																</IconButton>
															</div>
														) : (
															""
														)}
														{column.id === "id" ? (
															<div style={{ cursor: "pointer" }}>
																<IconButton onClick={() => handleDelete(value)}>
																	<DeleteIcon />
																</IconButton>
															</div>
														) : (
															""
														)}
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

			<NotificationDialog open={open} handleClose={handleClose} title='File'>
				<span>Patient file deleted successfully!!!</span>
			</NotificationDialog>
		</>
	);
}
