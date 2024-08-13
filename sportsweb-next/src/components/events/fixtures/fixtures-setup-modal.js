import { useState, useEffect, useMemo } from "react";
import { ModalBody } from "@chakra-ui/react";
import * as yup from "yup";

import FixturesModal from "./fixtures-modal";
import FixturesLeague from "./fixture-formats/fixtures-league";
import FixturesKnockout from "./fixture-formats/fixtures-knockout";
import FixturesLeagueKnockout from "./fixture-formats/fixtures-league-knockout";
import FixturesGroupKnockout from "./fixture-formats/fixtures-group-knockout";
import { useTeams } from "../../../hooks/team-hooks";
import { getFixtureDetails } from "../../../helper/constants/event-fixtures-constants";
import {
  useGenerateFixtures,
  useSaveFixturesSetup,
} from "../../../hooks/tournament-hooks";
import { useUser } from "../../../hooks/user-hooks";

const FixturesSetupModal = (props) => {
  const {
    isOpen,
    onClose,
    sport,
    tournamentCategory,
    fixturesData,
    setGeneratedFixturesData,
    isResultPresent,
  } = props;
  const { data: userData } = useUser();
  const { data: registrationData = [], isSuccess: isRegistrationSuccess } =
    useTeams(tournamentCategory.tournamentCategoryId, isOpen);
  const { mutate: setupMutate, isLoading: isSetupLoading } =
    useSaveFixturesSetup();
  const { mutate: generateMutate, isLoading: isGenerateLoading } =
    useGenerateFixtures();

  const isLoading = isSetupLoading || isGenerateLoading;

  const [fixtureFormat, setFixtureFormat] = useState(
    fixturesData
      ? fixturesData.fixtureFormat
      : tournamentCategory.tournamentFormat
  );

  // Better way to sync state instead of useEffect
  const [initialFixturesData, setInitialFixturesData] = useState(fixturesData);
  if (initialFixturesData !== fixturesData) {
    const latestFixtureFormat = fixturesData
      ? fixturesData.fixtureFormat
      : tournamentCategory.tournamentFormat;
    setFixtureFormat(latestFixtureFormat);
    setInitialFixturesData(fixturesData);
  }

  const playersType = sport.sports_category.find(
    (category) =>
      category.category_code === tournamentCategory.tournamentCategory
  )?.type;

  const { fixtureConfig: initialFixtureConfig, validationSchema } = useMemo(
    () =>
      getFixtureDetails(
        fixtureFormat,
        playersType,
        JSON.parse(tournamentCategory.tournamentConfig),
        yup
      ),
    [fixtureFormat, playersType, tournamentCategory.tournamentConfig]
  );

  const fixtureConfig = useMemo(
    () =>
      fixturesData && fixturesData.fixtureFormat === fixtureFormat
        ? JSON.parse(fixturesData.fixtureConfig)
        : initialFixtureConfig,
    [fixtureFormat, fixturesData, initialFixtureConfig]
  );

  const [regOptions, setRegOptions] = useState([]);

  useEffect(() => {
    if (fixturesData && fixturesData.fixtureFormat === fixtureFormat) {
      if (fixtureFormat === "GRPKNO") {
        const newRegOptions = [];
        fixtureConfig.groups.forEach((group) => {
          newRegOptions.push(...group.participant_list);
        });
        setRegOptions(newRegOptions);
      } else {
        setRegOptions(fixtureConfig.participant_list);
      }
    }
  }, [
    fixtureConfig.groups,
    fixtureConfig.participant_list,
    fixtureFormat,
    fixturesData,
    isOpen,
  ]);

  const getFormatDetails = (format) => {
    switch (format) {
      case "LEAGUE":
        return FixturesLeague;
      case "KNOCK":
        return FixturesKnockout;
      case "LGEKNO":
        return FixturesLeagueKnockout;
      case "GRPKNO":
        return FixturesGroupKnockout;
    }
  };

  const FormatComponent = getFormatDetails(fixtureFormat);

  // Check if this function is ok
  const handleClose = () => {
    onClose();
    setFixtureFormat(
      fixturesData
        ? fixturesData.fixtureFormat
        : tournamentCategory.tournamentFormat
    );
    setRegOptions([]);
  };

  const handleSave = (formikValues, submitType) => {
    const fixtureObj = {
      tournamentFixtureMaster: {
        tournamentCategoryId: tournamentCategory.tournamentCategoryId,
        fixtureStatus: fixturesData?.fixtureStatus || "DRT",
        createdBy: userData.user_id,
        fixtureFormat: fixtureFormat,
        fixtureGenerated: fixturesData?.fixtureGenerated || false,
        fixtureConfig: formikValues,
      },
      tournamentFixturesList: [],
    };
    if (submitType === "DRT") {
      setupMutate(fixtureObj, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      setupMutate(fixtureObj, {
        onSuccess: () => {
          generateMutate(fixtureObj, {
            onSuccess: (data) => {
              onClose();
              setGeneratedFixturesData({
                sport,
                tournamentCategory,
                generatedFixtures: data,
              });
            },
          });
        },
      });
    }
  };

  const areFixturesPublished = Boolean(fixturesData?.fixtureStatus === "PUB");

  return (
    <FixturesModal isOpen={isOpen} onClose={handleClose}>
      <ModalBody
        mt={{ base: "50px", md: "50px" }}
        ml={{ base: "50px", md: "150px" }}
        pr={{ base: "0px", md: "30px" }}
        p={4}
      >
        <FormatComponent
          playersType={playersType}
          registrationData={registrationData}
          sport={sport}
          fixtureFormat={fixtureFormat}
          setFixtureFormat={setFixtureFormat}
          fixtureConfig={fixtureConfig}
          validationSchema={validationSchema}
          regOptions={regOptions}
          setRegOptions={setRegOptions}
          handleSave={handleSave}
          isLoading={isLoading}
          onClose={handleClose}
          areFixturesPublished={areFixturesPublished}
          isResultPresent={isResultPresent}
          // Is below needed?
          // isRegistrationSuccess={isRegistrationSuccess}
        />
      </ModalBody>
    </FixturesModal>
  );
};

export default FixturesSetupModal;
