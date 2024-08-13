import { useEffect, useState } from "react";
import {
  Box,
  ButtonGroup,
  HStack,
  IconButton,
  SimpleGrid,
  Skeleton,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueries } from "react-query";
import Button from "../../ui/button";
import FixturesCard from "./fixtures-card";
import FixturesSetupModal from "./fixtures-setup-modal";
import {
  useFixturesByTournamentCatId,
  useFixturesMasterByTournamentCatId,
  useSaveFixtures,
} from "../../../hooks/tournament-hooks";
import pageService from "../../../services/page-service";
import { useUser } from "../../../hooks/user-hooks";
import {
  getParticipantsRegex,
  getParticipantsLabel,
} from "../../../helper/constants/event-fixtures-constants";
import { TextMedium } from "../../ui/text/text";
import FixturesFilterPopover from "./fixtures-filter-popover";
import { BackButton } from "../../ui/icons";

const FixturesGenerated = (props) => {
  const {
    generatedFixturesData,
    setGeneratedFixturesData,
    eventData,
    currentEvent,
  } = props;
  const { sport, tournamentCategory, generatedFixtures } =
    generatedFixturesData;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { data: userData } = useUser();

  // Show loading indicator somewhere?
  const { data: fixturesData, isLoading } = useFixturesMasterByTournamentCatId(
    tournamentCategory.tournamentCategoryId
  );

  const [fixturesFilter, setFixturesFilter] = useState({
    type: "All",
    fixtureDate: null,
    teamName: "",
  });

  const areFiltersApplied =
    fixturesFilter.fixtureDate || fixturesFilter.teamName;
  const isFilterApplied = fixturesFilter.type !== "All" || areFiltersApplied;

  const { data: savedFixturesData, isLoading: isSavedFixturesLoading } =
    useFixturesByTournamentCatId(
      tournamentCategory.tournamentCategoryId,
      fixturesFilter,
      fixturesData?.fixtureGenerated
    );

  const [fixtures, setFixtures] = useState(generatedFixtures);

  // Check if this can be done without useEffect
  useEffect(() => {
    setFixtures(generatedFixtures ?? savedFixturesData);
  }, [generatedFixtures, savedFixturesData]);

  const handleFixturesFilter = (key, value) => {
    setFixturesFilter({
      ...fixturesFilter,
      [key]: value,
    });
  };

  const clearFilter = () => {
    setFixturesFilter({
      ...fixturesFilter,
      fixtureDate: null,
      teamName: "",
    });
  };

  const { mutate, isLoading: isSaveFixturesLoading } = useSaveFixtures();

  const playersType = sport.sports_category.find(
    (category) =>
      category.category_code === tournamentCategory.tournamentCategory
  )?.type;

  const venues = useQueries(
    tournamentCategory.tournamentCategoryVenue
      ? tournamentCategory.tournamentCategoryVenue.map((pageId) => ({
          queryKey: ["page", pageId],
          queryFn: () => pageService.getPage(pageId),
        }))
      : []
  );

  const [isMinParticipantsReg, setIsMinParticipantsReg] = useState(false);

  // const [errors, setErrors] = useState(
  //   generatedFixtures.map((f) => !Boolean(f.fixtureDate && f.venueId))
  // );
  // const [initialGeneratedFixtures, setInitialGeneratedFixtures] =
  //   useState(generatedFixtures);
  const [isTouched, setIsTouched] = useState(false);
  // let latestErrors = errors;
  // if (initialGeneratedFixtures !== generatedFixtures) {
  //   latestErrors = generatedFixtures.map(
  //     (f) => !Boolean(f.fixtureDate && f.venueId)
  //   );
  //   setErrors(latestErrors);
  //   setInitialGeneratedFixtures(generatedFixtures);
  // }

  const getParticipantList = () => {
    const fixtureConfig = JSON.parse(fixturesData.fixtureConfig);
    let participantList = [];
    if (fixturesData.fixtureFormat === "GRPKNO") {
      fixtureConfig.groups.forEach((group) => {
        participantList.push(...group.participant_list);
      });
    } else {
      participantList = fixtureConfig.participant_list;
    }
    return participantList;
  };

  const participantList = getParticipantList();

  const handleSave = (fixtureStatus) => {
    // const isFixturesValid = errors.every((e) => !e);
    // if (!isFixturesValid) return;
    const fixtureConfig = JSON.parse(fixturesData.fixtureConfig);

    if (fixtureStatus === "PUB") {
      const { min_registrations } = JSON.parse(
        tournamentCategory.tournamentConfig
      ).participant_criteria;

      const regex = new RegExp(getParticipantsRegex(playersType));
      const registeredCount = participantList.reduce(
        (registeredCount, participant) => {
          if (!regex.test(participant.participant_name)) {
            return registeredCount + 1;
          }
          return registeredCount;
        },
        0
      );

      if (registeredCount < +min_registrations) {
        setIsMinParticipantsReg(false);
        return;
      } else {
        setIsMinParticipantsReg(true);
      }
    }

    mutate(
      {
        tournamentFixtureMaster: {
          ...fixturesData,
          fixtureStatus,
          fixtureGenerated: true,
          fixtureConfig,
        },
        tournamentFixturesList: fixtures.map((fixture) => ({
          ...fixture,
          createdBy: userData.user_id,
          matchScore: JSON.parse(fixture.matchScore),
        })),
      },
      {
        onSuccess: () => {
          const title =
            fixtureStatus === "PUB"
              ? "The fixtures have been published."
              : "The fixtures have been saved as draft.";
          toast({
            title,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setGeneratedFixturesData(null);
        },
        onError: () =>
          toast({
            title: "Failed to save the fixtures. Please try again",
            status: "error",
            duration: 3000,
            isClosable: true,
          }),
      }
    );
  };

  const isGroupKnockout = fixturesData?.fixtureFormat === "GRPKNO";
  const isLeagueKnockout = fixturesData?.fixtureFormat === "LGEKNO";
  const isGroupOrLeagueKnockout = isGroupKnockout || isLeagueKnockout;

  const isSavedFixtures = !generatedFixtures;
  const isResultPresent = fixtures?.some((fixture) => fixture.matchScore);

  return (
    <VStack spacing={4}>
      <SimpleGrid w="full" columns={currentEvent ? 3 : 2}>
        <HStack spacing={5}>
          <IconButton
            aria-label="Back"
            variant="ghost"
            icon={<BackButton fontSize="20px" />}
            onClick={() => setGeneratedFixturesData(null)}
          />
          {isSavedFixtures && isGroupOrLeagueKnockout && (
            <ButtonGroup isAttached={true}>
              <Button
                variant={fixturesFilter.type === "All" ? "solid" : "outline"}
                onClick={() => handleFixturesFilter("type", "All")}
              >
                All
              </Button>
              <Button
                variant={
                  fixturesFilter.type === "Group" ||
                  fixturesFilter.type === "League"
                    ? "solid"
                    : "outline"
                }
                onClick={() => {
                  if (isGroupKnockout) handleFixturesFilter("type", "Group");
                  else if (isLeagueKnockout)
                    handleFixturesFilter("type", "League");
                }}
              >
                {isGroupKnockout && "Group"}
                {isLeagueKnockout && "League"}
              </Button>
              <Button
                variant={
                  fixturesFilter.type === "Knockout" ? "solid" : "outline"
                }
                onClick={() => handleFixturesFilter("type", "Knockout")}
              >
                Knockout
              </Button>
            </ButtonGroup>
          )}
        </HStack>
        {currentEvent && (
          <>
            <Button justifySelf="center" borderRadius="3xl" onClick={onOpen}>
              {isResultPresent ? "Setup Fixture" : "Edit Setup Fixture"}
            </Button>
            <FixturesSetupModal
              isOpen={isOpen}
              onClose={onClose}
              sport={sport}
              tournamentCategory={tournamentCategory}
              fixturesData={fixturesData}
              setGeneratedFixturesData={setGeneratedFixturesData}
              isResultPresent={isResultPresent}
            />
          </>
        )}
        <HStack justifySelf="end">
          {areFiltersApplied && (
            <Button colorScheme="gray" onClick={clearFilter}>
              Clear Filter
            </Button>
          )}
          {isSavedFixtures && (
            <FixturesFilterPopover
              fixturesFilter={fixturesFilter}
              handleFixturesFilter={handleFixturesFilter}
              participantList={participantList}
              areFiltersApplied={areFiltersApplied}
            />
          )}
        </HStack>
      </SimpleGrid>

      {isSavedFixturesLoading ? (
        <Skeleton w="full" h={14} />
      ) : fixtures?.length > 0 ? (
        fixtures.map((fixture, fixtureIndex) => (
          <FixturesCard
            key={fixtureIndex}
            fixture={fixture}
            fixtureIndex={fixtureIndex}
            fixturesData={fixturesData}
            playersType={playersType}
            venues={venues}
            tournamentCategory={tournamentCategory}
            generatedFixturesData={generatedFixturesData}
            eventData={eventData}
            currentEvent={currentEvent}
            isSavedFixtures={isSavedFixtures}
            setFixtures={setFixtures}
            isFilterApplied={isFilterApplied}
            // isError={isTouched && errors[fixtureIndex]}
          />
        ))
      ) : (
        <TextMedium>No fixtures to display</TextMedium>
      )}

      {isTouched && !isMinParticipantsReg && (
        <TextMedium color="red.500">
          Minimum {getParticipantsLabel(playersType)} should be registered
          before publishing the fixtures
        </TextMedium>
      )}
      <HStack w="full" justifyContent="flex-end" spacing={4}>
        {currentEvent && fixturesData?.fixtureStatus !== "PUB" && (
          <Button
            variant="outline"
            isLoading={isSaveFixturesLoading}
            onClick={() => {
              // setIsTouched(true);
              handleSave("DRT");
            }}
          >
            Save as Draft
          </Button>
        )}
        {currentEvent &&
          (fixturesData?.fixtureStatus === "DRT" || !isSavedFixtures) && (
            <Button
              isLoading={isSaveFixturesLoading}
              disabled={isFilterApplied || isSaveFixturesLoading}
              onClick={() => {
                setIsTouched(true);
                handleSave("PUB");
              }}
            >
              Save & Publish
            </Button>
          )}
        <Button
          colorScheme="red"
          onClick={() => setGeneratedFixturesData(null)}
        >
          Cancel
        </Button>
      </HStack>
    </VStack>
  );
};

export default FixturesGenerated;
