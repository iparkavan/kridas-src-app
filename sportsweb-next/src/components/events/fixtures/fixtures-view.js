import { useState } from "react";
import { VStack } from "@chakra-ui/react";
import FixturesSportCard from "./fixtures-sport-card";
import FixturesGenerated from "./fixtures-generated";

function FixturesView(props) {
  const { currentEvent, eventData, sports } = props;
  const [generatedFixturesData, setGeneratedFixturesData] = useState(null);

  return generatedFixturesData ? (
    <FixturesGenerated
      key={generatedFixturesData.generatedFixtures}
      generatedFixturesData={generatedFixturesData}
      setGeneratedFixturesData={setGeneratedFixturesData}
      eventData={eventData}
      currentEvent={currentEvent}
    />
  ) : (
    <VStack spacing={5}>
      {eventData.tournaments.map((tournament) => (
        <FixturesSportCard
          key={tournament.tournamentId}
          currentEvent={currentEvent}
          tournament={tournament}
          sports={sports}
          setGeneratedFixturesData={setGeneratedFixturesData}
        />
      ))}
    </VStack>
  );
}

export default FixturesView;
