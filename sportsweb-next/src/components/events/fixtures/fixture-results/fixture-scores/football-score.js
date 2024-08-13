import { Grid } from "@chakra-ui/react";
import { TextMedium } from "../../../../ui/text/text";

const FootballScore = ({ matchScore, type }) => {
  const key =
    type === "first_team" ? "first_team_goals_info" : "second_team_goals_info";
  const goalsInfo = matchScore[key];

  return (
    <Grid templateColumns="auto auto" columnGap={3} justifyItems="center">
      {goalsInfo.map((goal, index) => {
        return (
          <>
            <TextMedium>{goal.player_name}</TextMedium>
            <TextMedium>{goal.goal_min}</TextMedium>
          </>
        );
      })}
    </Grid>
  );
};

export default FootballScore;
