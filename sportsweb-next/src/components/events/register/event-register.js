import { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Select,
  Skeleton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEventByIdJava } from "../../../hooks/event-hook";
import CoverImage from "../../common/cover-image";
import EmptyCoverImage from "../../common/empty-cover-image";
import PictureModal from "../../common/picture-modal";
import Button from "../../ui/button";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import EventRegisterTeam from "./event-register-team";
import EventRegisterPlayers from "./event-register-players";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useSports } from "../../../hooks/sports-hooks";
import teamService from "../../../services/team-service";
import { TextSmall } from "../../ui/text/text";
import { LocationIcon } from "../../ui/icons";
import routes from "../../../helper/constants/route-constants";
import { format } from "date-fns";
import { useCountries } from "../../../hooks/country-hooks";

const EventRegister = ({ eventId }) => {
  const router = useRouter();
  const { data: countriesData = [] } = useCountries();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: eventData, isLoading } = useEventByIdJava(eventId);
  const { data: sportsData = [], isSuccess: isSportsSuccess } = useSports();
  const { data: categories = [] } = useCategoriesByType("EVT");
  const eventCategoryName = categories.find(
    (category) => category.category_id === eventData?.eventCategoryId
  )?.category_name;

  const formatDate = (date) => format(new Date(date), "dd-MMM-yyyy  h:mm aa");
  const address = eventData && JSON.parse(eventData.eventAddress);
  const [tournamentCategoryId, setTournamentCategoryId] = useState("");
  const [selectedSport, setSelectedSport] = useState();
  const [isRegistrationFull, setIsRegistrationFull] = useState(false);

  const categoryType = selectedSport?.sports_category.find(
    (category) => category.category_code === selectedSport.tournamentCategory
  )?.type;
  const isTeam = Boolean(categoryType === "Team");
  const isIndividual = Boolean(categoryType === "Individual");
  const isDoubles = Boolean(categoryType === "Doubles");
  let heading;
  if (isTeam) {
    heading = "Team";
  } else if (isIndividual) {
    heading = "Player";
  } else if (isDoubles) {
    heading = "Players";
  }

  if (!eventData) return null;

  let tournamentCategories = [];
  if (isSportsSuccess && eventData.tournaments) {
    eventData.tournaments.forEach((tournament) => {
      const sport = sportsData.find(
        (sport) => sport.sports_id === tournament.sportsRefid
      );
      tournament?.tournamentCategories.forEach((tournamentCategory) => {
        const obj = { ...sport };
        obj.tournamentCategoryId = tournamentCategory.tournamentCategoryId;
        obj.tournamentCategory = tournamentCategory.tournamentCategory;
        obj.tournamentCategoryName = tournamentCategory.tournamentCategoryName;
        obj.tournamentConfig = JSON.parse(tournamentCategory.tournamentConfig);
        obj.participantCategory = tournamentCategory.participantCategory;
        obj.preferencesOffered = tournamentCategory.preferencesOffered
          ? JSON.parse(tournamentCategory.preferencesOffered)
          : tournamentCategory.preferencesOffered;
        tournamentCategories.push(obj);
      });
    });
  }

  const isPaymentOnline = eventData.collectPymtOnline === "Y";

  return (
    <Skeleton isLoaded={!isLoading}>
      <Box p={6} bg="white" borderRadius="xl" position="relative">
        {eventData.eventBanner ? (
          <>
            <CoverImage modalOpen={onOpen} coverimage={eventData.eventBanner} />
            <PictureModal
              isOpen={isOpen}
              onClose={onClose}
              src={eventData.eventBanner}
              alt="Event cover image"
            />
          </>
        ) : (
          <EmptyCoverImage
            coverimage={"url('/images/no-banner-image-page.jpg')"}
          />
        )}

        <Flex
          direction={{ base: "column", md: "row" }}
          // align="center"
          mt="-50px"
          px={{ md: 7 }}
        >
          <Box>
            <Avatar
              size="xl"
              name={eventData.eventName}
              src={eventData.eventLogo}
              alt="Event Logo"
              css={{
                border: "2px solid white",
              }}
              position="relative"
            ></Avatar>
            {/* <VStack mt={3} align="left">
              <HeadingMedium fontWeight="medium">
                {eventData.eventName}
              </HeadingMedium>
            </VStack>
            <VStack align="flex-start" mt={2}>
              <HeadingSmall fontWeight="normal">
                {eventCategoryName}
              </HeadingSmall>
            </VStack> */}
            <VStack align="flex-start" mt={1}>
              <HeadingMedium fontWeight="medium">
                {eventData?.eventName}
              </HeadingMedium>
              <HStack>
                <HeadingSmall fontWeight="normal">
                  {
                    categories?.find(
                      (a) => a.category_id === eventData?.eventCategoryId
                    )?.category_name
                  }
                </HeadingSmall>
                <HeadingSmall fontWeight="normal">
                  {" "}
                  {"Organized By"}{" "}
                </HeadingSmall>
                <HeadingSmall
                  fontWeight="normal"
                  color="blue"
                  cursor="pointer"
                  onClick={() => {
                    router.push(
                      routes.page(eventData?.eventOrganizers?.[0]?.companyId)
                    );
                  }}
                >
                  {eventData?.eventOrganizers?.[0]?.organizerName}
                </HeadingSmall>
              </HStack>
              <TextSmall fontWeight="normal">
                {eventData && formatDate(eventData?.eventStartdate)} --{" "}
                {eventData && formatDate(eventData?.eventEnddate)}
              </TextSmall>
              <HStack>
                <LocationIcon color="gray.500" />
                <TextSmall color="gray.500">
                  {address?.city}{" "}
                  {
                    countriesData
                      ?.find((c) => c["country_code"] == address?.country)
                      ?.country_states?.find(
                        (s) => s["state_code"] == address?.state
                      )?.["state_name"]
                  }{" "}
                  {
                    countriesData?.find(
                      (c) => c["country_code"] == address?.country
                    )?.["country_name"]
                  }{" "}
                </TextSmall>
              </HStack>
            </VStack>
          </Box>
        </Flex>
      </Box>

      <Box p={6} bg="white" mt={4} borderRadius="xl">
        <HeadingMedium>Register {heading}</HeadingMedium>
        <FormControl my={4} isInvalid={isRegistrationFull}>
          <Select
            fontSize="sm"
            borderColor="gray.300"
            maxW="sm"
            placeholder="Select Sport"
            value={tournamentCategoryId}
            onChange={async (e) => {
              const value = e.target.value;
              setTournamentCategoryId(value);
              setIsRegistrationFull(false);
              if (value) {
                const sport = tournamentCategories.find(
                  (tournamentCategoryObj) =>
                    tournamentCategoryObj.tournamentCategoryId == value
                );
                setSelectedSport(sport);
                try {
                  const isDoubles =
                    sport.sports_category.find(
                      (category) =>
                        category.category_code === sport.tournamentCategory
                    )?.type === "Doubles";
                  const teams = await teamService.getTeam(value);
                  const teamsLength = isDoubles
                    ? teams.length / 2
                    : teams.length;
                  if (
                    teamsLength >=
                    Number(
                      sport.tournamentConfig.participant_criteria
                        .max_registrations
                    )
                  ) {
                    setIsRegistrationFull(true);
                  }
                } catch (e) {
                  console.log(e);
                }
              } else {
                setSelectedSport(null);
              }
            }}
          >
            {tournamentCategories.map((tournamentCategoryObj) => {
              const category =
                tournamentCategoryObj.sports_category.find(
                  (sportCategory) =>
                    sportCategory.category_code ===
                    tournamentCategoryObj.tournamentCategory
                )?.category_name || tournamentCategoryObj.tournament_category;

              const tournamentCategoryName =
                tournamentCategoryObj.tournamentCategoryName ||
                `${tournamentCategoryObj.sports_name} - ${category} (${
                  tournamentCategoryObj.tournamentConfig.age_criteria
                    ?.criteria_by
                }${
                  tournamentCategoryObj.tournamentConfig.age_criteria
                    ?.age_value &&
                  ` ${tournamentCategoryObj.tournamentConfig.age_criteria.age_value}`
                })`;
              return (
                <option
                  key={tournamentCategoryObj.tournamentCategoryId}
                  value={tournamentCategoryObj.tournamentCategoryId}
                >
                  {tournamentCategoryName}
                  {/* {`${tournamentCategoryObj.sports_name} - ${category}`} (
                  {
                    tournamentCategoryObj.tournamentConfig.age_criteria
                      ?.criteria_by
                  }
                  {tournamentCategoryObj.tournamentConfig.age_criteria
                    ?.age_value &&
                    ` ${tournamentCategoryObj.tournamentConfig.age_criteria.age_value}`}
                  ) */}
                </option>
              );
            })}
          </Select>
          <FormErrorMessage>Maximum Registration Reached</FormErrorMessage>
        </FormControl>

        {isTeam && (
          <EventRegisterTeam
            eventId={eventId}
            tournamentCategoryId={tournamentCategoryId}
            sport={selectedSport}
            isRegistrationFull={isRegistrationFull}
            isPaymentOnline={isPaymentOnline}
          />
        )}

        {isIndividual && (
          <EventRegisterPlayers
            eventId={eventId}
            tournamentCategoryId={tournamentCategoryId}
            isIndividual={isIndividual}
            isDoubles={isDoubles}
            isRegistrationFull={isRegistrationFull}
            sport={selectedSport}
            isPaymentOnline={isPaymentOnline}
          />
        )}

        {/* Separate instances of the component for singles & doubles as the
        plaer id prefill disabled state was not getting reset on change */}
        {isDoubles && (
          <EventRegisterPlayers
            eventId={eventId}
            tournamentCategoryId={tournamentCategoryId}
            isIndividual={isIndividual}
            isDoubles={isDoubles}
            isRegistrationFull={isRegistrationFull}
            sport={selectedSport}
            isPaymentOnline={isPaymentOnline}
          />
        )}

        {!tournamentCategoryId && (
          <Button
            colorScheme="primary"
            variant="outline"
            onClick={() => router.push(`/events/${eventId}`)}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Skeleton>
  );
};

export default EventRegister;
