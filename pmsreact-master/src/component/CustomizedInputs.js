import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import purple from "@material-ui/core/colors/purple";

const styles = theme => ({
	root: {
		"&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
			borderColor: purple[500]
		}
	},
	disabled: {},
	focused: {},
	error: {},
	notchedOutline: {}
});

function CustomizedInputs(props) {
	return (
		<TextField
			InputProps={{ classes: props.classes }}
			label="Custom CSS"
			variant="outlined"
			id="custom-css-outlined-input"
		/>
	);
}

export default withStyles(styles)(CustomizedInputs);
