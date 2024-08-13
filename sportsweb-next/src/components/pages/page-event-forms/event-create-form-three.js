import {
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Link,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Skeleton,
  Spacer,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { FieldArray, Form, Formik } from "formik";
import clone from "just-clone";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { useQueries } from "react-query";
import {
  processForSending,
  removeCategory,
  updateProductsForEvent,
} from "../../../helper/constants/event-constants";
import { feedOptions } from "../../../helper/constants/feed-constants";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import {
  useCountries,
  useCountryByISOCode,
} from "../../../hooks/country-hooks";
import {
  useEventByIdNew,
  useEventPrize,
  useUpdateTournament,
} from "../../../hooks/event-hook";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import { useSports } from "../../../hooks/sports-hooks";
import { useUser } from "../../../hooks/user-hooks";
import pageService from "../../../services/page-service";
import { Accordion, AccordionButton, AccordionItem } from "../../ui/accordion";
import Button from "../../ui/button";
import IconButton from "../../ui/icon-button";
import { DeleteIcon, EditIcon } from "../../ui/icons";
import DeletePopover from "../../ui/popover/delete-popover";
import { TextSmall } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import PageEventSportsSelect from "../page-event/page-event-sports-select";
import DescModal from "./desc-modal";
import RulesModal from "./rules-modal";
import EventIndemnityModal from "../page-event-about/event-indemnity-modal";
import {
  useAddProduct,
  useProductByIdMutation,
  useSearchProductsMutation,
  useUpdateProduct,
} from "../../../hooks/product-hooks";
import { useLocation } from "../../../hooks/location-hooks";

function EventCreateFormThree({
  eventLoading,
  nextStep,
  prevStep,
  activeStep,
  steps,
  eventid,
  isTypeEdit,
  apparelData,
  foodData,
}) {
  const router = useRouter();
  const { data: userData } = useUser();
  const toast = useToast();
  const {
    data: eventData,
    isLoading,
    refetch: refetchEventData,
  } = useEventByIdNew(eventid);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: sports = [] } = useSports();
  const [sportMode, setSportMode] = useState("view");
  const [tournament, setTournament] = useState();
  const [tournamentCategory, setTournamentCategory] = useState();
  const { data: docType = [] } = useLookupTable("EDC");
  const { data: prizeData = [] } = useEventPrize("PRZ");
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });
  const { mutate: sportsMutate, isLoading: sportsLoading } =
    useUpdateTournament();
  const { data: participantCategories = [] } = useCategoriesByType("PRC");
  const formatDate = (date) => format(new Date(date), "dd-MM-yyyy");
  const { data: countriesData = [] } = useCountries();
  const { mutateAsync: addProductMutateAsync } = useAddProduct();
  const { mutateAsync: updateProductMutateAsync } = useUpdateProduct();
  const { mutateAsync: searchProductsMutateAsync } =
    useSearchProductsMutation();
  const { mutateAsync: getProductMutateAsync } = useProductByIdMutation();

  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);

  const pages = useQueries(
    eventData?.eventVenue
      ? eventData.eventVenue.map((pageId) => ({
          queryKey: ["page", pageId],
          queryFn: () => pageService.getPage(pageId),
        }))
      : []
  );

  const pageOptions =
    pages.map((page) => ({
      value: page.data?.company_id,
      label: page.data?.company_name,
    })) || [];

  // const pageAddress =
  //   pages.map((page) => ({
  //     company_id: page.data.company_id,
  //   })) || [];

  if (isLoading) return <Skeleton>Loading..</Skeleton>;
  // else if (!eventData) return null;
  else
    return (
      <Formik
        initialValues={{
          tournamentData: eventData?.tournaments
            ? clone(eventData.tournaments)
            : [],
          tournaments: eventData?.tournaments || [],
          saveAndProceed: true,
        }}
        // enableReinitialize={eventData ? false : true}
        enableReinitialize={false}
        onSubmit={({ saveAndProceed, ...values }) => {
          let updatedTournaments = clone(values.tournamentData);

          if (eventData?.tournaments) {
            updatedTournaments = processForSending(
              eventData.tournaments,
              updatedTournaments
            );
          }

          updatedTournaments.forEach((tournament) => {
            tournament?.tournamentCategories.forEach((tournamentCategory) => {
              if (typeof tournamentCategory.tournamentConfig === "string") {
                tournamentCategory.tournamentConfig = JSON.parse(
                  tournamentCategory.tournamentConfig
                );
              }
              if (typeof tournamentCategory.preferencesOffered === "string") {
                tournamentCategory.preferencesOffered = JSON.parse(
                  tournamentCategory.preferencesOffered
                );
              }
              if (
                tournamentCategory.preferencesOffered?.apparel_preference
                  ?.length === 0 &&
                tournamentCategory.preferencesOffered?.food_preference
                  ?.length === 0
              ) {
                tournamentCategory.preferencesOffered = null;
              }
              if (
                typeof tournamentCategory.tournamentPointConfig === "string"
              ) {
                tournamentCategory.tournamentPointConfig = JSON.parse(
                  tournamentCategory.tournamentPointConfig
                );
              }
            });
          });

          sportsMutate(
            {
              eventId: eventid,
              tournaments: updatedTournaments,
              userId: userData?.user_id,
            },
            {
              onSuccess: async () => {
                const { data: newEventData } = await refetchEventData();
                const isPaymentOnline = newEventData.collectPymtOnline === "Y";
                if (newEventData.eventStatus === "PUB") {
                  try {
                    await updateProductsForEvent(
                      searchProductsMutateAsync,
                      addProductMutateAsync,
                      updateProductMutateAsync,
                      getProductMutateAsync,
                      newEventData.tournaments,
                      newEventData.eventName,
                      userData?.user_id,
                      newEventData?.eventOrganizers?.[0]?.companyId,
                      sports,
                      countryData,
                      isPaymentOnline,
                      toast
                    );
                  } catch (e) {
                    console.log(e);
                    return;
                  }
                }

                // toast({
                //   title: `Your event has been added Sucessfully`,
                //   position: "top",
                //   status: "success",
                //   duration: 3000,
                //   isClosable: true,
                // });
                if (saveAndProceed) {
                  nextStep();
                } else {
                  router.back();
                }
              },
            }
          );
        }}
      >
        {(formik) => (
          <Form>
            <VStack
              p={{ base: "2", md: "2", lg: "5" }}
              bg="white"
              gap={5}
              mt={30}
            >
              <Box w="full">
                <Button
                  _focus={{ boxShadow: "none" }}
                  colorScheme="primary"
                  variant="outline"
                  onClick={onOpen}
                  isLoading={sportsLoading}
                  // disabled={!formik.values.event_category && true}
                >
                  + Add Sports
                </Button>
              </Box>
              <Box w="full">
                <FieldArray
                  name="tournaments"
                  render={(arrayHelpers) => (
                    <>
                      <Accordion
                        defaultIndex={[0]}
                        // defaultIndex={index == 0 ? 0 : null}
                        // key={index}
                        allowToggle
                        w="full"
                      >
                        {formik.values.tournamentData.map((tournament) => {
                          const sport = sports.find(
                            (s) => s["sports_id"] == tournament["sportsRefid"]
                          );
                          return tournament.tournamentCategories.map(
                            (tournamentCategory, index) => {
                              const categoryName = sport?.sports_category.find(
                                (cat) =>
                                  cat.category_code ===
                                  tournamentCategory.tournamentCategory
                              )?.category_name;
                              const formatName = sport?.sports_format.find(
                                (format) =>
                                  format.format_code ===
                                  tournamentCategory.tournamentFormat
                              )?.format_name;

                              // const categoryDescContentState =
                              //   typeof tournamentCategory?.tournamentCategoryDesc ===
                              //   "object"
                              //     ? convertFromRaw(
                              //         JSON.parse(
                              //           tournamentCategory?.tournamentCategoryDesc
                              //         )
                              //       )
                              //     : tournamentCategory?.tournamentCategoryDesc;

                              // const tournamentCategoryDescHtml = stateToHTML(
                              //   categoryDescContentState.getCurrentContent(),
                              //   feedOptions
                              // );

                              // const playingConditionsContentState =
                              //   typeof tournamentCategory.standardPlayingConditions ===
                              //   "object"
                              //     ? convertFromRaw(
                              //         JSON.parse(
                              //           tournamentCategory?.standardPlayingConditions
                              //         )
                              //       )
                              //     : tournamentCategory?.standardPlayingConditions;

                              // convertFromRaw(
                              //   JSON.parse(
                              //     tournamentCategory?.standardPlayingConditions
                              //   )
                              // );

                              // const playingConditionsHtml = stateToHTML(
                              //   playingConditionsContentState.getCurrentContent(),
                              //   feedOptions
                              // );
                              const categoryDescContentState =
                                tournamentCategory?.tournamentCategoryDesc
                                  ? convertFromRaw(
                                      JSON.parse(
                                        tournamentCategory.tournamentCategoryDesc
                                      )
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

                              const tournamentCategoryDescHtml = stateToHTML(
                                categoryDescContentState,
                                feedOptions
                              );

                              const playingConditionsContentState =
                                tournamentCategory?.standardPlayingConditions
                                  ? convertFromRaw(
                                      JSON.parse(
                                        tournamentCategory.standardPlayingConditions
                                      )
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

                              const indemnityClauseContentState =
                                convertFromRaw(
                                  JSON.parse(tournamentCategory.indemnityClause)
                                );
                              const indemnityClauseHtml = stateToHTML(
                                indemnityClauseContentState,
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
                              const tournamentConfig =
                                typeof tournamentCategory.tournamentConfig ===
                                "object"
                                  ? tournamentCategory.tournamentConfig
                                  : JSON.parse(
                                      tournamentCategory.tournamentConfig
                                    );

                              const preferencesOffered =
                                typeof tournamentCategory.preferencesOffered ===
                                "object"
                                  ? tournamentCategory.preferencesOffered
                                  : JSON.parse(
                                      tournamentCategory.preferencesOffered
                                    );

                              const tournamentCategoryName =
                                tournamentCategory.tournamentCategoryName ||
                                `${sport?.sports_name} - ${categoryName} (${
                                  tournamentConfig.age_criteria?.criteria_by
                                }${
                                  tournamentConfig.age_criteria?.age_value &&
                                  ` ${tournamentConfig.age_criteria.age_value}`
                                })`;

                              return (
                                <AccordionItem
                                  key={`${sport?.sports_id} ${tournamentCategory.tournamentCategory}`}
                                >
                                  <AccordionButton bg="gray.300" py={3} px={4}>
                                    <Flex>
                                      <TextSmall fontWeight="medium">
                                        {tournamentCategoryName}
                                        {/* {sport?.["sports_name"]} -{" "}
                                        {categoryName} (
                                        {
                                          tournamentConfig.age_criteria
                                            ?.criteria_by
                                        }
                                        {tournamentConfig.age_criteria
                                          ?.age_value &&
                                          ` ${tournamentConfig.age_criteria.age_value}`}
                                        ) */}
                                      </TextSmall>
                                    </Flex>
                                    <Spacer />
                                    <Flex gap={5}>
                                      <DeletePopover
                                        title={
                                          <TextSmall color="black">
                                            Delete Sport
                                          </TextSmall>
                                        }
                                        trigger={
                                          <IconButton
                                            size={iconButtonSize}
                                            icon={
                                              <DeleteIcon fontSize="18px" />
                                            }
                                            // colorScheme="primary"
                                            // tooltipLabel="Delete Sport"
                                          />
                                        }
                                        handleDelete={
                                          () => {
                                            const categoriesList =
                                              removeCategory(
                                                sport.sports_id,
                                                tournamentCategory.tournamentCategory,
                                                formik.values.tournamentData
                                              );

                                            formik.setFieldValue(
                                              "tournamentData",
                                              categoriesList
                                            );
                                          }
                                          //    {
                                          //   arrayHelpers.replace(index, {
                                          //     ...formik.values.sports_list[
                                          //       index
                                          //     ],
                                          //     is_delete: "Y",
                                          //   }
                                          //   );
                                          // }
                                        }
                                      >
                                        <TextSmall color="black">
                                          Are you sure you want to delete this
                                          sport?
                                        </TextSmall>
                                      </DeletePopover>
                                    </Flex>
                                    <IconButton
                                      icon={<EditIcon fontSize="18px" />}
                                      cursor="pointer"
                                      onClick={() => {
                                        setSportMode("edit");
                                        setTournament(tournament);
                                        setTournamentCategory(
                                          tournamentCategory
                                        );
                                        onOpen();
                                      }}
                                    ></IconButton>
                                  </AccordionButton>
                                  <AccordionPanel>
                                    <VStack
                                      alignItems="flex-start"
                                      w="full"
                                      spacing={5}
                                    >
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
                                      {tournamentCategory?.tournamentSubCategory
                                        ?.length > 0 && (
                                        <FieldLayout label="Sub-Category">
                                          <Text>
                                            {tournamentCategory?.tournamentSubCategory?.map(
                                              (subCatCode, index) => {
                                                const categoryName =
                                                  sport?.sports_category.find(
                                                    (category) =>
                                                      category.category_code ==
                                                      subCatCode
                                                  )?.category_name;
                                                return (
                                                  <Fragment key={subCatCode}>
                                                    {categoryName}
                                                    {index !==
                                                      tournamentCategory
                                                        .tournamentSubCategory
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
                                        <FieldLayout label="Format">
                                          {formatName}
                                        </FieldLayout>
                                      )}
                                      {tournamentConfig.age_criteria
                                        .criteria_by && (
                                        <FieldLayout label="Age Criteria">
                                          {
                                            tournamentConfig.age_criteria
                                              .criteria_by
                                          }
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
                                      {tournamentConfig.age_criteria
                                        .age_value && (
                                        <FieldLayout label="Age Value">
                                          {
                                            tournamentConfig.age_criteria
                                              .age_value
                                          }
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
                                      {tournamentConfig.age_criteria
                                        .age_from && (
                                        <FieldLayout label="From Age">
                                          {formatDate(
                                            tournamentConfig.age_criteria
                                              .age_from
                                          )}
                                        </FieldLayout>
                                      )}
                                      {tournamentConfig.age_criteria.age_to && (
                                        <FieldLayout label="To Age">
                                          {formatDate(
                                            tournamentConfig.age_criteria.age_to
                                          )}
                                        </FieldLayout>
                                      )}

                                      <Box w="full">
                                        <SimpleGrid
                                          column={2}
                                          spacing={5}
                                          w="full"
                                        >
                                          {tournamentConfig.participant_criteria
                                            .min_registrations && (
                                            <FieldLayout label="Overall Min Players or Teams">
                                              {
                                                tournamentConfig
                                                  .participant_criteria
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
                                                tournamentConfig
                                                  .participant_criteria
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
                                      {tournamentConfig.team_criteria
                                        .max_participation && (
                                        // <FieldLayout label="Player can play maximum partcipations in a round/game">
                                        <FieldLayout
                                          label={
                                            <Text>
                                              Player can play maximum
                                              partcipations <br /> in a
                                              round/game
                                            </Text>
                                          }
                                        >
                                          {
                                            tournamentConfig.team_criteria
                                              .max_participation
                                          }
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
                                      {tournamentCategory
                                        ?.tournamentCategoryPrizes?.length >
                                        0 && (
                                        <FieldLayout label="Prizes">
                                          <HStack>
                                            {tournamentCategory?.tournamentCategoryPrizes?.map(
                                              (prizeId, index) => {
                                                const categoryName =
                                                  prizeData?.find(
                                                    ({ category_id }) =>
                                                      category_id == prizeId
                                                  )?.category_name;
                                                return (
                                                  <Text key={prizeId}>
                                                    {categoryName}
                                                    {index !==
                                                      tournamentCategory
                                                        .tournamentCategoryPrizes
                                                        .length -
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
                                        {/* <Button
                                          colorScheme="blue"
                                          variant="link"
                                          onClick={decOnOpen}
                                        >
                                          Sports Description
                                        </Button> */}
                                        {/* <Modal
                                          title="Descripton"
                                          isOpen={decIsOpen}
                                          onClose={decOnClose}
                                        >
                                          <ModalBody>
                                            <Box
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  tournamentCategoryDescHtml,
                                              }}
                                            />
                                          </ModalBody>
                                        </Modal> */}
                                        <DescModal
                                          tournamentCategoryDescHtml={
                                            tournamentCategoryDescHtml
                                          }

                                          // decOnOpen={decOnOpen}
                                          // decOnClose={decOnClose}
                                          // decIsOpen={decIsOpen}
                                        />
                                      </FieldLayout>
                                      <FieldLayout label="Playing Conditions">
                                        {/* <Text>
                                          {
                                            tournamentCategory.standardPlayingConditions
                                          }
                                        </Text> */}
                                        {/* <Button
                                          colorScheme="blue"
                                          variant="link"
                                          onClick={ruleOnOpen}
                                        >
                                          Playing Conditions
                                        </Button>
                                        <Modal
                                          title="Playing Conditions"
                                          isOpen={ruleIsOpen}
                                          onClose={ruleOnClose}
                                        >
                                          <ModalBody>
                                            <Box
                                              dangerouslySetInnerHTML={{
                                                __html: playingConditionsHtml,
                                              }}
                                            />
                                          </ModalBody>
                                        </Modal> */}
                                        <RulesModal
                                          playingConditionsHtml={
                                            playingConditionsHtml
                                          }
                                        />
                                      </FieldLayout>
                                      {tournamentCategory?.indemnityClause && (
                                        <FieldLayout label="Indemnity Clause">
                                          <EventIndemnityModal
                                            indemnityClauseHtml={
                                              indemnityClauseHtml
                                            }
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

                                      {preferencesOffered?.apparel_preference
                                        ?.length > 0 && (
                                        <FieldLayout label="Apparel Preference">
                                          <HStack>
                                            {preferencesOffered.apparel_preference?.map(
                                              (apparelType, index) => {
                                                let apparelName =
                                                  apparelData?.find(
                                                    ({ lookup_key }) =>
                                                      lookup_key === apparelType
                                                  )?.lookup_value;
                                                if (
                                                  index !==
                                                  preferencesOffered
                                                    .apparel_preference.length -
                                                    1
                                                ) {
                                                  apparelName += ", ";
                                                }
                                                return (
                                                  <Text key={index}>
                                                    {apparelName}
                                                  </Text>
                                                );
                                              }
                                            )}
                                          </HStack>
                                        </FieldLayout>
                                      )}

                                      {preferencesOffered?.food_preference
                                        ?.length > 0 && (
                                        <FieldLayout label="Food Preference">
                                          <HStack>
                                            {preferencesOffered.food_preference?.map(
                                              (foodType, index) => {
                                                const foodName = foodData?.find(
                                                  ({ lookup_key }) =>
                                                    lookup_key === foodType
                                                )?.lookup_value;
                                                if (
                                                  index !==
                                                  preferencesOffered
                                                    .food_preference.length -
                                                    1
                                                ) {
                                                  foodName += ", ";
                                                }
                                                return (
                                                  <Text key={index}>
                                                    {foodName}
                                                  </Text>
                                                );
                                              }
                                            )}
                                          </HStack>
                                        </FieldLayout>
                                      )}

                                      {eventData?.eventVenue.length > 0 && (
                                        <FieldLayout label="Event Venue">
                                          <SimpleGrid
                                            columns={2}
                                            spacingX={16}
                                            spacingY={5}
                                          >
                                            {tournamentCategory?.tournamentCategoryVenue.map(
                                              (venueId, index) => {
                                                const page = pages.find(
                                                  (option) =>
                                                    option.data?.company_id ===
                                                    venueId
                                                );
                                                return (
                                                  <>
                                                    <HStack
                                                      align="flex-start"
                                                      key={index}
                                                    >
                                                      <Text>{index + 1}. </Text>
                                                      <Box>
                                                        <Text>
                                                          {
                                                            page?.data
                                                              ?.company_name
                                                          }
                                                        </Text>
                                                        {page?.data?.address
                                                          ?.url && (
                                                          <Text>
                                                            {
                                                              page.data.address
                                                                .url
                                                            }
                                                          </Text>
                                                        )}
                                                        {page?.data?.address
                                                          ?.line1 && (
                                                          <Text>
                                                            {
                                                              page.data.address
                                                                .line1
                                                            }
                                                          </Text>
                                                        )}
                                                        {page?.data?.address
                                                          ?.line2 && (
                                                          <Text>
                                                            {
                                                              page.data.address
                                                                .line2
                                                            }
                                                          </Text>
                                                        )}
                                                        <Text>
                                                          {page?.data?.address
                                                            ?.city &&
                                                            `${page.data.address.city}, `}
                                                          {page?.data?.address
                                                            ?.country &&
                                                            `${
                                                              countriesData
                                                                ?.find(
                                                                  (c) =>
                                                                    c[
                                                                      "country_code"
                                                                    ] ==
                                                                    page?.data
                                                                      ?.address
                                                                      ?.country
                                                                )
                                                                ?.country_states?.find(
                                                                  (s) =>
                                                                    s[
                                                                      "state_code"
                                                                    ] ==
                                                                    page?.data
                                                                      ?.address
                                                                      ?.state
                                                                )?.[
                                                                "state_name"
                                                              ]
                                                            }, `}
                                                          {
                                                            countriesData?.find(
                                                              (c) =>
                                                                c[
                                                                  "country_code"
                                                                ] ==
                                                                page?.data
                                                                  ?.address
                                                                  ?.country
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
                                        </FieldLayout>
                                      )}
                                    </VStack>
                                  </AccordionPanel>
                                </AccordionItem>
                              );
                            }
                          );
                        })}
                        <PageEventSportsSelect
                          eventid={eventid}
                          // MainCategories={MainCategories}
                          // arrayHelpers={arrayHelpers}
                          // onOpen={onOpen}
                          onClose={onClose}
                          isOpen={isOpen}
                          sportMode={sportMode}
                          setSportMode={setSportMode}
                          tournament={tournament}
                          tournamentCategory={tournamentCategory}
                          formik={formik}
                          docType={docType}
                          prizeData={prizeData}
                          eventData={eventData}
                          apparelData={apparelData}
                          foodData={foodData}
                          // index={index}
                          pageOptions={pageOptions}
                        />
                      </Accordion>
                    </>
                  )}
                ></FieldArray>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  w="full"
                  justify="flex-start"
                  gap={{ base: "5", md: "2", sm: "1", lg: "5" }}
                  pt={5}
                >
                  <Button
                    isDisabled={activeStep === 0}
                    mr={4}
                    onClick={prevStep}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Spacer />
                  <Button
                    colorScheme="primary"
                    type="submit"
                    isLoading={sportsLoading}
                  >
                    Save & Proceed
                  </Button>
                  {!isTypeEdit && (
                    <Button
                      colorScheme="primary"
                      // onClick={() => {
                      //   formik.setFieldValue("eventStatus", "DRT");
                      //   setStatus("DRT");
                      // }}
                      // type="submit"
                      onClick={() => {
                        formik.setFieldValue("saveAndProceed", false);
                        formik.handleSubmit();
                      }}
                      isLoading={sportsLoading}
                    >
                      Save as Draft
                    </Button>
                  )}

                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  {eventData?.tournaments?.length > 0 && (
                    <Button variant="outline" onClick={nextStep}>
                      Next
                    </Button>
                  )}
                </Flex>
              </Box>
            </VStack>
          </Form>
        )}
      </Formik>
    );
}
export default EventCreateFormThree;
