import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  VStack,
  useDisclosure,
  Button,
  HStack,
  AlertDialog,
  useToast,
  Text,
  Box,
  Spacer,
  AccordionPanel,
  Link,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useSports } from "../../../hooks/sports-hooks";
import { FieldArray, Form, Formik } from "formik";
import { DeleteIcon, EditIcon } from "../../ui/icons";
import EventSportlistModal from "./event-sportlist-modal";
import { useEventPrize, useUpdateEvent } from "../../../hooks/event-hook";
import { useRouter } from "next/router";
import { HeadingMedium } from "../../ui/heading/heading";
import Tooltip from "../../ui/tooltip";
import { Accordion, AccordionButton, AccordionItem } from "../../ui/accordion";
import { TextSmall } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import DeletePopover from "../../ui/popover/delete-popover";
import IconButton from "../../ui/icon-button";
import { useTeams } from "../../../hooks/team-hooks";
import DeleteSport from "./delete-sports";

function EventSportListView({
  eventData,
  setShowText,
  currentEvent,
  aboutformik,
  type = "public",
}) {
  const [sportMode, setSportMode] = useState("view");
  const [currentIndex, setCurrentIndex] = useState();
  const [currentSport, setCurrentSport] = useState(null);
  const router = useRouter();
  const { eventId } = router.query;
  const { data: sports = [] } = useSports();
  /*  console.log(eventData, "eventdata from list "); */
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isLoading } = useUpdateEvent();
  const toast = useToast();
  const { data: docType = [] } = useLookupTable("EDT");
  const { data: prizeData = [] } = useEventPrize("PRZ");

  const { data: TeamData = [] } = useTeams(
    eventData?.sport_list?.[0]?.tournament_category_id
  );

  return (
    <Formik
      initialValues={{ sports_list: eventData?.sport_list }}
      enableReinitialize={true}
      // validationSchema={SportListAboutModalSchema(yup)}
      onSubmit={(values) => {
        const event_id = eventData.event_id;
        const parent_event_id = eventData.parent_event_id;
        const event_name = eventData.event_name;
        const event_desc = eventData.event_desc;
        const event_status = eventData.event_status;
        const event_rules = eventData.event_rules;
        const event_venue_other = eventData.event_venue_other;
        const virtual_venue_url = eventData.virtual_venue_url;
        const event_category = eventData.event_category_refid;
        const event_startdate = eventData.event_startdate;
        const event_enddate = eventData.event_enddate;
        const event_reg_startdate = eventData.event_reg_startdate;
        const event_reg_lastdate = eventData.event_reg_lastdate;
        const company_id = eventData.company.company_id;
        const max_age = eventData.max_age;
        const min_age = eventData.min_age;

        mutate(
          {
            event_id,
            parent_event_id,
            event_name,
            event_desc,
            event_status,
            event_rules,
            event_venue_other,
            virtual_venue_url,
            event_category,
            event_startdate,
            event_enddate,
            event_reg_startdate,
            event_reg_lastdate,
            company_id,
            sports_list: values.sports_list,
            max_age,
            min_age,
          },
          {
            onSuccess: () =>
              toast({
                title: "Changes Applied",
                status: "success",
                duration: 1000,
                isClosable: true,
              }),
          }
        );
      }}
    >
      {(formik) => (
        <FieldArray
          name="sports_list"
          render={(arrayHelpers) => (
            <VStack alignItems="flex-start" w="full" gap={5}>
              <HStack spacing={4} w="full">
                {/* <Icon as={ContactInfo} w="6" h="6" /> */}
                <HeadingMedium>Sports List</HeadingMedium>
                <Spacer />
                <Button
                  _focus={{ boxShadow: "none" }}
                  colorScheme="primary"
                  variant="outline"
                  onClick={onOpen}
                  // disabled={!formik.values.event_category && true}
                >
                  + Add Sports
                </Button>
              </HStack>
              <Box w="full">
                <Form>
                  {/* {formik.values.sports_list.map((sport, index) => ( */}
                  <Accordion defaultIndex={[0]} allowToggle w="full">
                    {eventData?.sport_list
                      ?.filter((s) => s?.is_delete == "N")
                      ?.map((sport, index) => (
                        <AccordionItem key={sport.tournament_category_id}>
                          <AccordionButton bg="gray.300" py={3} px={4}>
                            {/* <Flex gap={2}> */}
                            <Flex gap={2}>
                              <TextSmall fontWeight="medium">
                                {
                                  sports.find(
                                    (s) => s["sports_id"] == sport["sport_id"]
                                  )?.["sports_name"]
                                }
                              </TextSmall>
                              <Box>{"-"}</Box>
                              <TextSmall fontWeight="medium">
                                {eventData.category_name === "Tournament"
                                  ? sports
                                      .find(
                                        (s) =>
                                          s["sports_id"] == sport["sport_id"]
                                      )
                                      ?.sports_category.find((category) => {
                                        return (
                                          category["category_code"] ==
                                          sport["tournament_category"]
                                        );
                                      })?.category_name
                                  : sport.tournament_category}
                              </TextSmall>
                            </Flex>

                            <Spacer />

                            {/* {console.log(
                              ...formik.values.sports_list,
                              "sport list "
                            )} */}
                            <Flex gap={5}>
                              <DeleteSport
                                arrayHelpers={arrayHelpers}
                                sport={sport}
                                formik={formik}
                                sportindex={index}
                              />

                              <IconButton
                                icon={<EditIcon fontSize="18px" />}
                                cursor="pointer"
                                onClick={() => {
                                  setSportMode("edit");
                                  setCurrentSport(sport);
                                  setCurrentIndex(index);
                                  onOpen();
                                }}
                              ></IconButton>

                              {/* <EditIcon
                                cursor="pointer"
                                onClick={() => {
                                  setSportMode("edit");
                                  setCurrentSport(sport);
                                  setCurrentIndex(index);
                                  onOpen();
                                }}
                              /> */}
                            </Flex>

                            {/* </Flex> */}
                          </AccordionButton>
                          <AccordionPanel p={5}>
                            <VStack
                              alignItems="flex-start"
                              w="full"
                              spacing={5}
                            >
                              {eventData?.category_name === "Tournament" ? (
                                <FieldLayout label="Format">
                                  {
                                    sports
                                      .find(
                                        (s) =>
                                          s["sports_id"] == sport["sport_id"]
                                      )
                                      ?.sports_format.find((category) => {
                                        return (
                                          category["format_code"] ==
                                          sport["tournament_format"]
                                        );
                                      })?.format_name
                                  }
                                </FieldLayout>
                              ) : null}
                              {sport?.reg_fee && (
                                <FieldLayout label="Registration Fees">
                                  {sport.reg_fee} {sport.reg_fee_currency}
                                </FieldLayout>
                              )}

                              <FieldLayout label="Min Age">
                                {sport.min_age}
                              </FieldLayout>
                              <FieldLayout label="Max Age">
                                {sport.max_age}
                              </FieldLayout>
                              {sport.max_male && (
                                <FieldLayout label="Max of Male Player Required ">
                                  {sport.max_male}
                                </FieldLayout>
                              )}

                              {sport.max_female && (
                                <FieldLayout label="Max of Female Player Required  ">
                                  {sport.max_female}
                                </FieldLayout>
                              )}
                              {sport.min_male && (
                                <FieldLayout label="Min of Male Player Required ">
                                  {sport.min_male}
                                </FieldLayout>
                              )}
                              {sport.min_female && (
                                <FieldLayout label="Min of Male Player Required ">
                                  {sport.min_female}
                                </FieldLayout>
                              )}
                              {sport?.minimum_players && (
                                <FieldLayout label="Min Players">
                                  {sport.minimum_players}
                                </FieldLayout>
                              )}
                              {sport.maximum_players && (
                                <FieldLayout label="Max Players">
                                  {sport.maximum_players}
                                </FieldLayout>
                              )}
                              {sport.min_reg_count && (
                                <FieldLayout label="Min Teams">
                                  {sport.min_reg_count}
                                </FieldLayout>
                              )}
                              {sport.max_reg_count && (
                                <FieldLayout label="Max Teams">
                                  {sport.max_reg_count}
                                </FieldLayout>
                              )}
                              {sport.sport_desc && (
                                <FieldLayout label="Description">
                                  <Text
                                    w={{
                                      base: "fit-content",
                                      md: "56",
                                      sm: "56",
                                      lg: "container.md",
                                    }}
                                  >
                                    {sport.sport_desc}
                                  </Text>
                                </FieldLayout>
                              )}
                              {sport?.doc_list?.length > 0 && (
                                <FieldLayout label="Documents">
                                  {Array.isArray(sport?.doc_list)
                                    ? sport?.doc_list?.map((doc, index) => (
                                        <Link
                                          href={doc.url}
                                          color="primary.500"
                                          isExternal
                                          key={index}
                                        >
                                          {
                                            docType?.find(
                                              (document) =>
                                                document["lookup_key"] ===
                                                doc.type
                                            )?.["lookup_value"]
                                          }
                                          - {doc.name}
                                        </Link>
                                      ))
                                    : JSON.parse(sport?.doc_list)?.map(
                                        (doc, index) => (
                                          <Link
                                            href={doc.url}
                                            color="primary.500"
                                            isExternal
                                            key={index}
                                          >
                                            {
                                              docType?.find(
                                                (document) =>
                                                  document["lookup_key"] ===
                                                  doc.type
                                              )?.["lookup_value"]
                                            }
                                            - {doc.name}
                                          </Link>
                                        )
                                      )}
                                </FieldLayout>
                              )}
                              {sport?.tournament_category_prizes?.length >
                                0 && (
                                <FieldLayout label="Prizes">
                                  <HStack>
                                    {sport?.tournament_category_prizes?.map(
                                      (prizeId, index) => {
                                        const categoryName = prizeData?.find(
                                          ({ category_id }) =>
                                            category_id == prizeId
                                        )?.category_name;
                                        return (
                                          <Text key={prizeId}>
                                            {categoryName}
                                            {index !==
                                              sport?.tournament_category_prizes
                                                .length -
                                                1 && ","}
                                          </Text>
                                        );
                                      }
                                    )}
                                  </HStack>
                                </FieldLayout>
                              )}
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </Form>
              </Box>

              <EventSportlistModal
                arrayHelpers={arrayHelpers}
                // onOpen={onOpen}
                onClose={onClose}
                isOpen={isOpen}
                sportMode={sportMode}
                setSportMode={setSportMode}
                currentSport={currentSport}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                eventData={eventData}
                otherFormik={formik}
                docType={docType}
                prizeData={prizeData}
              />
              {/* <Button
                _focus={{ boxShadow: "none" }}
                colorScheme="blue"
                variant="outline"
                onClick={onOpen}
                color="#2F80ED"
              >
                + Add Sports
              </Button> */}
            </VStack>
          )}
        ></FieldArray>
      )}
    </Formik>
  );
}
export default EventSportListView;
