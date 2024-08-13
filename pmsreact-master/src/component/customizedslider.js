import React from "react";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles(theme => ({
	root: {
		width: 300 + theme.spacing(3) * 2
	},
	margin: {
		height: theme.spacing(3)
	}
}));

const PrettoSlider = withStyles({
	root: {
		color: "#52af77",
		height: 8
	},
	thumb: {
		height: 24,
		width: 24,
		backgroundColor: "#fff",
		border: "2px solid currentColor",
		marginTop: -8,
		marginLeft: -12,
		"&:focus,&:hover,&$active": {
			boxShadow: "inherit"
		}
	},
	active: {},
	valueLabel: {
		left: "calc(-50% + 4px)"
	},
	track: {
		height: 8,
		borderRadius: 4
	},
	rail: {
		height: 8,
		borderRadius: 4
	}
})(Slider);

const CustomizedSlider = props => {
	const classes = useStyles();
	console.log("now testZ " + props.progress);
	console.log("now test " + props.percentcompleted);

	// this.setState({ progressvalue: props.percentcompleted });

	return (
		<div className={classes.root}>
			<div style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
				<div style={{ fontSize: "14px" }}>Course Progress </div>
				<div>{props.progress}</div>
			</div>

			<PrettoSlider
				valueLabelDisplay="auto"
				aria-label="pretto slider"
				value={props.percentcompleted || ""}
				defaultValue={0}
			/>
			<div className={classes.margin} />
		</div>
	);
};

export default CustomizedSlider;
