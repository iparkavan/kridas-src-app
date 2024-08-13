import PageContainer from "../../common/layout/components/PageContainer";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import PeopleIcon from "@material-ui/icons/People";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PagesIcon from "@material-ui/icons/Pages";
import CountUp from "react-countup";
import { useState, useEffect } from "react";
import userConfig from "../config/userConfig";
import useHttp from "../../../hooks/useHttp";
import PieChart from "../../common/ui/components/PieChart";
import BarChart from "../../common/ui/components/BarChart";
import TopFollowers from "../../common/ui/components/TopFollowers";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    display: "flex",
    padding: theme.spacing(1),
    justifyContent: "space-between",
    alignItems: "center",
    "&> div": {
      textAlign: "center",
      width: "40%",
    },
  },
  card_layout: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    maxHeight: "330px",
    height: "300px",
    fontWeight: "600",
    "&> div": {
      textAlign: "left",
    },
  },
  icon: {
    height: "5rem",
    width: "5rem",
  },
  gridItem: {
    boxSizing: "border-box",
  },
  CardContent: {
    width: "300px",
    height: "200px",
  },
  heading: {
    textAlign: "center",
  },
  Topheading: {
    fontSize: "20px",
    color: "red",
    justifyContent: "center",
    padding: "7px",
  },
  pages: {
    display: "grid",
    gridTemplateColumns: "2fr 10fr 1fr",
  },
  dividerAlign: {
    background: "none",
    borderTop: "1px dashed #C4C4C4",
    margin: "12px",
  },
}));

const UserDashboard = (props) => {
  const classes = useStyles();
  const [topList, setTopList] = useState();
  const { sendRequest } = useHttp();

  useEffect(() => {
    const config = userConfig.getTopUsers();
    const transformDate = (data) => {
      setTopList(data);
    };
    sendRequest(config, transformDate);
  }, [sendRequest]);

  let defaultStatistics = {
    total_users: "0",
    verified_users: "0",
    unconfirmed_users: "0",
    total_pages: "0",
    verified_company: "0",
  };
  const [statisticsDetail, setStatisticsDetail] = useState(defaultStatistics);

  let data = [
    ["Month", "User Registered", "Page Registered"],
    ["Sep", 0, 0],
    ["Oct", 0, 0],
    ["Nov", 0, 0],
    ["Dec", 0, 0],
    ["Jan", 0, 0],
    ["Feb", 0, 0],
  ];

  let approvalsData = [
    ["UnApproval Users", "UnApproval Pages"],
    ["UnApproval Users", 5],
    ["UnApproval Pages", 1],
  ];

  const [barValue, setBarValue] = useState(data);
  const [approvalData, setApprovalData] = useState(approvalsData);

  const converter = (reqObj) => {
    let arrayData = [];
    console.log("arry data",arrayData);
    let value0 = ["Month", "User Registered", "Page Registered"];
    arrayData.push(value0);
    for (let objects of reqObj) {
      let value1 = [
        objects.month.toString().substring(0, 3),
        Number(objects.users),
        Number(objects.pages),
      ];
      arrayData.push(value1);
    }
    setBarValue(arrayData);
  };

  useEffect(() => {
    fetchApprovals();
    getStatisticsDetail();
    const config = userConfig.getGraph();
    const transformDate = async (dataCount) => {
      if (dataCount) {
        await converter(dataCount);
      }
      console.log("datacount",dataCount);
    };
    sendRequest(config, transformDate);
  }, [sendRequest]);

  const getStatisticsDetail = () => {
    const config = userConfig.fetchStatistics();
    const transformUserData = (data) => {
      if (data) {
        setStatisticsDetail(data[0]);
      }
    };
    sendRequest(config, transformUserData);
  };
  const fetchApprovals = () => {
    const config = userConfig.fetchApprovals();
    const transformUserData = (datacounts) => {
      if (datacounts) {
        approvalData = approvals(datacounts);
      }
    };
    sendRequest(config, transformUserData);
  };

  const approvals = (reqObject) => {
    let tableContent = ["UnApprovals list", "Count"];
    let usersData = [
      "UnApproval Users",
      Number(reqObject.pending_verified_users),
    ];
    let pagesData = [
      "UnApproval Pages",
      Number(reqObject.pending_verified_company),
    ];
    setApprovalData([tableContent, usersData, pagesData]);
  };

  return (
    <PageContainer heading="Home">
      <Grid container justify="flex-start" alignItems="flex-start" spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={3} className={classes.gridItem}>
          <Paper className={classes.paperContainer} elevation={2}>
            <div>
              <PeopleIcon className={classes.icon} color="secondary" />
            </div>
            <div>
              <Typography variant="body1" color="secondary">
                <CountUp end={Number(statisticsDetail.total_users)} />
              </Typography>
              <Typography variant="subtitle1" color="secondary">
                Users
              </Typography>
            </div>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={3}
          className={classes.gridContainer}
        >
          <Paper className={classes.paperContainer} elevation={2}>
            <div>
              <HowToRegIcon className={classes.icon} color="secondary" />
            </div>
            <div>
              <Typography variant="body1" color="secondary">
                <CountUp end={Number(statisticsDetail.verified_users)} />
              </Typography>
              <Typography variant="subtitle1" color="secondary">
                Verified Users
              </Typography>
            </div>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={3}
          className={classes.gridContainer}
        >
          <Paper className={classes.paperContainer} elevation={2}>
            <div>
              <PagesIcon className={classes.icon} color="secondary" />
            </div>
            <div>
              <Typography variant="body1" color="secondary">
                <CountUp end={Number(statisticsDetail.total_pages)} />
              </Typography>
              <Typography variant="subtitle1" color="secondary">
                Pages
              </Typography>
            </div>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={3}
          className={classes.gridContainer}
        >
          <Paper className={classes.paperContainer} elevation={2}>
            <div>
              <CheckCircleIcon className={classes.icon} color="secondary" />
            </div>
            <div>
              <Typography variant="body1" color="secondary">
                <CountUp end={Number(statisticsDetail.verified_company)} />
              </Typography>
              <Typography variant="subtitle1" color="secondary">
                Verified Pages
              </Typography>
            </div>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={8}
          className={classes.gridContainer}
        >
          <Paper className={classes.paperContainer} elevation={2}>
            <BarChart barValue={barValue} />
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          className={classes.gridContainer}
        >
          <Paper className={classes.card_layout} elevation={2}>
            <div>
              <div className={classes.Topheading}> Top 5 users</div>
              <Divider className={classes.dividerAlign} />
              <div className={classes.pages}>
                <TopFollowers
                  topList={topList}
                  heading={"Top 5 pages"}
                  type={"users"}
                />
              </div>
            </div>
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={8}
          className={classes.gridContainer}
        >
          <Paper className={classes.paperContainer} elevation={2}>
            <PieChart approvalData={approvalData} />
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          className={classes.gridContainer}
        >
          <Paper className={classes.card_layout} elevation={2}>
            <div>
              <div className={classes.Topheading}> Top 5 pages</div>
              <Divider className={classes.dividerAlign} />
              <div className={classes.pages}>
                <TopFollowers
                  topList={topList}
                  heading={"Top 5 pages"}
                  type={"company"}
                />
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default UserDashboard;
