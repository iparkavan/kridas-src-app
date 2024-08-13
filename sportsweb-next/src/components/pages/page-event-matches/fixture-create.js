import { Box, HStack, Select, Text } from "@chakra-ui/react";
import { values } from "draft-js/lib/DefaultDraftBlockRenderMap";
import React, { useState } from "react";
import { useEffect } from "react";
import { useEventByIdJava, useEventMatches } from "../../../hooks/event-hook";
import { useSports } from "../../../hooks/sports-hooks";
import { useTeams } from "../../../hooks/team-hooks";
import Button from "../../ui/button";
import { HeadingMedium } from "../../ui/heading/heading";
import Skeleton from "../../ui/skeleton";
import FixtureStepper from "./fixtures-stepper";

function EventFixtureCreate({
  eventData,
  currentEvent,
  isLoadingEvent,
  sports,
  isSportsSuccess,
}) {
  const [matches, setMatches] = useState();

  const [type, setType] = useState();
  const [tournamentCategoryId, setTournamentCategoryId] = useState("");
  const [view, setView] = useState("Hide");

  const { data: matchesData, isSuccess: isMatchSuccess } =
    useEventMatches(tournamentCategoryId);

  const { data: eventTeamData = [], isLoading } =
    useTeams(tournamentCategoryId);

  let tournamentCategories = [];
  if (isSportsSuccess && eventData?.tournaments) {
    eventData.tournaments.forEach((tournament) => {
      const sport = sports.find(
        (sport) => sport.sports_id === tournament.sportsRefid
      );
      tournament?.tournamentCategories.forEach((tournamentCategory) => {
        const obj = { ...sport };
        obj.tournamentCategoryId = tournamentCategory.tournamentCategoryId;
        obj.tournamentCategory = tournamentCategory.tournamentCategory;
        obj.tournamentFormat = tournamentCategory.tournamentFormat;
        obj.tournamentConfig = tournamentCategory.tournamentConfig;
        tournamentCategories.push(obj);
      });
    });
  }

  useEffect(() => {
    const isType = eventTeamData.find(
      (cat) => cat.tournament_category_id === +tournamentCategoryId
    )?.type?.type;
    setType(isType);
  }, [eventTeamData, tournamentCategoryId]);

  const areMatchesPresent = Boolean(matchesData?.length > 0);
  if (isLoadingEvent) {
    return <Skeleton minH="40px" />;
  }
  return (
    <Box>
      {view === "View" ? null : (
        <>
          <HStack spacing={10} mb={7}>
            <HeadingMedium>Event Category</HeadingMedium>
            <Select
              borderColor="gray.300"
              maxW="xs"
              placeholder="Select Sport"
              value={tournamentCategoryId}
              onChange={(e) => setTournamentCategoryId(e.target.value)}
            >
              {tournamentCategories.map((tournamentCategoryObj) => {
                const category =
                  tournamentCategoryObj.sports_category.find(
                    (sportCategory) =>
                      sportCategory.category_code ===
                      tournamentCategoryObj.tournamentCategory
                  )?.category_name || tournamentCategoryObj.tournament_category;

                return (
                  <option
                    key={tournamentCategoryObj.tournamentCategoryId}
                    value={tournamentCategoryObj.tournamentCategoryId}
                  >
                    {`${tournamentCategoryObj.sports_name} - ${category}`}
                  </option>
                );
              })}
            </Select>
            <Button
              onClick={() => setView("View")}
              disabled={tournamentCategoryId ? false : true}
            >
              Generate Fixture
            </Button>
          </HStack>
        </>
      )}

      {view === "View" && (
        <FixtureStepper
          type={type}
          isLoading={isLoading}
          eventTeamData={eventTeamData}
          currentEvent={currentEvent}
          eventData={eventData}
          tournamentCategoryId={tournamentCategoryId}
          tournamentCategories={tournamentCategories}
          setMatches={setMatches}
          matches={matches}
        />
      )}
    </Box>
  );
}

export default EventFixtureCreate;
