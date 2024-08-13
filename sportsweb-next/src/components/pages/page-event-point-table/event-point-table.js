import { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  GridItem,
  HStack,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useEventByIdJava, useTablePoint } from "../../../hooks/event-hook";
import { useSports } from "../../../hooks/sports-hooks";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import { HeadingMedium } from "../../ui/heading/heading";
import Skeleton from "../../ui/skeleton";
import { TextMedium, TextSmall } from "../../ui/text/text";

function EventPointTable({
  eventData,
  isLoadingEvent,
  sports,
  isSportsSuccess,
}) {
  // const { data: eventData, isLoading: isEventLoading } =
  //   useEventByIdJava(eventId);

  const [tournamentCategoryId, setTournamentCategoryId] = useState("");

  const { data: pointsData, isSuccess: isPointsSuccess } =
    useTablePoint(tournamentCategoryId);

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
        tournamentCategories.push(obj);
      });
    });
  }
  const updatedPoints = {};
  pointsData?.forEach((points) => {
    const groups = points["groupName"];
    const groupObj = updatedPoints[groups];
    if (groupObj) {
      updatedPoints[groups].push(points);
    } else {
      updatedPoints[groups] = [points];
    }
  });

  const arePointsPresent = Boolean(pointsData?.length > 0);

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
        isPointsSuccess &&
        (arePointsPresent ? (
          <VStack bgColor="gray.100" borderRadius="lg" w="full">
            {Object.keys(updatedPoints).map((pointsKey) => (
              <Grid
                key={pointsKey}
                w="full"
                p={5}
                templateColumns="10fr 1fr 1fr 1fr 1fr 1fr"
                rowGap={3}
                justifyItems="center"
                alignItems="center"
              >
                <GridItem colSpan={6} justifySelf="start">
                  <HeadingMedium>{pointsKey}</HeadingMedium>
                </GridItem>
                <GridItem justifySelf="start">
                  <TextSmall color="gray.500">Team</TextSmall>
                </GridItem>
                <GridItem>
                  <TextSmall color="gray.500">MP</TextSmall>
                </GridItem>
                <GridItem>
                  <TextSmall color="gray.500">W</TextSmall>
                </GridItem>
                <GridItem>
                  <TextSmall color="gray.500">D</TextSmall>
                </GridItem>
                <GridItem>
                  <TextSmall color="gray.500">L</TextSmall>
                </GridItem>
                <GridItem>
                  <TextSmall fontWeight="medium">PTS</TextSmall>
                </GridItem>
                <GridItem colSpan={6} justifySelf="stretch">
                  <Divider borderColor="gray.300" />
                </GridItem>
                {updatedPoints[pointsKey].map((points, index) => (
                  <>
                    <GridItem justifySelf="start">
                      <HStack spacing={4}>
                        <TextMedium>{index + 1}</TextMedium>
                        <Avatar name={points.teamName} size="sm" />
                        <TextMedium>{points.teamName}</TextMedium>
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <TextMedium>{points.matchesPlayed}</TextMedium>
                    </GridItem>
                    <GridItem>
                      <TextMedium>{points.wonCount}</TextMedium>
                    </GridItem>
                    <GridItem>
                      <TextMedium>{points.drawCount}</TextMedium>
                    </GridItem>
                    <GridItem>
                      <TextMedium>{points.lostCount}</TextMedium>
                    </GridItem>
                    <GridItem>
                      <TextMedium fontWeight="medium">
                        {points.points}
                      </TextMedium>
                    </GridItem>
                    <GridItem colSpan={6} justifySelf="stretch">
                      <Divider borderColor="gray.300" />
                    </GridItem>
                  </>
                ))}
              </Grid>
            ))}
          </VStack>
        ) : (
          <EmptyContentDisplay displayText="No Points Table to display" />
        ))}
    </Box>
  );
}

export default EventPointTable;
