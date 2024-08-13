import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

export default function SnackBar(props) {
	function Alert(props) {
		return <MuiAlert elevation={6} variant="filled" {...props} />;
	}

	return (
		<>
			<Snackbar open={props.open} autoHideDuration={5000} onClose={props.handleClose}>
				<Alert onClose={props.handleClose} severity="success">
					{props.message}
				</Alert>
			</Snackbar>
		</>
	);
}
