import { useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { Flex, VStack, HStack, Icon, Spacer, Divider } from "@chakra-ui/react";

import DeleteStatistic from "./user-pages-sports-profile-delete-statistic";
import EditVenue from "./user-pages-sports-profile-edit-venue";
import { useSports } from "../../../../hooks/sports-hooks";
import { TextMedium } from "../../../ui/text/text";
import LabelValuePair from "../../../ui/label-value-pair";

function VenueStatistics({ data, idx, type }) {
  const [view, setView] = useState(false);
  const { data: sportsData = [] } = useSports();
  const sportNames = sportsData
    ?.filter(({ sports_id }) =>
      data.categorywise_statistics?.sports_id.includes(sports_id)
    )
    ?.map(({ sports_name }) => sports_name);

  return (
    <VStack
      border="1px solid"
      borderColor="gray.300"
      w="full"
      h="min-content"
      borderRadius="4px"
      align="flex-start"
      key={data.company_statistics_id}
      p={4}
    >
      <Flex w="full">
        <HStack spacing={1} color="primary.600">
          {view ? (
            <Icon
              as={MdKeyboardArrowUp}
              w="6"
              h="6"
              cursor="pointer"
              onClick={() => setView(false)}
            />
          ) : (
            <Icon
              as={MdKeyboardArrowDown}
              w="6"
              h="6"
              cursor="pointer"
              onClick={() => setView(true)}
            />
          )}
          <TextMedium fontWeight="bold">
            {data.categorywise_statistics.venue}
          </TextMedium>
        </HStack>
        <Spacer />
        {type === "private" && (
          <HStack spacing={1}>
            <EditVenue statistics_id={data.company_statistics_id} />
            <DeleteStatistic
              statistics_id={data.company_statistics_id}
              category="Venue"
            />
          </HStack>
        )}
      </Flex>
      {view && <Divider />}
      <VStack
        p={[1, 3, 5]}
        spacing={5}
        align="flex-start"
        display={view ? "flex" : "none"}
      >
        {data.categorywise_statistics.venue && (
          <LabelValuePair label="Sports">
            {sportNames.join(", ")}
          </LabelValuePair>
        )}

        {data.categorywise_statistics.address && (
          <LabelValuePair label="Address">
            {data.categorywise_statistics.address}
          </LabelValuePair>
        )}
      </VStack>
    </VStack>
  );
}

export default VenueStatistics;
