import React from "react";
import { Chart } from "react-google-charts";


export default function BarChart(props) {

    const options = {
        chart: {
            title:"",
            subtitle: "Last 6 months Records of Users/Pages",
        },
    };

    return (
        <>
            <Chart
                chartType="Bar"
                width="100%"
                height="300px"
                data={props.barValue}
                options={options}
            />
        </>
    )
}