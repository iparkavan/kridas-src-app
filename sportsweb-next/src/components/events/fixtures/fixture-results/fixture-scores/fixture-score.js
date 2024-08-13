import CricketScore from "./cricket-score";
import FootballScore from "./football-score";
import SetsScore from "./sets-score";

const FixtureScore = ({ sportCode, matchScore, ...otherProps }) => {
  if (!matchScore) {
    return null;
  }

  let Component;
  switch (sportCode) {
    case "SPOR05":
      Component = CricketScore;
      break;
    case "SPOR07":
      Component = FootballScore;
      break;
    default:
      Component = SetsScore;
  }

  return <Component matchScore={matchScore} {...otherProps} />;
};

export default FixtureScore;
