import {
  AccordionPanel,
  Box,
  Divider,
  HStack,
  Icon,
  Link,
  VStack,
} from "@chakra-ui/react";

import { useUserStatistics } from "../../../hooks/user-statistics-hooks";
import { JpgIcon, PdfIcon } from "../../ui/icons";
import {
  sportsConfig,
  sportSpecifics,
} from "../../../helper/constants/sports-constants";
import UserProfileSportsStatistics from "./user-profile-sports-statistics";
import LabelText from "../../ui/text/label-text";
import LabelValuePair from "../../ui/label-value-pair";
import { HeadingSmall } from "../../ui/heading/heading";
import { Accordion, AccordionButton, AccordionItem } from "../../ui/accordion";
import { TextSmall, TextXtraSmall } from "../../ui/text/text";

const ViewUserStatistics = (props) => {
  const { userData, type } = props;
  const { data: statisticsData = [] } = useUserStatistics(
    userData?.["user_id"]
  );
  const isSportsStatisticsPresent = statisticsData?.some(
    (statistic) => statistic?.["skill_level"] && statistic?.["playing_status"]
  );

  if (!isSportsStatisticsPresent) {
    return null;
  }

  return (
    <VStack alignItems="flex-start" width="full" spacing={6}>
      <Divider borderColor="gray.300" mx={-6} px={6} />
      <HeadingSmall textTransform="uppercase">Sports Statistics</HeadingSmall>
      <Accordion defaultIndex={[0]} allowToggle w="full">
        {statisticsData?.map(
          (statistic) =>
            statistic?.["skill_level"] &&
            statistic?.["playing_status"] && (
              <AccordionItem key={statistic["user_statistics_id"]}>
                <AccordionButton>
                  <TextSmall fontWeight="medium">
                    {statistic?.["sports_name"]}
                  </TextSmall>
                </AccordionButton>

                <AccordionPanel p={5}>
                  <VStack alignItems="flex-start" w="full" spacing={5}>
                    <LabelValuePair label="Skill Level">
                      {statistic?.["category_name"]}
                    </LabelValuePair>
                    <LabelValuePair label="Active">
                      {statistic?.["playing_status"] === "AC"
                        ? "I am actively playing"
                        : "I am not actively playing"}
                    </LabelValuePair>

                    {/* {statistic?.["sportwise_statistics"] &&
                    statistic?.["sportwise_statistics"]?.statsInfo?.[0] &&
                    Object.keys(
                      statistic?.["sportwise_statistics"]?.statsInfo?.[0]
                    ).some((key) => {
                      if (key === "statsSubInfo") {
                        return (
                          Object.keys(
                            statistic?.["sportwise_statistics"]?.statsInfo?.[0][
                              key
                            ]
                          ).length > 0
                        );
                      }
                      return statistic?.["sportwise_statistics"]
                        ?.statsInfo?.[0][key];
                    }) && (
                      <>
                        <TextHighlight fontWeight="bold" mb={2}>Statistics</TextHighlight>
                        <UserProfileSportsStatistics statistic={statistic} />
                      </>
                    )} */}

                    <UserProfileSportsStatistics statistic={statistic} />

                    {statistic?.["sportwise_statistics"] &&
                      Object.keys(statistic?.["sportwise_statistics"])?.some(
                        (key) =>
                          key !== "statsInfo" &&
                          statistic["sportwise_statistics"][key]
                      ) && (
                        <Box>
                          <LabelText mb={2}>
                            {statistic?.["sports_name"]} Specifics
                          </LabelText>
                          <VStack alignItems="flex-start" spacing={2}>
                            {statistic?.["sportwise_statistics"] &&
                              Object.keys(
                                statistic?.["sportwise_statistics"]
                              )?.map((key) => {
                                if (
                                  typeof statistic?.["sportwise_statistics"][
                                    key
                                  ] === "boolean" &&
                                  key !== "BOW"
                                ) {
                                  if (
                                    statistic?.["sports_code"] === "SPOR13" ||
                                    statistic?.["sports_code"] === "SPOR04" ||
                                    statistic?.["sports_code"] === "SPOR03" ||
                                    statistic?.["sports_code"] === "SPOR10" ||
                                    statistic?.["sports_code"] === "SPOR12" ||
                                    statistic?.["sports_code"] === "SPOR09" ||
                                    statistic?.["sports_code"] === "SPOR07"
                                  ) {
                                    return (
                                      statistic?.["sportwise_statistics"][
                                        key
                                      ] && (
                                        <TextSmall key={key}>
                                          {
                                            sportSpecifics[
                                              statistic?.["sports_code"]
                                            ].find((s) => s.value === key)
                                              ?.label
                                          }
                                        </TextSmall>
                                      )
                                    );
                                  }
                                  return (
                                    statistic?.["sportwise_statistics"][
                                      key
                                    ] && (
                                      <TextSmall key={key}>
                                        {sportsConfig[key]}
                                      </TextSmall>
                                    )
                                  );
                                } else if (!sportsConfig[key]) {
                                  return (
                                    <TextSmall key={key}>
                                      {
                                        sportsConfig[
                                          statistic?.["sportwise_statistics"][
                                            key
                                          ]
                                        ]
                                      }
                                    </TextSmall>
                                  );
                                }

                                return (
                                  <HStack key={key} spacing={10}>
                                    {key !== "BOWT" &&
                                      statistic?.["sportwise_statistics"][
                                        key
                                      ] && (
                                        <>
                                          <TextSmall fontWeight="medium">
                                            {sportsConfig[key]}
                                          </TextSmall>
                                          {sportsConfig[
                                            statistic?.["sportwise_statistics"][
                                              key
                                            ]
                                          ] && (
                                            <TextSmall>
                                              {
                                                sportsConfig[
                                                  statistic?.[
                                                    "sportwise_statistics"
                                                  ][key]
                                                ]
                                              }
                                            </TextSmall>
                                          )}
                                          {key === "BOW" && (
                                            <TextSmall>
                                              {
                                                sportsConfig[
                                                  statistic?.[
                                                    "sportwise_statistics"
                                                  ]["BOWT"]
                                                ]
                                              }
                                            </TextSmall>
                                          )}
                                        </>
                                      )}
                                  </HStack>
                                );
                              })}
                          </VStack>
                        </Box>
                      )}

                    {type === "private" &&
                      statistic?.["statistics_links"]?.length > 0 && (
                        <Box w="full">
                          <LabelText>External Stats URL (Optional)</LabelText>
                          <TextXtraSmall>
                            These information are mandatory when applying for
                            sponsorship
                          </TextXtraSmall>
                          <VStack mt={3} alignItems="flex-start" spacing={3}>
                            {statistic?.["statistics_links"]?.map(
                              (link, index) => (
                                <HStack key={index} spacing={10}>
                                  <TextSmall>{index + 1}</TextSmall>
                                  <Link
                                    href={link}
                                    color="primary.500"
                                    fontSize="sm"
                                    isExternal
                                  >
                                    {link}
                                  </Link>
                                </HStack>
                              )
                            )}
                          </VStack>
                        </Box>
                      )}

                    {type === "private" &&
                      statistic?.["statistics_docs"]?.length > 0 && (
                        <Box w="full">
                          <LabelText>
                            Upload Certificates / Documents / Achievement Proofs
                            (Optional)
                          </LabelText>
                          <TextXtraSmall>
                            These information are mandatory when applying for
                            sponsorship
                          </TextXtraSmall>
                          <Divider borderColor="gray.300" my={3} />
                          <VStack alignItems="flex-start" spacing={4}>
                            {statistic?.["statistics_docs"]?.map(
                              (stat, index) => (
                                <HStack key={stat.key} spacing={10}>
                                  <TextSmall>{index + 1}</TextSmall>
                                  <Icon
                                    as={
                                      stat.url.split(".").pop() === "jpg" ||
                                      stat.url.split(".").pop() === "jpeg"
                                        ? JpgIcon
                                        : PdfIcon
                                    }
                                    w="6"
                                    h="6"
                                  />
                                  <Link
                                    href={stat.url}
                                    color="primary.500"
                                    fontSize="sm"
                                    isExternal
                                  >
                                    {stat.url.split("--")[1]}
                                  </Link>
                                </HStack>
                              )
                            )}
                          </VStack>
                        </Box>
                      )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            )
        )}
      </Accordion>
    </VStack>
  );
};

export default ViewUserStatistics;
