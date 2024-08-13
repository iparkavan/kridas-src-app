import { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  VStack,
  Select,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useEventByIdJava, useEventMatches } from "../../../hooks/event-hook";
import { useSports } from "../../../hooks/sports-hooks";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import { TextMedium } from "../../ui/text/text";

function PageEventMatches({ eventData, isLoadingEvent }) {
  // const { data: eventData, isLoading } = useEventByIdJava(eventId);
  const { data: sportsData = [], isSuccess: isSportsSuccess } = useSports();
  const [tournamentCategoryId, setTournamentCategoryId] = useState("");
  const { data: matchesData, isSuccess: isMatchSuccess } =
    useEventMatches(tournamentCategoryId);

  let tournamentCategories = [];
  if (isSportsSuccess && eventData?.tournaments) {
    eventData.tournaments.forEach((tournament) => {
      const sport = sportsData.find(
        (sport) => sport.sports_id === tournament.sportsRefid
      );
      tournament?.tournamentCategories.forEach((tournamentCategory) => {
        const obj = { ...sport };
        obj.tournamentCategoryId = tournamentCategory.tournamentCategoryId;
        obj.tournamentCategory = tournamentCategory.tournamentCategory;
        tournamentCategories.push(obj);
      });
    });
  }

  const areMatchesPresent = Boolean(matchesData?.length > 0);

  if (isLoadingEvent) {
    return <Skeleton minH="40px" />;
  }

  return (
    <Box>
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
      </HStack>

      {tournamentCategoryId &&
        isMatchSuccess &&
        (areMatchesPresent ? (
          <VStack spacing={4}>
            {matchesData.map((match) => {
              const fixtureDate = new Date(match.fixtureDate);
              const matchDate = format(fixtureDate, "dd-MMM-yyyy");
              const matchTime = format(fixtureDate, "h:mm aa");
              let matchScore = match.matchScore;

              let setsWon,
                hasTeamOneLost,
                hasTeamTwoLost,
                isMatchScorePresent = false;
              if (matchScore) {
                matchScore = JSON.parse(matchScore);
                isMatchScorePresent = matchScore.length > 0;
                setsWon = matchScore.reduce(
                  (totalSets, set) => {
                    if (set.firstTeamPoints > set.secondTeamPoints) {
                      totalSets.teamOne++;
                    } else if (set.secondTeamPoints > set.firstTeamPoints) {
                      totalSets.teamTwo++;
                    }
                    return totalSets;
                  },
                  { teamOne: 0, teamTwo: 0 }
                );
                hasTeamOneLost = setsWon.teamOne < setsWon.teamTwo;
                hasTeamTwoLost = setsWon.teamTwo < setsWon.teamOne;
              }

              return (
                <Grid
                  key={match.fixtureId}
                  w="full"
                  bg="gray.100"
                  borderRadius="lg"
                  p={5}
                  // templateColumns="1fr 4fr 2fr 4fr"
                  templateColumns="10% 35% 15% 35%"
                  rowGap={3}
                  columnGap={5}
                  justifyItems="center"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <GridItem justifySelf="start">
                    <TextMedium color="gray.500">
                      Match {match.matchNo}
                    </TextMedium>
                  </GridItem>
                  <GridItem>
                    <TextMedium color="gray.500">{matchDate}</TextMedium>
                  </GridItem>
                  <GridItem />
                  <GridItem>
                    <TextMedium color="gray.500">{matchTime}</TextMedium>
                  </GridItem>
                  <GridItem justifySelf="start">
                    <TextMedium color="gray.500" fontWeight="medium">
                      {match.groupName}
                    </TextMedium>
                  </GridItem>
                  <GridItem>
                    <HeadingMedium color={hasTeamOneLost && "gray.400"}>
                      {match.firstTeamName}
                    </HeadingMedium>
                  </GridItem>
                  <GridItem w={isMatchScorePresent && "full"}>
                    <HStack justify="space-between">
                      {isMatchScorePresent && (
                        <HeadingMedium>{setsWon?.teamOne}</HeadingMedium>
                      )}
                      <HeadingSmall>Vs</HeadingSmall>
                      {isMatchScorePresent && (
                        <HeadingMedium>{setsWon?.teamTwo}</HeadingMedium>
                      )}
                    </HStack>
                  </GridItem>
                  <GridItem>
                    <HeadingMedium color={hasTeamTwoLost && "gray.400"}>
                      {match.secondTeamName}
                    </HeadingMedium>
                  </GridItem>
                  {isMatchScorePresent && (
                    <>
                      <GridItem justifySelf="start">
                        <TextMedium color="gray.500">Result</TextMedium>
                      </GridItem>
                      <GridItem />
                      <GridItem>
                        <HeadingSmall>
                          {matchScore
                            .map(
                              (matchSet) =>
                                `${matchSet.firstTeamPoints}/${matchSet.secondTeamPoints}`
                            )
                            .join(", ")}
                        </HeadingSmall>
                      </GridItem>
                    </>
                  )}
                </Grid>
              );
            })}
          </VStack>
        ) : (
          <TextMedium>
            No Matches are present for this event category
          </TextMedium>
        ))}
    </Box>
  );
}

export default PageEventMatches;
