import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import useHttp from "../../../hooks/useHttp";
import BodyText from "../../common/ui/components/BodyText";
import BodyHeading from "../../common/ui/components/BodyHeading";
import moment from "moment";
import EventConfig from "../config/EventConfig";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  sectionSpace: {
    margin: "10px 0 0px 0",
  },
  contentSpace: {
    margin: "1px 0 0 0",
  },
  totalMargin: {
    margin: "1%",
    marginLeft: "10px",
  },
  tableAlign: {
    width: "100%",
    margin: "10px 0 0 0",
  },
  // heading: {
  //   fontFamily: "Arial, Helvetica, sans-serif",
  //   fontSize: "23px",
  //   marginBottom: "10px",
  //   marginTop: "5px",
  //   // color: "#97BFB4",
  // },
  boldText: {
    fontWeight: "500",
  },
  logoPreview: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    width: "47vh",
    height: "26vh",
    marginLeft: "40px",
    marginTop: "10px",
  },
  coverImage: {
    marginBottom: "20px",
    width: "full",
    height: "250px",
    objectFit: "conver",
  },
  profilePic: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
  },
  doubleGrid: {
    display: "flex",
    columnGap: "20px",
  },
  userDetails: {
    // lineHeight: "5px",
    borderRight: "solid rgba(0, 0, 0, 0.12)",
    paddingRight: "20px",
  },
  companyTitle: {
    fontFamily: "bold",
  },
  flexStatus: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  heading: {
    color: "#97BFB4",
    // marginTop: "auto"
    // lineHeight: "1px",
    // paddingTop: "10px",
  },
  status: {
    margin: 0,
    // lineHeight: "5px",
    // marginLeft: "10px",
  },
  verifiedIcon: {
    color: "green",
    // paddingTop: "10px",
    // alignItems: "center",
    marginLeft: "4px",
  },
  unverified: {
    // paddingTop: "5px",
  },
  mailAndContactIcons: {
    color: "#97BFB4",
    marginRight: "12px",
  },
}));

const EventInformations = (props) => {
  const classes = useStyles();
  const { eventId } = props;
  const [eventDetails, setEventDetails] = useState({});
  const { isLoading, sendRequest } = useHttp(true);
  const [desc, setDesc] = useState("");
  const [terms, setTerms] = useState("");
  console.log(eventDetails);

  useEffect(async () => {
    const config = await EventConfig.getEventById(eventId);
    const transformData = (data) => {
      setEventDetails(data.data);
      setDesc(JSON.parse(data.data?.event_desc));
      setTerms(JSON.parse(data.data?.event_rules));
    };
    sendRequest(config, transformData);
  }, [sendRequest, eventId]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div>
        {eventDetails.event_banner && (
          <img
            className={classes.coverImage}
            src={eventDetails.event_banner}
            alt="coverImage"
          />
        )}
      </div>
      <div className={classes.doubleGrid}>
        <div className={classes.userDetails}>
        {eventDetails.event_logo && (
            <img
              className={classes.profilePic}
              src={eventDetails.event_logo}
              alt="profilePic"
            />
          )}
          <div className={classes.sectionSpace}>
            <h2 className={classes.companyTitle}>
              {eventDetails?.event_name
                ? eventDetails?.event_name
                : "No Data Available"}
            </h2>
          </div>

          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Event Category</h3>
            <div className={classes.sectionSpace}>
              <BodyText>
                {eventDetails?.category_name
                  ? eventDetails?.category_name
                  : "No Data Available"}
              </BodyText>
            </div>
          </div>
        </div>

        <div>
          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>From</h3>
            <div className={classes.sectionSpace}>
              <BodyText>
                {eventDetails?.event_startdate !== undefined &&
                eventDetails?.event_startdate !== null
                  ? moment(new Date(eventDetails?.event_startdate)).format(
                      "YYYY-MM-DD"
                    )
                  : "No Data Available"}
              </BodyText>
            </div>

            <div className={classes.sectionSpace}>
              <h3 className={classes.heading}>To</h3>
              <div className={classes.sectionSpace}>
                <BodyText>
                  {eventDetails?.event_enddate !== undefined &&
                  eventDetails?.event_enddate !== null
                    ? moment(new Date(eventDetails?.event_enddate)).format(
                        "YYYY-MM-DD"
                      )
                    : "No Data Available"}
                </BodyText>
              </div>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Virtual Id</h3>
            <div className={classes.sectionSpace}>
              <BodyText>
                {eventDetails?.virtual_venue_url
                  ? eventDetails?.virtual_venue_url
                  : "No Data Available"}
              </BodyText>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Stream URL</h3>
            <div className={classes.sectionSpace}>
              <BodyText>
                {eventDetails?.stream_url
                  ? eventDetails?.stream_url?.map((e) => {
                      return (
                        <>
                          <div className={classes.totalGrid}>
                            <div>
                              <Typography>
                                <b>URL : </b>
                                <a href={e.url}>{e.url}</a>
                              </Typography>
                            </div>
                            <div>
                              <Typography>
                                <b>Description : </b>
                                {e.desc}
                              </Typography>
                            </div>
                          </div>
                        </>
                      );
                    })
                  : "No Data Available"}
              </BodyText>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Description</h3>
            <div className={classes.sectionSpace}>
              <BodyText>
                {desc
                  ? desc.blocks[0].text
                  : eventDetails?.event_desc
                  ? eventDetails?.event_desc
                  : "No Data Available"}
              </BodyText>
            </div>
          </div>

          <div className={classes.sectionSpace}>
            <h3 className={classes.heading}>Terms and Conditions</h3>
            <div className={classes.sectionSpace}>
              <BodyText>
                {terms
                  ? terms.blocks[0].text
                  : eventDetails?.event_rules
                  ? eventDetails?.event_rules
                  : "No Data Available"}
              </BodyText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInformations;
