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
	{ id: "totalPayment", label: "Total Payment ", minWidth: 54, align: "left" },
	{
		id: "totalAdvancePayment",
		label: "Total Advance Payment ",
		minWidth: 54,
		align: "left",
	},
];

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
});

export default function AllPaymentsSummary(props) {
	const classes = useStyles();
	const [load, setLoad] = useState(false);

	useEffect(() => {
		columns[0].label = `Total Payment (${props?.reportcurrency})`;
		columns[1].label = `Total Advance Payment (${props?.reportcurrency})`;

		if (props.reportcurrency !== undefined && props.reportlocale !== undefined && props.reportdata !== undefined) {
			setLoad(true);
		}
	}, [props]);

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
						<TableRow hover tabIndex={-1}>
							<TableCell align='left'>
								{load &&
									Helper.getFormattedNumberBasedOnLocale(
										props?.reportdata?.totalPayment,
										props?.reportlocale,
										props?.reportcurrency,
									)}
							</TableCell>
							<TableCell align='left'>
								{load &&
									Helper.getFormattedNumberBasedOnLocale(
										props?.reportdata?.totalAdvancePayment,
										props?.reportlocale,
										props?.reportcurrency,
									)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}
