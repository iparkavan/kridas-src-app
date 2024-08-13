import { HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { TextMedium, TextSmall } from "../../../../ui/text/text";

const CricketScore = ({ matchScore, type }) => {
  let bgColor;
  if (type === "first_team") {
    if (matchScore.first_team_score > matchScore.second_team_score) {
      bgColor = "green.500";
    } else {
      bgColor = "red.500";
    }
  } else {
    if (matchScore.second_team_score > matchScore.first_team_score) {
      bgColor = "green.500";
    } else {
      bgColor = "red.500";
    }
  }

  const score = matchScore[`${type}_stats`].score;
  const wickets = matchScore[`${type}_stats`].wickets;
  const overs = matchScore[`${type}_stats`].overs;

  return (
    <VStack spacing={1}>
      <HStack spacing="2px">
        <TextSmall
          textAlign="center"
          borderTopLeftRadius="md"
          borderBottomLeftRadius="md"
          color="white"
          bg={bgColor}
          minW="80px"
          py={1}
        >
          Scores
        </TextSmall>

        <TextSmall
          textAlign="center"
          color="white"
          bg={bgColor}
          minW="80px"
          py={1}
        >
          Wickets
        </TextSmall>

        <TextSmall
          textAlign="center"
          borderTopRightRadius="md"
          borderBottomRightRadius="md"
          color="white"
          bg={bgColor}
          minW="80px"
          py={1}
        >
          Overs
        </TextSmall>
      </HStack>

      <HStack spacing={0}>
        <TextMedium
          borderTop="2px"
          borderBottom="2px"
          borderLeft="2px"
          borderColor="gray.300"
          borderTopLeftRadius="md"
          borderBottomLeftRadius="md"
          p="2px"
          minW="82px"
          textAlign="center"
        >
          {score}
        </TextMedium>
        <TextMedium
          border="2px"
          borderColor="gray.300"
          p="2px"
          minW="82px"
          textAlign="center"
        >
          {wickets}
        </TextMedium>
        <TextMedium
          borderTop="2px"
          borderBottom="2px"
          borderRight="2px"
          borderColor="gray.300"
          borderTopRightRadius="md"
          borderBottomRightRadius="md"
          p="2px"
          minW="82px"
          textAlign="center"
        >
          {overs}
        </TextMedium>
      </HStack>
    </VStack>
  );
};

export default CricketScore;
