import {
  Avatar,
  Box,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { HeadingSmall } from "../../ui/heading/heading";
import { TextMedium } from "../../ui/text/text";
import Button from "../../ui/button";
function FixturesDoublesCard({
  type,
  eventData,
  typeGame,
  tournamentCategories,
  tournamentCategoryId,
}) {
  const tournamentCategory = tournamentCategories.find(
    (tc) => tc.tournamentCategoryId == tournamentCategoryId
  );
  const formatCode = tournamentCategory?.sports_format.find(
    (sportCategory) =>
      sportCategory.format_code === tournamentCategory.tournamentFormat
  )?.format_code;

  // const sports_code = tournamentCategory.sports_code;

  console.log(tournamentCategory, "formatCode");
  return (
    <Box w="full" h="max-content" bg="gray.100" mt={15}>
      <Grid
        templateColumns="repeat(5,1fr)"
        gap={6}
        p={5}
        // alignContent="center"
        alignContent="space-between"
      >
        {
          (type = "view" ? (
            <GridItem w="100%">
              <Text>Match</Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <ReactDatePicker
                dateFormat="MM/dd/yyyy"
                placeholderText="Date"
                customInput={
                  <Input borderColor="gray.300" bg="white" fontSize="sm" />
                }
              />
            </GridItem>
          ))
        }

        {
          (type = "view" ? (
            <GridItem w="100%" textAlign="center">
              <Text>Match</Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <ReactDatePicker
                dateFormat="MM/dd/yyyy"
                placeholderText="Date"
                customInput={
                  <Input borderColor="gray.300" bg="white" fontSize="sm" />
                }
              />
            </GridItem>
          ))
        }
        <GridItem w="100%" textAlign="center"></GridItem>
        {
          (type = "view" ? (
            <GridItem w="100%" textAlign="center">
              <Text>Match</Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <ReactDatePicker
                dateFormat="MM/dd/yyyy"
                placeholderText="Date"
                customInput={
                  <Input borderColor="gray.300" bg="white" fontSize="sm" />
                }
              />
            </GridItem>
          ))
        }

        {
          (type = "view" ? (
            <GridItem w="100%" textAlign="end">
              <Text>Match</Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <ReactDatePicker
                dateFormat="MM/dd/yyyy"
                placeholderText="Date"
                customInput={
                  <Input borderColor="gray.300" bg="white" fontSize="sm" />
                }
              />
            </GridItem>
          ))
        }
      </Grid>
      <Grid
        templateColumns="repeat(5,1fr)"
        gap={6}
        p={5}
        alignContent="space-between"
      >
        {
          (type = "view" ? (
            <GridItem w="100%">
              <Text>hello</Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <Input
                borderColor="gray.300"
                bg="white"
                fontSize="sm"
                placeholder="Venue Name"
              />
            </GridItem>
          ))
        }
        <GridItem w="100%" alignSelf="center">
          <HStack gap={3}>
            <VStack p={3} align="flex-start">
              <HStack>
                <Avatar name="name" src="https://bit.ly/dan-abramov" />
                <HeadingSmall noOfLines={2}>name</HeadingSmall>
              </HStack>
              <HStack>
                <Avatar name="name" src="https://bit.ly/dan-abramov" />
                <HeadingSmall noOfLines={2}>name</HeadingSmall>
              </HStack>
            </VStack>
            <Text>2</Text>
          </HStack>
        </GridItem>

        <GridItem
          // w="100%"
          alignSelf="center"
          // pr={40}
          w="auto"
          px={20}
        >
          {tournamentCategory && tournamentCategory.sports_code === "SPOR02" ? (
            <Flex gap={2}>
              <Text>2</Text>
              <TextMedium>Vs</TextMedium>
              <Text>1</Text>
            </Flex>
          ) : (
            <TextMedium>Vs</TextMedium>
          )}
        </GridItem>
        <GridItem w="100%">
          <HStack gap={3}>
            <Text>2</Text>
            <VStack p={3} align="flex-start">
              <HStack>
                <Avatar name="name" src="https://bit.ly/dan-abramov" />
                <HeadingSmall noOfLines={2}>name</HeadingSmall>
              </HStack>
              <HStack>
                <Avatar name="name" src="https://bit.ly/dan-abramov" />
                <HeadingSmall noOfLines={2}>name</HeadingSmall>
              </HStack>
            </VStack>
          </HStack>
        </GridItem>

        <GridItem w="100%" textAlign="end">
          <Button size="md" variant="solid">
            Edit Result
          </Button>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(5,1fr)" p={5} alignContent="space-between">
        <GridItem w="100%">
          <Text>Result</Text>
        </GridItem>
        <GridItem w="100%"></GridItem>
        <GridItem w="100%">
          <Text>21/13, 21/16, 20/18</Text>
        </GridItem>
        <GridItem w="100%"></GridItem>
        <GridItem w="100%"></GridItem>
      </Grid>
    </Box>
  );
}

export default FixturesDoublesCard;
