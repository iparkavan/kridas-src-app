import { useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { Flex, VStack, HStack, Icon, Spacer, Divider } from "@chakra-ui/react";

import EditAcademy from "./user-pages-sports-profile-edit-academy";
import DeleteStatistic from "./user-pages-sports-profile-delete-statistic";
import { useSports } from "../../../../hooks/sports-hooks";
import { TextMedium } from "../../../ui/text/text";
import LabelValuePair from "../../../ui/label-value-pair";

function AcademyStatistics({ data, idx, type }) {
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
          {data.categorywise_statistics.academy_name && (
            <TextMedium fontWeight="bold">
              {data.categorywise_statistics.academy_name}
            </TextMedium>
          )}
        </HStack>
        <Spacer />
        {type === "private" && (
          <HStack spacing={1}>
            <EditAcademy statistics_id={data.company_statistics_id} />
            <DeleteStatistic
              statistics_id={data.company_statistics_id}
              category="Academy"
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
        {data.categorywise_statistics.sports_id && (
          <LabelValuePair label="Sports">
            {sportNames.join(", ")}
          </LabelValuePair>
        )}
        {data.categorywise_statistics.skill_level && (
          <LabelValuePair label="Skill Level">
            {data.categorywise_statistics.skill_level}
          </LabelValuePair>
        )}
        {data.categorywise_statistics.gender && (
          <LabelValuePair label="Gender">
            {data.categorywise_statistics.gender}
          </LabelValuePair>
        )}
        {data.categorywise_statistics.age_group && (
          <LabelValuePair label="Age Group">
            {data.categorywise_statistics.age_group}
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

export default AcademyStatistics;
