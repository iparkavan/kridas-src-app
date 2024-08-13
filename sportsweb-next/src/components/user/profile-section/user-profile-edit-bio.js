import {
  Grid,
  GridItem,
  HStack,
  IconButton,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form, FieldArray } from "formik";
import * as yup from "yup";

import { useUpdateUser, useUser } from "../../../hooks/user-hooks";
import TextAreaWithValidation from "../../ui/textbox/textarea-with-validation";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { getBioYupSchema } from "../../../helper/constants/user-contants";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import { useSports } from "../../../hooks/sports-hooks";
import { HeadingSmall, HeadingXtraSmall } from "../../ui/heading/heading";
import MultiSelect from "../../ui/select/multi-select";
import Button from "../../ui/button";
import FieldLayout from "./user-profile-edit/field-layout";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import { DeleteIcon } from "../../ui/icons";
import { TextMedium } from "../../ui/text/text";

const UserProfileEditBio = () => {
  const toast = useToast();
  const { data: userData, error } = useUser();
  const { data: professionData = [], isLoading: isProfessionLoading } =
    useLookupTable("PRF", {
      select: (data) => {
        const selectOptions = data.map((val) => ({
          value: val.lookup_key,
          label: val.lookup_value,
        }));
        return selectOptions;
      },
    });
  const { mutate, isLoading } = useUpdateUser();
  const { data: sportsData = [] } = useSports({}, true);

  const gameIdObj = { type: "", other_type: "", id: "" };
  const streamObj = { type: "", other_type: "", url: "" };

  if (userData && !isProfessionLoading) {
    return (
      <Formik
        initialValues={{
          sports_id: userData.bio_details?.sports_id || "",
          profession: userData.bio_details?.profession
            ? {
                ...professionData.find(
                  (profession) =>
                    profession.value === userData.bio_details.profession
                ),
              }
            : null,
          description: userData.bio_details?.description || "",
          game_ids: userData.bio_details?.game_ids || [gameIdObj],
          streaming_profiles: userData.bio_details?.streaming_profiles || [
            streamObj,
          ],
        }}
        enableReinitialize={true}
        validationSchema={getBioYupSchema(yup, sportsData)}
        onSubmit={(values, { setSubmitting }) => {
          const bio_details = {
            sports_id: values.sports_id,
            description: values.description,
            profession: values.profession.value,
          };

          const isESports = Boolean(
            sportsData.find((sport) => sport.sports_id == values.sports_id)
              ?.sports_code === "SPOR33"
          );

          if (isESports) {
            bio_details.game_ids = values.game_ids;
            bio_details.streaming_profiles = values.streaming_profiles;
          }

          mutate(
            { userData, values: { bio_details } },
            {
              onSettled: (_, error) => {
                setSubmitting(false);
                const toastTitle = error
                  ? "Failed to update your bio. Please try again."
                  : "Your bio has been updated.";
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
        {({ values }) => {
          const isESports = Boolean(
            values.sports_id &&
              sportsData.find((sport) => sport.sports_id == values.sports_id)
                ?.sports_code === "SPOR33"
          );

          return (
            <Form>
              <VStack alignItems="flex-start" width="full" spacing={4}>
                <HeadingSmall textTransform="uppercase">Bio</HeadingSmall>

                <FieldLayout label="Sport">
                  <SelectWithValidation
                    name="sports_id"
                    placeholder="Select Sport"
                  >
                    {sportsData?.map((sport) => (
                      <option key={sport.sports_id} value={sport.sports_id}>
                        {sport.sports_name}
                      </option>
                    ))}
                  </SelectWithValidation>
                </FieldLayout>

                <FieldLayout label="Player / Profession">
                  <MultiSelect
                    name="profession"
                    placeholder="Player / Profession"
                    options={professionData}
                  />
                </FieldLayout>

                <FieldLayout label="Description">
                  <TextAreaWithValidation
                    name="description"
                    placeholder="Description"
                  />
                </FieldLayout>

                {isESports && (
                  <>
                    <HeadingXtraSmall>GAME ID</HeadingXtraSmall>
                    <FieldArray
                      name="game_ids"
                      render={(helpers) => (
                        <Grid
                          gap={4}
                          templateColumns={{ sm: "auto auto auto" }}
                          alignItems="start"
                        >
                          {values.game_ids.map((game, index) => (
                            <>
                              <HStack alignItems="flex-start" spacing={4}>
                                <TextMedium alignSelf="center">
                                  {index + 1}
                                </TextMedium>
                                <SelectWithValidation
                                  name={`game_ids[${index}].type`}
                                  placeholder="Select Platform"
                                >
                                  <option value="EA ID">EA ID</option>
                                  <option value="Steam ID">Steam ID</option>
                                  <option value="Xbox ID">Xbox ID</option>
                                  <option value="Riot ID">Riot ID</option>
                                  <option value="Discord ID">Discord ID</option>
                                  <option value="OTH">Other</option>
                                </SelectWithValidation>
                              </HStack>

                              {game.type === "OTH" && (
                                <TextBoxWithValidation
                                  name={`game_ids[${index}].other_type`}
                                  placeholder="Enter Platform"
                                />
                              )}

                              <HStack alignItems="flex-start">
                                <TextBoxWithValidation
                                  name={`game_ids[${index}].id`}
                                  placeholder="Enter ID"
                                />

                                <IconButton
                                  variant="ghost"
                                  colorScheme="primary"
                                  icon={<DeleteIcon />}
                                  onClick={() => helpers.remove(index)}
                                />
                              </HStack>

                              {game.type !== "OTH" && <GridItem />}
                            </>
                          ))}
                          <Button
                            justifySelf="start"
                            variant="link"
                            onClick={() => helpers.push(gameIdObj)}
                          >
                            + Add Another
                          </Button>
                        </Grid>
                      )}
                    />
                  </>
                )}

                {isESports && (
                  <>
                    <HeadingXtraSmall>STREAMING PROFILES</HeadingXtraSmall>
                    <FieldArray
                      name="streaming_profiles"
                      render={(helpers) => (
                        <Grid
                          gap={4}
                          templateColumns={{ sm: "auto auto auto" }}
                          alignItems="start"
                        >
                          {values.streaming_profiles.map((stream, index) => (
                            <>
                              <HStack alignItems="flex-start" spacing={4}>
                                <TextMedium alignSelf="center">
                                  {index + 1}
                                </TextMedium>
                                <SelectWithValidation
                                  name={`streaming_profiles[${index}].type`}
                                  placeholder="Select Platform"
                                >
                                  <option value="YouTube">YouTube</option>
                                  <option value="Twitch">Twitch</option>
                                  <option value="OTH">Other</option>
                                </SelectWithValidation>
                              </HStack>

                              {stream.type === "OTH" && (
                                <TextBoxWithValidation
                                  name={`streaming_profiles[${index}].other_type`}
                                  placeholder="Enter Platform"
                                />
                              )}

                              <HStack alignItems="flex-start">
                                <TextBoxWithValidation
                                  name={`streaming_profiles[${index}].url`}
                                  placeholder="Enter URL"
                                />

                                <IconButton
                                  variant="ghost"
                                  colorScheme="primary"
                                  icon={<DeleteIcon />}
                                  onClick={() => helpers.remove(index)}
                                />
                              </HStack>

                              {stream.type !== "OTH" && <GridItem />}
                            </>
                          ))}
                          <Button
                            justifySelf="start"
                            variant="link"
                            onClick={() => helpers.push(streamObj)}
                          >
                            + Add Another
                          </Button>
                        </Grid>
                      )}
                    />
                  </>
                )}

                <Button type="submit" isLoading={isLoading}>
                  Save
                </Button>
              </VStack>
            </Form>
          );
        }}
      </Formik>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return "Loading...";
};

export default UserProfileEditBio;
