import BodyText from "../../../common/ui/components/BodyText";

const SportsNameList = (props) => {
  const { selectedSports, sportsList } = props;

  const getSportsName = (sportsId) => {
    const sportsObj =
      sportsList !== null && sportsList.find((x) => x.sportsId === sportsId);
    return !(sportsObj == null) ? sportsObj.sportsName : null;
  };


  return selectedSports.map((sport) => {
    return <BodyText key={sport.sportsId}>{getSportsName(sport)}</BodyText>;
  });
};

export default SportsNameList;
