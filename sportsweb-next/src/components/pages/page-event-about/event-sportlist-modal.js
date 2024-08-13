import React from "react";
import {
  ModalBody,
  Box,
  VStack,
  Button,
  useToast,
  Text,
  Flex,
  FormErrorMessage,
  FormControl,
  ButtonGroup,
  ModalFooter,
  HStack,
  Link,
  Input,
  IconButton,
} from "@chakra-ui/react";
import * as yup from "yup";
import SelectWithValidation from "../../ui/select/select-with-validation";
import { TextSmall } from "../../ui/text/text";
import { Form, Formik, FieldArray } from "formik";
import { HeadingMedium } from "../../ui/heading/heading";
import { useSports } from "../../../hooks/sports-hooks";
import { useEventPrize, useUpdateEvent } from "../../../hooks/event-hook";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import TextAreaWithValidation from "../../ui/textbox/textarea-with-validation";
// import {
//   SportListAboutModalSchema,
//   SportListModalScema,
// } from "../../../helper/constants/event-constants";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import CustomFormLabel from "../../ui/form/form-label";
import Modal from "../../ui/modal";
import { DeleteIcon, Prize, RegisterEvent } from "../../ui/icons";
import MultiSelect from "../../ui/select/multi-select";
import { useDocumentUpload } from "../../../hooks/upload-hooks";

