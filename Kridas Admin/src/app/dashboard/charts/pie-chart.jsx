import React from "react";
import Chart from "react-google-charts";

const PieChart = (props) => {
  const options = {
    title: "UnApproval List",
    pieHole: 0.4,
    is3D: true,
  };

  return (
    <Chart
      chartType="PieChart"
      width="500px"
      height="300px"
      data={props.approvalData}
      options={options}
    />
  );
};

export default PieChart;
