import { TextMedium } from "../../../../ui/text/text";

const VsScore = ({ sportCode, matchScore, type }) => {
  if (!matchScore || sportCode === "SPOR05") {
    return null;
  }

  let color, score;
  if (sportCode === "SPOR07") {
    // Football
    const { first_team_score, second_team_score } = matchScore;
    if (type === "first_team") {
      score = first_team_score;
      if (first_team_score > second_team_score) {
        color = "green.500";
      } else if (first_team_score < second_team_score) {
        color = "red.500";
      } else {
        color = "black";
      }
    } else {
      score = second_team_score;
      if (second_team_score > first_team_score) {
        color = "green.500";
      } else if (second_team_score < first_team_score) {
        color = "red.500";
      } else {
        color = "black";
      }
    }
  } else {
    // Sets
    const { first_team_score, second_team_score } = matchScore;
    if (type === "first_team") {
      score = first_team_score;
      if (first_team_score > second_team_score) {
        color = "green.500";
      } else if (first_team_score < second_team_score) {
        color = "red.500";
      } else {
        color = "black";
      }
    } else {
      score = second_team_score;
      if (second_team_score > first_team_score) {
        color = "green.500";
      } else if (second_team_score < first_team_score) {
        color = "red.500";
      } else {
        color = "black";
      }
    }
  }

  return (
    <TextMedium fontSize="3xl" fontWeight="bold" color={color}>
      {score}
    </TextMedium>
  );
};

export default VsScore;
