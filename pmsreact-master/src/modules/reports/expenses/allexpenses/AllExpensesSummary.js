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

const columns = [
	{ id: "totalExpense", label: "Total Expense (SGD)", minWidth: 54, align: "center", format: (value) => Helper.getFormattedNumber(value) },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function AllExpensesSummaryReports(props) {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		console.log("props AllExpensesSummaryTable > " + props);
		columns[0].label = `Expense Amount (${props?.reportcurrency})`;
		columns[0].format = (value) => Helper.getFormattedNumberBasedOnLocale(value, props?.reportlocale, props?.reportcurrency);
		setLoading(true);
	}, []);

	return (
		<Paper className={classes.root}>
			<div style={{ padding: "10px 10px", backgroundColor: "lightgrey" }}>SUMMARY</div>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label='sticky table' size='small'>
					<TableHead style={{ color: "black", zIndex: 1, backgroundColor: "red" }}>
						<TableRow>
							{loading &&
								columns.map((column) => (
									<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, zIndex: 0 }}>
										{column.label}
									</TableCell>
								))}
						</TableRow>
					</TableHead>

					<TableBody>
						<TableRow hover tabIndex={-1}>
							<TableCell align='center'>{Helper.getFormattedNumber(props?.reportdata?.totalExpense)}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}
