import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form, FieldArray } from "formik";
import { useRouter } from "next/router";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import * as yup from "yup";
import { convertToPascalCase } from "../../../helper/constants/common-constants";
import { getRegisterTeamSchema } from "../../../helper/constants/event-constants";
import { useEventById, useRegisterTeam } from "../../../hooks/event-hook";
import { useUser } from "../../../hooks/user-hooks";
import teamService from "../../../services/team-service";
import CoverImage from "../../common/cover-image";
import EmptyCoverImage from "../../common/empty-cover-image";
import PictureModal from "../../common/picture-modal";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import IconButton from "../../ui/icon-button";
import { RemoveIcon } from "../../ui/icons";
import PhoneNumberInput from "../../ui/phone-input/phone-number-input";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { TextMedium } from "../../ui/text/text";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";

const EventRegisterTeam = ({ eventId }) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: userData } = useUser();
  const { data: eventData, isLoading } = useEventById(eventId);
  const { mutate, isLoading: isRegistrationLoading } = useRegisterTeam();

  const player = {
    first_name: "",
    last_name: "",
    email_id: "",
    contact_number: "",
  };

  const CustomTh = (props) => <Th p={3} {...props} />;
  const CustomTd = (props) => <Td p={3} {...props} />;

  if (!eventData) return null;

  return (
    <Skeleton isLoaded={!isLoading}>
      <Box p={6} bg="white" borderRadius="xl" position="relative">
        {eventData?.["event_banner"] ? (
          <>
            <CoverImage
              modalOpen={onOpen}
              coverimage={eventData?.["event_banner"]}
            />
            <PictureModal
              isOpen={isOpen}
              onClose={onClose}
              src={eventData?.["event_banner"]}
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
              size={"xl"}
              name={eventData?.["event_name"]}
              src={eventData?.["event_logo"]}
              alt={"Event Logo"}
              css={{
                border: "2px solid white",
              }}
              position="relative"
            ></Avatar>
            <VStack mt={3} align="left">
              <HeadingMedium fontWeight="medium">
                {eventData.event_name}
              </HeadingMedium>
            </VStack>
            <VStack align="flex-start" mt={2}>
              <HeadingSmall fontWeight="normal">
                {eventData?.category_name}
              </HeadingSmall>
            </VStack>
          </Box>
        </Flex>
      </Box>

      <Box p={6} bg="white" mt={4} borderRadius="xl">
        <Formik
          initialValues={{
            tournament_category_id: "",
            team_name: "",
            team_members: [player],
            selected_sport: null,
          }}
          validationSchema={getRegisterTeamSchema(yup, eventData?.sport_list)}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting }) => {
            const { selected_sport, ...otherValues } = values;
            otherValues.team_members.forEach((member) => {
              member["first_name"] = convertToPascalCase(member["first_name"]);
              member["last_name"] = convertToPascalCase(member["last_name"]);
              member["email_id"] = member["email_id"].trim();
              member["contact_number"] = formatPhoneNumberIntl(
                member["contact_number"]
              );
            });
            otherValues.team_name = otherValues.team_name.trim();
            mutate(
              { ...otherValues, user_id: userData?.["user_id"] },
              {
                onSettled: (_, error) => {
                  setSubmitting(false);
                  const toastTitle = error
                    ? "Failed to register the team. Please try again."
                    : "Your team has been registered.";
                  toast({
                    title: toastTitle,
                    status: error ? "error" : "success",
                    duration: 5000,
                    isClosable: true,
                  });
                  if (!error) {
                    router.push(`/events/${eventId}`);
                  }
                },
              }
            );
          }}
        >
          {({ values, handleChange, setFieldValue, setFieldError }) => (
            <Form>
              <VStack alignItems="flex-start" spacing={6}>
                <HeadingMedium>Register Team</HeadingMedium>
                <SelectWithValidation
                  name="tournament_category_id"
                  placeholder="Select Sport"
                  maxW="sm"
                  onChange={async (e) => {
                    handleChange(e);
                    setFieldError("tournament_category_id", undefined);
                    const value = e.target.value;
                    if (value) {
                      const sport = eventData.sport_list?.find(
                        (sport) => sport["tournament_category_id"] == value
                      );
                      try {
                        if (sport?.["max_reg_count"]) {
                          const teams = await teamService.getTeam(value);
                          if (teams?.length >= Number(sport["max_reg_count"])) {
                            setFieldError(
                              "tournament_category_id",
                              "Maximum teams have been filled for this sport"
                            );
                          }
                        }
                      } catch (e) {
                        console.log(e);
                      }
                      setFieldValue("selected_sport", sport);
                      const minPlayers = sport?.["minimum_players"] || 1;
                      setFieldValue(
                        "team_members",
                        new Array(minPlayers).fill().map(() => ({ ...player }))
                      );
                    } else {
                      setFieldValue("selected_sport", null);
                      setFieldValue("team_members", [player]);
                    }
                  }}
                >
                  {eventData?.sport_list?.map((sport) => {
                    const category =
                      sport["sport_category"]?.find(
                        (sportCategory) =>
                          sportCategory["category_code"] ===
                          sport["tournament_category"]
                      )?.["category_name"] || sport["tournament_category"];
                    return (
                      <option
                        key={sport["tournament_category_id"]}
                        value={sport["tournament_category_id"]}
                      >
                        {`${sport["sport_name"]} - ${category}`}
                      </option>
                    );
                  })}
                </SelectWithValidation>

                <TextBoxWithValidation
                  name="team_name"
                  placeholder="Team Name"
                  maxW="sm"
                />

                <FieldArray
                  name="team_members"
                  render={(teamHelpers) => (
                    <>
                      <Box>
                        <HStack gap={3}>
                          <HeadingSmall>Player(s) Details </HeadingSmall>
                          <HeadingSmall>|</HeadingSmall>
                          <Button
                            variant="link"
                            colorScheme="primary"
                            disabled={
                              !values.tournament_category_id ||
                              (values.selected_sport?.["maximum_players"] &&
                                values.team_members.length >=
                                  values.selected_sport?.["maximum_players"])
                            }
                            onClick={() => teamHelpers.push(player)}
                          >
                            + Add Another Player
                          </Button>
                        </HStack>
                        {(values.selected_sport?.maximum_players ||
                          values.selected_sport?.minimum_players) && (
                          <Stack
                            mt={2}
                            direction={{ base: "column", sm: "row" }}
                            spacing={{ base: 0, sm: 5 }}
                          >
                            {values.selected_sport?.minimum_players && (
                              <TextMedium>
                                Minimum Players -{" "}
                                {values.selected_sport.minimum_players}
                              </TextMedium>
                            )}
                            {values.selected_sport?.maximum_players && (
                              <TextMedium>
                                Maximum Players -{" "}
                                {values.selected_sport.maximum_players}
                              </TextMedium>
                            )}
                          </Stack>
                        )}
                      </Box>
                      <TableContainer w="full">
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <CustomTh>No</CustomTh>
                              <CustomTh>First Name</CustomTh>
                              <CustomTh>Last Name</CustomTh>
                              <CustomTh>Email</CustomTh>
                              <CustomTh>Contact Number</CustomTh>
                              <CustomTh>Remove</CustomTh>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {values.team_members.map((_, index) => (
                              <Tr key={index}>
                                <CustomTd>{index + 1}</CustomTd>
                                <CustomTd>
                                  <TextBoxWithValidation
                                    name={`team_members[${index}].first_name`}
                                    minW="100px"
                                    disabled={!values.tournament_category_id}
                                  />
                                </CustomTd>
                                <CustomTd>
                                  <TextBoxWithValidation
                                    name={`team_members[${index}].last_name`}
                                    minW="100px"
                                    disabled={!values.tournament_category_id}
                                  />
                                </CustomTd>
                                <CustomTd>
                                  <TextBoxWithValidation
                                    name={`team_members[${index}].email_id`}
                                    type="email"
                                    minW="100px"
                                    disabled={!values.tournament_category_id}
                                    validate={(value) => {
                                      const filteredEmails =
                                        values.team_members?.filter(
                                          (member) =>
                                            member?.[
                                              "email_id"
                                            ]?.toLowerCase() ===
                                            value?.toLowerCase()
                                        );

                                      if (filteredEmails?.length > 1)
                                        return "Please enter a unique email";
                                    }}
                                  />
                                </CustomTd>
                                <CustomTd>
                                  <PhoneNumberInput
                                    name={`team_members[${index}].contact_number`}
                                    style={{ minWidth: "130px" }}
                                    disabled={!values.tournament_category_id}
                                  />
                                </CustomTd>
                                <CustomTd>
                                  <IconButton
                                    size="md"
                                    icon={<RemoveIcon fontSize="24px" />}
                                    colorScheme="red"
                                    disabled={
                                      values.selected_sport?.["minimum_players"]
                                        ? values.team_members.length <=
                                          values.selected_sport[
                                            "minimum_players"
                                          ]
                                        : values.team_members.length === 1
                                    }
                                    onClick={() => teamHelpers.remove(index)}
                                  />
                                </CustomTd>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                />
                <ButtonGroup spacing={4}>
                  <Button
                    colorScheme="primary"
                    type="submit"
                    isLoading={isRegistrationLoading}
                  >
                    Save
                  </Button>
                  <Button
                    colorScheme="primary"
                    variant="outline"
                    onClick={() => router.push(`/events/${eventId}`)}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Skeleton>
  );
};

export default EventRegisterTeam;
