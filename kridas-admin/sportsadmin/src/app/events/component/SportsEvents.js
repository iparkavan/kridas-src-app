import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useHttp from "../../../hooks/useHttp";
import EventConfig from "../config/EventConfig";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(() => ({
  sectionSpace: {
    width: "35%",
  },

  message: {
    fontSize: "12px",
  },

  boldText: {
    fontWeight: "500",
  },
}));

const SportsEvents = (props) => {
  const classes = useStyles();
  const { eventId } = props;
  const [eventDetails, setEventDetails] = useState({});
  const { isLoading, sendRequest } = useHttp(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(async () => {
    const config = await EventConfig.getEventById(eventId);
    const transformData = (data) => {
      setEventDetails(data.data);
    };
    sendRequest(config, transformData);
  }, [sendRequest, eventId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {eventDetails?.sport_list?.length > 0 &&
      eventDetails?.sport_list[0].sport_id !== null ? (
        eventDetails?.sport_list?.map((row, index) => (
          <Accordion
            expanded={expanded === row.tournament_category_id}
            key={row.tournament_category_id}
            onChange={handleChange(row.tournament_category_id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }} key={index}>
                <b>{row.sport_name}</b>
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <>
                <div className={classes.sectionSpace}>
                  <Typography key={index}>Tournament Category</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.tournament_category !== null
                        ? row.tournament_category
                        : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Tournament Format</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.tournament_format ? row.tournament_format : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Minimum Age</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.min_age !== null ? row.min_age : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Maximum Age</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.max_age !== null ? row.max_age : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Age Group</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.age_group !== null ? row.age_group : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>
              </>
            </AccordionDetails>

            <AccordionDetails>
              <>
                <div className={classes.sectionSpace}>
                  <Typography key={index}>Minimum Male</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.min_male !== null ? row.min_male : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Maximum Male</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.max_male !== null ? row.max_male : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Minimum Female</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.min_female !== null ? row.min_female : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Maximum Female</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.max_female !== null ? row.max_female : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>
                    Minimum Registration Count
                  </Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.min_reg_count !== null ? row.min_reg_count : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>
              </>
            </AccordionDetails>

            <AccordionDetails>
              <>
                <div className={classes.sectionSpace}>
                  <Typography key={index}>
                    Maximum Registration Count
                  </Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.max_reg_count !== null ? row.max_reg_count : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Minimum Players</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.minimum_players !== null
                        ? row.minimum_players
                        : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Maximum Players</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.maximum_players !== null
                        ? row.maximum_players
                        : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Registration Fee</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.reg_fee !== null ? row.reg_fee : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>

                <div className={classes.sectionSpace}>
                  <Typography key={index}>Registration Currency</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.reg_fee_currency !== null
                        ? row.reg_fee_currency
                        : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>
              </>
            </AccordionDetails>

            <AccordionDetails>
              <>
                <div>
                  <Typography key={index}>Sport Description</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.sport_desc !== null ? row.sport_desc : "NA"}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>
              </>
            </AccordionDetails>

            {/* <AccordionDetails>
              <>
                <div className={classes.sectionSpace}>
                  <Typography key={index}>Sport Category</Typography>
                  <div>
                    <div className={classes.boldText}>
                      {row.sport_category.length > 0 &&
                      row.sport_category !== null ? (
                        row.sport_category?.map((row, index) => (
                          <Accordion
                            expanded={
                              expanded === "panel1" ? row.gender : undefined
                            }
                            onChange={handleChange("panel1")}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1bh-content"
                              id="panel1bh-header"
                            >
                              <Typography
                                sx={{ width: "33%", flexShrink: 0 }}
                                key={index}
                              >
                                {row.category_name}
                              </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                              <div className={classes.sectionSpace}>
                                <Typography key={index}>
                                  Category Name
                                </Typography>
                                <div>
                                  <div className={classes.boldText}>
                                    {row.category_name !== null
                                      ? row.category_name
                                      : "NA"}
                                  </div>
                                  <Divider></Divider>
                                </div>
                              </div>
                            </AccordionDetails>

                            <AccordionDetails>
                              <div className={classes.sectionSpace}>
                                <Typography key={index}>Gender</Typography>
                                <div>
                                  <div className={classes.boldText}>
                                    {row.gender === "M"
                                      ? "Male"
                                      : row.gender === "F"
                                      ? "Female"
                                      : row.gender === "Others"
                                      ? "Others"
                                      : "null"}{" "}
                                  </div>
                                  <Divider></Divider>
                                </div>
                              </div>
                            </AccordionDetails>

                            <AccordionDetails>
                              <div className={classes.sectionSpace}>
                                <Typography key={index}>
                                  Category Code
                                </Typography>
                                <div>
                                  <div className={classes.boldText}>
                                    {row.category_code !== null
                                      ? row.category_code
                                      : "NA"}
                                  </div>
                                  <Divider></Divider>
                                </div>
                              </div>
                            </AccordionDetails>
                          </Accordion>
                        ))
                      ) : (
                        <div className={classes.message}>No Data Available</div>
                      )}
                    </div>
                    <Divider></Divider>
                  </div>
                </div>
              </>
            </AccordionDetails> */}
          </Accordion>
        ))
      ) : (
        <div className={classes.message}>No Data Available</div>
      )}
    </div>
  );
};

export default SportsEvents;
