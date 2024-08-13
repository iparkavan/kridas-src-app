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
  Divider,
  AccordionPanel,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useSports } from "../../../hooks/sports-hooks";
import { FieldArray, Form, Formik } from "formik";
import { DeleteIcon, EditIcon } from "../../ui/icons";
import EventSportlistModal from "./event-sportlist-modal";
import { useEventPrize, useUpdateEvent } from "../../../hooks/event-hook";
import { useRouter } from "next/router";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import { Accordion, AccordionButton, AccordionItem } from "../../ui/accordion";
import { TextSmall } from "../../ui/text/text";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";

function EventSportListViewOnly({
  eventData,
  setShowText,
  currentEvent,
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
  const { data: prizeData = [] } = useEventPrize("PRZ");
  const toast = useToast();
  const { data: docType = [] } = useLookupTable("EDT");

  return (
    <VStack alignItems="flex-start" width="full" spacing={6}>
      <Divider borderColor="gray.300" mx={-6} px={6} />
      <HeadingSmall textTransform="uppercase">Sports List</HeadingSmall>
      <Accordion defaultIndex={[0]} allowToggle w="full">
        {eventData?.sport_list?.map((sport, index) => (
          <AccordionItem key={sport["sport_id"]}>
            <AccordionButton>
              <Flex gap={2}>
                <TextSmall fontWeight="medium">
                  {
                    sports.find((s) => s["sports_id"] == sport["sport_id"])?.[
                      "sports_name"
                    ]
                  }
                </TextSmall>
                {"-"}
                <TextSmall fontWeight="medium">
                  {eventData.category_name === "Tournament"
                    ? sports
                        .find((s) => s["sports_id"] == sport["sport_id"])
                        ?.sports_category.find((category) => {
                          return (
                            category["category_code"] ==
                            sport["tournament_category"]
                          );
                        })?.category_name
                    : sport.tournament_category}
                </TextSmall>
              </Flex>
            </AccordionButton>
            <AccordionPanel p={5}>
              <VStack alignItems="flex-start" w="full" spacing={5}>
                {/* <FieldLayout label="Category">
                  {eventData.category_name === "Tournament"
                    ? sports
                        .find((s) => s["sports_id"] == sport["sport_id"])
                        ?.sports_category.find((category) => {
                          return (
                            category["category_code"] ==
                            sport["tournament_category"]
                          );
                        })?.category_name
                    : sport.tournament_category}
                </FieldLayout> */}
                {eventData?.category_name === "Tournament" ? (
                  <FieldLayout label="Format">
                    {
                      sports
                        .find((s) => s["sports_id"] == sport["sport_id"])
                        ?.sports_format.find((category) => {
                          return (
                            category["format_code"] ==
                            sport["tournament_format"]
                          );
                        })?.format_name
                    }
                  </FieldLayout>
                ) : null}
                {sport.reg_fee && (
                  <FieldLayout label="Registration Fees">
                    {sport.reg_fee} {sport.reg_fee_currency}
                  </FieldLayout>
                )}

                {/* <FieldLayout label="Rewards">
                  {
                    sports.find(
                      (s) =>
                        s["category_id"] == sport["tournament_category_prizes"]
                    )?.["category_name"]
                  }
                </FieldLayout> */}
                <FieldLayout label="Min Age">{sport.min_age}</FieldLayout>
                <FieldLayout label="Max Age">{sport.max_age}</FieldLayout>
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
                                  document["lookup_key"] === doc.type
                              )?.["lookup_value"]
                            }
                            - {doc.name}
                          </Link>
                        ))
                      : JSON.parse(sport?.doc_list)?.map((doc, index) => (
                          <Link
                            href={doc.url}
                            color="primary.500"
                            isExternal
                            key={index}
                          >
                            {
                              docType?.find(
                                (document) =>
                                  document["lookup_key"] === doc.type
                              )?.["lookup_value"]
                            }
                            - {doc.name}
                          </Link>
                        ))}
                  </FieldLayout>
                )}
                {sport?.tournament_category_prizes?.length > 0 && (
                  <FieldLayout label="Prizes">
                    <HStack>
                      {sport?.tournament_category_prizes?.map(
                        (prizeId, index) => {
                          const categoryName = prizeData?.find(
                            ({ category_id }) => category_id == prizeId
                          )?.category_name;
                          return (
                            <Text key={prizeId}>
                              {categoryName}
                              {index !==
                                sport?.tournament_category_prizes.length - 1 &&
                                ","}
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
    </VStack>
  );
}
export default EventSportListViewOnly;
