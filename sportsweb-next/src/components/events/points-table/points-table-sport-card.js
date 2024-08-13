import { Box, Stack } from "@chakra-ui/react";
import { HeadingMedium } from "../../ui/heading/heading";
import PointsTableSportCategory from "./points-table-sport-category";

const PointsTableSportCard = (props) => {
  const {
    currentEvent,
    tournament,
    sports,
    setSelectedSport,
    setSelectedTournamentCategory,
    eventId,
  } = props;

  const sport = sports?.find(
    (sport) => sport.sports_id === tournament.sportsRefid
  );

  return (
    <Box bg="gray.100" p={7} borderRadius="md" w="full" maxW="xl">
      <HeadingMedium color="primary.500" textAlign="center">
        {sport?.sports_name}
      </HeadingMedium>
      <Stack mt={4} spacing={5}>
        {tournament.tournamentCategories.map((tournamentCategory) => (
          <PointsTableSportCategory
            key={tournamentCategory.tournamentCategoryId}
            currentEvent={currentEvent}
            sport={sport}
            tournamentCategory={tournamentCategory}
            setSelectedTournamentCategory={setSelectedTournamentCategory}
            setSelectedSport={setSelectedSport}
            eventId={eventId}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default PointsTableSportCard;
