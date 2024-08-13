import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";

import TableRow from "@material-ui/core/TableRow";
import Helper from "../../../helper/helper";
import TablePagination from "@material-ui/core/TablePagination";

let columns = [
	{ id: "sino", label: "S.No", minWidth: 60, align: "left" },
	{
		id: "month",
		align: "left",
		label: "Month",
		minWidth: 100,
		format: (value) => Helper.getFormattedDate(value, "MMM YYYY"),
	},

	{ id: "totalCost", label: "Cost", minWidth: 54, align: "right", format: "" },
	{ id: "totalDiscount", label: "Discount", minWidth: 54, align: "right", format: "" },
	{
		id: "totalAfterDiscount",
		label: "Inc. after Discount",
		minWidth: 54,
		align: "right",
		format: "",
	},

	{ id: "totalTax", label: "Tax", minWidth: 54, align: "right", format: "" },
	{ id: "totalInvoiceAmount", label: "Inv Amount", minWidth: 54, align: "right", format: "" },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function MonthlyInvoicesDetailTable(props) {
	const classes = useStyles();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [load, setLoad] = useState(false);
	const [count, setCount] = useState(0);
	const [totalCost, setTotalCost] = useState(0);
	const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
	const [totalDiscount, setTotalDiscount] = useState(0);
	const [totalTax, setTotalTax] = useState(0);
	const [totalInvAmount, setTotalInvAmount] = useState(0);

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, props?.reportdata?.length - page * rowsPerPage);

	useEffect(() => {
		console.log("props MonthlyInvoicesDetailTable > " + props);

		let reportArr = props.reportdata;
		//const totalCost = reportArr.reduce((prev, cur) => prev + cur.totalCost, 0);

		setTotalCost(reportArr.reduce((prev, cur) => prev + cur.totalCost, 0));
		setTotalDiscount(reportArr.reduce((prev, cur) => prev + cur.totalDiscount, 0));
		setTotalAfterDiscount(reportArr.reduce((prev, cur) => prev + cur.totalAfterDiscount, 0));
		setTotalTax(reportArr.reduce((prev, cur) => prev + cur.totalTax, 0));
		setTotalInvAmount(reportArr.reduce((prev, cur) => prev + cur.totalInvoiceAmount, 0));

		setCount(props?.reportdata?.length);

		columns[2].label = `Cost (${props?.reportcurrency})`;
		columns[3].label = `Discount (${props?.reportcurrency})`;
		columns[4].label = `Inc. after Discount (${props?.reportcurrency})`;
		columns[5].label = `Tax (${props?.reportcurrency})`;
		columns[6].label = `Inv Amount (${props?.reportcurrency})`;

		columns[2].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[3].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[4].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[5].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		columns[6].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);

		setLoad(true);
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper className={classes.root}>
			<div style={{ padding: "10px 10px", backgroundColor: "lightgrey" }}>SUMMARY</div>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label='sticky table' size='small'>
					<TableHead style={{ color: "black", zIndex: 1, backgroundColor: "red" }}>
						<TableRow>
							{load &&
								columns.map((column) => (
									<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, zIndex: 0 }}>
										{column.label}
									</TableCell>
								))}
						</TableRow>
					</TableHead>

					<TableBody>
						<TableRow>
							<TableCell>&nbsp;</TableCell>
							<TableCell style={txtStyle}>Total</TableCell>
							<TableCell style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(totalCost, props?.reportlocale, props?.reportcurrency)}
							</TableCell>
							<TableCell style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(totalDiscount, props?.reportlocale, props?.reportcurrency)}
							</TableCell>
							<TableCell style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(totalAfterDiscount, props?.reportlocale, props?.reportcurrency)}
							</TableCell>
							<TableCell style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(totalTax, props?.reportlocale, props?.reportcurrency)}
							</TableCell>
							<TableCell style={currStyle}>
								{Helper.getFormattedNumberBasedOnLocale(totalInvAmount, props?.reportlocale, props?.reportcurrency)}
							</TableCell>
						</TableRow>
					</TableBody>

					<TableBody>
						{load &&
							props?.reportdata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								return (
									<TableRow hover role='checkbox' tabIndex={-1} key={index}>
										{columns.map((column, idx) => {
											let value = row[column.id];

											return (
												<React.Fragment key={idx}>
													<TableCell key={column.id} align={column.align}>
														{column.id === "sino" ? index + 1 : ""}
														{column.format && column.id !== "" ? column.format(value) : value}
													</TableCell>
												</React.Fragment>
											);
										})}
									</TableRow>
								);
							})}
						{emptyRows > 0 && (
							<TableRow style={{ height: 20 * emptyRows }}>
								<TableCell colSpan={10} />
							</TableRow>
						)}
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

const currStyle = {
	textAlign: "right",
	fontSize: "12px",
	fontWeight: "bold",
};

const txtStyle = {
	textAlign: "left",
	fontSize: "12px",
	fontWeight: "bold",
};
