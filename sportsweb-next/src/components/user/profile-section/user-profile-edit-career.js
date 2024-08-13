import { Fragment } from "react";
import {
  HStack,
  VStack,
  Text,
  Grid,
  GridItem,
  Checkbox,
  useBreakpointValue,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import * as yup from "yup";

import { DeleteIcon } from "../../ui/icons";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import TextAreaWithValidation from "../../ui/textbox/textarea-with-validation";
import MultiSelect from "../../ui/select/multi-select";
import DatePicker from "../../ui/pickers/date-picker";
import { HeadingSmall } from "../../ui/heading/heading";
import { useSports } from "../../../hooks/sports-hooks";
import { useUser } from "../../../hooks/user-hooks";
import {
  useCreateUserSportsCarrer,
  useUserStatistics,
} from "../../../hooks/user-statistics-hooks";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import { getUserCareerYupSchema } from "../../../helper/constants/user-contants";
import helper from "../../../helper/helper";
import FieldLayout from "./user-profile-edit/field-layout";
import { TextSmall } from "../../ui/text/text";
import Button from "../../ui/button";
import IconButton from "../../ui/icon-button";
import DeletePopover from "../../ui/popover/delete-popover";

const UserProfileEditCareer = () => {
  const toast = useToast();
  const { data: userData = {} } = useUser();
  const { data: sportsData = [] } = useSports({}, true);
  const { data: statisticsData = [] } = useUserStatistics(
    userData?.["user_id"]
  );
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });
  const { data: professionData = [] } = useLookupTable("PRF", {
    select: (data) => {
      const selectOptions = data.reduce((prevVal, currentVal) => {
        if (currentVal["lookup_key"].startsWith("P")) {
          prevVal.push({
            value: currentVal["lookup_key"],
            label: currentVal["lookup_value"],
          });
        }
        return prevVal;
      }, []);
      return selectOptions;
    },
  });
  const { mutate, isLoading } = useCreateUserSportsCarrer();

  const careerObj = {
    name: "",
    url: "",
    profiles: null,
    roles: [],
    from: null,
    to: null,
    isCurrent: false,
    achievements: "",
  };

  const sportsCareerObj = {
    sports_id: "",
    sport_career: [{ ...careerObj }],
  };

  const initialValues = statisticsData.reduce((statsArray, statistic) => {
    if (statistic?.["sport_career"]?.length > 0) {
      statsArray.push({
        sports_id: statistic["sports_id"],
        isInitial: true,
        sport_career:
          statistic?.["sport_career"]?.length > 0
            ? statistic?.["sport_career"]?.map((career) => {
                const profile = statistic?.["sports_profile"].find(
                  (profile) => profile["profile_code"] === career?.profiles
                );
                return {
                  ...career,
                  profiles: profile
                    ? {
                        ...profile,
                        value: profile?.["profile_code"],
                        label: profile?.["profile_name"],
                      }
                    : null,
                  roles: career?.roles?.map((roleCode) => {
                    if (profile?.["profile_code"] === "PLAYER") {
                      const role = statistic?.["sports_role"].find(
                        (role) => role["role_code"] === roleCode
                      );
                      return {
                        ...role,
                        value: role["role_code"],
                        label: role["role_name"],
                      };
                    } else {
                      const role = professionData.find(
                        (profession) => profession.value === roleCode
                      );
                      return role;
                    }
                  }),
                  from: new Date(career.from),
                  to: career.to && new Date(career.to),
                };
              })
            : [careerObj],
      });
    }
    return statsArray;
  }, []);

  const getSelectedSport = (sportId) => {
    return sportsData.find((sport) => sport["sports_id"] == sportId);
  };

  const getProfileOptions = (sportId) => {
    let options = [];
    if (sportId) {
      const selectedSport = getSelectedSport(sportId);
      options = selectedSport?.["sports_profile"]?.map((val) => ({
        ...val,
        value: val["profile_code"],
        label: val["profile_name"],
      }));
    }
    return options;
  };

  const getRoleOptions = (sportId, profiles) => {
    let options = [];
    if (profiles && profiles["profile_code"] === "PLAYER") {
      if (sportId) {
        const selectedSport = getSelectedSport(sportId);
        options = selectedSport?.["sports_role"]?.map((val) => ({
          ...val,
          value: val["role_code"],
          label: val["role_name"],
        }));
      }
    } else if (profiles && profiles["profile_code"] === "PROFSN") {
      options = professionData;
    }
    return options;
  };

  return (
    <Formik
      initialValues={{
        sports_careers:
          initialValues?.length === 0
            ? [{ ...sportsCareerObj }]
            : [...initialValues],
      }}
      validationSchema={getUserCareerYupSchema(yup)}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting }) => {
        const { sports_careers } = values;
        const updatedSportsCareers = sports_careers?.map((sportsCareer) => {
          const updatedSportCareer = sportsCareer?.["sport_career"]?.map(
            (career) => {
              return {
                ...career,
                profiles: career.profiles?.value,
                roles: career.roles?.map((type) => type.value),
                from: helper.getJSDateObject(career.from),
                to: career.isCurrent ? null : helper.getJSDateObject(career.to),
              };
            }
          );
          delete sportsCareer.isInitial;
          return {
            ...sportsCareer,
            sport_career: updatedSportCareer,
          };
        });

        mutate(
          {
            sports_careers: updatedSportsCareers,
            user_id: userData?.["user_id"],
          },
          {
            onSettled: (_, error) => {
              setSubmitting(false);
              const toastTitle = error
                ? "Failed to update your sports career. Please try again."
                : "Your sports career has been updated.";
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
            <HeadingSmall textTransform="uppercase">Sports Career</HeadingSmall>

            <FieldArray
              name="sports_careers"
              render={(sportsCareersHelpers) => (
                <VStack w="full" alignItems="flex-start" spacing={7}>
                  {formik.values.sports_careers?.length === 0 ? (
                    <Button
                      fontSize="sm"
                      variant="link"
                      onClick={() => sportsCareersHelpers.push(sportsCareerObj)}
                    >
                      + Add Sport
                    </Button>
                  ) : (
                    formik.values.sports_careers?.map(
                      (sportsCareer, sportsCareersIndex) => (
                        <Fragment key={sportsCareersIndex}>
                          <FieldLayout label="Sport">
                            <Flex w="full" gap={2}>
                              <SelectWithValidation
                                name={`sports_careers[${sportsCareersIndex}].sports_id`}
                                placeholder="Select Sport"
                                disabled={sportsCareer?.isInitial}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  formik.setFieldValue(
                                    `sports_careers[${sportsCareersIndex}].sport_career`,
                                    [careerObj]
                                  );
                                  formik.setFieldTouched(
                                    `sports_careers[${sportsCareersIndex}].sport_career`,
                                    false
                                  );
                                }}
                                validate={(value) => {
                                  const filteredSports =
                                    formik.values.sports_careers.filter(
                                      (career) => career["sports_id"] == value
                                    );

                                  if (filteredSports?.length > 1)
                                    return "Career already exists for this sport";
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
                                  sportsCareersHelpers.remove(
                                    sportsCareersIndex
                                  )
                                }
                              >
                                <TextSmall>
                                  Are you sure you want to delete this sport
                                  from your sports career?
                                </TextSmall>
                              </DeletePopover>
                            </Flex>
                          </FieldLayout>
                          <FieldArray
                            name={`sports_careers[${sportsCareersIndex}].sport_career`}
                            render={(sportCareerHelpers) => (
                              <VStack
                                alignItems="flex-start"
                                w="full"
                                spacing={3}
                              >
                                <TextSmall>
                                  Provide your career details for the above
                                  sport
                                </TextSmall>
                                {sportsCareer.sport_career?.length === 0 ? (
                                  <Button
                                    fontSize="sm"
                                    variant="link"
                                    onClick={() =>
                                      sportCareerHelpers.push(careerObj)
                                    }
                                  >
                                    + Add Career
                                  </Button>
                                ) : (
                                  sportsCareer.sport_career?.map(
                                    (career, sportCareerIndex) => (
                                      <Flex
                                        key={sportCareerIndex}
                                        alignItems="baseline"
                                        w="full"
                                        gap={[2, 5, 10]}
                                      >
                                        <Text>{sportCareerIndex + 1}</Text>

                                        <Grid
                                          templateColumns="repeat(2, 1fr)"
                                          gap={5}
                                          flexGrow={1}
                                        >
                                          <GridItem colSpan={[2, 2, 2, 1]}>
                                            <TextBoxWithValidation
                                              name={`sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].name`}
                                              placeholder="Organization/Club/Team name"
                                            />
                                          </GridItem>
                                          <GridItem colSpan={[2, 2, 2, 1]}>
                                            <TextBoxWithValidation
                                              name={`sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].url`}
                                              placeholder="Org. URL"
                                            />
                                          </GridItem>
                                          <GridItem colSpan={[2, 2, 2, 1]}>
                                            <MultiSelect
                                              name={`sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].profiles`}
                                              placeholder="Select Profile"
                                              instanceId="profiles"
                                              options={getProfileOptions(
                                                formik.values.sports_careers[
                                                  sportsCareersIndex
                                                ].sports_id
                                              )}
                                              customOnChange={() =>
                                                formik.setFieldValue(
                                                  `sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].roles`,
                                                  []
                                                )
                                              }
                                            />
                                          </GridItem>
                                          <GridItem colSpan={[2, 2, 2, 1]}>
                                            <MultiSelect
                                              name={`sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].roles`}
                                              placeholder="Select Roles"
                                              isMulti
                                              instanceId="roles"
                                              options={getRoleOptions(
                                                formik.values.sports_careers[
                                                  sportsCareersIndex
                                                ].sports_id,
                                                formik.values.sports_careers[
                                                  sportsCareersIndex
                                                ].sport_career[sportCareerIndex]
                                                  .profiles
                                              )}
                                            />
                                          </GridItem>
                                          <GridItem colSpan={[2, 2, 2, 1]}>
                                            <DatePicker
                                              name={`sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].from`}
                                              placeholderText="From"
                                              dateFormat="MM/yyyy"
                                              showMonthYearPicker
                                            />
                                          </GridItem>
                                          <GridItem colSpan={[2, 2, 2, 1]}>
                                            <DatePicker
                                              name={`sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].to`}
                                              placeholderText="To"
                                              disabled={
                                                formik.values.sports_careers[
                                                  sportsCareersIndex
                                                ].sport_career[sportCareerIndex]
                                                  .isCurrent
                                              }
                                              dateFormat="MM/yyyy"
                                              showMonthYearPicker
                                            />
                                          </GridItem>
                                          <GridItem colSpan={[2, 2, 2, 1]}>
                                            <Field
                                              name={`sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].isCurrent`}
                                            >
                                              {({ field }) => (
                                                <Checkbox
                                                  borderColor="gray.300"
                                                  {...field}
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                    if (e.target.checked) {
                                                      formik.setFieldValue(
                                                        `sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].to`,
                                                        null
                                                      );
                                                    }
                                                    formik.setFieldError(
                                                      `sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].to`,
                                                      undefined
                                                    );
                                                  }}
                                                  isChecked={
                                                    formik.values
                                                      .sports_careers[
                                                      sportsCareersIndex
                                                    ].sport_career[
                                                      sportCareerIndex
                                                    ].isCurrent
                                                  }
                                                >
                                                  <TextSmall>Current</TextSmall>
                                                </Checkbox>
                                              )}
                                            </Field>
                                          </GridItem>
                                          <GridItem colSpan={2}>
                                            <TextAreaWithValidation
                                              name={`sports_careers[${sportsCareersIndex}].sport_career[${sportCareerIndex}].achievements`}
                                              placeholder="Achievements/Milestones"
                                            />
                                          </GridItem>
                                          {sportCareerIndex ===
                                            sportsCareer.sport_career?.length -
                                              1 && (
                                            <GridItem
                                              colSpan={2}
                                              justifySelf="end"
                                            >
                                              <Button
                                                fontSize="sm"
                                                variant="link"
                                                alignSelf="flex-end"
                                                onClick={() =>
                                                  sportCareerHelpers.push(
                                                    careerObj
                                                  )
                                                }
                                              >
                                                + Add Career
                                              </Button>
                                            </GridItem>
                                          )}
                                        </Grid>
                                        {formik.values.sports_careers[
                                          sportsCareersIndex
                                        ].sport_career.length > 1 && (
                                          <DeletePopover
                                            title="Delete Career"
                                            trigger={
                                              <IconButton
                                                size={iconButtonSize}
                                                icon={
                                                  <DeleteIcon fontSize="18px" />
                                                }
                                                colorScheme="primary"
                                                tooltipLabel="Delete Career"
                                              />
                                            }
                                            handleDelete={() =>
                                              sportCareerHelpers.remove(
                                                sportCareerIndex
                                              )
                                            }
                                          >
                                            <TextSmall>
                                              Are you sure you want to delete
                                              this career from your sports
                                              career?
                                            </TextSmall>
                                          </DeletePopover>
                                        )}
                                      </Flex>
                                    )
                                  )
                                )}
                                {sportsCareersIndex ===
                                  formik.values.sports_careers?.length - 1 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      sportsCareersHelpers.push(sportsCareerObj)
                                    }
                                  >
                                    + Add Sport
                                  </Button>
                                )}
                              </VStack>
                            )}
                          />
                        </Fragment>
                      )
                    )
                  )}
                </VStack>
              )}
            />

            <Button type="submit" isLoading={isLoading}>
              Save
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};

export default UserProfileEditCareer;
