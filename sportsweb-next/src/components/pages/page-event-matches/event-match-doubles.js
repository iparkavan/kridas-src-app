import {
  Box,
  Flex,
  Grid,
  GridItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useGenerateFixtures } from "../../../hooks/fixtures-hooks";
import { useTeams } from "../../../hooks/team-hooks";
import Button from "../../ui/button";
import Skeleton from "../../ui/skeleton";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";

function EventMatchDoubles({
  doubleTeam,
  nextStep,
  prevStep,
  activeStep,
  steps,
  currentEvent,
  tournamentCategories,
  tournamentCategoryId,
  setMatches,
  eventTeamData,
  isLoading,
  matches,
  typeValid,
  updatedActivities,
  updatedRegister,
  setNoOfRound,
  noOfRound,
  noOfReg,
  setNoOfReg,
  teams,
  setTeams,
  formatCode,
}) {
  const tournamentCategory = tournamentCategories.find(
    (tc) => tc.tournamentCategoryId == tournamentCategoryId
  );

  const categoryName = tournamentCategory?.sports_category.find(
    (sportCategory) =>
      sportCategory.category_code === tournamentCategory.tournamentCategory
  )?.category_name;

  // const [noOfReg, setNoOfReg] = useState();

  const [isGenerate, setIsGenerate] = useState();
  // const [noOfRound, setNoOfRound] = useState();
  const formatName = tournamentCategory?.sports_format.find(
    (sportCategory) =>
      sportCategory.format_code === tournamentCategory.tournamentFormat
  )?.format_name;

  // const formatCode = tournamentCategory?.sports_format.find(
  //   (sportCategory) =>
  //     sportCategory.format_code === tournamentCategory.tournamentFormat
  // )?.format_code;

  const formateCodeChange = (formatCode) => {
    if (formatCode === "LGEKNO") {
      return "LGEKNO";
    } else if (formatCode === "KNOCK") {
      return "KNOCK";
    } else if (formatCode === "LEAGUE") {
      return "LEAGUE";
    } else if (formatCode === "GRPKNO") {
      return "GRPKNO";
    }
    return formatCode;
  };

  const formattedValue = formateCodeChange(formatCode);

  const temp =
    tournamentCategory && JSON.parse(tournamentCategory?.tournamentConfig);

  const maxReg = temp?.participant_criteria?.max_registrations;
  const minReg = temp?.participant_criteria?.min_registrations;

  const [onClick, setonClick] = useState(false);
  // const [teams, setTeams] = useState([]);
  const [option, setOption] = useState([]);

  useEffect(() => {
    const regCount = +isGenerate || 0;
    const teamNames = new Array(regCount)?.fill()?.map((_, index) => {
      if (updatedActivities[updatedRegister[index]]) {
        const playerNames = updatedActivities[updatedRegister[index]].map(
          (player, index) => {
            let playerName = `${player.first_name} ${player.last_name}`;
            // if (index === 0) {
            //   playerName += " / ";
            // }
            return playerName;
          }
        );

        return playerNames.join(" / ");
      } else {
        return `Participant ${index * 2 + 1} / Participant ${index * 2 + 2}`;
      }
    });
    setTeams(teamNames);
    setOption(teamNames);
  }, [updatedRegister, updatedActivities, isGenerate, setTeams]);

  const isDuplicate = teams.length !== new Set(teams).size;

  const {
    mutate,
    isLoading: isGenerateLoading,
    isError,
  } = useGenerateFixtures();

  if (isLoading) {
    return <Skeleton minH={"100vh"} w="full" />;
  }
  return (
    <VStack
      p={{ base: "2", md: "2", lg: "5" }}
      bg="white"
      gap={5}
      mt={10}
      align="flex-start"
    >
      <VStack w="full" gap={5}>
        <FieldLayout label="Sport & Sport Category">
          <Text>
            {tournamentCategory?.sports_name} {"-"} {categoryName}
          </Text>
        </FieldLayout>
        <FieldLayout label="Sport Format">
          <Text>{formatName}</Text>
        </FieldLayout>
      </VStack>

      {(formatCode === "LGEKNO" ||
        // formatCode === "GRPKNO" ||
        formatCode === "LEAGUE") && (
        <FieldLayout label="No of Rounds">
          <NumberInput onChange={(value) => setNoOfRound(value)} maxW={20}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FieldLayout>
      )}
      <FieldLayout label="No of Registration">
        <VStack align="flex-start">
          <NumberInput onChange={(value) => setNoOfReg(value)} maxW={20}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {+noOfReg > maxReg && (
            <Text color="red">Max Registeration exceed</Text>
          )}
          {+noOfReg < minReg && (
            <Text color="red">Should be Greater than Min Registeration </Text>
          )}
        </VStack>

        <Button
          onClick={() => {
            setIsGenerate(noOfReg);
          }}
          disabled={+noOfReg > maxReg || !+noOfReg > 0}
        >
          Generate Teams
        </Button>
      </FieldLayout>
      {isGenerate > 0 && (
        <>
          <SimpleGrid columns={2} spacing={2} alignContent="flex-start">
            <VStack align="flex-start">
              <Text>SI.No</Text>
            </VStack>
            <VStack align="flex-start">
              <Text>Teams</Text>
            </VStack>
            {teams.map((_, index) => (
              <Fragment key={index}>
                <VStack align="flex-start">
                  <Text>{index + 1}</Text>
                </VStack>
                <VStack align="flex-start">
                  <Select
                    value={teams[index]}
                    onChange={(e) => {
                      const newTeams = [...teams];
                      //newmatc index ={...match[index],value}
                      newTeams[index] = e.target.value;
                      setTeams(newTeams);
                      // setMatches(newTeams);
                    }}
                  >
                    {option?.map((teamObj, index) => (
                      <option key={index} value={teamObj}>
                        {teamObj}
                      </option>
                    ))}
                  </Select>
                </VStack>
              </Fragment>
            ))}
          </SimpleGrid>
          {onClick && isDuplicate && (
            <Text color="red">Teams should not be same</Text>
          )}
        </>
      )}

      <Flex
        direction={{ base: "column", md: "row" }}
        w="full"
        justify="flex-end"
        gap={{ base: "5", md: "2", sm: "1", lg: "5" }}
        pt={10}
      >
        <Button
          colorScheme="primary"
          type="submit"
          onClick={() => {
            // formatCode === "LGEKNO" ?
            if (!isDuplicate) {
              if (formatCode !== "GRPKNO") {
                mutate(
                  {
                    // format: formatCode === "KNOCK" ? "KNOCKOUT" : "LEAGUE",
                    // numRounds: 0,
                    // numTeamGrp: 0,
                    // numTeams: noOfReg,
                    // randomTeam: true,
                    // teams: teams,
                    // format: formatCode === "KNOCK" ? "KNOCKOUT" : "LEAGUE",
                    format: formattedValue,
                    numTeamGrp: 0,
                    numRounds: noOfRound,
                    numTeams: noOfReg,
                    randomTeam: true,
                    teams: teams,
                    groups: null,
                  },
                  {
                    onSuccess: (response) => {
                      setMatches(response);
                      nextStep();
                    },
                  },
                  {
                    onError: "error occurs",
                  }
                );
              } else {
                nextStep();
              }
            }

            setonClick(true);
          }}
          isLoading={isGenerateLoading}
        >
          Save & Proceed
        </Button>

        <Button variant="outline">Cancel</Button>

        <Button variant="outline" onClick={nextStep}>
          Next
        </Button>
      </Flex>
    </VStack>
  );
}

export default EventMatchDoubles;
