import { useState } from "react";
import {
  Grid,
  GridItem,
  HStack,
  IconButton,
  Select,
  Stack,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";

import NumberWithValidation from "../../../ui/number-input/number-with-validation";
import CustomFormLabel from "../../../ui/form/form-label";
import Button from "../../../ui/button";
import GeneratedParticipants from "./generated-participants";
import { TextMedium } from "../../../ui/text/text";
import {
  getParticipants,
  getParticipantsLabel,
} from "../../../../helper/constants/event-fixtures-constants";
import FixturesAlertModal from "../fixtures-alert-modal";
import { RepeatIcon } from "../../../ui/icons";

const FixturesKnockout = (props) => {
  const {
    playersType,
    registrationData,
    sport,
    fixtureFormat,
    setFixtureFormat,
    fixtureConfig,
    validationSchema,
    regOptions,
    setRegOptions,
    handleSave,
    isLoading,
    onClose,
    areFixturesPublished,
    isResultPresent,
  } = props;

  // Need to change the default state later
  const [gridColumns, setGridColumns] = useState("auto minmax(200px, 1fr)");

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  // let submitType;
  const [submitType, setSubmitType] = useState();

  return (
    <Formik
      initialValues={fixtureConfig}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        handleSave(values, submitType);
        onAlertClose();
      }}
    >
      {({
        values,
        setFieldValue,
        handleSubmit,
        touched,
        errors,
        validateForm,
      }) => {
        const canGenerate = values.no_of_reg;

        const handleGenerate = (isRandom) => {
          if (canGenerate) {
            const participants = getParticipants(
              +values.no_of_reg,
              registrationData,
              playersType,
              isRandom
            );
            setFieldValue("participant_list", participants);
            setRegOptions(participants);
            // setGridColumns(
            //   +values.no_of_reg > 6
            //     ? "auto auto auto auto"
            //     : "auto 200px"
            // );
          }
        };

        const areParticipantsGenerated = values.participant_list.length > 0;

        return (
          <Form>
            <Grid
              templateColumns={{ base: "auto", md: "auto auto auto" }}
              columnGap={2}
              rowGap={{ base: 3, md: 7 }}
              justifyItems={{ md: "center" }}
            >
              <GridItem w="full">
                <CustomFormLabel>Event Format</CustomFormLabel>
                <Select
                  maxW="2xs"
                  value={fixtureFormat}
                  onChange={(e) => setFixtureFormat(e.target.value)}
                >
                  {sport.sports_format.map((format) => (
                    <option key={format.format_code} value={format.format_code}>
                      {format.format_name}
                    </option>
                  ))}
                </Select>
              </GridItem>
              <GridItem maxW="150px">
                <NumberWithValidation
                  name="no_of_reg"
                  label="No. of Registration"
                  min={1}
                />
              </GridItem>
              <GridItem gridColumn="1 / -1">
                <HStack>
                  <Button
                    colorScheme="navy"
                    fontWeight="normal"
                    disabled={!canGenerate}
                    onClick={() => handleGenerate(false)}
                  >
                    Generate {getParticipantsLabel(playersType)}
                  </Button>
                  <Tooltip label="Randomize">
                    <IconButton
                      aria-label="Randomize"
                      colorScheme="navy"
                      variant="outline"
                      icon={<RepeatIcon />}
                      disabled={!canGenerate}
                      onClick={() => handleGenerate(true)}
                    />
                  </Tooltip>
                </HStack>
              </GridItem>
              {areParticipantsGenerated && (
                <GridItem gridColumn="1 / -1">
                  <GeneratedParticipants
                    values={values}
                    gridColumns={gridColumns}
                    playersType={playersType}
                    regOptions={regOptions}
                  />
                </GridItem>
              )}
              {touched?.participant_list && errors?.participant_list && (
                <GridItem gridColumn="1 / -1">
                  <TextMedium color="red.500">
                    {errors.participant_list}
                  </TextMedium>
                </GridItem>
              )}
            </Grid>
            <Stack
              direction={{ base: "column", md: "row" }}
              justifyContent="flex-end"
              alignItems="flex-start"
              mt={7}
              spacing={4}
            >
              <Button
                variant="outline"
                isLoading={isLoading}
                onClick={async () => {
                  // submitType = "DRT";
                  setSubmitType("DRT");
                  if (areFixturesPublished) {
                    const errors = await validateForm();
                    if (Object.keys(errors).length === 0) {
                      onAlertOpen();
                    }
                  } else {
                    handleSubmit();
                  }
                }}
                disabled={isLoading || isResultPresent}
              >
                Save as Draft
              </Button>
              <Button
                isLoading={isLoading}
                onClick={async () => {
                  // submitType = "GEN";
                  setSubmitType("GEN");
                  if (areFixturesPublished) {
                    const errors = await validateForm();
                    if (Object.keys(errors).length === 0) {
                      onAlertOpen();
                    }
                  } else {
                    handleSubmit();
                  }
                }}
                disabled={isLoading || isResultPresent}
              >
                Generate Fixtures
              </Button>
              <Button colorScheme="red" onClick={onClose}>
                Cancel
              </Button>
            </Stack>
            <FixturesAlertModal
              isOpen={isAlertOpen}
              onClose={onAlertClose}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default FixturesKnockout;
