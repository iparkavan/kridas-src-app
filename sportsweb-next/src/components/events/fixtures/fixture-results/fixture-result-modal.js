import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import * as yup from "yup";

import SetsResult from "./sets-result";
import CricketResult from "./cricket-result";
import FootballResult from "./football-result";
import { getFixtureResultDetails } from "../../../../helper/constants/event-fixtures-constants";
import { useUpdateFixture } from "../../../../hooks/tournament-hooks";

const FixtureResultModal = ({
  isOpen,
  onClose,
  fixture,
  date,
  day,
  time,
  venueName,
  generatedFixturesData,
  isFixtureDetailsPresent,
  resultLabel,
}) => {
  const { mutate: updateFixtureMutate, isLoading } = useUpdateFixture();
  const { sport, tournamentCategory } = generatedFixturesData;

  const { matchScore: initialMatchScore, validationSchema } =
    getFixtureResultDetails(sport.sports_code, yup);

  const matchScore = fixture.matchScore
    ? JSON.parse(fixture.matchScore)
    : initialMatchScore;

  const getSportResultComponent = (sportCode) => {
    switch (sportCode) {
      case "SPOR05":
        return CricketResult;
      case "SPOR07":
        return FootballResult;
      default:
        return SetsResult;
    }
  };

  const SportResultComponent = getSportResultComponent(sport.sports_code);

  const handleSave = (formikValues) => {
    const fixtureObj = {
      ...fixture,
      tournamentCategoryId: tournamentCategory.tournamentCategoryId,
      matchScore: formikValues,
    };
    updateFixtureMutate(fixtureObj, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{resultLabel}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pt={0} pb={6}>
          <SportResultComponent
            fixture={fixture}
            matchScore={matchScore}
            validationSchema={validationSchema}
            date={date}
            day={day}
            time={time}
            venueName={venueName}
            isFixtureDetailsPresent={isFixtureDetailsPresent}
            isLoading={isLoading}
            handleSave={handleSave}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FixtureResultModal;
