import {
  Box,
  Avatar,
  LinkOverlay,
  LinkBox,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";

import { HeadingSmall } from "../../ui/heading/heading";
import { Router, useRouter } from "next/router";
import { TextSmall, TextXtraSmall } from "../../ui/text/text";
import { differenceInCalendarDays, format, formatDistance } from "date-fns";
import { useSports } from "../../../hooks/sports-hooks";
import EventInterest from "./event-interest";

import NextLink from "next/link";

import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useCountries } from "../../../hooks/country-hooks";

function PageEventCard({ eventData }) {
  const router = useRouter();
  const { data: countriesData = [] } = useCountries();
  const Address = JSON.parse(eventData.eventAddress);

  const diffInDays =
    differenceInCalendarDays(
      new Date(eventData.eventEnddate),
      new Date(eventData.eventStartdate)
    ) + 1;
  const { data: categories } = useCategoriesByType("EVT");

  return (
    <Box
      border={{ base: "1px", md: "none" }}
      borderColor="gray.300"
      borderRadius="md"
      w="full"
      p={{ base: 3, md: 5 }}
    >
      <Grid
        templateColumns={{ lg: "repeat(6, 1fr)" }}
        gap={2}
        alignItems="center"
      >
        <LinkBox>
          <NextLink href={`/events/${eventData.eventId}`} passHref>
            <LinkOverlay>
              <GridItem>
                <Avatar
                  size="lg"
                  src={
                    eventData.eventLogo
                      ? eventData.eventLogo
                      : "/images/no-banner-image-page.jpg"
                  }
                />
              </GridItem>
            </LinkOverlay>
          </NextLink>
        </LinkBox>
        <GridItem colSpan={4}>
          <LinkBox>
            <NextLink href={`/events/${eventData.eventId}`} passHref>
              <LinkOverlay>
                <VStack align="flex-start" spacing={1}>
                  <HeadingSmall
                    wordBreak="break-word"
                    textOverflow="ellipsis"
                    maxWidth={"95%"}
                    isTruncated
                  >
                    {eventData.eventName}
                  </HeadingSmall>
                  <TextSmall color="primary.500" fontWeight="500" noOfLines={1}>
                    {
                      categories?.find(
                        (a) => a.category_id === eventData.eventCategoryId
                      ).category_name
                    }
                  </TextSmall>
                  <TextSmall
                    color="primary.500"
                    fontWeight="500"
                    maxWidth="95%"
                    isTruncated
                  >
                    {eventData.sportsList.join(", ")}
                  </TextSmall>
                  <TextXtraSmall fontWeight="200">
                    {Address?.city}{" "}
                    {
                      countriesData
                        ?.find((c) => c["country_code"] == Address?.country)
                        ?.country_states?.find(
                          (s) => s["state_code"] == Address?.state
                        )?.["state_name"]
                    }{" "}
                    {
                      countriesData?.find(
                        (c) => c["country_code"] == Address?.country
                      )?.["country_name"]
                    }
                  </TextXtraSmall>
                  <TextXtraSmall color="gray.500">
                    {" "}
                    {format(new Date(eventData?.eventStartdate), "d MMM yyyy")}
                    {" - "}
                    {format(new Date(eventData?.eventEnddate), "d MMM yyyy")} (
                    {diffInDays === 1
                      ? `${diffInDays} day`
                      : `${diffInDays} days`}
                    )
                  </TextXtraSmall>
                </VStack>
              </LinkOverlay>
            </NextLink>
          </LinkBox>
        </GridItem>

        <GridItem alignItems="flex-end">
          <EventInterest
            type="list"
            // userInterested={eventData?.userInterested}
            eventData={eventData}
          />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default PageEventCard;
