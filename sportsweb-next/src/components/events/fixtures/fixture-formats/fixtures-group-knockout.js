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
import {
  getParticipants,
  getParticipantsLabel,
} from "../../../../helper/constants/event-fixtures-constants";
import CustomFormLabel from "../../../ui/form/form-label";
import Button from "../../../ui/button";
import { TextMedium } from "../../../ui/text/text";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import GeneratedGroups from "./generated-groups";
import FixturesGroupCsp from "./fixtures-group-csp";
import FixturesAlertModal from "../fixtures-alert-modal";
import { RepeatIcon } from "../../../ui/icons";

const FixturesGroupKnockout = (props) => {
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
        // Resetting inner format if not CSP
        if (values.knockout_format !== "CSP") {
          values.inner_format = [];
        }
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
        let canGenerate =
          values.no_of_reg &&
          values.no_of_groups &&
          values.knockout_format &&
          values.no_of_rounds &&
          values.no_of_qualifiers;

        if (values.knockout_format === "CSP") {
          canGenerate =
            canGenerate &&
            values.inner_format.every((f) => f.level && f.prize && f.format);
        }

        const handleGenerate = (isRandom) => {
          if (canGenerate) {
            const participants = getParticipants(
              +values.no_of_reg,
              registrationData,
              playersType,
              isRandom
            );
            setRegOptions(participants);

            const groups = [];
            for (let i = 0; i < values.no_of_groups; i++) {
              const group_name = "Group " + String.fromCharCode(65 + i);
              const noOfParticipants = Math.ceil(
                +values.no_of_reg / +values.no_of_groups
              );
              const participant_list = [];
              for (let j = 0; j < noOfParticipants; j++) {
                const participant = participants[i * noOfParticipants + j];
                // Condition for uneven groups
                if (participant) {
                  participant_list.push(participant);
                }
              }
              groups.push({
                group_name,
                participant_list,
              });
            }

            setFieldValue("groups", groups);
          }
        };

        const areGroupsGenerated = values.groups.length > 0;

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
              <GridItem maxW="180px">
                <NumberWithValidation
                  name="no_of_reg"
                  label="No. of Registration"
                  min={1}
                />
              </GridItem>
              <GridItem maxW="180px">
                <NumberWithValidation
                  name="no_of_groups"
                  label="No. of Groups"
                  min={1}
                />
              </GridItem>
              <GridItem w="full">
                <SelectWithValidation
                  name="knockout_format"
                  label="Knockout Format"
                  maxW="2xs"
                  fontSize="md"
                >
                  <option selected hidden disabled value=""></option>
                  <option value="CHAIN">Chain</option>
                  <option value="CSP">Cup, Shield & Plate</option>
                </SelectWithValidation>
              </GridItem>
              <GridItem maxW="180px">
                <NumberWithValidation
                  name="no_of_rounds"
                  label="No. of Rounds"
                  min={1}
                />
              </GridItem>
              <GridItem maxW="180px">
                <NumberWithValidation
                  name="no_of_qualifiers"
                  label="No. of Qualifiers per Group"
                  min={1}
                />
              </GridItem>

              {values.knockout_format === "CSP" && <FixturesGroupCsp />}

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
              {areGroupsGenerated && (
                <GridItem gridColumn="1 / -1">
                  <GeneratedGroups
                    values={values}
                    playersType={playersType}
                    regOptions={regOptions}
                  />
                </GridItem>
              )}
              {touched?.groups &&
                errors?.groups &&
                typeof errors.groups === "string" && (
                  <GridItem gridColumn="1 / -1">
                    <TextMedium color="red.500">{errors.groups}</TextMedium>
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

export default FixturesGroupKnockout;
