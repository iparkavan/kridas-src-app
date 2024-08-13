import {
  Box,
  Divider,
  Grid,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";

import Button from "../../ui/button";
import VsSvg from "../../../svg/vs-svg";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import DatePicker from "../../ui/pickers/date-picker";
import { getEditMatchYupSchema } from "../../../helper/constants/event-fixtures-constants";
import { TextMedium } from "../../ui/text/text";
import { useUpdateFixture } from "../../../hooks/tournament-hooks";

const FixturesEditModal = (props) => {
  const {
    isOpen,
    onClose,
    fixture,
    fixtureIndex,
    fixturesData,
    playersType,
    venues,
    tournamentCategory,
    eventData,
    setFixtures,
    isSavedFixtures,
  } = props;

  const { mutate: updateFixtureMutate, isLoading } = useUpdateFixture();

  const initialValues = {
    firstTeamName: fixture.firstTeamName,
    secondTeamName: fixture.secondTeamName,
    fixtureDate: fixture.fixtureDate ? new Date(fixture.fixtureDate) : "",
    venueId: fixture.venueId || tournamentCategory.tournamentCategoryVenue?.[0],
    courtNo: fixture.courtNo || "",
  };

  const fixtureConfig = fixturesData && JSON.parse(fixturesData.fixtureConfig);

  let participantList;
  if (fixtureConfig) {
    if (fixturesData.fixtureFormat === "GRPKNO") {
      participantList = fixtureConfig.groups.find(
        (group) => group.group_name === fixture.groupName
      )?.participant_list;
    } else {
      participantList = fixtureConfig.participant_list;
    }
  }

  const areTeamNamesInParticipantList =
    participantList &&
    participantList.some(
      (p) =>
        p.participant_name === fixture.firstTeamName ||
        p.participant_name === fixture.secondTeamName
    );

  let participantOptions =
    participantList &&
    participantList.map((participant) => (
      <option key={participant.reg_id} value={participant.participant_name}>
        {participant.participant_name}
      </option>
    ));

  const venueOptions =
    venues?.length > 0 &&
    venues.map((venue, i) => (
      <option key={i} value={venue.data?.company_id}>
        {venue.data?.company_name}
      </option>
    ));

  const handleSubmit = (values) => {
    if (isSavedFixtures) {
      const fixtureObj = {
        ...fixture,
        ...values,
        tournamentCategoryId: tournamentCategory.tournamentCategoryId,
        matchScore: fixture.matchScore ? JSON.parse(fixture.matchScore) : null,
      };
      updateFixtureMutate(fixtureObj, {
        onSuccess: () => onClose(),
      });
    } else {
      const fixtureObj = { ...fixture, ...values };
      setFixtures((prevFixtures) => {
        const newFixtures = [...prevFixtures];
        newFixtures[fixtureIndex] = fixtureObj;
        return newFixtures;
      });
      onClose();
    }
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Match {fixtureIndex + 1}</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValues}
          validationSchema={getEditMatchYupSchema(
            playersType,
            eventData.eventStartdate,
            eventData.eventEnddate,
            yup
          )}
          onSubmit={handleSubmit}
        >
          <Form>
            <ModalBody>
              <Divider borderColor="primary.500" mt={-3} />
              <HStack mt={5} mb={8} spacing={8}>
                {areTeamNamesInParticipantList ? (
                  <SelectWithValidation name="firstTeamName">
                    {participantOptions}
                  </SelectWithValidation>
                ) : (
                  <TextMedium w="full" textAlign="center" fontWeight="medium">
                    {fixture.firstTeamName}
                  </TextMedium>
                )}
                <Box>
                  <VsSvg />
                </Box>
                {areTeamNamesInParticipantList ? (
                  <SelectWithValidation name="secondTeamName">
                    {participantOptions}
                  </SelectWithValidation>
                ) : (
                  <TextMedium w="full" textAlign="center" fontWeight="medium">
                    {fixture.secondTeamName}
                  </TextMedium>
                )}
              </HStack>
              <Grid templateColumns="2fr 2fr 1fr" gap={5}>
                <DatePicker
                  name="fixtureDate"
                  label="Date & Time"
                  showTimeSelect={true}
                  dateFormat="dd/MM/yyyy h:mm aa"
                />
                <SelectWithValidation name="venueId" label="Venue">
                  {venueOptions}
                </SelectWithValidation>
                <TextBoxWithValidation name="courtNo" label="Court No" />
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" isLoading={isLoading}>
                Save
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default FixturesEditModal;