function EventSportlistModal(props) {
  const { data: sports = [] } = useSports();
  // const { mutate, isLoading } = useUpdateEvent();
  // const { data: prizeData = [] } = useEventPrize("PRZ");
  const { mutate, isLoading } = useDocumentUpload();
  const {
    arrayHelpers,
    onClose,
    isOpen,
    sportMode,
    setSportMode,
    currentSport,
    currentIndex,
    setCurrentIndex,
    eventData,
    otherFormik,
    handleModalSubmit,
    docType,
    prizeData,
    aboutFormik,
  } = props;

  const multiPrizeOptions = prizeData?.map((prize) => {
    return {
      ...prize,
      value: prize.category_id,
      label: prize.category_name,
    };
  });

  const initialValues =
    sportMode === "edit"
      ? // currentSport
        // { ...currentSport }
        {
          ...currentSport,
          tournament_category_prizes:
            currentSport?.tournament_category_prizes?.map((prizeId) => {
              const currentPrize = prizeData?.find(
                (p) => p.category_id === prizeId
              );
              return {
                ...currentPrize,
                value: currentPrize?.category_id,
                label: currentPrize?.category_name,
              };
            }),
          doc_list: Array.isArray(currentSport?.doc_list)
            ? currentSport?.doc_list
            : JSON.parse(currentSport?.doc_list),
          // tournament_category_prizes: Array.isArray(
          //   currentSport?.tournament_category_prizes
          // )
          //   ? currentSport?.tournament_category_prizes?.[0]
          //   : currentSport?.tournament_category_prizes?.slice(1, -1),
        }
      : {
          sport_id: "",
          tournament_category: "",
          tournament_format: "",
          // age_restriction: "",
          sport_desc: "",
          min_age: "",
          max_age: "",
          reg_fee: "",
          maximum_players: 1,
          minimum_players: 1,
          max_reg_count: "",
          min_reg_count: 1,
          reg_fee_currency: "",
          reg_fee_currency: "",
          tournament_category_prizes: [],
          doc_list: [null],
        };
  const handleClose = () => {
    setSportMode("view");
    onClose();
  };
  // const mixedSportIds = [80, 82, 16, 72];
  return (
    <Box>
      <Formik
        initialValues={{ ...initialValues }}
        // validationSchema={SportListAboutModalSchema(otherFormik, yup)}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          let max_reg_count = values.max_reg_count;
          if (max_reg_count === "") max_reg_count = null;
          const tournament_category_prizes =
            values.tournament_category_prizes?.map(({ value }) => value);
          values.doc_list = values.doc_list?.filter((doc) => doc?.url);

          if (sportMode === "edit") {
            arrayHelpers.replace(currentIndex, {
              ...values,
              tournament_category_prizes,
              max_reg_count,
            });
          } else {
            arrayHelpers.push({
              ...values,
              tournament_category_prizes,
              max_reg_count,
            });
          }

          // handleModalSubmit(otherFormik);
          otherFormik.handleSubmit();

          actions.resetForm();
          handleClose();
          // onClose();
        }}
        // let updatedValues = { ...values };
        //   if (values?.tournament_category !== "MIXDBL") {
        //     delete updatedValues.min_male;
        //     delete updatedValues.max_male;
        //     delete updatedValues.min_female;
        //     delete updatedValues.max_female;
        //   }
      >
        {({ values, handleChange, errors, touched, setFieldValue }) => (
          <Modal
            title={"Sports Selection"}
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
          >
            <Form>
              <VStack align="stretch">
                <VStack align="self-start">
                  <SelectWithValidation
                    name="sport_id"
                    label="Select a Sport"
                    placeholder="Select"
                    disabled={sportMode === "edit"}
                  >
                    {sports?.map((sport) => (
                      <option
                        key={sport["sports_id"]}
                        value={sport["sports_id"]}
                      >
                        {sport["sports_name"]}
                      </option>
                    ))}
                  </SelectWithValidation>
                </VStack>
                {eventData?.category_name === "Tournament" ? null : (
                  <VStack align="self-start">
                    <SelectWithValidation
                      placeholder="select category"
                      label="Select Category"
                      name="tournament_category"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="For All">For All</option>
                    </SelectWithValidation>
                  </VStack>
                )}
                {eventData?.category_name === "Tournament" ? (
                  <VStack align="self-start">
                    <SelectWithValidation
                      placeholder="select category"
                      name="tournament_category"
                      label="Select Category"
                    >
                      {values?.sport_id &&
                        sports
                          .find(
                            (sport) => sport["sports_id"] == values.sport_id
                          )
                          ?.["sports_category"]?.map((category) => {
                            return (
                              <option
                                key={category["category_code"]}
                                value={category["category_code"]}
                              >
                                {category["category_name"]}
                              </option>
                            );
                          })}
                    </SelectWithValidation>
                  </VStack>
                ) : null}

                {eventData?.category_name === "Tournament" ? (
                  <VStack align="self-start">
                    <SelectWithValidation
                      placeholder="select format"
                      name="tournament_format"
                      label="Select Format"
                    >
                      {values.sport_id &&
                        sports
                          .find(
                            (sport) => sport["sports_id"] == values.sport_id
                          )
                          ?.["sports_format"]?.map((format) => {
                            return (
                              <option
                                key={format["format_code"]}
                                value={format["format_code"]}
                              >
                                {format["format_name"]}
                              </option>
                            );
                          })}
                    </SelectWithValidation>
                  </VStack>
                ) : null}

                <VStack align="self-start">
                  <Flex gap={10}>
                    <FormControl isInvalid={touched.min_age && errors.min_age}>
                      <CustomFormLabel>Min Age</CustomFormLabel>
                      <NumberInput
                        mt={1}
                        defaultValue={values?.min_age}
                        min={1}
                        max={99}
                        onChange={(value) => setFieldValue("min_age", +value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors.min_age}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={touched.max_age && errors.max_age}>
                      <CustomFormLabel>Max Age</CustomFormLabel>
                      <NumberInput
                        mt={1}
                        defaultValue={values?.max_age}
                        min={1}
                        max={99}
                        onChange={(value) => setFieldValue("max_age", +value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors.max_age}</FormErrorMessage>
                    </FormControl>

                    {/* <TextBoxWithValidation
                          label="Min Age"
                          name="min_age"
                          w={40}
                        />
                        <TextBoxWithValidation
                          label="Max Age"
                          name="max_age"
                          w={40}
                        /> */}
                  </Flex>
                </VStack>
                <VStack
                  // spacing={[1, 3]}
                  // direction={["column", "row"]}
                  align="self-start"
                  w="full"
                >
                  <CustomFormLabel>Other Settings</CustomFormLabel>

                  {/* {values?.tournament_category === "MIXDBL" && (
                    <>
                      <TextSmall w={400}>Minimum Participants</TextSmall>
                      <HStack gap={5}>
                        <TextSmall>Male</TextSmall>
                        <FormControl
                          isInvalid={touched.min_male && errors.min_male}
                        >
                          <NumberInput
                            size="sm"
                            maxW={20}
                            mt={1}
                            defaultValue={values?.min_male}
                            min={1}
                            max={99}
                            onChange={(value) =>
                              setFieldValue("min_male", +value)
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>{errors.min_male}</FormErrorMessage>
                        </FormControl>
                        <TextSmall>Female</TextSmall>
                        <FormControl
                          isInvalid={touched.min_female && errors.min_female}
                        >
                          <NumberInput
                            size="sm"
                            maxW={20}
                            mt={1}
                            defaultValue={values?.min_female}
                            min={1}
                            max={99}
                            onChange={(value) =>
                              setFieldValue("min_female", +value)
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>
                            {errors.min_female}
                          </FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <TextSmall w={400}>Maximum Participants</TextSmall>
                      <HStack gap={5}>
                        <TextSmall>Male</TextSmall>
                        <FormControl
                          isInvalid={touched.max_male && errors.max_male}
                        >
                          <NumberInput
                            size="sm"
                            maxW={20}
                            mt={1}
                            defaultValue={values?.max_male}
                            min={1}
                            max={99}
                            onChange={(value) =>
                              setFieldValue("max_male", +value)
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>{errors.max_male}</FormErrorMessage>
                        </FormControl>
                        <TextSmall>Female</TextSmall>
                        <FormControl
                          isInvalid={touched.max_female && errors.max_female}
                        >
                          <NumberInput
                            size="sm"
                            maxW={20}
                            mt={1}
                            defaultValue={values?.max_female}
                            min={1}
                            max={99}
                            onChange={(value) =>
                              setFieldValue("max_female", +value)
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>
                            {errors.max_female}
                          </FormErrorMessage>
                        </FormControl>
                      </HStack>
                    </>
                  )} */}
                  <VStack
                    // spacing={[1, 3]}
                    // direction={["column", "row"]}
                    align="self-start"
                    w="full"
                    pt={3}
                  >
                    <HStack w="full">
                      <TextSmall w="full">
                        Overall minimum number of players per Team
                      </TextSmall>
                      <FormControl
                        isInvalid={
                          touched.minimum_players && errors.minimum_players
                        }
                      >
                        <NumberInput
                          size="sm"
                          maxW={20}
                          mt={1}
                          defaultValue={values?.minimum_players}
                          min={1}
                          max={99}
                          onChange={(value) =>
                            setFieldValue("minimum_players", +value)
                          }
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>
                          {errors.minimum_players}
                        </FormErrorMessage>
                      </FormControl>
                    </HStack>
                    <HStack w="full">
                      <TextSmall w="full">
                        Overall maximum number of players per Team
                      </TextSmall>

                      <FormControl
                        isInvalid={
                          touched.maximum_players && errors.maximum_players
                        }
                      >
                        <NumberInput
                          size="sm"
                          maxW={20}
                          mt={1}
                          defaultValue={values?.maximum_players}
                          min={1}
                          max={99}
                          onChange={(value) =>
                            setFieldValue("maximum_players", +value)
                          }
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>
                          {errors.maximum_players}
                        </FormErrorMessage>
                      </FormControl>
                    </HStack>
                    <HStack w="full" mt={5}>
                      <TextSmall w="full">
                        Overall Minimum number of Teams
                      </TextSmall>

                      <FormControl
                        isInvalid={
                          touched.min_reg_count && errors.min_reg_count
                        }
                      >
                        <NumberInput
                          size="sm"
                          maxW={20}
                          mt={1}
                          defaultValue={values?.min_reg_count}
                          min={1}
                          max={99}
                          onChange={(value) =>
                            setFieldValue("min_reg_count", +value)
                          }
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>
                          {errors.min_reg_count}
                        </FormErrorMessage>
                      </FormControl>
                    </HStack>
                    <HStack w="full">
                      <TextSmall w="full">
                        Overall Maximum number of Teams
                      </TextSmall>

                      <FormControl
                        isInvalid={
                          touched.max_reg_count && errors.max_reg_count
                        }
                      >
                        <NumberInput
                          size="sm"
                          maxW={20}
                          mt={1}
                          defaultValue={values?.max_reg_count}
                          min={1}
                          max={99}
                          onChange={(value) =>
                            setFieldValue("max_reg_count", +value)
                          }
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>
                          {errors.max_reg_count}
                        </FormErrorMessage>
                      </FormControl>
                    </HStack>
                  </VStack>
                </VStack>

                <VStack
                  // spacing={[1, 3]}
                  // direction={["column", "row"]}
                  align="self-start"
                  w="full"
                  pt={3}
                >
                  <HStack>
                    <RegisterEvent size={30} />
                    <TextSmall w="full">Registration/Participant Fee</TextSmall>
                  </HStack>

                  <HStack align="self-start">
                    <FormControl isInvalid={touched.reg_fee && errors.reg_fee}>
                      <NumberInput
                        mt={1}
                        defaultValue={values?.reg_fee}
                        onChange={(value) => setFieldValue("reg_fee", +value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors.reg_fee}</FormErrorMessage>
                    </FormControl>
                    <SelectWithValidation
                      name="reg_fee_currency"
                      // placeholder="select category"
                    >
                      <option selected hidden disabled value=""></option>
                      <option value="INR">INR</option>
                      <option value="SGD">SGD</option>
                      {/* <option value="Women">Women</option>
                      <option value="For All">For All</option> */}
                    </SelectWithValidation>
                  </HStack>
                </VStack>
                <VStack align="self-start" w="full" pt={3}>
                  <HStack>
                    <Prize size={30} />
                    <TextSmall w="full">Price/Acknowledgement</TextSmall>
                  </HStack>

                  <HStack align="self-start">
                    {/* <SelectWithValidation name="tournament_category_prizes">
                      <option selected hidden disabled value=""></option>
                      {prizeData?.map((prize) => (
                        <option
                          key={prize.category_id}
                          value={prize.category_id}
                        >
                          {prize.category_name}
                        </option>
                      ))}
                    </SelectWithValidation> */}
                    <MultiSelect
                      isMulti
                      placeholder="Select Prize"
                      id="tournament_category_prizes"
                      instanceId="tournament_category_prizes"
                      name="tournament_category_prizes"
                      options={multiPrizeOptions}
                    />

                    {/* <FormControl isInvalid={touched.reg_fee && errors.reg_fee}>
                      <NumberInput
                        mt={1}
                        defaultValue={values?.reg_fee}
                        min={1}
                        max={99}
                        onChange={(value) => setFieldValue("reg_fee", +value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors.reg_fee}</FormErrorMessage>
                    </FormControl>
                    <SelectWithValidation name="reg_fee_currencyi">
                      <option selected hidden disabled value=""></option>
                      <option value="INR">INR</option>
                    </SelectWithValidation> */}
                  </HStack>
                </VStack>
                <VStack align="self-start">
                  <TextAreaWithValidation
                    label="Description"
                    placeholder="description"
                    name="sport_desc"
                  />
                </VStack>
                <VStack align="self-start" pt={3}>
                  <TextSmall w="full">Document Upload</TextSmall>
                  <FieldArray
                    name="doc_list"
                    render={(documentHelpers) => (
                      <>
                        {values.doc_list?.map((doc, index) => (
                          <HStack key={index}>
                            <SelectWithValidation
                              name={`doc_list[${index}].type`}
                            >
                              <option
                                selected
                                hidden
                                disabled
                                value=""
                              ></option>
                              {docType?.map((type) => (
                                <option
                                  key={type.lookup_key}
                                  value={type.lookup_key}
                                >
                                  {type.lookup_value}
                                </option>
                              ))}
                            </SelectWithValidation>
                            {doc?.url && (
                              <Link
                                href={doc.url}
                                color="primary.500"
                                isExternal
                              >
                                {doc?.name}
                              </Link>
                            )}
                            <Button
                              as="label"
                              id="upload-file"
                              variant="outline"
                              size="sm"
                              colorScheme="primary"
                              cursor="pointer"
                              disabled={doc?.url || !doc?.type}
                              isLoading={isLoading}
                            >
                              Upload
                              <Input
                                type="file"
                                id="upload-file"
                                display="none"
                                disabled={!doc?.type}
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    mutate(
                                      {
                                        files: e.target.files,
                                      },
                                      {
                                        onSuccess: (data) => {
                                          const type = doc.type;
                                          const uploadedDoc = data[0];
                                          setFieldValue(`doc_list[${index}]`, {
                                            ...uploadedDoc,
                                            type,
                                          });
                                        },
                                      }
                                    );
                                  }
                                }}
                              />
                            </Button>
                            <IconButton
                              variant="ghost"
                              colorScheme="primary"
                              icon={<DeleteIcon />}
                              onClick={() => documentHelpers.remove(index)}
                            />
                          </HStack>
                        ))}
                        <Button
                          variant="link"
                          colorScheme="primary"
                          fontWeight="normal"
                          onClick={() => {
                            documentHelpers.push(null);
                          }}
                        >
                          + Add Another
                        </Button>
                      </>
                    )}
                  />
                </VStack>
              </VStack>

              <ModalFooter>
                <ButtonGroup>
                  <Button
                    onClick={handleClose}
                    _focus={{ boxShadow: "none" }}
                    variant="outline"
                    colorScheme="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="primary"
                    mr={3}
                    _focus={{ boxShadow: "none" }}
                    type="submit"
                    // isLoading={isLoading}
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </Form>
          </Modal>
        )}
      </Formik>
    </Box>
  );
}

export default EventSportlistModal;
