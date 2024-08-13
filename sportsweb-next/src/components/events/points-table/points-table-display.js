import { Fragment } from "react";
import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Skeleton,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import { useTournamentStandingByCategoryId } from "../../../hooks/tournament-standing-hooks";
import { TextMedium } from "../../ui/text/text";
import { BackButton } from "../../ui/icons";
import { getTournamentCategoryName } from "../../../helper/constants/tournament-category-constants";
import { useFixturesMasterByTournamentCatId } from "../../../hooks/tournament-hooks";
import Button from "../../ui/button";
import PointsTableSetupModal from "./points-table-setup-modal";

const PointsTableDisplay = (props) => {
  const {
    selectedSport,
    selectedTournamentCategory,
    setSelectedTournamentCategory,
    currentEvent,
    eventId,
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: fixturesData, isLoading: isFixturesLoading } =
    useFixturesMasterByTournamentCatId(
      selectedTournamentCategory.tournamentCategoryId
    );
  const isFormatGroupKnockout = fixturesData?.fixtureFormat === "GRPKNO";

  const { data: standingsData, isLoading: isStandingsLoading } =
    useTournamentStandingByCategoryId(
      selectedTournamentCategory.tournamentCategoryId
    );

  const isLoading = isFixturesLoading || isStandingsLoading;

  const tournamentCategoryName = getTournamentCategoryName(
    selectedTournamentCategory,
    selectedSport
  );

  const playersType = selectedSport.sports_category.find(
    (category) =>
      category.category_code === selectedTournamentCategory.tournamentCategory
  )?.type;
  let playersLabel = playersType === "Team" ? "Teams" : "Players";

  const areStandingsPresent = standingsData?.length > 0;
  const isAnyPointsPresent =
    areStandingsPresent &&
    standingsData.some((standing) => standing.points > 0);

  const updatedStandings = {};
  if (areStandingsPresent) {
    standingsData
      .sort((a, b) => b.points - a.points)
      .forEach((standing) => {
        const groupName = standing.groupName;
        const groupValue = updatedStandings[groupName];
        if (groupValue) {
          updatedStandings[groupName].push(standing);
        } else {
          updatedStandings[groupName] = [standing];
        }
      });
  }

  const sortedGroupStandings = Object.entries(updatedStandings).sort(
    ([standingskey1], [standingskey2]) => {
      if (standingskey1 < standingskey2) return -1;
      if (standingskey1 > standingskey2) return 1;
      return 0;
    }
  );

  return (
    <Box>
      <Flex alignItems="center" mb={5} gap={2}>
        <IconButton
          aria-label="Back"
          variant="ghost"
          icon={<BackButton fontSize="20px" />}
          onClick={() => setSelectedTournamentCategory(null)}
        />
        <HeadingMedium>{tournamentCategoryName}</HeadingMedium>
        {currentEvent && !isAnyPointsPresent && (
          <>
            <Button borderRadius="3xl" ml="auto" onClick={onOpen}>
              Edit Points Table Setup
            </Button>
            <PointsTableSetupModal
              isOpen={isOpen}
              onClose={onClose}
              tournamentCategory={selectedTournamentCategory}
              eventId={eventId}
            />
          </>
        )}
      </Flex>

      {isLoading ? (
        <Skeleton h={20} />
      ) : (
        <VStack spacing={8}>
          {sortedGroupStandings.map(([standingsKey, standingsValue]) => (
            <Grid
              key={standingsKey}
              minW="4xl"
              templateColumns="minmax(50%, auto) repeat(5, 1fr)"
              textAlign="center"
            >
              <GridItem textAlign="start" bg="blue.100" p={4}>
                <HeadingSmall textTransform="uppercase">
                  {isFormatGroupKnockout ? standingsKey : playersLabel}
                </HeadingSmall>
              </GridItem>

              <GridItem bg="blue.100" p={4}>
                <HeadingSmall>PLAYED</HeadingSmall>
              </GridItem>
              <GridItem bg="blue.100" p={4}>
                <HeadingSmall>WON</HeadingSmall>
              </GridItem>
              <GridItem bg="blue.100" p={4}>
                <HeadingSmall>LOST</HeadingSmall>
              </GridItem>
              <GridItem bg="blue.100" p={4}>
                <HeadingSmall>DRAW</HeadingSmall>
              </GridItem>
              <GridItem bg="blue.100" p={4}>
                <HeadingSmall>PTS</HeadingSmall>
              </GridItem>

              {standingsValue.map((standing, index) => (
                <Fragment key={standing.standingId}>
                  <GridItem p={4} textAlign="start">
                    <TextMedium>
                      {index + 1}.&nbsp;&nbsp;&nbsp;{standing.teamName}
                    </TextMedium>
                  </GridItem>
                  <GridItem p={4}>
                    <TextMedium>{standing.matchesPlayed}</TextMedium>
                  </GridItem>
                  <GridItem p={4}>
                    <TextMedium>{standing.wonCount}</TextMedium>
                  </GridItem>
                  <GridItem p={4}>
                    <TextMedium>{standing.lostCount}</TextMedium>
                  </GridItem>
                  <GridItem p={4}>
                    <TextMedium>{standing.drawCount}</TextMedium>
                  </GridItem>
                  <GridItem p={4} bg="blue.600" color="white">
                    <TextMedium>{standing.points}</TextMedium>
                  </GridItem>
                  <GridItem gridColumn="1/-1" justifySelf="stretch">
                    <Divider borderColor="gray.400" />
                  </GridItem>
                </Fragment>
              ))}
            </Grid>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default PointsTableDisplay;
