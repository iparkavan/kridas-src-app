import React, { useEffect } from "react";
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
	{ id: "month", label: "Month", minWidth: 54, align: "left" },
	{ id: "totalPatients", label: "Total Patients", minWidth: 54, align: "left" },
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function MonthlyNewPatientsSummary(props) {
	const classes = useStyles();

	useEffect(() => {
		console.log("props New MonthlyNewPatientsSummary Summary > " + props);
	}, []);

	return (
		<Paper className={classes.root}>
			<div style={{ padding: "10px 10px", backgroundColor: "lightgrey" }}>SUMMARY</div>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label='sticky table' size='small'>
					<TableHead style={{ color: "black", zIndex: 1, backgroundColor: "red" }}>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, zIndex: 0 }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						<TableRow hover tabIndex={-1}>
							<TableCell align='left'>{Helper.getFormattedDate(props?.reportdata?.month, "MMM YYYY")}</TableCell>
							<TableCell align='left'>{props?.reportdata?.totalPatients}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}
