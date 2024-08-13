import {
  VStack,
  Box,
  Radio,
  Stack,
  RadioGroup,
  FormControl,
  FormErrorMessage,
  Input,
  Link,
  useBreakpointValue,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import * as yup from "yup";

import { DeleteIcon } from "../../ui/icons";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import { useSports } from "../../../hooks/sports-hooks";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import UserProfileSportSpecifics from "./user-profile-sport-specifics";
import { useUser } from "../../../hooks/user-hooks";
import {
  useUpdateUserStatistics,
  useUserStatistics,
} from "../../../hooks/user-statistics-hooks";
import { getUserStatisticsYupSchema } from "../../../helper/constants/user-contants";
import EditSportsStatistics from "./sports-statistics/edit-sports-statistics";
import { HeadingSmall } from "../../ui/heading/heading";
import { TextMedium, TextSmall } from "../../ui/text/text";
import FieldLayout from "./user-profile-edit/field-layout";
import IconButton from "../../ui/icon-button";
import Button from "../../ui/button";
import DeletePopover from "../../ui/popover/delete-popover";

const UserProfileEditStatistics = () => {
  const toast = useToast();
  const { data: userData = {} } = useUser();
  const { data: sportsData = [] } = useSports();
  const { data: skillsData = [] } = useCategoriesByType("SKI");
  const { data: statisticsData = [] } = useUserStatistics(
    userData?.["user_id"]
  );
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useUpdateUserStatistics();

  const statisticObj = {
    sports_id: "",
    skill_level: "",
    playing_status: "",
    statistics_links: [""],
    documents: [null],
    // sportwise_statistics: {},
    sportwise_statistics: { statsInfo: [{ statsSubInfo: {} }] },
  };

  const initialValues = statisticsData.reduce((statsArray, statistic) => {
    if (statistic?.["skill_level"] && statistic?.["playing_status"]) {
      statsArray.push({
        // ...statistic,
        sports_id: statistic["sports_id"],
        skill_level: statistic["skill_level"],
        playing_status: statistic["playing_status"],
        sportwise_statistics: statistic["sportwise_statistics"],
        statistics_docs: statistic["statistics_docs"],
        statistics_links:
          statistic?.["statistics_links"]?.length > 0
            ? statistic?.["statistics_links"]
            : [""],
        documents:
          statistic?.["statistics_docs"]?.length > 0
            ? statistic?.["statistics_docs"]
            : [null],
        isInitial: true,
      });
    }
    return statsArray;
  }, []);

  return (
    <Formik
      initialValues={{
        sports_statistics:
          initialValues?.length === 0
            ? [{ ...statisticObj }]
            : [...initialValues],
      }}
      validationSchema={getUserStatisticsYupSchema(yup)}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting }) => {
        updateMutate(
          {
            ...values,
            user_id: userData?.["user_id"],
          },
          {
            onSettled: (_, error) => {
              setSubmitting(false);
              const toastTitle = error
                ? "Failed to update your sports statistics. Please try again."
                : "Your sports statistics has been updated.";
              toast({
                title: toastTitle,
                status: error ? "error" : "success",
                duration: 5000,
                isClosable: true,
              });
            },
          }
        );
      }}
    >
      {(formik) => (
        <Form>
          <VStack alignItems="flex-start" width="full" spacing={4}>
            <Box w="full">
              <HeadingSmall textTransform="uppercase">
                Sports Statistics
              </HeadingSmall>
              <TextSmall fontWeight="medium" mt={2}>
                Sports you play & score stats
              </TextSmall>
              <TextSmall>Required when applying for Sponsorship</TextSmall>
            </Box>

            <FieldArray
              name="sports_statistics"
              render={(sportsStatisticsHelpers) => (
                <VStack w="full" alignItems="flex-start" spacing={7}>
                  {formik.values.sports_statistics?.length === 0 ? (
                    <Button
                      fontSize="sm"
                      variant="link"
                      onClick={() => sportsStatisticsHelpers.push(statisticObj)}
                    >
                      + Add Sport
                    </Button>
                  ) : (
                    formik.values.sports_statistics?.map(
                      (sportsStatistic, sportsStatisticsIndex) => (
                        <VStack
                          key={sportsStatisticsIndex}
                          w="full"
                          alignItems="flex-start"
                          spacing={4}
                        >
                          <FieldLayout label="Sport">
                            <Flex w="full" gap={2}>
                              <SelectWithValidation
                                name={`sports_statistics[${sportsStatisticsIndex}].sports_id`}
                                placeholder="Select Sport"
                                disabled={Boolean(sportsStatistic?.isInitial)}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  formik.setFieldValue(
                                    `sports_statistics[${sportsStatisticsIndex}].sportwise_statistics`,
                                    {
                                      statsInfo: [{ statsSubInfo: {} }],
                                    }
                                  );
                                }}
                                validate={(value) => {
                                  const filteredSports =
                                    formik.values.sports_statistics.filter(
                                      (statistic) =>
                                        statistic["sports_id"] == value
                                    );

                                  if (filteredSports?.length > 1)
                                    return "Statistics already exists for this sport";
                                }}
                              >
                                {sportsData?.map((sport) => (
                                  <option
                                    key={sport["sports_id"]}
                                    value={sport["sports_id"]}
                                  >
                                    {sport["sports_name"]}
                                  </option>
                                ))}
                              </SelectWithValidation>
                              <DeletePopover
                                title="Delete Sport"
                                trigger={
                                  <IconButton
                                    size={iconButtonSize}
                                    icon={<DeleteIcon fontSize="18px" />}
                                    colorScheme="primary"
                                    tooltipLabel="Delete Sport"
                                  />
                                }
                                handleDelete={() =>
                                  sportsStatisticsHelpers.remove(
                                    sportsStatisticsIndex
                                  )
                                }
                              >
                                <TextSmall>
                                  Are you sure you want to delete this sport
                                  from your sports statistics?
                                </TextSmall>
                              </DeletePopover>
                            </Flex>
                          </FieldLayout>

                          <FieldLayout label="Skill Level">
                            <SelectWithValidation
                              name={`sports_statistics[${sportsStatisticsIndex}].skill_level`}
                              placeholder="Select Skill Level"
                            >
                              {skillsData?.map((skill) => (
                                <option
                                  key={skill["category_id"]}
                                  value={skill["category_id"]}
                                >
                                  {skill["category_name"]}
                                </option>
                              ))}
                            </SelectWithValidation>
                          </FieldLayout>

                          <FieldLayout label="Active">
                            <Field
                              name={`sports_statistics[${sportsStatisticsIndex}].playing_status`}
                            >
                              {({ field, form }) => {
                                return (
                                  <FormControl
                                    isInvalid={
                                      form.errors?.sports_statistics?.[
                                        sportsStatisticsIndex
                                      ]?.playing_status &&
                                      form.touched?.sports_statistics?.[
                                        sportsStatisticsIndex
                                      ]?.playing_status
                                    }
                                  >
                                    <RadioGroup {...field}>
                                      <Stack spacing={2}>
                                        <Radio
                                          borderColor="gray.300"
                                          colorScheme="primary"
                                          w="fit-content"
                                          {...field}
                                          value="AC"
                                        >
                                          <TextSmall>
                                            I am actively playing
                                          </TextSmall>
                                        </Radio>
                                        <Radio
                                          borderColor="gray.300"
                                          colorScheme="primary"
                                          w="fit-content"
                                          {...field}
                                          value="IC"
                                        >
                                          <TextSmall>
                                            I am not actively playing
                                          </TextSmall>
                                        </Radio>
                                      </Stack>
                                    </RadioGroup>
                                    <FormErrorMessage>
                                      {
                                        form.errors?.sports_statistics?.[
                                          sportsStatisticsIndex
                                        ]?.playing_status
                                      }
                                    </FormErrorMessage>
                                  </FormControl>
                                );
                              }}
                            </Field>
                          </FieldLayout>

                          <EditSportsStatistics
                            formik={formik}
                            sports={sportsData}
                            sportsStatisticsIndex={sportsStatisticsIndex}
                          />

                          <UserProfileSportSpecifics
                            formik={formik}
                            sports={sportsData}
                            sportsStatisticsIndex={sportsStatisticsIndex}
                          />

                          <FieldArray
                            name={`sports_statistics[${sportsStatisticsIndex}].statistics_links`}
                            render={(arrayHelpers) => (
                              <VStack
                                alignItems="flex-start"
                                spacing={4}
                                w="full"
                              >
                                <Box>
                                  <TextSmall fontWeight="medium">
                                    External Stats URL (Optional)
                                  </TextSmall>
                                  <TextSmall>
                                    Provide the information below
                                  </TextSmall>
                                </Box>
                                {sportsStatistic?.statistics_links?.map(
                                  (link, index) => (
                                    <Flex
                                      key={index}
                                      gap={{ base: 2, sm: 5 }}
                                      align="center"
                                      w="full"
                                      maxW="lg"
                                    >
                                      <TextMedium>{index + 1}</TextMedium>
                                      <TextBoxWithValidation
                                        name={`sports_statistics[${sportsStatisticsIndex}].statistics_links[${index}]`}
                                        placeholder="URL"
                                      />
                                      <DeletePopover
                                        title="Delete URL"
                                        trigger={
                                          <IconButton
                                            colorScheme="primary"
                                            size="md"
                                            icon={
                                              <DeleteIcon fontSize="18px" />
                                            }
                                            tooltipLabel="Delete URL"
                                          />
                                        }
                                        handleDelete={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        <TextSmall>
                                          Are you sure you want to delete this
                                          URL from your sports statistics?
                                        </TextSmall>
                                      </DeletePopover>
                                    </Flex>
                                  )
                                )}
                                <Button
                                  variant="link"
                                  colorScheme="primary"
                                  fontSize="sm"
                                  onClick={() => arrayHelpers.push("")}
                                >
                                  + Add URL
                                </Button>
                              </VStack>
                            )}
                          />

                          <FieldArray
                            name={`sports_statistics[${sportsStatisticsIndex}].documents`}
                            render={(arrayHelpers) => (
                              <VStack
                                alignItems="flex-start"
                                spacing={2}
                                w="full"
                              >
                                <Box>
                                  <TextSmall fontWeight="medium">
                                    Upload Certificates / Documents /
                                    Achievement Proofs (Optional)
                                  </TextSmall>
                                  <TextSmall>
                                    Provide the information below
                                  </TextSmall>
                                </Box>
                                {sportsStatistic?.documents?.map(
                                  (doc, index) => (
                                    <Flex
                                      key={index}
                                      align="center"
                                      gap={5}
                                      w="full"
                                      maxW="lg"
                                      flexWrap="wrap"
                                    >
                                      <TextSmall>{index + 1}</TextSmall>
                                      {sportsStatistic.documents[index] ? (
                                        <Link
                                          fontSize="sm"
                                          href={
                                            sportsStatistic.documents[
                                              index
                                            ] instanceof File
                                              ? URL.createObjectURL(
                                                  sportsStatistic.documents[
                                                    index
                                                  ]
                                                )
                                              : sportsStatistic.documents[index]
                                                  ?.url
                                          }
                                          isExternal
                                        >
                                          {sportsStatistic.documents[
                                            index
                                          ] instanceof File
                                            ? sportsStatistic.documents[index]
                                                .name
                                            : sportsStatistic.documents[
                                                index
                                              ]?.url.split("--")[1]}
                                        </Link>
                                      ) : (
                                        <Button
                                          as="label"
                                          id="upload-file"
                                          variant="outline"
                                          size="sm"
                                          colorScheme="primary"
                                          cursor="pointer"
                                        >
                                          Upload
                                          <Input
                                            type="file"
                                            id="upload-file"
                                            display="none"
                                            onChange={(e) => {
                                              if (e.target.files[0]) {
                                                formik.setFieldValue(
                                                  `sports_statistics[${sportsStatisticsIndex}].documents[${index}]`,
                                                  e.target.files[0]
                                                );
                                              }
                                            }}
                                          />
                                        </Button>
                                      )}
                                      <DeletePopover
                                        title="Delete Document"
                                        trigger={
                                          <IconButton
                                            size="md"
                                            icon={
                                              <DeleteIcon fontSize="18px" />
                                            }
                                            colorScheme="primary"
                                            tooltipLabel="Delete Document"
                                          />
                                        }
                                        handleDelete={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        <TextSmall>
                                          Are you sure you want to delete this
                                          document from your sports statistics?
                                        </TextSmall>
                                      </DeletePopover>
                                    </Flex>
                                  )
                                )}
                                <Button
                                  variant="link"
                                  colorScheme="primary"
                                  fontSize="sm"
                                  onClick={() => arrayHelpers.push(null)}
                                >
                                  + Add Document
                                </Button>
                              </VStack>
                            )}
                          />
                          {sportsStatisticsIndex ===
                            formik.values.sports_statistics.length - 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                sportsStatisticsHelpers.push(statisticObj)
                              }
                            >
                              + Add Sport
                            </Button>
                          )}
                        </VStack>
                      )
                    )
                  )}
                </VStack>
              )}
            />
            <Button type="submit" isLoading={updateIsLoading}>
              Save
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};

export default UserProfileEditStatistics;
