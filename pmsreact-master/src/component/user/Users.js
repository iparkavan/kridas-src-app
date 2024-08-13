import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";

import UserService from "../../service/UserService";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CreateIcon from "@material-ui/icons/Create";

import TableHead from "@material-ui/core/TableHead";
import Button from "@material-ui/core/Button";

import TablePaginationActions from "../../elements/ui/TablePaginationActions/TablePaginationActions";
import MasterData from "../../modules/helper/masterdata";

TablePaginationActions.propTypes = {
	count: PropTypes.number.isRequired,
	onChangePage: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
	table: {
		minWidth: 500,
	},
});

export default function Users(props) {
	const classes = useStyles2();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [userList, setUserList] = useState([]);
	const [message, setMessage] = useState("");

	useEffect(() => {
		reloadUserList();
	}, []);

	const reloadUserList = () => {
		UserService.fetchUsers()
			.then((res) => {
				console.log(res);
				if (res.status === 200) {
					setUserList(res.data);
					setMessage("");
				} else {
					setMessage("No users found.");
				}
			})
			.catch((error) => {
				console.log(error);
				setMessage("Error n retreiving user list data.");
			});
	};

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, userList.length - page * rowsPerPage);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const editUser = (id) => {
		window.localStorage.setItem("userId", id);
		props.history.push("/admin/edit-user");
	};

	const addUser = () => {
		window.localStorage.removeItem("userId");
		props.history.push("/admin/add-user");
	};

	return (
		<>
			<Container style={stylewrap}>
				<Typography variant="h4" style={style}>
					User Details
				</Typography>
				<Button variant="contained" color="primary" onClick={() => addUser()}>
					+ Add User
				</Button>
				<Typography variant="body2" style={style} color="error">
					{message}
				</Typography>

				<TableContainer component={Paper} style={{ marginTop: "10px" }}>
					<Table className={classes.table} aria-label="custom pagination table">
						<TableHead>
							<TableRow>
								<TableCell>First Name</TableCell>
								<TableCell>Last Name</TableCell>
								<TableCell>Middle Name</TableCell>
								<TableCell>Email Address</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Status</TableCell>
								<TableCell align="center">Edit</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(rowsPerPage > 0
								? userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								: userList
							).map((row) => (
								<TableRow key={row.id}>
									<TableCell component="th" scope="row">
										{row.firstName}
									</TableCell>
									<TableCell>{row.lastName}</TableCell>
									<TableCell>{row.middleName}</TableCell>
									<TableCell>{row.userEmail}</TableCell>
									<TableCell>{row.userPhone}</TableCell>

									<TableCell>
										{row.userRolesList.length > 0 ? row.userRolesList[0].roleDesc : ""}
									</TableCell>
									{/* <TableCell>{MasterData.getStatusLabelFromValue(row.userStatus)}</TableCell> */}
									<TableCell align="center">
										<IconButton aria-label="Edit" onClick={() => editUser(row.id)} size="small">
											<CreateIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}

							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>

						<TableFooter>
							<TableRow>
								<TablePagination
									rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
									colSpan={8}
									count={userList.length}
									rowsPerPage={rowsPerPage}
									page={page}
									SelectProps={{
										inputProps: { "aria-label": "rows per page" },
										native: true,
									}}
									onChangePage={handleChangePage}
									onChangeRowsPerPage={handleChangeRowsPerPage}
									ActionsComponent={TablePaginationActions}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
			</Container>
		</>
	);
}

const stylewrap = {
	justifyContent: "center",
	marginLeft: "72px",
	width: "calc(100% - 72px)",
	height: "100vh",
	paddingTop: "100px",
};

const style = {
	display: "flex",
	justifyContent: "center",
};
