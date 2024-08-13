import {
  Box,
  Divider,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Stack,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";

import { EditIcon } from "../../ui/icons";
import VsSvg from "../../../svg/vs-svg";
import { HeadingSmall } from "../../ui/heading/heading";
import Button from "../../ui/button";
import FixturesEditModal from "./fixtures-edit-modal";
import { TextMedium } from "../../ui/text/text";
import FixtureResultModal from "./fixture-results/fixture-result-modal";
import FixtureScore from "./fixture-results/fixture-scores/fixture-score";
import VsScore from "./fixture-results/fixture-scores/vs-score";

const FixturesCard = (props) => {
  const {
    fixture,
    fixtureIndex,
    fixturesData,
    playersType,
    venues,
    tournamentCategory,
    generatedFixturesData,
    eventData,
    currentEvent,
    isSavedFixtures,
    setFixtures,
    isFilterApplied,
    // isError,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isResultOpen,
    onOpen: onResultOpen,
    onClose: onResultClose,
  } = useDisclosure();

  // Check if needed or destructure tournament category id also and send it
  const { sport } = generatedFixturesData;

  // const isFixtureDetailsPresent =
  //   fixture.fixtureDate && fixture.venueId && fixture.courtNo;
  const isFixtureDetailsPresent = fixture.fixtureDate && fixture.venueId;

  let date, time, day, venueName;
  if (isFixtureDetailsPresent) {
    const fixtureDate = new Date(fixture.fixtureDate);
    date = format(fixtureDate, "dd/MM/yyyy");
    time = format(fixtureDate, "hh:mm aa");
    day = format(fixtureDate, "EEEE");
    venueName = venues.find(
      (venue) => venue.data?.company_id === fixture.venueId
    )?.data?.company_name;
  }

  const matchScore = JSON.parse(fixture.matchScore);
  let resultLabel = matchScore ? "Edit Result" : "Add Result";

  return (
    <Box w="full">
      <Grid
        // w="full"
        templateColumns="auto auto auto auto auto"
        border="1px solid"
        // borderColor={isError ? "red" : "primary.500"}
        borderColor="primary.500"
        pt={3}
        pb={5}
        px={5}
        borderRadius="lg"
        rowGap={2}
        columnGap={4}
        alignItems="center"
      >
        <GridItem colSpan={2}>
          Match {fixture.matchNo} - {fixture.fixtureStage}
        </GridItem>
        <GridItem justifySelf="center">
          {isFixtureDetailsPresent && <TextMedium>{venueName}</TextMedium>}
        </GridItem>
        <GridItem />
        <GridItem justifySelf="end">
          <HStack spacing={6}>
            {/* {isFixtureDetailsPresent && ( */}
            {fixture.courtNo && (
              <TextMedium>Court No: {fixture.courtNo}</TextMedium>
            )}
            {currentEvent && !isFilterApplied && (
              <IconButton
                size="sm"
                variant="outline"
                isRound={true}
                aria-label="Edit Fixture"
                icon={<EditIcon />}
                // borderColor={isError ? "red.500" : "inherit"}
                onClick={onOpen}
              >
                Edit
              </IconButton>
            )}
          </HStack>
          <FixturesEditModal
            isOpen={isOpen}
            onClose={onClose}
            fixture={fixture}
            fixtureIndex={fixtureIndex}
            fixturesData={fixturesData}
            playersType={playersType}
            venues={venues}
            tournamentCategory={tournamentCategory}
            eventData={eventData}
            setFixtures={setFixtures}
            isSavedFixtures={isSavedFixtures}
          />
        </GridItem>
        <GridItem gridColumn="1 / -1" mb={8}>
          <Divider borderColor="primary.500" />
        </GridItem>
        <GridItem>
          {isFixtureDetailsPresent && (
            <Stack spacing={1}>
              <TextMedium color="gray.500">{time}</TextMedium>
              <TextMedium fontWeight="medium">{date}</TextMedium>
              <TextMedium color="gray.500">{day}</TextMedium>
            </Stack>
          )}
        </GridItem>
        <GridItem justifySelf="center">
          <VStack>
            <HeadingSmall>{fixture.firstTeamName}</HeadingSmall>
            <FixtureScore
              sportCode={sport.sports_code}
              matchScore={matchScore}
              type="first_team"
            />
          </VStack>
        </GridItem>
        <GridItem justifySelf="center">
          <HStack spacing={4}>
            <VsScore
              sportCode={sport.sports_code}
              matchScore={matchScore}
              type="first_team"
            />
            <VsSvg />
            <VsScore
              sportCode={sport.sports_code}
              matchScore={matchScore}
              type="second_team"
            />
          </HStack>
        </GridItem>
        <GridItem justifySelf="center">
          <VStack>
            <HeadingSmall>{fixture.secondTeamName}</HeadingSmall>
            <FixtureScore
              sportCode={sport.sports_code}
              matchScore={matchScore}
              type="second_team"
            />
          </VStack>
        </GridItem>
        <GridItem justifySelf="center" alignContent={"center"}>
          {currentEvent &&
            fixturesData.fixtureStatus === "PUB" &&
            isSavedFixtures && (
              <Button
                disabled={
                  fixturesData.fixtureFormat !== "KNOCK" &&
                  !tournamentCategory.tournamentPointConfig
                }
                onClick={onResultOpen}
              >
                {resultLabel}
              </Button>
            )}
          <FixtureResultModal
            isOpen={isResultOpen}
            onClose={onResultClose}
            fixture={fixture}
            date={date}
            day={day}
            time={time}
            venueName={venueName}
            isFixtureDetailsPresent={isFixtureDetailsPresent}
            generatedFixturesData={generatedFixturesData}
            resultLabel={resultLabel}
          />
        </GridItem>

        <GridItem />

        {matchScore && (
          <GridItem colSpan={3} justifySelf="center" mt={2}>
            <TextMedium color="primary.500" display="inline">
              Result :{" "}
            </TextMedium>
            <TextMedium display="inline">{matchScore.result}</TextMedium>
          </GridItem>
        )}

        <GridItem />
      </Grid>
      {/* {isError && (
        <TextMedium mt={1} color="red.500">
          Please enter the fixture details
        </TextMedium>
      )} */}
    </Box>
  );
};

export default FixturesCard;
