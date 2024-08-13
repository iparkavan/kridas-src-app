import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Select,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import DatePicker from "../../ui/pickers/date-picker";
import { TextMedium } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import TeamVsCard from "./team-vs-card";

function LeagueFixtures({
  nextStep,
  prevStep,
  activeStep,
  steps,
  tournamentCategories,
  tournamentCategoryId,
  setMatches,
  matches,
  typeValid,
}) {
  const router = useRouter();
  const [singleFormat, setSingleFormat] = useState("");
  const tournamentCategory = tournamentCategories.find(
    (tc) => tc.tournamentCategoryId == tournamentCategoryId
  );

  const [teams, setTeams] = useState([]);

  const categoryName = tournamentCategory?.sports_category.find(
    (sportCategory) =>
      sportCategory.category_code === tournamentCategory.tournamentCategory
  )?.category_name;

  const formatName = tournamentCategory?.sports_format.find(
    (sportCategory) =>
      sportCategory.format_code === tournamentCategory.tournamentFormat
  )?.format_name;

  const formatCode = tournamentCategory?.sports_format.find(
    (sportCategory) =>
      sportCategory.format_code === tournamentCategory.tournamentFormat
  )?.format_code;

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
      {formatCode === "LEAGUE" && (
        <FieldLayout label="League Format">
          <Select
            placeholder="Select option"
            //   onChange={setSingleFormat("SINGLE")}
            onChange={() => setSingleFormat("SINGLE")}
          >
            <option value="single">Single</option>
            <option value="Home&Away">Home & Away</option>
          </Select>
        </FieldLayout>
      )}
      {/* <SimpleGrid columns={2} spacing={4} rowGap={1}> */}
        {matches?.map((teams, index) => (
          <TeamVsCard
            typeValid={typeValid}
            index={index}
            doublesType="doubles"
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
        <Button mr={4} onClick={prevStep} variant="outline">
          Previous
        </Button>
        <Spacer />
        <Button colorScheme="primary" onClick={nextStep}>
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

export default LeagueFixtures;
