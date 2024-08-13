import { useState } from "react";
import { VStack } from "@chakra-ui/react";
import PointsTableSportCard from "./points-table-sport-card";
import PointsTableDisplay from "./points-table-display";

const PointsTableView = (props) => {
  const { currentEvent, eventData, sports } = props;
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedTournamentCategory, setSelectedTournamentCategory] =
    useState(null);

  return selectedSport && selectedTournamentCategory ? (
    <PointsTableDisplay
      selectedSport={selectedSport}
      selectedTournamentCategory={selectedTournamentCategory}
      setSelectedTournamentCategory={setSelectedTournamentCategory}
      currentEvent={currentEvent}
      eventId={eventData.eventId}
    />
  ) : (
    <VStack spacing={5}>
      {eventData.tournaments.map((tournament) => (
        <PointsTableSportCard
          key={tournament.tournamentId}
          currentEvent={currentEvent}
          tournament={tournament}
          sports={sports}
          setSelectedSport={setSelectedSport}
          setSelectedTournamentCategory={setSelectedTournamentCategory}
          eventId={eventData.eventId}
        />
      ))}
    </VStack>
  );
};

export default PointsTableView;
