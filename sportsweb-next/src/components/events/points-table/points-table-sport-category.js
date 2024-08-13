import { HStack, useDisclosure } from "@chakra-ui/react";
import { TextMedium } from "../../ui/text/text";
import Button from "../../ui/button";
import { useFixturesMasterByTournamentCatId } from "../../../hooks/tournament-hooks";
import PointsTableSetupModal from "./points-table-setup-modal";
import { getTournamentCategoryName } from "../../../helper/constants/tournament-category-constants";

const PointsTableSportCategory = (props) => {
  const {
    currentEvent,
    sport,
    tournamentCategory,
    setSelectedTournamentCategory,
    setSelectedSport,
    eventId,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: fixturesData, isLoading } = useFixturesMasterByTournamentCatId(
    tournamentCategory.tournamentCategoryId
  );

  const tournamentCategoryName = getTournamentCategoryName(
    tournamentCategory,
    sport
  );

  const handlePointsTable = () => {
    if (currentEvent) {
      if (
        fixturesData?.fixtureStatus === "PUB" &&
        tournamentCategory.tournamentPointConfig
      ) {
        setSelectedSport(sport);
        setSelectedTournamentCategory(tournamentCategory);
      } else {
        onOpen();
      }
    } else {
      setSelectedSport(sport);
      setSelectedTournamentCategory(tournamentCategory);
    }
  };

  let buttonLabel = "View Points Table",
    buttonVariant = "outline";
  if (
    currentEvent &&
    (fixturesData?.fixtureStatus !== "PUB" ||
      !tournamentCategory.tournamentPointConfig)
  ) {
    buttonVariant = tournamentCategory.tournamentPointConfig
      ? "outline"
      : "solid";
    buttonLabel = "Points Table Setup";
  }

  const isFormatKnockout = fixturesData
    ? fixturesData.fixtureFormat === "KNOCK"
    : tournamentCategory.tournamentFormat === "KNOCK";

  return (
    <>
      <HStack justifyContent="space-between" spacing={0} gap={2} wrap="wrap">
        <TextMedium fontWeight="medium">{tournamentCategoryName}</TextMedium>
        <Button
          borderRadius="3xl"
          size="sm"
          onClick={handlePointsTable}
          variant={buttonVariant}
          isLoading={isLoading}
          disabled={
            (!currentEvent &&
              fixturesData?.fixtureStatus !== "PUB" &&
              tournamentCategory.tournamentPointConfig) ||
            isFormatKnockout
          }
        >
          {buttonLabel}
        </Button>
      </HStack>
      <PointsTableSetupModal
        isOpen={isOpen}
        onClose={onClose}
        tournamentCategory={tournamentCategory}
        eventId={eventId}
      />
    </>
  );
};

export default PointsTableSportCategory;
