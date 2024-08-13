import React, { useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { Backdrop, CircularProgress, CssBaseline, Drawer, Grid, Paper } from "@material-ui/core";
import Summary from "./Summary";
import customStyles from "./CustomStyle";
import clsx from "clsx";
import LeftsideMenu from './LeftsideMenu';
import logodb from "../img/Beats-health-logo.png";
import SessionTimeOut from './common/SessionTimeOut';

const SummaryPage = () => {
    const classes = customStyles();
    const [isLoading, setLoading] = React.useState(false);
    const [summaryDashboardDetails, setSummaryDashboardDetails] = React.useState([]);
    const [open] = React.useState(false);

    function statusColors(status) {
        if (status === 'Failed') {
            return 'red';
        } else if (status === 'Completed') {
            return 'green';
        }
    }

    useEffect(() => {
        fetchSummaryDashboard();
    }, [])

    setTimeout(() => {
        fetchSummaryDashboard();
    }, 300000);

    const fetchSummaryDashboard = async () => {
        // if (sessionStorage.role === 'Admin') {
        let fetchConfig = {
            method: "get",
            url: process.env.REACT_APP_BEATS_FETCH_SUMMARY_DASHBOARD,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.idToken,
            }
        };

        try {
            setLoading(true);
            let summaryDashboardResponse = await axios(fetchConfig);
            setLoading(false);
            var summary = {};
            var tempDashboardDetails = [];
            if (summaryDashboardResponse && summaryDashboardResponse.data) {
                for (var i = 0; i < summaryDashboardResponse.data.length; i++) {
                    summary = {};
                    summary.createdOn = summaryDashboardResponse.data[i].created_on;
                    summary.lastUpdated = summaryDashboardResponse.data[i].modified_on === null ? "" : summaryDashboardResponse.data[i].modified_on;
                    summary.user = summaryDashboardResponse.data[i].first_name === null ? summaryDashboardResponse.data[i].organization_name : summaryDashboardResponse.data[i].first_name + ' ' + summaryDashboardResponse.data[i].last_name
                    summary.totRecordsUploaded = summaryDashboardResponse.data[i].total_processing;
                    summary.total = summaryDashboardResponse.data[i].total_processing;
                    summary.nameTag = summaryDashboardResponse.data[i].widget_name;
                    summary.totRecordsERA = summaryDashboardResponse.data[i].era_count;
                    summary.uploadedFileUrl = summaryDashboardResponse.data[i].s3_bucket_url;
                    summary.fileUploadId = summaryDashboardResponse.data[i].file_upload_id;
                    summary.status = summaryDashboardResponse.data[i].file_processing_status;
                    summary.color = statusColors(summary.status);
                    summary.verification = summaryDashboardResponse.data[i].file_type;
                    summary.comments = summaryDashboardResponse.data[i].comments;
                    let processingStatus = summaryDashboardResponse.data[i].processing_status;
                    for (var j = 0; j < processingStatus.length; j++) {
                        if (processingStatus[j].processing_status === "Complete") {
                            summary.complete = processingStatus[j].total_processing;
                        } else if (processingStatus[j].processing_status === "Validation Failed") {
                            summary.validationFailed = processingStatus[j].total_processing;
                        } else if (processingStatus[j].processing_status === "In Progress") {
                            summary.inProgress = processingStatus[j].total_processing;
                        } else if (processingStatus[j].processing_status === "Retry") {
                            summary.retry = processingStatus[j].total_processing;
                        } else if (processingStatus[j].processing_status === "Transaction Failed") {
                            summary.transactionFailed = processingStatus[j].total_processing;
                        }
                    }
                    tempDashboardDetails.push(summary);
                }

                let reversedData = tempDashboardDetails && tempDashboardDetails.reverse();
                setSummaryDashboardDetails(reversedData ? reversedData : []);
            }
        } catch (e) {
            console.log("failed to fetch summary dashboard data");
            setLoading(false);
        }
        // }
    }

    return (
        <div className={classes.root}>
            <SessionTimeOut />
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CssBaseline />
            <ToastContainer />
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <img src={logodb} className="dblogo" alt="Beats Logo" />
                </div>
                <LeftsideMenu />
            </Drawer>
            <main id="maindiv" className={classes.content}>
                <Paper elevation={6} style={{ padding: '10px', overflow: 'hidden' }} >
                    <h1 style={{ marginTop: '20px' }}>Please note, each widget in the summary dashboard correspond to a batch run. All widgets below are auto refreshed for every 5 minutes and auto deleted based on admin configuration</h1>
                    <Grid container>
                        {summaryDashboardDetails ? summaryDashboardDetails.map((summaryObject) => {
                            return (
                                <Grid item xs={12} sm={6} md={4} style={{ margin: '5px', float: 'left', maxWidth: '31%' }}>
                                    <Summary {...summaryObject} fetchSummaryDashboard={fetchSummaryDashboard} setLoading={setLoading} />
                                </Grid>
                            )
                        }) : <Grid item xs={12} sm={12} md={12} style={{ margin: '5%', textAlign: 'center' }}>
                            No records found
                        </Grid>}
                    </Grid>
                </Paper>
            </main>
        </div>
    )
}

export default SummaryPage