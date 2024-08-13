import React from "react";
import Chart from "react-google-charts";

const BarChart = (props) => {
  const options = {
    chart: {
      title: "Users/Pages Performance",
      subtitle: "Last 6 months Records of Users/Pages",
    },
    backgroundColor: 'red'
  };

  return (
    <Chart
      chartType="Bar"
      width="500px"
      height="300px"
      data={props.barValue}
      options={options}
    />
  );
};

export default BarChart;
