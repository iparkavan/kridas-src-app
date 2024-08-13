import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import useHttp from "../../../hooks/useHttp";
import userConfig from "../config/userConfig";
import BodyText from "../../common/ui/components/BodyText";
import BodyHeading from "../../common/ui/components/BodyHeading";
import Address from "../../common/ui/components/Address";
import ExternalLink from "../../common/ui/components/ExternalLink";
import LinkListWithObject from "../../common/ui/components/LinkListWithObject";
import helper from "../../../utils/helper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(() => ({
  sectionSpace: {
    margin: "20px 0 0px 0",
  },
  contentSpace: {
    margin: "5px 0 0 0",
  },
  tableAlign: {
    marginTop: "20px"
  }
}));

const UserProfile = (props) => {
  const classes = useStyles();
  const { userId } = props;
  const [userDetails, setUserDetails] = useState({});
  const { isLoading, sendRequest } = useHttp(true);

  useEffect(async () => {
    const config = await userConfig.getUserById(userId);
    const transformData = (data) => {
      setUserDetails(data.data);
    };
    sendRequest(config, transformData);

  }, [sendRequest, userId]);


  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        <BodyText>
          {userDetails?.first_name} {userDetails?.last_name}{" "}
          {userDetails?.user_status === "AC" ? (
            <span style={{ color: "green" }}>{"(Active)"}</span>
          ) : (
            <span style={{ color: "red" }}>{"(Inactive)"}</span>
          )}
        </BodyText>
        <BodyText>{helper.getGenderName(userDetails?.user_gender)}</BodyText>
        <BodyText>{userDetails?.user_email}</BodyText>
        <BodyText>{userDetails?.user_phone}</BodyText>
        <BodyText>
          {userDetails.user_dob !== null
            ? `Born on ${new Date(userDetails?.user_dob).toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}`
            : ""}
        </BodyText>

        <ExternalLink url={userDetails?.user_website}>Website</ExternalLink>
      </div>
      <div className={classes.sectionSpace}>
        <BodyHeading>Address</BodyHeading>
        <Divider></Divider>
        <div className={classes.contentSpace}>
          <Address address={userDetails.address} />
        </div>
      </div>
      <div className={classes.sectionSpace}>
        <BodyHeading>Social Media Links</BodyHeading>
        <Divider></Divider>
        <div className={classes.contentSpace}>
          <LinkListWithObject listItems={userDetails.social} />
        </div>
      </div>
      <div className={classes.sectionSpace}>
        <BodyHeading>Documents</BodyHeading>
        <Divider></Divider>
        <div className={classes.contentSpace}>
          <BodyText>{userDetails?.user_identity_docs?.length > 0 ? userDetails?.user_identity_docs?.map((e) => { return (<p ><a href={e.url}>{e.url}</a></p>) }) : "No details available on file."}</BodyText>
        </div>
      </div>
      <div className={classes.sectionSpace}>
        <BodyHeading>About</BodyHeading>
        <Divider></Divider>
        <div className={classes.contentSpace}>
          <BodyText>
            {userDetails.user_desc === null
              ? "No data available on file."
              : userDetails.user_desc}
          </BodyText>
        </div>
      </div>

      <div className={classes.sectionSpace}>
        <BodyHeading>User Bio</BodyHeading>
        <Divider></Divider>
        <div className={classes.tableAlign}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sports Name</TableCell>
                  <TableCell>Profession</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userDetails?.bio_details !== null ?
                  <TableRow   >
                    <TableCell component="th" scope="row">
                      {userDetails?.sports_name}
                    </TableCell>
                    <TableCell>{userDetails?.lookup_value}</TableCell>
                    <TableCell>{userDetails?.bio_details?.description}</TableCell>
                  </TableRow> : "No Data Available"}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
