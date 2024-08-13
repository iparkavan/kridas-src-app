import { Button, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import TeamVsCard from "./team-vs-card";

function EventMatchPreview({
  matches,
  nextStep,
  prevStep,
  typeValid,
  knockout,
  league,
}) {
  console.log(knockout, "knockout");
  const router = useRouter();
  return (
    <VStack
      p={{ base: "2", md: "2", lg: "5" }}
      bg="white"
      gap={5}
      mt={10}
      align="flex-start"
    >
      {league && (
        <>
          <Text>league</Text>
          {league?.map((teams, index) => (
            <TeamVsCard
              typeValid={typeValid}
              index={index}
              type="prview"
              teams={teams}
              key={index}
              matches={league}
            />
          ))}
        </>
      )}

      {knockout && (
        <>
          <Text>knockout</Text>
          {knockout?.map((teams, index) => (
            <TeamVsCard
              typeValid={typeValid}
              index={index}
              type="prview"
              teams={teams}
              key={index}
              matches={knockout}
            />
          ))}
        </>
      )}
      {/* <SimpleGrid columns={2} spacing={4} rowGap={1}> */}
        {matches?.map((teams, index) => (
          <TeamVsCard
            typeValid={typeValid}
            index={index}
            type="prview"
            teams={teams}
            key={index}
            matches={matches}
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

        <Button colorScheme="primary">Save & Proceed</Button>

        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </Flex>
    </VStack>
  );
}

export default EventMatchPreview;
