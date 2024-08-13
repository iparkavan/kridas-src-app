import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useHttp from "../../../../hooks/useHttp";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import BodyText from "../../../common/ui/components/BodyText";
import SportsConfig from "../config/SportsConfig";
import PageContainer from "../../../common/layout/components/PageContainer";

const useStyles = makeStyles((theme) => ({
  sectionSpace: {
    margin: "20px 0 0px 0",
  },
  contentSpace: {
    margin: "8px 0 0 0",
  },
  totalMargin: {
    margin: "3%",
    marginLeft: "45px",
  },
  tableAlign: {
    width: "100%",
    margin: "10px 0 0 0",
  },
  heading: {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "23px",
    marginBottom: "10px",
    marginTop: "5px",
  },
  boldText: {
    fontWeight: "500",
  },
}));

/* View Sports Function */

function ViewSports(props) {
  const classes = useStyles();
  let history = useHistory();
  const { sportsId } = props.match.params;
  let InitalState = {
    sports_name: "",
    sports_desc: "",
    sports_code: "",
    sports_category: [],
    sports_age_group: [],
    sports_format: [],
    // sports_brand: [],
    sports_role: [],
    is_stats_enabled: false,
  };
  const { sendRequest } = useHttp();
  const [sportsDetails, setSportsDetails] = useState(InitalState);
  const {
    sports_name,
    sports_desc,
    sports_format,
    sports_category,
    sports_age_group,
    sports_profile,
    sports_role,
    sports_code,
    is_stats_enabled,
  } = sportsDetails;
  /* const [brandCompany, setBrandCompany] = useState(sports_brand); */
  const [, setClear] = useState({});

  /* For Fetching Sports Data and Company Name For Sports Brand */

  useEffect(() => {
    const config = SportsConfig.getById(sportsId);
    const transformDate = (data) => {
      setSportsDetails(data.data);
    };
    sendRequest(config, transformDate);

    /* const brandConfig = SportsConfig.getCompanyNameBySportsId(sportsId)
        const transformBrandData = (data) => {
            setBrandCompany(data.data.array_agg);
        };
        sendRequest(brandConfig, transformBrandData); */

    return () => {
      setClear({});
    };
  }, [sendRequest, sportsId]);

  const Backbtn = () => {
    history.push(`/masters/sports`);
  };

  return (
    <>
      <PageContainer
        heading="Sports Details"
        isBackButon={true}
        onAction={Backbtn}
      >
        <div className={classes.totalMargin}>
          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Sport Name </div>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>{sports_name}</BodyText>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <div className={classes.boldText}> Sport Code </div>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>{sports_code ? sports_code : "NA"}</BodyText>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Sports Statistics </div>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>
                {is_stats_enabled === true ? "Enabled" : "Disabled"}
              </BodyText>
            </div>
          </div>

          {/* <div className={classes.sectionSpace}>
                        <div className={classes.boldText}>Sport Brand </div>
                        <Divider></Divider>
                        <div className={classes.contentSpace}>
                            <BodyText>{sports_brand.length === 0 ? 'NA' : brandCompany.join(" , ")}</BodyText>
                        </div>
                    </div> */}

          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Sport Description </div>
            <Divider></Divider>
            <div className={classes.contentSpace}>
              <BodyText>{sports_desc}</BodyText>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Sports Category </div>
            <Divider></Divider>
            <div className={classes.tableAlign}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category Code</TableCell>
                      <TableCell>Category Name</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sports_category?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.category_code}
                        </TableCell>
                        <TableCell>{row.category_name}</TableCell>
                        <TableCell>
                          {row.gender === "M"
                            ? "M"
                            : row.gender === "F"
                            ? "F"
                            : row.gender === "Others"
                            ? "Others"
                            : "null"}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.type}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Age Group</div>
            <Divider></Divider>
            <div className={classes.tableAlign}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Age Group Code</TableCell>
                      <TableCell>Age Group</TableCell>
                      <TableCell>Minimum Age</TableCell>
                      <TableCell>Maximum Age</TableCell>
                      <TableCell>Minimum Players</TableCell>
                      <TableCell>Maximum Players</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sports_age_group?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.age_group_code}
                        </TableCell>
                        <TableCell>{row.age_group}</TableCell>
                        <TableCell>{row.min_age}</TableCell>
                        <TableCell>{row.max_age}</TableCell>
                        <TableCell>{row.min_players}</TableCell>
                        <TableCell>{row.max_players}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Sport Format </div>
            <Divider></Divider>
            <div className={classes.tableAlign}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Format Code</TableCell>
                      <TableCell>Format Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sports_format?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.format_code}
                        </TableCell>
                        <TableCell>{row.format_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Sport Profile </div>
            <Divider></Divider>
            <div className={classes.tableAlign}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Profile Code</TableCell>
                      <TableCell>Profile Name</TableCell>
                      <TableCell>Profile Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sports_profile?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.profile_code}
                        </TableCell>
                        <TableCell>{row.profile_name}</TableCell>
                        <TableCell>{row.profile_description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <div className={classes.boldText}>Sport Role </div>
            <Divider></Divider>
            <div className={classes.tableAlign}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Role Code</TableCell>
                      <TableCell>Role Name</TableCell>
                      <TableCell>Role Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sports_role?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.role_code}
                        </TableCell>
                        <TableCell>{row.role_name}</TableCell>
                        <TableCell>{row.role_desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export default ViewSports;
