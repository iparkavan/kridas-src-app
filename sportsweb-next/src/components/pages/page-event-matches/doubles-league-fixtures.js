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

function DoublesLeagueFixtures({ typeValid }) {
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
          <Text>cat nanme</Text>
        </FieldLayout>
        <FieldLayout label="Sport Format">
          <Text>name</Text>
        </FieldLayout>
      </VStack>
      <FieldLayout label="No of Registration">
        <VStack align="flex-start">
          <NumberInput
          // onChange={(value) => setNoOfReg(value)} maxW={20}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {/* {+noOfReg > maxReg && (
            <Text color="red">Max Registeration exceed</Text>
          )} */}
        </VStack>

        <Button
        // onClick={() => {
        //   setIsGenerate(noOfReg);
        // }}
        // disabled={+noOfReg > maxReg || !+noOfReg > 0}
        >
          Generate teams
        </Button>
      </FieldLayout>
      {/* {isGenerate > 0 && (
        <> */}
      <SimpleGrid columns={2} spacing={2} alignContent="flex-start">
        <VStack align="flex-start">
          <Text>SI.No</Text>
        </VStack>
        <VStack align="flex-start">
          <Text>Teams</Text>
        </VStack>

        <Fragment key={index}>
          <VStack align="flex-start">
            <Text>{index + 1}</Text>
          </VStack>
          <VStack align="flex-start">
            <Select

            // value={teamObj.company.company_name}
            >
              <option>name</option>
            </Select>
          </VStack>
        </Fragment>

        {/* {alldata?.slice(0, noOfReg).map((teamObj, index) => {
            const isUser = teamObj.type.type === "Individual";
            const isTeam = teamObj.type.type === "team";
            const isDoubles = teamObj.type.type === "doubles";
            if (isUser) {
              const fullName = `${teamObj.first_name} ${teamObj.last_name}`;
              return (
                <>
                  <VStack justify="flex-start">
                    <Text>{index + 1}</Text>
                  </VStack>
                  <VStack justify="flex-start">
                    <Select>
                      <option value="option1">{fullName}</option>
                    </Select>
                  </VStack>
                </>
              );
            } else if (isTeam) {
              return (
                <>
                  <VStack align="flex-start">
                    <Text>{index + 1}</Text>
                  </VStack>
                  <VStack align="flex-start">
                    <Select
                      value={teams[index]}
                      // value={teamObj.company.company_name}
                      onChange={(e) => {
                        const newTeams = [...teams];
                        newTeams[index] = e.target.value;
                        setTeams(newTeams);
                      }}
                    >
                      {alldata?.slice(0, noOfReg)?.map((teamObj, index) => (
                        <option
                          key={index}
                          value={teamObj?.company?.company_name}
                        >
                          {teamObj?.company?.company_name}
                        </option>
                      ))}
                    </Select>
                  </VStack>
                </>
              );
            }
          })} */}
      </SimpleGrid>

      <Flex
        direction={{ base: "column", md: "row" }}
        w="full"
        justify="flex-end"
        gap={{ base: "5", md: "2", sm: "1", lg: "5" }}
        pt={10}
      >
        <Button colorScheme="primary" type="submit">
          Save & Proceed
        </Button>

        <Button variant="outline">Cancel</Button>

        <Button variant="outline">Next</Button>
      </Flex>
    </VStack>
  );
}

export default DoublesLeagueFixtures;
