import React, { Component, Fragment } from "react";
import { Bar } from "react-chartjs-2";

class BarChart extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		console.log("object..bar." + JSON.stringify(props));
	}
	render() {
		return (
			<div>
				<h2>Bar Example (custom size)</h2>
				<Bar
					data={this.props.data}
					width={100}
					height={50}
					options={{
						maintainAspectRatio: false,
					}}
				/>
			</div>
		);
	}
}

export default BarChart;
