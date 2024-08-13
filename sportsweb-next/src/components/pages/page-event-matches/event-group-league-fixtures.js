import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
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
import React, { useState } from "react";
import Button from "../../ui/button";
import LabelText from "../../ui/text/label-text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import { useGenerateFixtures } from "../../../hooks/fixtures-hooks";
import TeamVsCard from "./team-vs-card";
import { useEffect } from "react";

function EventGroupLeagueFixtures({
  formatCode,
  // matches,
  categoryName,
  formatName,
  tournamentCategory,
  nextStep,
  teams,
  setNoOfRound,
  noOfRound,
  noOfReg,
  typeValid,
  setGroupNo,
  groupNo,
  setNoOfReg,
  group,
  setGroup,
  league,
  setLeague,
  // knockout={knockout}
  //             setknockout={setknockout}
}) {
  // const [groupNo, setGroupNo] = useState();
  const [generate, setIsGenerate] = useState();
  const [mode, setMode] = useState("2");
  const [matches, setMatches] = useState();
  const [onClick, setonClick] = useState(false);

  const handleChange = (value) => {
    setMode(value);
  };

  const isDuplicate = teams.length !== new Set(teams).size;

  // const divideGroup = (originalArray, numGroups) => {
  //   const groupSize = Math.floor(originalArray.length / numGroups);
  //   const dividedArray = [];

  //   originalArray.forEach((element, i) => {
  //     const groupIndex = Math.floor(i / groupSize);
  //     if (!dividedArray[groupIndex]) {
  //       dividedArray[groupIndex] = [];
  //     }
  //     dividedArray[groupIndex][i % groupSize] = element;
  //   });

  //   return dividedArray;
  // };

  function divideArray(originalArray, numGroups) {
    const groupSize = Math.floor(originalArray.length / numGroups);
    const dividedArray = {};

    originalArray.forEach((element, i) => {
      const groupIndex = Math.floor(i / groupSize);
      if (!dividedArray.hasOwnProperty(groupIndex)) {
        dividedArray[groupIndex] = [];
      }
      dividedArray[groupIndex][i % groupSize] = element;
    });

    return dividedArray;
  }

  const dividedArray = divideArray(teams, +generate);

  // useEffect(() => {
  //   setGroup(dividedArray);
  // }, [setGroup, dividedArray]);

  const {
    mutate,
    isLoading: isGenerateLoading,
    isError,
  } = useGenerateFixtures();

  const formateCodeChange = (formatCode) => {
    if (formatCode === "LGEKNO") {
      return "LGEKNO";
    } else if (formatCode === "KNOCK") {
      return "KNOCKOUT";
    } else if (formatCode === "LEAGUE") {
      return "LEAGUE";
    } else if (formatCode === "GRPKNO") {
      return "GRPKNO";
    }
    return formatCode;
  };

  const formattedValue = formateCodeChange(formatCode);

  return (
    <VStack
      p={{ base: "2", md: "2", lg: "5" }}
      bg="white"
      gap={5}
      mt={10}
      align="flex-start"
      w="full"
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
      {formatCode === "GRPKNO" && (
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

      <LabelText fontSize={20}>Group Information </LabelText>
      <FieldLayout label="No of Group">
        <HStack w="full" alignSelf="center" spacing={5}>
          <NumberInput onChange={(value) => setGroupNo(value)} maxW={20}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <LabelText>Group Creation </LabelText>
          <RadioGroup onChange={handleChange} value={mode}>
            <Flex gap={3}>
              <Radio value="1">Automatic</Radio>
              <Radio value="2">Manual</Radio>
            </Flex>
          </RadioGroup>
          <Button
            onClick={() => {
              setIsGenerate(groupNo);
            }}
            disabled={+groupNo > +groupNo > 0}
          >
            Generate teams
          </Button>
        </HStack>
      </FieldLayout>

      <Box />

      {generate && (
        <SimpleGrid columns={3} spacing={5}>
          {Object.keys(dividedArray)?.map((data, index) => (
            <VStack key={index} align="flex-start">
              <Text fontWeight="bold">
                Group {String.fromCharCode(65 + +data)}
              </Text>

              {dividedArray[data]?.map((datatwo, index) => (
                <>
                  {mode === "2" ? (
                    <Select placeholder="Select the Teams">
                      {teams?.map((teamObj, index) => (
                        <option key={index} value={teamObj}>
                          {teamObj}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Text key={index}>{datatwo}</Text>
                  )}
                </>
              ))}
            </VStack>
          ))}
        </SimpleGrid>
      )}
      {onClick && isDuplicate && (
        <Text color="red">Team should not be same</Text>
      )}
      <Divider />
      {/* <SimpleGrid columns={2} spacing={4} rowGap={1}> */}
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
      {/* </SimpleGrid> */}

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
            if (!isDuplicate) {
              if (formatCode === "GRPKNO") {
                console.log("divideArray2", dividedArray);
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
                    groups: Object.values(dividedArray).map((val) => val),
                    // groups: groupArray,
                  },
                  {
                    onSuccess: (response) => {
                      setMatches(response);
                      setLeague(response);
                      nextStep();
                    },
                  },
                  {
                    onError: "error occurs",
                  }
                );
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

export default EventGroupLeagueFixtures;
