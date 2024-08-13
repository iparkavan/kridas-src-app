import {
  AccordionPanel,
  Box,
  Divider,
  Flex,
  HStack,
  Link,
  SimpleGrid,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import React, { Fragment } from "react";
import { useQueries } from "react-query";
import { feedOptions } from "../../../helper/constants/feed-constants";
import { useCategoriesByType } from "../../../hooks/category-hooks";

import { useEventPrize } from "../../../hooks/event-hook";

import pageService from "../../../services/page-service";
import { Accordion, AccordionButton, AccordionItem } from "../../ui/accordion";

import { HeadingMedium } from "../../ui/heading/heading";

import Skeleton from "../../ui/skeleton";
import LabelText from "../../ui/text/label-text";
import { TextSmall } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import DescModal from "../page-event-forms/desc-modal";
import RulesModal from "../page-event-forms/rules-modal";
import EventDescModal from "./event-desc-modal";
import EventIndemnityModal from "./event-indemnity-modal";
import EventRulesModal from "./event-rules-modal";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";

function PageEventAboutSummary({
  eventData,
  isLoadingEvent,
  categories,
  countriesData,
  sports,
}) {
  const { data: prizeData = [] } = useEventPrize("PRZ");

  const { data: apparelData } = useLookupTable("APP");
  const { data: foodData } = useLookupTable("FDP");

  const { data: participantCategories = [] } = useCategoriesByType("PRC");

  const pages = useQueries(
    eventData?.eventVenue
      ? eventData.eventVenue.map((pageId) => ({
          queryKey: ["page", pageId],
          queryFn: () => pageService.getPage(pageId),
        }))
      : []
  );
  const [isLargeScreen] = useMediaQuery("(min-width: 768px)"); // Adjust breakpoint as needed
  console.log(isLargeScreen, "isLargeScreen");

  if (!eventData) return null;

  const formatDate = (date) => format(new Date(date), "dd-MMM-yyyy  h:mm aa");
  const formatDateOnly = (date) => format(new Date(date), "dd-MM-yyyy");
  let eventDescHtml;
  let isDescHtml = true;
  try {
    const contentState = convertFromRaw(JSON.parse(eventData["eventDesc"]));
    eventDescHtml = stateToHTML(contentState, feedOptions);
  } catch (e) {
    isDescHtml = false;
  }

  let eventRulesHtml;
  let isRulesHtml = true;
  try {
    const contentState = convertFromRaw(
      JSON.parse(eventData["standardEventRules"])
    );
    eventRulesHtml = stateToHTML(contentState, feedOptions);
  } catch (e) {
    isRulesHtml = false;
  }

  // let eventIndemnityHtml;
  // let isIndemnityHtml = true;
  // try {
  //   const contentState = convertFromRaw(
  //     JSON.parse(eventData["indemnityClause"])
  //   );
  //   eventIndemnityHtml = stateToHTML(contentState, feedOptions);
  // } catch (e) {
  //   isIndemnityHtml = false;
  // }

  if (isLoadingEvent) return <Skeleton>Loading..</Skeleton>;
  else
    return (
      <VStack
        p={{ base: "2", md: "2", lg: "5" }}
        bg="white"
        gap={5}
        align="self-start"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        {/* <HeadingMedium>Event Details</HeadingMedium> */}
        <FieldLayout label="Event Name">{eventData.eventName}</FieldLayout>
        <FieldLayout label="Event Category">
          {
            categories?.find(
              (a) => a.category_id === eventData?.eventCategoryId
            )?.category_name
          }
        </FieldLayout>
        <FieldLayout label="Description">
          <EventDescModal
            isDescHtml={isDescHtml}
            eventData={eventData}
            eventDescHtml={eventDescHtml}
          />
        </FieldLayout>
        <FieldLayout label="Event Type">
          {eventData?.isPublicEvent === "Y" ? (
            <Text>Public Event</Text>
          ) : (
            <Text>Private Event</Text>
          )}
        </FieldLayout>
        <FieldLayout label="Event Start Date">
          <Box w="full">
            {eventData["eventStartdate"] &&
              formatDate(eventData["eventStartdate"])}
          </Box>
          {/* <Box w="full"> */}
          {/* <Flex
            w="full"
            direction={{ base: "column", md: "row" }}
            // gap={{ base: 2 }}
            align={{ sm: "flex-start" }}
          >
            <LabelText>Event End Date</LabelText>
            <Text ml="20">{formatDate(eventData["eventEnddate"])}</Text>
          </Flex> */}
          <FieldLayout label="Event End Date">
            <Box w="full">{formatDate(eventData["eventEnddate"])}</Box>
          </FieldLayout>
        </FieldLayout>

        <FieldLayout label="Registration Start Date">
          <Box w="full">
            {eventData["eventRegStartdate"] &&
              formatDate(eventData["eventRegStartdate"])}
          </Box>
          <Box w="full">
            <FieldLayout label="Registration End Date">
              {eventData["eventRegLastdate"] &&
                formatDate(eventData["eventRegLastdate"])}
            </FieldLayout>
          </Box>
        </FieldLayout>
        <FieldLayout label="Payment Mode">
          <Box w="full">
            {eventData?.collectPymtOnline === "N" &&
            eventData?.collectPymtOffline === "N" ? (
              <Text>No Payment</Text>
            ) : eventData?.collectPymtOnline === "Y" ? (
              <Text>Online</Text>
            ) : (
              <Text>Offline</Text>
            )}
          </Box>
          {eventData?.collectPymtOnline === "N" &&
          eventData?.collectPymtOffline === "N" ? null : (
            <Flex w="full">
              <LabelText>Registeration Fees</LabelText>
              <Text ml="14">
                {eventData?.eventRegfee} {eventData?.eventRegFeeCurrency}
              </Text>
            </Flex>
          )}
        </FieldLayout>
        {/* <FieldLayout label="Contact Details"> */}
        {/* {eventData["eventContacts"]?.["name"]} */}
        {isLargeScreen ? (
          <Box
            bg="#ffffff"
            // bg="red"
            p={4}
            w="full"
            gap="3"
            border="1px solid #e6ecf5"
            borderRadius="5px"
            direction={{ base: "column", md: "row", sm: "row" }}
          >
            <SimpleGrid
              columns={4}
              spacing={5}
              direction={{ base: "column", sm: "row", md: "row" }}
            >
              <LabelText>Name</LabelText>
              <LabelText>Email</LabelText>
              <LabelText>Phone Number</LabelText>
              <LabelText>Whatsapp Number</LabelText>
            </SimpleGrid>
            {eventData?.eventContacts &&
              JSON.parse(eventData?.eventContacts)?.map((contact, index) => (
                <SimpleGrid
                  columns={4}
                  spacing={5}
                  key={index}
                  mt={5}
                  direction={{ base: "column", md: "row", sm: "row" }}
                  bg="white"
                >
                  <Text>{contact?.name}</Text>
                  <Text>{contact?.email}</Text>
                  <Text>{contact?.phone_number}</Text>
                  {contact?.whatsapp_number ? (
                    <Text>{contact?.whatsapp_number}</Text>
                  ) : (
                    <Text>-</Text>
                  )}
                </SimpleGrid>
              ))}
          </Box>
        ) : (
          <Box
            bg="#ffffff"
            // bg="red"
            p={4}
            w="full"
            gap="3"
            border="1px solid #e6ecf5"
            borderRadius="5px"
            direction={{ base: "column", md: "row", sm: "row" }}
          >
            {eventData?.eventContacts &&
              JSON.parse(eventData?.eventContacts)?.map((contact, index) => (
                <>
                  <FieldLayout label="Name">{contact?.name}</FieldLayout>
                  <FieldLayout label="Email">{contact?.email}</FieldLayout>
                  <FieldLayout label="Phone Number">
                    {contact?.phone_number}
                  </FieldLayout>
                  {contact?.whatsapp_number ? (
                    <FieldLayout label="Whatsapp Number">
                      {contact?.whatsapp_number}
                    </FieldLayout>
                  ) : (
                    <Text>-</Text>
                  )}
                </>
              ))}
          </Box>
        )}

        {/* </FieldLayout> */}
        {/* <FieldLayout label="Event Rules">
              {isDescHtml ? (
                <Box dangerouslySetInnerHTML={{ __html: eventDescHtml }} />
              ) : (
                eventData["standardEventRules"]
              )}
            </FieldLayout> */}
        <FieldLayout label="Event Rules">
          <EventRulesModal
            isRulesHtml={isRulesHtml}
            eventRulesHtml={eventRulesHtml}
            eventData={eventData}
          />
        </FieldLayout>

        {eventData?.virtualVenueUrl ? (
          <FieldLayout label="Virtual Url">
            <Link href={eventData.virtualVenueUrl} isExternal>
              {eventData.virtualVenueUrl}
            </Link>
          </FieldLayout>
        ) : (
          <FieldLayout label="Event Venue">
            <Box
              bg="#ffffff"
              p={4}
              w="full"
              gap="3"
              border="1px solid #e6ecf5"
              borderRadius="5px"
              direction={{ base: "column", md: "row" }}
            >
              <SimpleGrid
                // columns={{ base: 2, lg: 2, sm: 1 }}
                column={2}
                spacingX={16}
                spacingY={5}
                w="full"
              >
                {pages?.map((datas, index) => (
                  <HStack align="flex-start" key={index} w="full">
                    <Text>{index + 1}.</Text>

                    <Box w={{ lg: "full" }}>
                      <Text>{datas?.data?.company_name}</Text>
                      {datas?.data?.address?.url && (
                        <Text>{datas.data.address.url}</Text>
                      )}
                      {datas?.data?.address?.line1 && (
                        <Text>{datas.data.address.line1}</Text>
                      )}
                      {datas?.data?.address?.line2 && (
                        <Text>{datas.data.address.line2}</Text>
                      )}
                      <Text>
                        {datas?.data?.address?.city &&
                          `${datas.data.address.city}, `}
                        {datas?.data?.address?.country &&
                          `${
                            countriesData
                              ?.find(
                                (c) =>
                                  c["country_code"] ==
                                  datas?.data?.address?.country
                              )
                              ?.country_states?.find(
                                (s) =>
                                  s["state_code"] == datas?.data?.address?.state
                              )?.["state_name"]
                          }, `}
                        {
                          countriesData?.find(
                            (c) =>
                              c["country_code"] == datas?.data?.address?.country
                          )?.["country_name"]
                        }
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>
          </FieldLayout>
        )}

        {/* <FieldLayout label="Event Indemnity Form">
          <EventIndemnityModal
            isIndemnityHtml={isIndemnityHtml}
            eventIndemnityHtml={eventIndemnityHtml}
            eventData={eventData}
          />
        </FieldLayout> */}
        <Divider />
        <HeadingMedium>Sports List</HeadingMedium>
        <Accordion defaultIndex={[0]} allowToggle w="full">
          {eventData.tournaments.map((dataOne) => {
            const sport = sports.find(
              (s) => s["sports_id"] == dataOne["sportsRefid"]
            );
            return dataOne.tournamentCategories.map(
              (tournamentCategory, index) => {
                const categoryName = sport?.sports_category.find(
                  (cat) =>
                    cat.category_code === tournamentCategory.tournamentCategory
                )?.category_name;
                const formatName = sport?.sports_format.find(
                  (format) =>
                    format.format_code === tournamentCategory.tournamentFormat
                )?.format_name;
                const categoryDescContentState =
                  typeof tournamentCategory?.tournamentCategoryDesc === "object"
                    ? tournamentCategory?.tournamentCategoryDesc
                    : convertFromRaw(
                        JSON.parse(tournamentCategory?.tournamentCategoryDesc)
                      );

                const tournamentCategoryDescHtml = stateToHTML(
                  categoryDescContentState,
                  feedOptions
                );

                // const playingConditionsContentState =
                //   typeof tournamentCategory?.standardPlayingConditions ===
                //   "object"
                //     ? tournamentCategory?.standardPlayingConditions
                //     : convertFromRaw(
                //         JSON.parse(
                //           tournamentCategory?.standardPlayingConditions
                //         )
                //       );

                // const playingConditionsHtml = stateToHTML(
                //   playingConditionsContentState,
                //   feedOptions
                // );

                // const isCatTeam =
                //   tournamentCategory.tournamentCategory ===
                //   "TEAMCA";

                const playingConditionsContentState =
                  tournamentCategory?.standardPlayingConditions
                    ? convertFromRaw(
                        JSON.parse(tournamentCategory.standardPlayingConditions)
                      )
                    : convertFromRaw({
                        entityMap: {},
                        blocks: [
                          {
                            text: "",
                            key: "foo",
                            type: "unstyled",
                            entityRanges: [],
                          },
                        ],
                      });

                const playingConditionsHtml = stateToHTML(
                  playingConditionsContentState,
                  feedOptions
                );

                const indemnityClauseContentState = convertFromRaw(
                  JSON.parse(tournamentCategory.indemnityClause)
                );
                const indemnityClauseHtml = stateToHTML(
                  indemnityClauseContentState,
                  feedOptions
                );

                const tournamentConfig =
                  typeof tournamentCategory.tournamentConfig === "object"
                    ? tournamentCategory.tournamentConfig
                    : JSON.parse(tournamentCategory.tournamentConfig);

                const preferencesOffered =
                  typeof tournamentCategory.preferencesOffered === "object"
                    ? tournamentCategory.preferencesOffered
                    : JSON.parse(tournamentCategory.preferencesOffered);

                const tournamentCategoryName =
                  tournamentCategory.tournamentCategoryName ||
                  `${sport?.sports_name} - ${categoryName} (${
                    tournamentConfig.age_criteria?.criteria_by
                  }${
                    tournamentConfig.age_criteria?.age_value &&
                    ` ${tournamentConfig.age_criteria.age_value}`
                  })`;

                return (
                  <AccordionItem key={index}>
                    <AccordionButton bg="gray.300" py={3} px={4}>
                      <Flex>
                        <TextSmall fontWeight="medium">
                          {tournamentCategoryName}
                          {/* {sport?.["sports_name"]} - {categoryName} (
                          {tournamentConfig.age_criteria?.criteria_by}
                          {tournamentConfig.age_criteria?.age_value &&
                            ` ${tournamentConfig.age_criteria.age_value}`}
                          ) */}
                        </TextSmall>
                      </Flex>

                      {/* <IconButton
                                          icon={<EditIcon fontSize="18px" />}
                                          cursor="pointer"
                                          onClick={() => {
                                            setSportMode("edit");
                                            setCurrentSport(sport);
                                            setCurrentIndex(index);
                                            onOpen();
                                          }}
                                        ></IconButton> */}
                    </AccordionButton>
                    <AccordionPanel>
                      <VStack alignItems="flex-start" w="full" spacing={5}>
                        {tournamentCategory?.participantCategory && (
                          <FieldLayout label="Participant Category">
                            {
                              participantCategories?.find(
                                (s) =>
                                  s["category_id"] ==
                                  tournamentCategory?.participantCategory
                              )?.["category_name"]
                            }
                          </FieldLayout>
                        )}
                        {tournamentCategory?.tournamentSubCategory?.length >
                          0 && (
                          <FieldLayout label="Sub-Category">
                            <Text>
                              {tournamentCategory?.tournamentSubCategory?.map(
                                (subCatCode, index) => {
                                  const categoryName =
                                    sport?.sports_category.find(
                                      (category) =>
                                        category.category_code == subCatCode
                                    )?.category_name;
                                  return (
                                    <Fragment key={subCatCode}>
                                      {categoryName}
                                      {index !==
                                        tournamentCategory.tournamentSubCategory
                                          .length -
                                          1 && ", "}
                                    </Fragment>
                                  );
                                }
                              )}
                            </Text>
                          </FieldLayout>
                        )}

                        {formatName && (
                          <FieldLayout label="Format">{formatName}</FieldLayout>
                        )}
                        {tournamentConfig.age_criteria.criteria_by && (
                          <FieldLayout label="Age Criteria">
                            {tournamentConfig.age_criteria.criteria_by}
                            {/* {typeof tournamentCategory?.tournamentConfig ===
                                          "object"
                                            ? tournamentCategory
                                                ?.tournamentConfig?.age_criteria
                                                ?.criteria_by
                                            : JSON.parse(
                                                tournamentCategory?.tournamentConfig
                                              )?.age_criteria?.criteria_by} */}
                            {/* {
                                          tournamentCategory.tournamentConfig
                                            .age_criteria.age_from
                                        } */}
                            {/* {
                                          tournamentCategory.tournamentConfig
                                            .age_criteria.age_to
                                        } */}
                          </FieldLayout>
                        )}
                        {tournamentConfig.age_criteria.age_value && (
                          <FieldLayout label="Age Value">
                            {tournamentConfig.age_criteria.age_value}
                            {/* {typeof tournamentCategory?.tournamentConfig ===
                                          "object"
                                            ? tournamentCategory
                                                ?.tournamentConfig?.age_criteria
                                                ?.age_value
                                            : JSON.parse(
                                                tournamentCategory?.tournamentConfig
                                              )?.age_criteria?.age_value} */}
                          </FieldLayout>
                        )}
                        {tournamentConfig.age_criteria.age_from && (
                          <FieldLayout label="From Age">
                            {formatDateOnly(
                              tournamentConfig.age_criteria.age_from
                            )}
                          </FieldLayout>
                        )}
                        {tournamentConfig.age_criteria.age_to && (
                          <FieldLayout label="To Age">
                            {formatDateOnly(
                              tournamentConfig.age_criteria.age_to
                            )}
                          </FieldLayout>
                        )}

                        {eventData?.eventVenue.length > 0 && (
                          <FieldLayout label="Event Venue">
                            <Box
                              bg="#ffffff"
                              p={4}
                              w="full"
                              gap="3"
                              border="1px solid #e6ecf5"
                              borderRadius="5px"
                              direction={{ base: "column", md: "row" }}
                            >
                              <SimpleGrid
                                columns={{ lg: 2, sm: 1 }}
                                spacingX={16}
                                spacingY={5}
                                w="full"
                              >
                                {tournamentCategory?.tournamentCategoryVenue.map(
                                  (venueId, index) => {
                                    const page = pages.find(
                                      (option) =>
                                        option?.data?.company_id === venueId
                                    );
                                    return (
                                      <>
                                        <HStack
                                          align="flex-start"
                                          key={index}
                                          w="full"
                                        >
                                          <Text>{index + 1}. </Text>
                                          <Box w={{ lg: "full", sm: "full" }}>
                                            <Text>
                                              {page?.data?.company_name}
                                            </Text>
                                            {page?.data?.address?.url && (
                                              <Text>
                                                {page.data.address.url}
                                              </Text>
                                            )}
                                            {page?.data?.address?.line1 && (
                                              <Text>
                                                {page.data.address.line1}
                                              </Text>
                                            )}
                                            {page?.data?.address?.line2 && (
                                              <Text>
                                                {page.data.address.line2}
                                              </Text>
                                            )}
                                            <Text>
                                              {page?.data?.address?.city &&
                                                `${page.data.address.city}, `}
                                              {page?.data?.address?.country &&
                                                `${
                                                  countriesData
                                                    ?.find(
                                                      (c) =>
                                                        c["country_code"] ==
                                                        page?.data?.address
                                                          ?.country
                                                    )
                                                    ?.country_states?.find(
                                                      (s) =>
                                                        s["state_code"] ==
                                                        page?.data?.address
                                                          ?.state
                                                    )?.["state_name"]
                                                }, `}
                                              {
                                                countriesData?.find(
                                                  (c) =>
                                                    c["country_code"] ==
                                                    page?.data?.address?.country
                                                )?.["country_name"]
                                              }
                                            </Text>
                                          </Box>
                                        </HStack>
                                      </>
                                    );
                                  }
                                )}
                              </SimpleGrid>
                            </Box>
                          </FieldLayout>
                        )}

                        <Box w="full">
                          <SimpleGrid column={2} spacing={5} w="full">
                            {tournamentConfig.participant_criteria
                              .min_registrations && (
                              <FieldLayout label="Overall Min Players or Teams">
                                {
                                  tournamentConfig.participant_criteria
                                    .min_registrations
                                }
                                {/* {typeof tournamentCategory?.tournamentConfig ===
                                              "object"
                                                ? tournamentCategory
                                                    ?.tournamentConfig
                                                    ?.participant_criteria
                                                    ?.min_registrations
                                                : JSON.parse(
                                                    tournamentCategory?.tournamentConfig
                                                  )?.participant_criteria
                                                    ?.min_registrations} */}
                              </FieldLayout>
                            )}

                            {tournamentConfig.participant_criteria
                              .max_registrations && (
                              <FieldLayout label="Overall Max Players or Teams">
                                {
                                  tournamentConfig.participant_criteria
                                    .max_registrations
                                }
                                {/* {typeof tournamentCategory?.tournamentConfig ===
                                            "object"
                                              ? tournamentCategory
                                                  ?.tournamentConfig
                                                  ?.participant_criteria
                                                  ?.max_registrations
                                              : JSON.parse(
                                                  tournamentCategory?.tournamentConfig
                                                )?.participant_criteria
                                                  ?.max_registrations} */}
                              </FieldLayout>
                            )}

                            {tournamentConfig.team_criteria
                              .min_players_per_team && (
                              <FieldLayout label="Min No. of Players per Team">
                                {
                                  tournamentConfig.team_criteria
                                    .min_players_per_team
                                }
                                {/* {typeof tournamentCategory?.tournamentConfig ===
                                                "object"
                                                  ? tournamentCategory
                                                      ?.tournamentConfig
                                                      ?.team_criteria
                                                      ?.min_players_per_team
                                                  : JSON.parse(
                                                      tournamentCategory?.tournamentConfig
                                                    )?.team_criteria
                                                      ?.min_players_per_team} */}
                              </FieldLayout>
                            )}
                            {tournamentConfig.team_criteria
                              .max_players_per_team && (
                              <FieldLayout label="Max No. of Players per Team">
                                {
                                  tournamentConfig.team_criteria
                                    .max_players_per_team
                                }
                                {/* {typeof tournamentCategory?.tournamentConfig ===
                                              "object"
                                                ? tournamentCategory
                                                    ?.tournamentConfig
                                                    ?.team_criteria
                                                    ?.max_players_per_team
                                                : JSON.parse(
                                                    tournamentCategory?.tournamentConfig
                                                  )?.team_criteria
                                                    ?.max_players_per_team} */}
                              </FieldLayout>
                            )}

                            {tournamentConfig.team_criteria
                              .min_male_players && (
                              <FieldLayout label="Min No. of Male Players">
                                {
                                  tournamentConfig.team_criteria
                                    .min_male_players
                                }
                                {/* {typeof tournamentCategory?.tournamentConfig ===
                                              "object"
                                                ? tournamentCategory
                                                    ?.tournamentConfig
                                                    ?.team_criteria
                                                    ?.min_male_players
                                                : JSON.parse(
                                                    tournamentCategory?.tournamentConfig
                                                  )?.team_criteria
                                                    ?.min_male_players} */}
                              </FieldLayout>
                            )}
                            {tournamentConfig.team_criteria
                              .max_male_players && (
                              <FieldLayout label="Max No. of Male Players">
                                {
                                  tournamentConfig.team_criteria
                                    .max_male_players
                                }
                                {/* {typeof tournamentCategory?.tournamentConfig ===
                                              "object"
                                                ? tournamentCategory
                                                    ?.tournamentConfig
                                                    ?.team_criteria
                                                    ?.max_male_players
                                                : JSON.parse(
                                                    tournamentCategory?.tournamentConfig
                                                  )?.team_criteria
                                                    ?.max_male_players} */}
                              </FieldLayout>
                            )}

                            {tournamentConfig.team_criteria
                              .min_female_players && (
                              <FieldLayout label="Min No. of Female Players">
                                {
                                  tournamentConfig.team_criteria
                                    .min_female_players
                                }
                                {/* {typeof tournamentCategory?.tournamentConfig ===
                                              "object"
                                                ? tournamentCategory
                                                    ?.tournamentConfig
                                                    ?.team_criteria
                                                    ?.min_female_players
                                                : JSON.parse(
                                                    tournamentCategory?.tournamentConfig
                                                  )?.team_criteria
                                                    ?.min_female_players} */}
                              </FieldLayout>
                            )}
                            {tournamentConfig.team_criteria
                              .max_female_players && (
                              <FieldLayout label="Max No. of Female Players">
                                {
                                  tournamentConfig.team_criteria
                                    .max_female_players
                                }
                                {/* {typeof tournamentCategory?.tournamentConfig ===
                                              "object"
                                                ? tournamentCategory
                                                    ?.tournamentConfig
                                                    ?.team_criteria
                                                    ?.max_female_players
                                                : JSON.parse(
                                                    tournamentCategory?.tournamentConfig
                                                  )?.team_criteria
                                                    ?.max_female_players} */}
                              </FieldLayout>
                            )}
                          </SimpleGrid>
                        </Box>
                        {tournamentConfig.team_criteria.max_participation && (
                          // <FieldLayout label="Player can play maximum partcipations in a round/game">
                          <FieldLayout
                            label={
                              <Text>
                                Player can play maximum partcipations <br /> in
                                a round/game
                              </Text>
                            }
                          >
                            {tournamentConfig.team_criteria.max_participation}
                            {/* {typeof tournamentCategory?.tournamentConfig ===
                                          "object"
                                            ? tournamentCategory
                                                ?.tournamentConfig
                                                ?.team_criteria
                                                ?.max_participation
                                            : JSON.parse(
                                                tournamentCategory?.tournamentConfig
                                              )?.team_criteria
                                                ?.max_participation} */}
                          </FieldLayout>
                        )}
                        {tournamentCategory?.regFee && (
                          <FieldLayout label="Registration Fee">
                            {tournamentCategory?.regFee}{" "}
                            {tournamentCategory?.regFeeCurrency}
                          </FieldLayout>
                        )}
                        {/* {tournamentCategory.tournamentCategoryPrizes
                                    .length >
                                    ( */}
                        {tournamentCategory?.tournamentCategoryPrizes?.length >
                          0 && (
                          <FieldLayout label="Prizes">
                            <HStack>
                              {tournamentCategory?.tournamentCategoryPrizes?.map(
                                (prizeId, index) => {
                                  const categoryName = prizeData?.find(
                                    ({ category_id }) => category_id == prizeId
                                  )?.category_name;
                                  return (
                                    <Text key={prizeId}>
                                      {categoryName}
                                      {index !==
                                        tournamentCategory
                                          .tournamentCategoryPrizes.length -
                                          1 && ","}
                                    </Text>
                                  );
                                }
                              )}
                            </HStack>
                          </FieldLayout>
                        )}
                        <FieldLayout label="Description">
                          {/* {
                                            tournamentCategory.tournamentCategoryDesc
                                          } */}

                          <DescModal
                            tournamentCategoryDescHtml={
                              tournamentCategoryDescHtml
                            }
                          />
                        </FieldLayout>
                        <FieldLayout label="Playing Conditions">
                          {/* <Text>
                                          {
                                            tournamentCategory.standardPlayingConditions
                                          }
                                        </Text> */}

                          <RulesModal
                            playingConditionsHtml={playingConditionsHtml}
                          />
                        </FieldLayout>
                        {tournamentCategory?.indemnityClause && (
                          <FieldLayout label="Indemnity Clause">
                            <EventIndemnityModal
                              indemnityClauseHtml={indemnityClauseHtml}
                            />
                          </FieldLayout>
                        )}
                        {/* {tournamentCategory?.docList.length >
                                        0 && (
                                        <FieldLayout label="Documents">
                                          {typeof tournamentCategory.docList ===
                                          "object"
                                            ? tournamentCategory.docList.map(
                                                (doc) => {
                                                  return (
                                                    <Link
                                                      key={doc.key}
                                                      href={doc.url}
                                                      color="primary.500"
                                                      isExternal
                                                    >
                                                      {
                                                        docType.find(
                                                          (document) =>
                                                            document.lookup_key ===
                                                            doc.type
                                                        )?.lookup_value
                                                      }{" "}
                                                      - {doc.name}
                                                    </Link>
                                                  );
                                                }
                                              )
                                            : JSON.parse(
                                                tournamentCategory.docList
                                              ).map((doc) => {
                                                return (
                                                  <Link
                                                    key={doc.key}
                                                    href={doc.url}
                                                    color="primary.500"
                                                    isExternal
                                                  >
                                                    {
                                                      docType.find(
                                                        (document) =>
                                                          document.lookup_key ===
                                                          doc.type
                                                      )?.lookup_value
                                                    }{" "}
                                                    - {doc.name}
                                                  </Link>
                                                );
                                              })}
                                        </FieldLayout>
                                      )} */}
                        {/* )} */}
                        {preferencesOffered?.apparel_preference?.length > 0 && (
                          <FieldLayout label="Apparel Preference">
                            <HStack>
                              {preferencesOffered.apparel_preference?.map(
                                (apparelType, index) => {
                                  let apparelName = apparelData?.find(
                                    ({ lookup_key }) =>
                                      lookup_key === apparelType
                                  )?.lookup_value;
                                  if (
                                    index !==
                                    preferencesOffered.apparel_preference
                                      .length -
                                      1
                                  ) {
                                    apparelName += ", ";
                                  }
                                  return <Text key={index}>{apparelName}</Text>;
                                }
                              )}
                            </HStack>
                          </FieldLayout>
                        )}

                        {preferencesOffered?.food_preference?.length > 0 && (
                          <FieldLayout label="Food Preference">
                            <HStack>
                              {preferencesOffered.food_preference?.map(
                                (foodType, index) => {
                                  const foodName = foodData?.find(
                                    ({ lookup_key }) => lookup_key === foodType
                                  )?.lookup_value;
                                  if (
                                    index !==
                                    preferencesOffered.food_preference.length -
                                      1
                                  ) {
                                    foodName += ", ";
                                  }
                                  return <Text key={index}>{foodName}</Text>;
                                }
                              )}
                            </HStack>
                          </FieldLayout>
                        )}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                );
              }
            );
          })}
        </Accordion>
      </VStack>
    );
}

export default PageEventAboutSummary;
