import { Box, ButtonGroup, Skeleton, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { HeadingSmall } from "../../ui/heading/heading";
import Modal from "../../ui/modal";
import { TextMedium, TextSmall } from "../../ui/text/text";
import Button from "../../ui/button";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import PlayerPreferencesButtons from "./player-preferences-buttons";
import { getPlayerPreferencesSchema } from "../../../helper/constants/event-constants";

const PlayerPreferencesModal = (props) => {
  const {
    isOpen,
    onClose,
    preferencesOffered,
    isApparelPresent,
    isFoodPresent,
    handleSubmit,
    player,
  } = props;

  const { data: apparelData = [], isLoading: isApparelLoading } =
    useLookupTable("APP");
  const { data: sizesData = [], isLoading: isSizesLoading } =
    useLookupTable("ASZ");
  const { data: foodData = [], isLoading: isFoodLoading } =
    useLookupTable("FDO");

  const isLoading = isApparelLoading || isSizesLoading || isFoodLoading;
  // Not sure if isLoading is required

  let initialValues = {};

  if (player.preferences_opted) {
    initialValues = { ...player.preferences_opted };
  } else {
    if (isApparelPresent) {
      initialValues.apparel_preference = {};
      preferencesOffered.apparel_preference.forEach((apparel) => {
        if (apparel === "TST") {
          initialValues.apparel_preference[apparel] = {
            size: "",
            nameToPrint: "",
            numberToPrint: "",
          };
        } else {
          initialValues.apparel_preference[apparel] = { size: "" };
        }
      });
    }
    if (isFoodPresent) {
      initialValues.food_preference = "";
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" title="Preferences">
      {isLoading ? (
        <Skeleton h={6} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={getPlayerPreferencesSchema(
            yup,
            preferencesOffered,
            isApparelPresent,
            isFoodPresent
          )}
          onSubmit={(values) => {
            handleSubmit(values);
            onClose();
          }}
        >
          {({ values, setFieldValue, touched, errors }) => (
            <Form>
              <Stack spacing={5}>
                {isApparelPresent && (
                  <>
                    <HeadingSmall>APPAREL PREFERENCE</HeadingSmall>

                    {preferencesOffered.apparel_preference.map((apparelKey) => {
                      const apparelName = apparelData.find(
                        (app) => app.lookup_key === apparelKey
                      )?.lookup_value;

                      const isTShirt = apparelKey === "TST";

                      return (
                        <Box key={apparelKey}>
                          <TextMedium mb={1}>
                            {apparelName} - Size (Inches)
                          </TextMedium>
                          <PlayerPreferencesButtons
                            name={`${apparelName}-size`}
                            lookupData={sizesData}
                            type="apparel"
                            value={values.apparel_preference[apparelKey].size}
                            onChange={(value) => {
                              setFieldValue(
                                `apparel_preference.${apparelKey}.size`,
                                value
                              );
                            }}
                          />
                          {touched?.apparel_preference?.[apparelKey]?.size &&
                            errors?.apparel_preference?.[apparelKey]?.size && (
                              <TextSmall mt={2} color="red.500">
                                {errors.apparel_preference[apparelKey].size}
                              </TextSmall>
                            )}
                          {isTShirt && (
                            <Stack direction="row" mt={3} spacing={5}>
                              <TextBoxWithValidation
                                name={`apparel_preference.${apparelKey}.nameToPrint`}
                                label="Name to be printed"
                              />
                              <TextBoxWithValidation
                                name={`apparel_preference.${apparelKey}.numberToPrint`}
                                label="Number to be printed"
                                maxWidth="fit-content"
                              />
                            </Stack>
                          )}
                        </Box>
                      );
                    })}
                  </>
                )}

                {isFoodPresent && (
                  <Box>
                    <HeadingSmall mb={4}>FOOD PREFERENCE</HeadingSmall>
                    <PlayerPreferencesButtons
                      name="food-preference"
                      lookupData={foodData}
                      type="food"
                      value={values.food_preference}
                      onChange={(value) => {
                        setFieldValue("food_preference", value);
                      }}
                    />
                    {touched?.food_preference && errors?.food_preference && (
                      <TextSmall mt={2} color="red.500">
                        {errors.food_preference}
                      </TextSmall>
                    )}
                  </Box>
                )}
              </Stack>

              <ButtonGroup mt={5} w="full" spacing={4}>
                <Button ml="auto" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};

export default PlayerPreferencesModal;
