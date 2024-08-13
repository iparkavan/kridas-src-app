import { useEventById } from "../../../hooks/event-hook";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";

import { TextMedium, TextSmall, TextXtraSmall } from "../../ui/text/text";
import format from "date-fns/format";

import LabelValuePair from "../../ui/label-value-pair";
import { useCountries } from "../../../hooks/country-hooks";
import CustomFormLabel from "../../ui/form/form-label";
import { HeadingMedium } from "../../ui/heading/heading";
import { BellIcon } from "../../ui/icons";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { feedOptions } from "../../../helper/constants/feed-constants";

function PageEventAboutView(props) {
  const { currentEvent, type, setShowText, eventData } = props;
  // const router = useRouter();
  // const { eventId } = router.query;
  const { data: countriesData = [] } = useCountries();
  // const { data: eventData = {} } = useEventById(eventId);
  const formatDate = (date) => format(new Date(date), "dd-MMM-yyyy  h:mm aa");
  // const formatRegDate = (date) => format(new Date(date), "dd-MMM-yyyy");

  // const formatTime = (date) => format(new Date(date), " h:mm aa");
  // let address = eventData?.event_venue_other;

  let eventDescHtml;
  let isDescHtml = true;
  try {
    const contentState = convertFromRaw(JSON.parse(eventData["event_desc"]));
    eventDescHtml = stateToHTML(contentState, feedOptions);
  } catch (e) {
    isDescHtml = false;
  }

  let eventRulesHtml;
  let isRulesHtml = true;
  try {
    const contentState = convertFromRaw(JSON.parse(eventData["event_rules"]));
    eventRulesHtml = stateToHTML(contentState, feedOptions);
  } catch (e) {
    isRulesHtml = false;
  }

  return (
    <>
      {/* {type === "private" && (
        <ButtonGroup ml={4} variant="outline" spacing="5">
          <Button
            variant="outline"
            colorScheme="primary"
            borderRadius={4}
            onClick={() => setShowText(true)}
          >
            Edit
          </Button>
        </ButtonGroup>
      )} */}

      <VStack alignItems="flex-start" w="full" gap={3}>
        <HStack spacing={4} mt={type === "public" && 3}>
          <HeadingMedium>
            <b>About this Event</b>
          </HeadingMedium>
        </HStack>

        <LabelValuePair label="Event Name">
          {eventData["event_name"]}
        </LabelValuePair>

        <LabelValuePair label="Event Category">
          {eventData["category_name"]}
        </LabelValuePair>

        {/* <LabelValuePair label="Date of the Event" /> */}
        <HStack gap={8}>
          <VStack>
            <LabelValuePair label="From">
              {eventData["event_startdate"] &&
                formatDate(eventData["event_startdate"])}
            </LabelValuePair>
          </VStack>
          <VStack>
            <LabelValuePair label="To">
              {eventData["event_enddate"] &&
                formatDate(eventData["event_enddate"])}
            </LabelValuePair>
          </VStack>
        </HStack>

        {eventData["event_reg_startdate"] && (
          <HStack gap={6}>
            <VStack>
              <LabelValuePair label="Registration Start Date">
                {eventData["event_reg_startdate"] &&
                  formatDate(eventData["event_reg_startdate"])}
              </LabelValuePair>
            </VStack>
            <VStack>
              <LabelValuePair label="Registration End Date">
                {eventData["event_reg_lastdate"] &&
                  formatDate(eventData["event_reg_lastdate"])}
              </LabelValuePair>
            </VStack>
          </HStack>
        )}

        {/* <HStack gap={10}>
          <VStack>
            <LabelValuePair label="Start Time">
              {eventData["event_startdate"] &&
                formatTime(eventData["event_startdate"])}
            </LabelValuePair>
          </VStack>
          <VStack>
            <LabelValuePair label="End Time">
              {eventData["event_enddate"] &&
                formatTime(eventData["event_enddate"])}
            </LabelValuePair>
          </VStack>
        </HStack> */}
        <VStack align="self-start">
          {/* {eventData?.event_venue_other && (
            <CustomFormLabel>Venue Address</CustomFormLabel>
          )} */}

          {eventData["event_venue_other"] === null ||
          eventData["event_venue_other"]?.["line1"] === "" ? null : (
            <VStack align="self-start">
              <LabelValuePair label="Address">
                {eventData["event_venue_other"]?.["line1"]}
                <br />
                {eventData["event_venue_other"]?.["line2"]}
                <br />
                <Flex gap={1}>
                  <TextSmall>
                    {eventData["event_venue_other"]?.["city"]}
                    {","}
                  </TextSmall>
                  <TextSmall>
                    {
                      countriesData
                        ?.find(
                          (c) =>
                            c["country_code"] ==
                            eventData["event_venue_other"]?.["country"]
                        )
                        ?.country_states?.find(
                          (s) =>
                            s["state_code"] ==
                            eventData["event_venue_other"]?.["state"]
                        )?.["state_name"]
                    }
                    {","}
                  </TextSmall>
                  <TextSmall>
                    {
                      countriesData?.find(
                        (c) =>
                          c["country_code"] ==
                          eventData["event_venue_other"]?.["country"]
                      )?.["country_name"]
                    }
                    {"-"}
                  </TextSmall>
                  <TextSmall>
                    {eventData["event_venue_other"]?.["pincode"]}
                  </TextSmall>
                </Flex>
              </LabelValuePair>
            </VStack>
          )}

          {/* {address?.line2 && (
                <LabelValuePair label="Address Line 2">
                  {address?.line2}
                </LabelValuePair>
              )}

              {address.pincode && (
                <LabelValuePair label="Pincode">
                  {address?.pincode}
                </LabelValuePair>
              )}

              {address?.country && (
                <LabelValuePair label="Country">
                  {
                    countriesData.find(
                      (c) => c["country_code"] == address?.country
                    )?.["country_name"]
                  }
                </LabelValuePair>
              )}

              {address?.state && (
                <LabelValuePair label="State">
                  {
                    countriesData
                      .find((c) => c["country_code"] == address?.country)
                      ?.country_states?.find(
                        (s) => s["state_code"] == address?.state
                      )?.["state_name"]
                  }
                </LabelValuePair>
              )}
              {address?.city && (
                <LabelValuePair label="City / Town">
                  {address?.city}
                </LabelValuePair>
              )} */}

          {eventData?.virtual_venue_url ? (
            <VStack align="self-start">
              <LabelValuePair label="Virtual URL">
                <Box w="full" wordBreak="break-word">
                  {eventData["virtual_venue_url"]}
                </Box>
              </LabelValuePair>
            </VStack>
          ) : null}
        </VStack>

        <VStack align="self-start">
          <LabelValuePair label="Description">
            {isDescHtml ? (
              <Box dangerouslySetInnerHTML={{ __html: eventDescHtml }} />
            ) : (
              eventData["event_desc"]
            )}
          </LabelValuePair>
        </VStack>
        <VStack align="self-start">
          <LabelValuePair label="Terms and Conditions">
            {isRulesHtml ? (
              <Box dangerouslySetInnerHTML={{ __html: eventRulesHtml }} />
            ) : (
              eventData["event_rules"]
            )}
          </LabelValuePair>
        </VStack>
      </VStack>
    </>
  );
}

export default PageEventAboutView;
