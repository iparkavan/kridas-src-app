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

let columns = [
	{ id: "totalCost", label: "Cost ", minWidth: 54, align: "left", format: (value) => Helper.getFormattedNumber(value) },
	{ id: "totalDiscount", label: "Discount ", minWidth: 54, align: "left", format: (value) => Helper.getFormattedNumber(value) },
	{
		id: "totalAfterDiscount",
		label: "Inc. after Discount ",
		minWidth: 54,
		align: "left",
		format: (value) => Helper.getFormattedNumber(value),
	},

	{ id: "totalTax", label: "Tax ", minWidth: 54, align: "left", format: (value) => Helper.getFormattedNumber(value) },
	{ id: "totalInvoiceAmount", label: "Inv Amount ", minWidth: 54, align: "left", format: (value) => Helper.getFormattedNumber(value) },
];

const useStyles = makeStyles({
	root: {
		width: "90%",
		margin: "0 auto",
	},
	container: {
		maxHeight: 440,
	},
});

export default function AllInvoicesSummary(props) {
	const classes = useStyles();
	const [load, setLoad] = useState(false);

	useEffect(() => {
		console.log("props AllInvoicesSummaryTable > " + props);

		columns[0].label = `Cost (${props?.reportcurrency})`;
		columns[1].label = `Discount (${props?.reportcurrency})`;
		columns[2].label = `Inc. after Discount (${props?.reportcurrency})`;
		columns[3].label = `Tax (${props?.reportcurrency})`;
		columns[4].label = `Inv Amount (${props?.reportcurrency})`;
		setLoad(true);
	}, []);

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
								{Helper.getFormattedNumberBasedOnLocale(props?.reportdata?.totalCost, props?.reportlocale, props?.reportcurrency)}
							</TableCell>
							<TableCell align='left'>
								{Helper.getFormattedNumberBasedOnLocale(props?.reportdata?.totalDiscount, props?.reportlocale, props?.reportcurrency)}
							</TableCell>
							<TableCell align='left'>
								{Helper.getFormattedNumberBasedOnLocale(
									props?.reportdata?.totalAfterDiscount,
									props?.reportlocale,
									props?.reportcurrency,
								)}
							</TableCell>
							<TableCell align='left'>
								{Helper.getFormattedNumberBasedOnLocale(props?.reportdata?.totalTax, props?.reportlocale, props?.reportcurrency)}
							</TableCell>
							<TableCell align='left'>
								{Helper.getFormattedNumberBasedOnLocale(
									props?.reportdata?.totalInvoiceAmount,
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
