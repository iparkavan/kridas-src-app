import { Divider, HStack, VStack } from "@chakra-ui/react";

import { HeadingSmall } from "../../ui/heading/heading";
import Button from "../../ui/button";
import { useSports } from "../../../hooks/sports-hooks";

const ViewUserInterests = ({ sportsInterested }) => {
  const { data: sportsData = [] } = useSports();
  const isSportsInterestedPresent = sportsInterested?.length > 0;

  if (!isSportsInterestedPresent) {
    return null;
  }

  return (
    <VStack alignItems="flex-start" width="full" spacing={6}>
      <Divider borderColor="gray.300" mx={-6} px={6} />
      <HeadingSmall textTransform="uppercase">Sports Interested</HeadingSmall>
      <HStack gap={6} spacing={0} flexWrap="wrap">
        {sportsInterested?.map((sport) => (
          <Button minW="none" key={sport}>
            {sportsData?.find((s) => s["sports_id"] === sport)?.["sports_name"]}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};

export default ViewUserInterests;
