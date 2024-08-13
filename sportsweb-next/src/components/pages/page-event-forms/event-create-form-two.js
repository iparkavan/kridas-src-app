import {
  Box,
  Flex,
  HStack,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
// import { values } from "draft-js/lib/DefaultDraftBlockRenderMap";
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { useQueries } from "react-query";
import { getEventCreateYupSchemaFormTwo } from "../../../helper/constants/event-constants";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import { useCountries } from "../../../hooks/country-hooks";
import {
  useCreateVenue,
  useEventByIdNew,
  useUpdateVenueNew,
} from "../../../hooks/event-hook";
import {
  useChildPagesSearch,
  usePage,
  usePages,
} from "../../../hooks/page-hooks";
import { useUser } from "../../../hooks/user-hooks";
import pageService from "../../../services/page-service";
import Button from "../../ui/button";
import IconButton from "../../ui/icon-button";
import { DeleteIcon } from "../../ui/icons";
import DeletePopover from "../../ui/popover/delete-popover";
import MultiSelect from "../../ui/select/multi-select";
import SelectWithValidation from "../../ui/select/select-with-validation";
import LabelText from "../../ui/text/label-text";
import { TextMedium, TextSmall } from "../../ui/text/text";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import EventVenueThirdParty from "./event-venue-thirdparty";
import * as yup from "yup";
function EventCreateFormTwo({
  eventLoading,
  prevStep,
  nextStep,
  activeStep,
  steps,
  eventid,
  setEventId,
  isTypeEdit,
}) {
  const router = useRouter();
  const { data: eventData, isLoading } = useEventByIdNew(eventid);
  const { data: countriesData = [] } = useCountries();
  const { data: userData } = useUser();
  // const [change, setChange] = useState(false);
  const toast = useToast();
  const { mutate: updateMutate, isLoading: updateLoading } =
    useUpdateVenueNew(eventid);
  const { mutate: newVenueMutate, isLoading: createLoading } = useCreateVenue();
  const venueObj = {
    venueId: "",
    venue_name: "",
    address: {
      url: "",
      line1: "",
      pincode: "",
      city: "",
      country: "",
      state: "",
    },
    venue_type: "",
  };
  const venueObjThirdParty = {
    venue_name: "",
    address: {
      url: "",
      line1: "",
      pincode: "",
      city: "",
      country: "",
      state: "",
    },
  };
  const pages = useQueries(
    eventData?.eventVenue
      ? eventData.eventVenue.map((pageId) => ({
          queryKey: ["page", pageId],
          queryFn: () => pageService.getPage(pageId),
        }))
      : []
  );
  const updatedVenues =
    pages.length > 0
      ? pages.map((page) => ({
          venueId: {
            value: page?.data?.company_id,
            label: page?.data?.company_name,
          },
          venue_type: "PV",
          address: {
            url: page?.data?.address?.url,
            line1: page?.data?.address?.line1,
            pincode: page?.data?.address?.pincode,
            city: page?.data?.address?.city,
            country: page?.data?.address?.country,
            state: page?.data?.address?.state,
          },
        }))
      : [
          {
            venue_type: "VU",
          },
        ];

  const TextBoxSearch = ({ index }) => {
    const { values, setFieldValue } = useFormikContext();
    const { data: childPages } = useChildPagesSearch(
      ""
      // values?.eventVenue[index].venueId?.label
    );
    const pageOptions =
      childPages?.map((page) => ({
        value: page.company_id,
        label: page.company_name,
      })) || [];

    const [enabled, setEnabled] = useState(false);
    const { data: pageData } = usePage(
      enabled && values?.eventVenue[index].venueId?.value
    );
    useEffect(() => {
      if (pageData) {
        setFieldValue(
          `eventVenue[${index}].address.url`,
          pageData.address?.url
        );
        if (pageData.address?.line2) {
          setFieldValue(
            `eventVenue[${index}].address.line1`,
            `${pageData.address?.line1} ${pageData.address?.line2}`
          );
        } else {
          setFieldValue(
            `eventVenue[${index}].address.line1`,
            pageData.address?.line1
          );
        }
        setFieldValue(
          `eventVenue[${index}].address.pincode`,
          pageData.address?.pincode
        );
        setFieldValue(
          `eventVenue[${index}].address.city`,
          pageData.address?.city
        );
        setFieldValue(
          `eventVenue[${index}].address.state`,
          pageData.address?.state
        );

        setFieldValue(
          `eventVenue[${index}].address.country`,
          pageData.address?.country
        );
      }
    }, [pageData, index, setFieldValue]);
    return (
      <MultiSelect
        name={`eventVenue[${index}].venueId`}
        placeholder="Select Venue"
        options={pageOptions}
        isClearable={true}
        customOnChange={(value) => {
          if (value) {
            setEnabled(true);
            setFieldValue(`eventVenue[${index}].venue_type`, "PV");
          } else {
            setEnabled(false);
            setFieldValue(`eventVenue[${index}].venue_type`, "");
          }
        }}
      />
    );
  };
  if (isLoading) return <Skeleton>Loading..</Skeleton>;
  else
    return (
      <Formik
        initialValues={
          {
            // venue_type: eventData?.virtualVenueUrl ? "VU" : "",
            eventVenue:
              eventData?.eventVenue?.length > 0 || eventData?.virtualVenueUrl
                ? // ? eventData?.eventVenue
                  updatedVenues
                : [venueObj],
            virtualVenueUrl: eventData?.virtualVenueUrl || "",
            // eventVenueCreate: [venueObjThirdParty],
            saveAndProceed: true,
          }
          // { ...initialValuesData}
        }
        enableReinitialize={true}
        validationSchema={getEventCreateYupSchemaFormTwo(yup)}
        // onSubmit={({ saveAndProceed, eventVenueCreate, ...values }) => {
        onSubmit={({ saveAndProceed, ...values }) => {
          let virtualVenueUrl = null;
          if (values.eventVenue[0].venue_type === "VU") {
            virtualVenueUrl = values.virtualVenueUrl;
          }

          const partnerVenues = values.eventVenue
            ?.filter((venue) => venue.venue_type === "PV")
            ?.map((venue) => venue.venueId.value);

          const thirdPartyVenues = values.eventVenue
            ?.filter((venue) => venue.venue_type === "TV")
            ?.map((venue) => ({
              venue_name: venue.venue_name,
              address: venue.address,
            }));

          if (thirdPartyVenues?.length === 0) {
            updateMutate(
              {
                eventId: eventid,
                eventVenue: partnerVenues,
                userId: userData.user_id,
                virtualVenueUrl,
                eventVenueOther: null,
              },
              {
                onSuccess: () => {
                  // toast({
                  //   title: `Your event has been Updated`,
                  //   position: "top",
                  //   status: "success",
                  //   duration: 3000,
                  //   isClosable: true,
                  // });
                  if (saveAndProceed) {
                    nextStep();
                  } else {
                    router.back();
                  }
                },
              }
            );
          } else {
            newVenueMutate(thirdPartyVenues, {
              onSuccess: (data) => {
                const thirdPartyVenueIds = data
                  ?.filter((page) => page.parent_company_id)
                  ?.map((page) => page.company_id);

                const allVenues = [...partnerVenues, ...thirdPartyVenueIds];

                updateMutate(
                  {
                    eventId: eventid,
                    eventVenue: allVenues,
                    userId: userData.user_id,
                    virtualVenueUrl,
                    eventVenueOther: null,
                  },
                  {
                    onSuccess: () => {
                      // toast({
                      //   title: `Your event has been Updated`,
                      //   position: "top",
                      //   status: "success",
                      //   duration: 3000,
                      //   isClosable: true,
                      // });
                      if (saveAndProceed) {
                        nextStep();
                      } else {
                        router.back();
                      }
                    },
                  }
                );
              },
            });
          }

          // let eventVenue, virtualVenueUrl;
          // if (venue_type === "PV") {
          //   eventVenue = values?.eventVenue.map((venue) => venue.venueId.value);
          //   virtualVenueUrl = null;
          // } else {
          //   virtualVenueUrl = values?.virtualVenueUrl;
          //   eventVenue = null;
          // }
          // if (venue_type === "PV") {
          //   updateMutate(
          //     {
          //       eventId: eventid,
          //       eventVenue,
          //       userId: userData.user_id,
          //       virtualVenueUrl,
          //       eventVenueOther: null,
          //     },
          //     {
          //       onSuccess: () => {
          //         nextStep();
          //         toast({
          //           title: `Your event has been Updated`,
          //           position: "top",
          //           status: "success",
          //           duration: 3000,
          //           isClosable: true,
          //         });
          //       },
          //     },
          //     {
          //       onError: "error occur",
          //     }
          //   );
          // } else if (venue_type === "TP") {
          //   newVenueMutate(eventVenueCreate, {
          //     onSuccess: (data) => {
          //       const venues = data.map((page) => page.company_id);
          //       updateMutate(
          //         {
          //           eventId: eventid,
          //           eventVenue: venues,
          //           userId: userData.user_id,
          //           virtualVenueUrl,
          //           eventVenueOther: null,
          //         },
          //         {
          //           onSuccess: () => {
          //             nextStep();
          //             toast({
          //               title: `Your event has been Updated`,
          //               position: "top",
          //               status: "success",
          //               duration: 3000,
          //               isClosable: true,
          //             });
          //           },
          //         },
          //         {
          //           onError: "error occur",
          //         }
          //       );
          //     },
          //   });
          // }
        }}
      >
        {(formik) => (
          <Form>
            <VStack
              p={{ base: "2", md: "2", lg: "5" }}
              bg="white"
              gap={5}
              mt={30}
            >
              <Flex
                justify="space-between"
                w="full"
                direction={{ base: "column", md: "row" }}
                gap={{ base: 2, md: 10 }}
              >
                <LabelText
                  p={{ base: "1", md: "2", sm: "1", lg: "1" }}
                  minW="25%"
                >
                  Event Venue
                </LabelText>
                <Box w="full" mt={3}>
                  {/* <SelectWithValidation
                    placeholder="Select Venue"
                    name="venue_type"
                  >
                    <option value="PV">Select From Partner Venue</option>
                    <option value="TV">Enter Third Party Venue</option>
                    <option value="VU"> Virtual Url</option>
                  </SelectWithValidation> */}
                  {/* {formik.values.venue_type === "VU" && (
                    <Box w="full" mt={3}>
                      <TextBoxWithValidation
                        name="virtualVenueUrl"
                        placeholder="Enter your URL"
                        // disabled={eventData && true}
                        fontSize="sm"
                      />
                    </Box>
                  )} */}
                  {/* {formik.values.venue_type === "PV" && ( */}
                  <VStack
                    alignItems="flex-start"
                    width="full"
                    spacing={5}
                    // mt={3}
                  >
                    <FieldArray
                      name="eventVenue"
                      render={(arrayHelpers) => (
                        <Fragment>
                          {formik?.values?.eventVenue?.map((details, index) => (
                            <Fragment key={index}>
                              <HStack w="full">
                                <Text mr={1}>{index + 1}</Text>
                                <TextBoxSearch index={index} />
                                <DeletePopover
                                  title="Delete Venue"
                                  trigger={
                                    <IconButton
                                      size="md"
                                      icon={<DeleteIcon fontSize="18px" />}
                                      colorScheme="primary"
                                      tooltipLabel="Delete Venue"
                                      disabled={
                                        formik.values.eventVenue?.length === 1
                                      }
                                    />
                                  }
                                  handleDelete={() =>
                                    arrayHelpers.remove(index)
                                  }
                                >
                                  <TextSmall>
                                    Are you sure you want to delete this Venue?
                                  </TextSmall>
                                </DeletePopover>
                              </HStack>
                              <HStack>
                                <Button
                                  size="sm"
                                  variant={
                                    formik.values.eventVenue[index]
                                      .venue_type === "TV"
                                      ? "solid"
                                      : "outline"
                                  }
                                  onClick={() => {
                                    // formik.setFieldValue(
                                    //   `eventVenue[${index}].venue_type`,
                                    //   "TV"
                                    // );
                                    formik.setFieldValue("virtualVenueUrl", "");
                                    // formik.setFieldValue(
                                    //   `eventVenue[${index}].venueId`,
                                    //   ""
                                    // );
                                    formik.setFieldValue(
                                      `eventVenue[${index}]`,
                                      { ...venueObj, venue_type: "TV" }
                                    );
                                  }}
                                >
                                  + Add New Venue
                                </Button>
                                <Button
                                  size="sm"
                                  variant={
                                    formik.values.eventVenue[index]
                                      .venue_type === "VU"
                                      ? "solid"
                                      : "outline"
                                  }
                                  onClick={() => {
                                    // formik.setFieldValue(
                                    //   `eventVenue[${index}].venue_type`,
                                    //   "VU"
                                    // );
                                    // formik.setFieldValue(
                                    //   `eventVenue[${index}].venueId`,
                                    //   ""
                                    // );
                                    formik.setFieldValue(
                                      `eventVenue[${index}]`,
                                      { ...venueObj, venue_type: "VU" }
                                    );
                                  }}
                                >
                                  + Add Virtual Url
                                </Button>
                              </HStack>
                              {formik.values.eventVenue[index].venue_type ===
                                "PV" && (
                                <>
                                  <TextBoxWithValidation
                                    name={`eventVenue[${index}].address.url`}
                                    placeholder="Map URL"
                                    fontSize="sm"
                                  />
                                  <TextBoxWithValidation
                                    name={`eventVenue[${index}].address.line1`}
                                    placeholder="Address"
                                    fontSize="sm"
                                  />
                                  <HStack w="full" align="self-start">
                                    <TextBoxWithValidation
                                      name={`eventVenue[${index}].address.city`}
                                      placeholder="City / Town"
                                      fontSize="sm"
                                    />
                                    <TextBoxWithValidation
                                      name={`eventVenue[${index}].address.pincode`}
                                      placeholder="Pincode"
                                      fontSize="sm"
                                    />
                                  </HStack>
                                  <HStack w="full" align="self-start">
                                    <SelectWithValidation
                                      placeholder="Select Country"
                                      name={`eventVenue[${index}].address.country`}
                                    >
                                      {countriesData.map((country) => (
                                        <option
                                          key={country["country_code"]}
                                          value={country["country_code"]}
                                        >
                                          {country["country_name"]}
                                        </option>
                                      ))}
                                    </SelectWithValidation>
                                    <SelectWithValidation
                                      placeholder="Select State"
                                      name={`eventVenue[${index}].address.state`}
                                    >
                                      {formik?.values?.eventVenue[index]
                                        ?.address?.country &&
                                        countriesData
                                          ?.find(
                                            (country) =>
                                              country["country_code"] ===
                                              formik?.values?.eventVenue[index]
                                                ?.address.country
                                          )
                                          ?.["country_states"]?.map((state) => (
                                            <option
                                              key={state["state_code"]}
                                              value={state["state_code"]}
                                            >
                                              {state["state_name"]}
                                            </option>
                                          ))}
                                    </SelectWithValidation>
                                  </HStack>
                                </>
                              )}
                              {formik.values.eventVenue[index].venue_type ===
                                "TV" && (
                                <EventVenueThirdParty
                                  formik={formik}
                                  venueObjThirdParty={venueObjThirdParty}
                                  index={index}
                                  arrayHelpers={arrayHelpers}
                                />
                              )}
                              {formik.values.eventVenue[index].venue_type ===
                                "VU" && (
                                <Box w="full" mt={3}>
                                  <TextBoxWithValidation
                                    name="virtualVenueUrl"
                                    placeholder="Enter your URL"
                                    // disabled={eventData && true}
                                    fontSize="sm"
                                  />
                                </Box>
                              )}
                              {formik.touched?.eventVenue?.[index]
                                ?.venue_type &&
                                formik.errors?.eventVenue?.[index]
                                  ?.venue_type && (
                                  <TextMedium color="red.500">
                                    {
                                      formik.errors?.eventVenue[index]
                                        ?.venue_type
                                    }
                                  </TextMedium>
                                )}
                            </Fragment>
                          ))}
                          {Boolean(
                            formik.values.eventVenue.find(
                              (ev) => ev.venue_type !== "VU"
                            )
                          ) && (
                            <Button
                              pt={5}
                              variant="link"
                              colorScheme="primary"
                              fontWeight="normal"
                              onClick={() => {
                                arrayHelpers.push(venueObj);
                              }}
                            >
                              + Add Another
                            </Button>
                          )}
                        </Fragment>
                      )}
                    ></FieldArray>
                  </VStack>
                  {/* )} */}
                  {/* {formik.values.venue_type === "TV" && (
                    <EventVenueThirdParty
                      formik={formik}
                      venueObjThirdParty={venueObjThirdParty}
                    />
                  )} */}
                </Box>
              </Flex>
              <Flex
                direction={{ base: "column", md: "row" }}
                w="full"
                justify="flex-start"
                gap={{ base: "5", md: "2", sm: "1", lg: "5" }}
                pt={5}
              >
                <Button
                  isDisabled={activeStep === 0}
                  mr={4}
                  onClick={prevStep}
                  variant="outline"
                >
                  Previous
                </Button>
                <Spacer />

                {/* <Button
                  colorScheme="primary"
                  // onClick={() => {
                  //   setStatus("DRT");
                  // }}

                  //   onClick={() => {
                  //     formik.setFieldValue("event_status", "DRT");
                  //     setStatus("DRT");
                  //   }}
                  type="submit"
                  isLoading={updateLoading}
                  // onClick={nextStep}
                >
                  Save and Proceed
                </Button> */}

                <Button
                  colorScheme="primary"
                  // onClick={() => {
                  //   formik.setFieldValue("eventStatus", "DRT");
                  //   setStatus("DRT");
                  // }}
                  type="submit"
                  isLoading={updateLoading}
                  // type="submit"
                  // onClick={() => {
                  //   setStatus("PUB");
                  // }}
                  // onClick={() => {
                  //   formik.setFieldValue("event_status", "PUB");
                  //   setStatus("PUB");
                  // }}
                  // isLoading={
                  //   formik.values.event_status === "PUB" &&
                  //   (createLoading || updateLoading)
                  // }

                  // disabled={!formik?.values?.sports_list?.length > 0 && true}
                >
                  Save & Proceed
                </Button>
                {!isTypeEdit && (
                  <Button
                    colorScheme="primary"
                    // onClick={() => {
                    //   formik.setFieldValue("eventStatus", "DRT");
                    //   setStatus("DRT");
                    // }}
                    // type="submit"
                    onClick={() => {
                      formik.setFieldValue("saveAndProceed", false);
                      formik.handleSubmit();
                    }}
                    isLoading={updateLoading}
                  >
                    Save as Draft
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  //   onClick={() => router?.push(`/page/${id}?tab=events`)}
                >
                  Cancel
                </Button>
                {eventData?.eventVenue?.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={nextStep}
                    //   onClick={() => router?.push(`/page/${id}?tab=events`)}
                  >
                    Next
                  </Button>
                )}
              </Flex>
            </VStack>
          </Form>
        )}
      </Formik>
    );
}

export default EventCreateFormTwo;
