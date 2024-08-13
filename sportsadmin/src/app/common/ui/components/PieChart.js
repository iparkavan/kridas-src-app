import { makeStyles } from "@material-ui/core";
import React from "react";
import { Chart } from "react-google-charts";


const useStyles = makeStyles((theme) => ({
    chartAlign: {
        width: "2000px"
    }
}))

export default function PieChart(props) {

    const classes = useStyles();

    const option = {
            title: "UnApproval List",
            pieHole: 0.4,
            is3D: true,
      };

    return (
        <>
            <Chart className={classes.chartAlign}
                chartType="PieChart"
                width="100%"
                height="300px"
                data={props.approvalData}
                options={option}
            />
        </>
    )
}