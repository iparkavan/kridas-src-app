import { Icon, MinusIcon } from "@chakra-ui/icons";
import {
  AccordionPanel,
  Avatar,
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Accordion, AccordionButton, AccordionItem } from "../../ui/accordion";
import Button from "../../ui/button";
import { HeadingMedium } from "../../ui/heading/heading";
import { AddIcon } from "../../ui/icons";
import DatePicker from "../../ui/pickers/date-picker";
import LabelText from "../../ui/text/label-text";
import { TextMedium } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import FixturesCard from "./fixture-card";
import TeamVsCard from "./team-vs-card";
import { useGenerateFixtures } from "../../../hooks/fixtures-hooks";

function EventGroupKnockoutFixtures({
  nextStep,
  prevStep,
  activeStep,
  steps,
  tournamentCategories,
  tournamentCategoryId,
  teams,
  typeValid,
  formatCode,
  noOfReg,
  noOfRound,
  setGroupNo,
  groupNo,
  group,
  knockout,
  setKnockout,
}) {
  const router = useRouter();
  const [singleFormat, setSingleFormat] = useState("");
  const tournamentCategory = tournamentCategories?.find(
    (tc) => tc.tournamentCategoryId == tournamentCategoryId
  );

  // const [teams, setTeams] = useState([]);
  const [qualificationStages, setQualificationStages] = useState([
    { teamAt: "", category: "", format: "" },
  ]);

  const formatData = qualificationStages.map((data) => data.format);
  // console.log(qualificationStages, "qualificationStages");
  console.log(formatData, "catData");

  const handleAddQualification = () => {
    setQualificationStages((prevStages) => [
      ...prevStages,
      { teamAt: "", category: "", format: "" },
    ]);
  };

  const handleStageChange = (index, field, value) => {
    const updatedStages = [...qualificationStages];
    updatedStages[index][field] = value;
    setQualificationStages(updatedStages);
  };
  const handleRemoveQualification = (index) => {
    const updatedStages = [...qualificationStages];
    updatedStages.splice(index, 1);
    setQualificationStages(updatedStages);
  };

  const [matches, setMatches] = useState();
  const [onClick, setonClick] = useState(false);
  const [knockValues, setKnockValues] = useState();
  const [topTeam, setTopTeam] = useState();
  const [csp, setcsp] = useState();
  console.log(group, "group from third compo");

  const isDuplicate = teams.length !== new Set(teams).size;
  const categoryName = tournamentCategory?.sports_category.find(
    (sportCategory) =>
      sportCategory.category_code === tournamentCategory.tournamentCategory
  )?.category_name;

  const formatName = tournamentCategory?.sports_format.find(
    (sportCategory) =>
      sportCategory.format_code === tournamentCategory.tournamentFormat
  )?.format_name;

  // const formatCode = tournamentCategory?.sports_format?.find(
  //   (sportCategory) =>
  //     sportCategory.format_code === tournamentCategory.tournamentFormat
  // )?.format_code;
  const {
    mutate,
    isLoading: isGenerateLoading,
    isError,
  } = useGenerateFixtures();
  return (
    <VStack
      p={{ base: "2", md: "2", lg: "5" }}
      bg="white"
      gap={5}
      mt={10}
      align="flex-start"
    >
      <VStack w="full" gap={5}>
        <FieldLayout label="Event Category">
          <Text>
            {tournamentCategory?.sports_name} {"-"} {categoryName}
          </Text>
        </FieldLayout>
        <FieldLayout label="Event Format">
          <Text>{formatName}</Text>
        </FieldLayout>
      </VStack>
      <VStack align="flex-start" w="full">
        <HeadingMedium>Qualification</HeadingMedium>

        <FieldLayout label="Top">
          <NumberInput
            maxW={20}
            onChange={(value) => setTopTeam(value)}
            setTopTeam
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FieldLayout>
        {formatCode === "GRPKNO" ? (
          <FieldLayout label="Knockout Format">
            <Select
              placeholder="Select option"
              onChange={(e) => {
                setKnockValues(e.target.value);
              }}
              maxW="2xs"
            >
              <option value="CHAIN">Chain</option>
              <option value="CSP">Cup,Shield,Plate</option>
            </Select>
          </FieldLayout>
        ) : (
          <FieldLayout label="Knockout Format">
            <Select
              placeholder="Select option"
              onChange={(e) => {
                setKnockValues(e.target.value);
              }}
              maxW="2xs"
            >
              <option value="PLAYOFFS">Playoffs</option>
              <option value="CHAIN">Chain</option>
            </Select>
          </FieldLayout>
        )}
      </VStack>
      {knockValues === "CSP" && (
        <VStack align="flex-start" w="full" gap={3}>
          {qualificationStages.map((stage, index) => (
            <HStack key={index} w="full" alignSelf="center" spacing={5}>
              <LabelText>Team At</LabelText>

              <Text>{`${index + 1} st Place`}</Text>
              <Select
                flex={1}
                placeholder="Select option"
                onChange={(e) =>
                  handleStageChange(index, "category", e.target.value)
                }
              >
                <option value="Cup">Cup</option>
                <option value="Shield">Shield</option>
                <option value="Plate">Plate</option>
              </Select>
              <LabelText>Format</LabelText>
              <Select
                flex={1}
                placeholder="Select option"
                onChange={(e) =>
                  handleStageChange(index, "format", e.target.value)
                }
              >
                <option value="PLAYOFFS">Playoffs</option>
                <option value="CHAIN">Chain</option>
              </Select>

              <IconButton
                icon={<MinusIcon fontSize="16px" />}
                colorScheme="primary"
                variant="outline"
                size="xs"
                isRound={true}
                onClick={() => handleRemoveQualification(index)}
                disabled={qualificationStages.length === 1 ? true : false}
              />
            </HStack>
          ))}
          <Button mr={4} onClick={handleAddQualification} variant="outline">
            Add Qualification Stage
          </Button>
        </VStack>
      )}

      <Divider />
      {matches?.map((teams, index) => (
        <TeamVsCard
          typeValid={typeValid}
          index={index}
          type="fixtures"
          teams={teams}
          key={index}
          matches={matches}
          setMatches={setMatches}
        />
      ))}
      <Flex
        direction={{ base: "column", md: "row" }}
        w="full"
        justify="flex-end"
        gap={{ base: "5", md: "2", sm: "1", lg: "5" }}
        pt={10}
      >
        <Button mr={4} onClick={prevStep} variant="outline">
          Previous
        </Button>
        <Spacer />
        <Button
          colorScheme="primary"
          onClick={() => {
            mutate(
              knockValues === "CSP"
                ? {
                    numTeams: teams.length,
                    numRounds: +noOfRound,
                    numTeamGrp: +groupNo,
                    numTopTeams: +topTeam,
                    phase: 2,
                    randomTeam: false,
                    format: "GRPKNO",
                    knockoutFormat: "CSP", //drop line la
                    cspFormat: formatData,
                    groups: null,
                  }
                : {
                    teams: null,
                    numTeams: +noOfReg,
                    numRounds: +noOfRound,
                    numTeamGrp: 0,
                    numTopTeams: +topTeam,
                    phase: 2,
                    knockoutFormat: knockValues,
                    randomTeam: false,
                    format:
                      (formatCode === knockValues) === "CSP"
                        ? "GRPKNO"
                        : "LGEKNO",
                    groups: null,
                  },
              {
                onSuccess: (response) => {
                  setMatches(response);
                  setKnockout(response);
                  nextStep();
                },
              },
              {
                onError: "error occurs",
              }
            );
            setonClick(true);
          }}
        >
          Save & Proceed
        </Button>

        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>

        <Button variant="outline" onClick={nextStep}>
          Next
        </Button>
      </Flex>
    </VStack>
  );
}

export default EventGroupKnockoutFixtures;
