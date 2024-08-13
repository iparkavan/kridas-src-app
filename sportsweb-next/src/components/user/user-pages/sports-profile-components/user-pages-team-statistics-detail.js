import { useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import {
  Flex,
  VStack,
  HStack,
  Text,
  Link,
  Spacer,
  Divider,
  Icon,
} from "@chakra-ui/react";

import EditTeam from "./user-pages-sports-profile-edit-team";
import { JpgIcon, PdfIcon } from "../../../ui/icons";
import DeleteStatistic from "./user-pages-sports-profile-delete-statistic";
import { useSports } from "../../../../hooks/sports-hooks";
import { HeadingSmall } from "../../../ui/heading/heading";
import { TextSmall } from "../../../ui/text/text";
import LabelValuePair from "../../../ui/label-value-pair";

function TeamStatistics({ data, idx, type }) {
  const [view, setView] = useState(false);
  const { data: sportsData = [] } = useSports();
  const sportName = sportsData?.find(
    ({ sports_id }) => sports_id === data.categorywise_statistics.sports_id
  )?.sports_name;

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
        <HStack spacing={2} color="primary.600">
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
          <VStack align="flex-start" spacing={0}>
            {data.categorywise_statistics.team_name && (
              <>
                <HeadingSmall>
                  {data.categorywise_statistics.team_name}
                </HeadingSmall>
                <TextSmall fontWeight="bold" color="initial">
                  {sportName}
                </TextSmall>
              </>
            )}
          </VStack>
        </HStack>
        <Spacer />
        {type === "private" && (
          <HStack spacing={1}>
            <EditTeam statistics_id={data.company_statistics_id} />
            <DeleteStatistic
              statistics_id={data.company_statistics_id}
              category="Team"
            />
          </HStack>
        )}
      </Flex>
      {view && <Divider borderColor="gray.400" />}
      <VStack
        p={[1, 3, 5]}
        spacing={5}
        align="flex-start"
        display={view ? "flex" : "none"}
      >
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

        {type === "private" && (
          <>
            {data.statistics_links.length > 0 && (
              <>
                <HeadingSmall>External Stats URL</HeadingSmall>
                <Divider w={["sm", "md"]} borderColor="gray.400" />
                <VStack align="flex-start">
                  {data.statistics_links?.map(({ link }, idx) => (
                    <HStack spacing={4} align="flex-start" key={idx}>
                      <Text color="black">{link === "" ? "" : idx + 1}</Text>
                      <Link color="#2F80ED" href={link} isExternal>
                        {link}
                      </Link>
                    </HStack>
                  ))}
                </VStack>
              </>
            )}
            {data.statistics_docs.length > 0 && (
              <>
                <HeadingSmall>
                  Upload Certificates/Documents/Achievement Proofs
                </HeadingSmall>
                <Divider w={["sm", "md"]} borderColor="gray.400" />

                {data?.["statistics_docs"] &&
                  (data?.["statistics_docs"]).map(({ key, url }, index) => (
                    // {statistic?.["statistics_docs"].map((doc, index) => (
                    <HStack key={index} spacing={10}>
                      <Text>{index + 1}</Text>
                      <Icon
                        as={
                          url?.split(".").pop() === "jpg" ||
                          url?.split(".").pop() === "jpeg"
                            ? JpgIcon
                            : PdfIcon
                        }
                        w="6"
                        h="6"
                      />
                      <Link href={url} color="primary.600" isExternal>
                        {url?.split("--").pop()}
                      </Link>
                    </HStack>
                  ))}
              </>
            )}
          </>
        )}
      </VStack>
    </VStack>
  );
}

export default TeamStatistics;
