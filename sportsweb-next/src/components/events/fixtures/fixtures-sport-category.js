import { HStack, useDisclosure } from "@chakra-ui/react";
import { TextMedium } from "../../ui/text/text";
import Button from "../../ui/button";
import FixturesSetupModal from "./fixtures-setup-modal";
import { useFixturesMasterByTournamentCatId } from "../../../hooks/tournament-hooks";
import { getTournamentCategoryName } from "../../../helper/constants/tournament-category-constants";

const FixturesSportCategory = (props) => {
  const { currentEvent, sport, tournamentCategory, setGeneratedFixturesData } =
    props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: fixturesData, isLoading } = useFixturesMasterByTournamentCatId(
    tournamentCategory.tournamentCategoryId
  );

  const tournamentCategoryName = getTournamentCategoryName(
    tournamentCategory,
    sport
  );

  const handleFixture = () => {
    if (currentEvent) {
      if (fixturesData?.fixtureGenerated) {
        setGeneratedFixturesData({
          sport,
          tournamentCategory,
          generatedFixtures: null,
        });
      } else {
        onOpen();
      }
    } else {
      if (fixturesData?.fixtureStatus === "PUB") {
        setGeneratedFixturesData({
          sport,
          tournamentCategory,
          generatedFixtures: null,
        });
      }
    }
  };

  let buttonLabel,
    buttonVariant = "outline";
  if (currentEvent) {
    if (fixturesData) {
      if (fixturesData.fixtureGenerated) {
        buttonLabel =
          fixturesData.fixtureStatus === "DRT"
            ? "View Fixture - Draft"
            : "View Fixture";
      } else {
        buttonLabel = "View Setup";
      }
    } else {
      buttonVariant = "solid";
      buttonLabel = "Setup Fixture";
    }
  } else {
    buttonLabel = "View Fixture";
  }

  return (
    <>
      <HStack justifyContent="space-between" spacing={0} gap={2} wrap="wrap">
        <TextMedium fontWeight="medium">{tournamentCategoryName}</TextMedium>
        <Button
          borderRadius="3xl"
          size="sm"
          onClick={handleFixture}
          variant={buttonVariant}
          isLoading={isLoading}
          disabled={
            isLoading ||
            (!currentEvent && fixturesData?.fixtureStatus !== "PUB")
          }
          // colorScheme="primary"
          // bg="linear-gradient(124deg, #2F80ED 11.18%, rgba(0, 169, 255, 0.80) 88.17%)"
          // color="white"
          // fontWeight="normal"
          // _hover={{
          //   bg: "linear-gradient(124deg, #2F80ED 11.18%, rgba(0, 169, 255, 1) 88.17%)",
          // }}
        >
          {/* Need to handle other cases here */}
          {buttonLabel}
        </Button>
      </HStack>
      <FixturesSetupModal
        isOpen={isOpen}
        onClose={onClose}
        sport={sport}
        tournamentCategory={tournamentCategory}
        fixturesData={fixturesData}
        setGeneratedFixturesData={setGeneratedFixturesData}
      />
    </>
  );
};

export default FixturesSportCategory;
