import { Box, HStack, VStack } from "@chakra-ui/react";
import { TextSmall } from "../../../../ui/text/text";

const SetsScore = ({ matchScore, type }) => {
  const sets = matchScore.sets;

  return (
    <HStack spacing={0} flexWrap="wrap" justifyContent="center">
      {sets.map((set, index) => {
        let bgColor;

        if (type === "first_team") {
          if (set.first_team_points > set.second_team_points) {
            bgColor = "green.500";
          } else if (set.first_team_points < set.second_team_points) {
            bgColor = "red.500";
          } else {
            bgColor = "black";
          }
        } else {
          if (set.second_team_points > set.first_team_points) {
            bgColor = "green.500";
          } else if (set.second_team_points < set.first_team_points) {
            bgColor = "red.500";
          } else {
            bgColor = "black";
          }
        }

        const points = set[`${type}_points`];
        const isFirst = index === 0;
        const isLast = index === sets.length - 1;

        return (
          <VStack key={index} spacing={1} w="55px">
            <TextSmall
              textAlign="center"
              borderTopLeftRadius={isFirst && "md"}
              borderBottomLeftRadius={isFirst && "md"}
              borderTopRightRadius={isLast && "md"}
              borderBottomRightRadius={isLast && "md"}
              borderRight="2px solid white"
              color="white"
              bg={bgColor}
              w="full"
              py={1}
            >
              Set {index + 1}
            </TextSmall>

            <Box
              borderTop="2px"
              borderBottom="2px"
              borderLeft="2px"
              borderRight={isLast && "2px"}
              borderColor="gray.300"
              borderTopLeftRadius={isFirst && "md"}
              borderBottomLeftRadius={isFirst && "md"}
              borderTopRightRadius={isLast && "md"}
              borderBottomRightRadius={isLast && "md"}
              py="2px"
              w="full"
              textAlign="center"
            >
              {points}
            </Box>
          </VStack>
        );
      })}
    </HStack>
  );
};

export default SetsScore;
