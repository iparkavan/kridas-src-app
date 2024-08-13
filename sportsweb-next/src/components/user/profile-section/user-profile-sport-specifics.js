import {
  Box,
  Checkbox,
  HStack,
  Radio,
  RadioGroup,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { Field } from "formik";
import { sportSpecifics } from "../../../helper/constants/sports-constants";
import { TextSmall } from "../../ui/text/text";

const UserProfileSportSpecifics = ({
  formik,
  sports,
  sportsStatisticsIndex,
}) => {
  const sportsWithSpecifics = [
    "SPOR02",
    "SPOR13",
    "SPOR04",
    "SPOR05",
    "SPOR03",
    "SPOR10",
    "SPOR12",
    "SPOR01",
    "SPOR06",
    "SPOR07",
    "SPOR08",
    "SPOR09",
  ];

  const { values } = formik;

  if (values["sports_statistics"][sportsStatisticsIndex]?.["sports_id"]) {
    const selectedSport = sports?.find(
      (sport) =>
        sport["sports_id"] ==
        values["sports_statistics"][sportsStatisticsIndex]?.["sports_id"]
    );

    if (sportsWithSpecifics.includes(selectedSport?.["sports_code"])) {
      return (
        <VStack alignItems="flex-start" w="full" spacing={4}>
          <Box>
            <TextSmall fontWeight="medium">
              Your {selectedSport?.["sports_name"]} Specifics (Optional)
            </TextSmall>
            <TextSmall>Provide specifics below</TextSmall>
          </Box>
          <SelectedSportSpecific
            sportCode={selectedSport?.["sports_code"]}
            formik={formik}
            sportsStatisticsIndex={sportsStatisticsIndex}
          />
        </VStack>
      );
    }
    return null;
  }

  return null;
};

const SelectedSportSpecific = ({
  sportCode,
  formik,
  sportsStatisticsIndex,
}) => {
  const { values, setFieldValue } = formik;

  if (sportCode === "SPOR05") {
    return (
      <VStack alignItems="flex-start" spacing={4}>
        <Checkbox
          borderColor="gray.300"
          isChecked={
            values["sports_statistics"][sportsStatisticsIndex]
              .sportwise_statistics?.BAT
          }
          onChange={(e) => {
            if (e.target.checked) {
              setFieldValue(
                `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BAT`,
                "RH"
              );
            } else {
              setFieldValue(
                `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BAT`,
                false
              );
            }
          }}
        >
          <TextSmall>Batting</TextSmall>
        </Checkbox>

        <Field
          name={`sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BAT`}
        >
          {({ field }) => (
            <RadioGroup {...field}>
              <HStack ml={6} spacing={0} gap={4} flexWrap="wrap">
                <Radio
                  borderColor="gray.300"
                  colorScheme="primary"
                  {...field}
                  value="RH"
                >
                  <TextSmall>Right Hand</TextSmall>
                </Radio>
                <Radio
                  borderColor="gray.300"
                  colorScheme="primary"
                  {...field}
                  value="LH"
                >
                  <TextSmall>Left Hand</TextSmall>
                </Radio>
              </HStack>
            </RadioGroup>
          )}
        </Field>

        <Checkbox
          borderColor="gray.300"
          isChecked={
            values["sports_statistics"][sportsStatisticsIndex]
              .sportwise_statistics?.BOW
          }
          onChange={(e) => {
            if (e.target.checked) {
              setFieldValue(
                `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BOW`,
                "RH"
              );
              setFieldValue(
                `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BOWT`,
                "OFFS"
              );
            } else {
              setFieldValue(
                `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BOW`,
                false
              );
              setFieldValue(
                `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BOWT`,
                false
              );
            }
          }}
        >
          <TextSmall>Bowling</TextSmall>
        </Checkbox>

        <Field
          name={`sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BOW`}
        >
          {({ field }) => (
            <RadioGroup {...field}>
              <HStack ml={6} spacing={0} gap={4} flexWrap="wrap">
                <Radio
                  borderColor="gray.300"
                  colorScheme="primary"
                  {...field}
                  value="RH"
                >
                  <TextSmall>Right Hand</TextSmall>
                </Radio>
                <Radio
                  borderColor="gray.300"
                  colorScheme="primary"
                  {...field}
                  value="LH"
                >
                  <TextSmall>Left Hand</TextSmall>
                </Radio>
              </HStack>
            </RadioGroup>
          )}
        </Field>

        <Field
          name={`sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BOWT`}
        >
          {({ field }) => (
            <RadioGroup {...field}>
              <HStack ml={6} spacing={0} gap={4} flexWrap="wrap">
                <Radio
                  borderColor="gray.300"
                  colorScheme="primary"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (
                      typeof values["sports_statistics"][sportsStatisticsIndex]
                        .sportwise_statistics?.BOW === "boolean"
                    ) {
                      setFieldValue(
                        `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BOW`,
                        true
                      );
                    }
                  }}
                  value="OFFS"
                >
                  <TextSmall>Off Spinner</TextSmall>
                </Radio>
                <Radio
                  borderColor="gray.300"
                  colorScheme="primary"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (
                      typeof values["sports_statistics"][sportsStatisticsIndex]
                        .sportwise_statistics?.BOW === "boolean"
                    ) {
                      setFieldValue(
                        `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BOW`,
                        true
                      );
                    }
                  }}
                  value="LEGS"
                >
                  <TextSmall>Leg Spinner</TextSmall>
                </Radio>
                <Radio
                  borderColor="gray.300"
                  colorScheme="primary"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (
                      typeof values["sports_statistics"][sportsStatisticsIndex]
                        .sportwise_statistics?.BOW === "boolean"
                    ) {
                      setFieldValue(
                        `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.BOW`,
                        true
                      );
                    }
                  }}
                  value="PACE"
                >
                  <TextSmall>Pacer</TextSmall>
                </Radio>
              </HStack>
            </RadioGroup>
          )}
        </Field>

        <Checkbox
          borderColor="gray.300"
          isChecked={
            values["sports_statistics"][sportsStatisticsIndex]
              .sportwise_statistics?.ALL
          }
          onChange={(e) => {
            setFieldValue(
              `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.ALL`,
              e.target.checked
            );
          }}
        >
          <TextSmall>All Rounder</TextSmall>
        </Checkbox>
        <Checkbox
          borderColor="gray.300"
          isChecked={
            values["sports_statistics"][sportsStatisticsIndex]
              .sportwise_statistics?.WKE
          }
          onChange={(e) => {
            setFieldValue(
              `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.WKE`,
              e.target.checked
            );
          }}
        >
          <TextSmall>Wicket Keeping</TextSmall>
        </Checkbox>
      </VStack>
    );
  } else if (
    sportCode === "SPOR13" ||
    sportCode === "SPOR04" ||
    sportCode === "SPOR03" ||
    sportCode === "SPOR10" ||
    sportCode === "SPOR12" ||
    sportCode === "SPOR09" ||
    sportCode === "SPOR07"
  ) {
    const selectedSportSpecifics = sportSpecifics[sportCode];
    return (
      <SimpleGrid columns={[1, 2, 2, 3, 4]} spacingY={5} w="full">
        {selectedSportSpecifics.map((specific) => {
          return (
            <Checkbox
              key={specific.value}
              borderColor="gray.300"
              w="fit-content"
              isChecked={
                values["sports_statistics"][sportsStatisticsIndex]
                  .sportwise_statistics?.[specific?.value]
              }
              onChange={(e) =>
                setFieldValue(
                  `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.${specific.value}`,
                  e.target.checked
                )
              }
            >
              <TextSmall>{specific.label}</TextSmall>
            </Checkbox>
          );
        })}
      </SimpleGrid>
    );
  } else {
    return (
      <VStack alignItems="flex-start" spacing={4} w="full">
        <Field
          name={`sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.HA`}
        >
          {({ field }) => (
            <RadioGroup {...field}>
              <HStack spacing={0} gap={[4, 10]} flexWrap="wrap">
                <Radio
                  borderColor="gray.300"
                  colorScheme="primary"
                  {...field}
                  value="RH"
                >
                  <TextSmall>Right Hand</TextSmall>
                </Radio>
                <Radio
                  borderColor="gray.300"
                  colorScheme="primary"
                  {...field}
                  value="LH"
                >
                  <TextSmall>Left Hand</TextSmall>
                </Radio>
              </HStack>
            </RadioGroup>
          )}
        </Field>

        <HStack spacing={0} gap={[4, 10]} flexWrap="wrap">
          <Checkbox
            borderColor="gray.300"
            isChecked={
              values["sports_statistics"][sportsStatisticsIndex]
                .sportwise_statistics?.SIN
            }
            onChange={(e) =>
              setFieldValue(
                `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.SIN`,
                e.target.checked
              )
            }
          >
            <TextSmall>Singles</TextSmall>
          </Checkbox>
          <Checkbox
            borderColor="gray.300"
            isChecked={
              values["sports_statistics"][sportsStatisticsIndex]
                .sportwise_statistics?.DOU
            }
            onChange={(e) =>
              setFieldValue(
                `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.DOU`,
                e.target.checked
              )
            }
          >
            <TextSmall>Doubles</TextSmall>
          </Checkbox>
          <Checkbox
            borderColor="gray.300"
            isChecked={
              values["sports_statistics"][sportsStatisticsIndex]
                .sportwise_statistics?.MIX
            }
            onChange={(e) =>
              setFieldValue(
                `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics.MIX`,
                e.target.checked
              )
            }
          >
            <TextSmall>Mixed Doubles</TextSmall>
          </Checkbox>
        </HStack>
      </VStack>
    );
  }
};

export default UserProfileSportSpecifics;
