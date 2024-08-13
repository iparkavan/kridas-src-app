import { useEffect, useRef, useState } from "react";
import { Formik, Form, FieldArray, useFormikContext } from "formik";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  Link,
  ModalFooter,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Stack,
  VStack,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import * as yup from "yup";

import { TextMedium, TextSmall } from "../../ui/text/text";
import Modal from "../../ui/modal";
import { useSports } from "../../../hooks/sports-hooks";
import SelectWithValidation from "../../ui/select/select-with-validation";
import TextAreaWithValidation from "../../ui/textbox/textarea-with-validation";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import {
  addTocategory,
  editCategory,
  SportListModalScema,
} from "../../../helper/constants/event-constants";
import CustomFormLabel from "../../ui/form/form-label";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import { DeleteIcon, Prize, RegisterEvent } from "../../ui/icons";
import {
  useEventByIdNew,
  useEventPrize,
  useUpdateTournament,
} from "../../../hooks/event-hook";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import { useDocumentUpload } from "../../../hooks/upload-hooks";
import MultiSelect from "../../ui/select/multi-select";
import EventDraftEditor from "./event-draft-editor";
// import { values } from "draft-js/lib/DefaultDraftBlockRenderMap";
import DatePicker from "../../ui/pickers/date-picker";
import { useChildPagesSearch, usePage } from "../../../hooks/page-hooks";
import { useCategoriesByType } from "../../../hooks/category-hooks";
import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { useUser } from "../../../hooks/user-hooks";
import { useQueries } from "react-query";
import pageService from "../../../services/page-service";
import LabelText from "../../ui/text/label-text";
import { format } from "date-fns";
import { useLocation } from "../../../hooks/location-hooks";
import {
  useCountries,
  useCountryByISOCode,
} from "../../../hooks/country-hooks";
import { MdVerified } from "react-icons/md";
import EventIndemnityForm from "../page-event-forms/event-indemnity-form";

function CategoryNameInput({ sports }) {
  const { values, setFieldValue, touched } = useFormikContext();

  const sportId = values.tournaments[0].sportsRefid;
  const tournamentCategory =
    values.tournaments[0].tournamentCategories[0].tournamentCategory;
  const criteriaBy =
    values.tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria
      .criteria_by;
  const ageValue =
    values.tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria
      .age_value;
  const isAgeValuePresent = criteriaBy === "Open" || ageValue;
  const isAgeValueTouched =
    criteriaBy === "Open" ||
    (criteriaBy !== "Open" &&
      Boolean(
        touched?.tournaments?.[0]?.tournamentCategories?.[0]?.tournamentConfig
          ?.age_criteria?.age_value
      ));

  const initialRenderRef = useRef(false);
  useEffect(() => {
    if (
      sportId &&
      tournamentCategory &&
      criteriaBy &&
      isAgeValuePresent &&
      isAgeValueTouched &&
      initialRenderRef.current
    ) {
      const sport = sports.find((s) => s.sports_id == sportId);
      const sportCategoryName = sport?.sports_category.find(
        (cat) => cat.category_code === tournamentCategory
      )?.category_name;

      setFieldValue(
        "tournaments[0].tournamentCategories[0].tournamentCategoryName",
        `${sport.sports_name} - ${sportCategoryName} (${criteriaBy}${
          criteriaBy !== "Open" ? ` ${ageValue}` : ""
        })`
      );
    }
    initialRenderRef.current = true;
  }, [
    ageValue,
    criteriaBy,
    isAgeValuePresent,
    isAgeValueTouched,
    setFieldValue,
    sportId,
    sports,
    tournamentCategory,
  ]);

  return (
    <TextBoxWithValidation
      name="tournaments[0].tournamentCategories[0].tournamentCategoryName"
      label="Category Name"
    />
  );
}

function PageEventSportsSelect(props) {
  const {
    onClose,
    isOpen,
    sportMode,
    setSportMode,
    tournament,
    tournamentCategory,
    formik: formFormik,
    docType,
    prizeData,
    eventid,
    index,
    eventData,
    apparelData,
    foodData,
    pageOptions,
  } = props;
  const { data: userData } = useUser();
  const { data: sports = [] } = useSports();
  const { data: locationData } = useLocation();
  const { data: countryData } = useCountryByISOCode(locationData?.countryCode);
  const { data: countriesData = [] } = useCountries();

  const { data: categories } = useCategoriesByType("EVT");
  // const { data: eventData } = useEventByIdNew(eventid);
  const { mutate, isLoading, isError } = useDocumentUpload();
  const { data: participantCategories = [] } = useCategoriesByType("PRC");
  const [enabled, setEnabled] = useState(false);
  const multiPrizeOptions = prizeData?.map((prize) => {
    return {
      ...prize,
      value: prize.category_id,
      label: prize.category_name,
    };
  });
  const [publish, setPublish] = useState(false);
  const {
    isOpen: isClauseOpen,
    onOpen: onClauseOpen,
    onClose: onClauseClose,
  } = useDisclosure();
  const formatDate = (date) => format(new Date(date), "dd-MMM-yyyy");

  // const eventVenueId = eventData?.eventVenue?.[0];
  // const { data: pageData, isLoadingPage } = usePage(eventVenueId);

  // const pages = useQueries(
  //   eventData?.eventVenue
  //     ? eventData.eventVenue.map((pageId) => ({
  //         queryKey: ["page", pageId],
  //         queryFn: () => pageService.getPage(pageId),
  //       }))
  //     : []
  // );

  // useEffect(() => {
  //   pages.map((data) => setVenue(data));
  // }, [pages, setVenue]);

  const EventCategoryName = categories?.find(
    (a) => a.category_id === eventData?.eventCategoryId
  )?.category_name;

  const getContentState = (value) => {
    let contentState;
    try {
      contentState = convertFromRaw(JSON.parse(value));
    } catch (e) {
      contentState = ContentState.createFromText(value);
    }
    return contentState;
  };

  let tournamentConfig, preferencesOffered;
  if (sportMode === "edit") {
    tournamentConfig =
      typeof tournamentCategory?.tournamentConfig === "string"
        ? JSON.parse(tournamentCategory.tournamentConfig)
        : tournamentCategory.tournamentConfig;
    preferencesOffered =
      typeof tournamentCategory?.preferencesOffered === "string"
        ? JSON.parse(tournamentCategory.preferencesOffered)
        : {
            apparel_preference: [],
            food_preference: [],
          };
  }

  useEffect(() => {
    setPublish(false);
  }, [sportMode, isOpen]);

  const defaultDescContent =
    sportMode === "edit" && tournamentCategory.tournamentCategoryDesc
      ? getContentState(tournamentCategory.tournamentCategoryDesc)
      : convertFromRaw({
          entityMap: {},
          blocks: [
            {
              text: "",
              key: "foo",
              type: "unstyled",
              entityRanges: [],
            },
          ],
        });

  const defaultRulesContent =
    sportMode === "edit" && tournamentCategory.standardPlayingConditions
      ? getContentState(tournamentCategory.standardPlayingConditions)
      : convertFromRaw({
          entityMap: {},
          blocks: [
            {
              text: "",
              key: "foo",
              type: "unstyled",
              entityRanges: [],
            },
          ],
        });

  const indemnityFormContent = {
    entityMap: {},
    blocks: [
      {
        key: "fgfg",
        text: `1. I acknowledge and agree that participating in ${
          eventData.eventName
        } ${EventCategoryName} on ${formatDate(
          eventData?.eventStartdate
        )}, at <Venue Name>, <Venue Address> come with inherent risks and that I am physically and mentally fit to join the event.`,
        // text: `1. I acknowledge and agree that participating in ${
        //   eventData.eventName
        // } ${EventCategoryName} on ${formatDate(
        //   eventData?.eventStartdate
        // )}, at  ${pageData?.address?.line1} ${pageData?.address?.city} ${
        //   countriesData
        //     ?.find((c) => c["country_code"] == pageData?.address?.country)
        //     ?.country_states?.find(
        //       (s) => s["state_code"] == pageData?.address?.state
        //     )?.["state_name"]
        // }, come with inherent risks and that I am physically and mentally fit to join the event.`,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "9k4gq",
        text: `2. I have full Knowledge of the foregoing risks and I assume all such risks to myself. In consideration of my participant in the event, I will not hold ${eventData?.eventOrganizers?.[0]?.organizerName}. `,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "7scbh",
        text: `3. I indemnify ${eventData?.eventOrganizers?.[0]?.organizerName} and their appointed officials, staff and employees against any actions, proceedings, liabilities, claims, damages and expenses by any party howsoever arising out of any connection with the above said activity.`,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "fho5m",
        text: "4. I undertake to ensure strict compliance with all rules, regulations, requirements and instructions related to the event.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "69quq",
        // text: "5. I represent that I am at least 18 years of age.",
        text: "5. I affirm that I born between <From DOB> and <To DOB>.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
  };

  const indemnityContentState =
    sportMode === "edit" && tournamentCategory.indemnityClause
      ? getContentState(tournamentCategory.indemnityClause)
      : convertFromRaw(indemnityFormContent);

  // const pages = useQueries(
  //   eventData?.eventVenue
  //     ? eventData.eventVenue.map((pageId) => ({
  //         queryKey: ["page", pageId],
  //         queryFn: () => pageService.getPage(pageId),
  //       }))
  //     : []
  // );

  // const pageOptions =
  //   pages.map((page) => ({
  //     value: page.data?.company_id,
  //     label: page.data?.company_name,
  //   })) || [];

  const TextBoxSearch = () => {
    return (
      <MultiSelect
        name="tournaments[0].tournamentCategories[0].tournamentCategoryVenue"
        placeholder="Venue Name"
        isMulti
        options={pageOptions}
      />
    );
  };

  const SubCatSelect = () => {
    const { values, setFieldValue } = useFormikContext();

    const catOptions =
      sports
        .find(
          (sport) => sport["sports_id"] == values.tournaments[0].sportsRefid
        )
        ?.["sports_category"]?.filter(
          (category) => category.category_code !== "TEAMCA"
        )
        ?.map((category) => ({
          value: category.category_code,
          label: category.category_name,
        })) || [];

    return (
      <MultiSelect
        name="tournaments[0].tournamentCategories[0].tournamentSubCategory"
        placeholder="Select Sub Category"
        isMulti
        options={catOptions}
        isDisabled={
          values.tournaments[0].tournamentCategories[0].tournamentCategory !==
          "TEAMCA"
        }
      />
    );
  };

  let updatedVenues = [];
  let updatedPrizes = [];
  let updatedSubcategories = [];
  if (sportMode === "edit") {
    updatedVenues = tournamentCategory?.tournamentCategoryVenue.map(
      (venueId) => {
        return pageOptions.find((option) => option.value === venueId);
      }
    );
    updatedPrizes = tournamentCategory?.tournamentCategoryPrizes?.map(
      (prizeId) => {
        const prize = multiPrizeOptions?.find((p) => p.value === prizeId);
        return { ...prize };
      }
    );

    const subCategories =
      sports
        .find((sport) => sport["sports_id"] == tournament.sportsRefid)
        ?.["sports_category"]?.filter(
          (category) => category.category_code !== "TEAMCA"
        )
        ?.map((category) => ({
          value: category.category_code,
          label: category.category_name,
        })) || [];
    updatedSubcategories = tournamentCategory?.tournamentSubCategory?.map(
      (categoryCode) => {
        const subCategory = subCategories?.find(
          (c) => c.value === categoryCode
        );
        return { ...subCategory };
      }
    );
  }

  const initialValues =
    sportMode === "edit"
      ? {
          tournaments: [
            {
              ...tournament,
              tournamentCategories: [
                {
                  ...tournamentCategory,
                  tournamentCategoryDesc:
                    EditorState.createWithContent(defaultDescContent),
                  standardPlayingConditions:
                    EditorState.createWithContent(defaultRulesContent),
                  tournamentCategoryVenue: updatedVenues,
                  tournamentCategoryPrizes: updatedPrizes,
                  tournamentSubCategory: updatedSubcategories,
                  tournamentConfig: {
                    ...tournamentConfig,
                    age_criteria: {
                      ...tournamentConfig.age_criteria,
                      age_from: tournamentConfig.age_criteria.age_from
                        ? new Date(tournamentConfig.age_criteria.age_from)
                        : "",
                      age_to: tournamentConfig.age_criteria.age_to
                        ? new Date(tournamentConfig.age_criteria.age_to)
                        : "",
                    },
                  },
                  indemnityClause: EditorState.createWithContent(
                    indemnityContentState
                  ),
                  preferencesOffered,
                },
              ],
            },
          ],
        }
      : {
          tournaments: [
            {
              eventRefid: eventid,
              eventVenue: null,
              eventVenueOther: null,
              sportsRefid: "",
              status: "INSERT",
              tournamentStartDate: eventData.eventStartdate || null,
              tournamentEndDate: eventData.eventEnddate || null,
              tournamentCategories: [
                {
                  createdBy: userData?.user_id,
                  docList: [],
                  parentCategoryId: null,
                  participantCategory: "",
                  regFee: "",
                  regFeeCurrency: countryData?.country_currency,
                  // standardPlayingConditions: "",
                  status: "INSERT",
                  // EditorState.createWithContent(defaultDraftContent),
                  tournamentCategory: "",
                  // tournamentCategoryDesc: "",
                  tournamentCategoryDesc:
                    EditorState.createWithContent(defaultDescContent),
                  // EditorState.createWithContent(defaultDraftContent),
                  standardPlayingConditions:
                    EditorState.createWithContent(defaultRulesContent),
                  tournamentCategoryId: null,
                  tournamentCategoryName: "",
                  tournamentCategoryPrizes: [],
                  tournamentCategoryVenue: [],
                  tournamentContacts: null,
                  tournamentFormat: "",
                  tournamentRefid: null,
                  tournamentSubCategory: [],
                  tournamentConfig: {
                    age_criteria: {
                      criteria_by: "",
                      age_value: "",
                      age_from: "",
                      age_to: "",
                    },
                    fixtures_url: null,
                    standings_url: null,
                    participant_criteria: {
                      max_registrations: "",
                      min_registrations: "",
                    },
                    team_criteria: {
                      min_players_per_team: "",
                      max_players_per_team: "",
                      min_male_players: "",
                      max_male_players: "",
                      max_female_players: "",
                      min_female_players: "",
                      max_participation: "",
                    },
                  },
                  indemnityClause: EditorState.createWithContent(
                    convertFromRaw(indemnityFormContent)
                  ),
                  preferencesOffered: {
                    apparel_preference: [],
                    food_preference: [],
                  },
                },
              ],
            },
          ],
        };

  const handleClose = () => {
    setSportMode("view");
    onClose();
  };

  const isVirtualEvent = Boolean(eventData.virtualVenueUrl);
  const hasPayment =
    eventData.collectPymtOnline === "Y" || eventData.collectPymtOffline === "Y";

  return (
    <Modal
      title="Sport Selection"
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <Box>
        <Formik
          initialValues={{ ...initialValues }}
          validationSchema={SportListModalScema(
            yup,
            isVirtualEvent,
            hasPayment
          )}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            // const updatedValues = { ...values };
            const updatedValues = JSON.parse(JSON.stringify(values));
            updatedValues.tournaments[0].sportsRefid =
              +values.tournaments[0].sportsRefid;
            updatedValues.tournaments[0].tournamentCategories[0].participantCategory =
              +values.tournaments[0].tournamentCategories[0]
                .participantCategory;
            updatedValues.tournaments[0].tournamentCategories[0].regFee =
              +values.tournaments[0].tournamentCategories[0].regFee;
            updatedValues.tournaments[0].tournamentCategories[0].tournamentSubCategory =
              values.tournaments[0].tournamentCategories[0].tournamentSubCategory.map(
                ({ value }) => value
              );
            updatedValues.tournaments[0].tournamentCategories[0].tournamentCategoryPrizes =
              values.tournaments[0].tournamentCategories[0].tournamentCategoryPrizes.map(
                ({ value }) => value
              );
            updatedValues.tournaments[0].tournamentCategories[0].tournamentCategoryVenue =
              values.tournaments[0].tournamentCategories[0].tournamentCategoryVenue.map(
                ({ value }) => value
              );

            const tournamentCategoryDescContent =
              values.tournaments[0].tournamentCategories[0].tournamentCategoryDesc.getCurrentContent();
            updatedValues.tournaments[0].tournamentCategories[0].tournamentCategoryDesc =
              JSON.stringify(convertToRaw(tournamentCategoryDescContent));

            const standardPlayingConditions =
              values.tournaments[0].tournamentCategories[0].standardPlayingConditions.getCurrentContent();
            updatedValues.tournaments[0].tournamentCategories[0].standardPlayingConditions =
              JSON.stringify(convertToRaw(standardPlayingConditions));

            const indemnityClause =
              values.tournaments[0].tournamentCategories[0].indemnityClause.getCurrentContent();
            updatedValues.tournaments[0].tournamentCategories[0].indemnityClause =
              JSON.stringify(convertToRaw(indemnityClause));

            if (sportMode === "edit") {
              const originalTournamentData = formFormik.values.tournamentData;
              const categoriesList = editCategory(
                updatedValues.tournaments[0],
                originalTournamentData
              );
              formFormik.setFieldValue("tournamentData", categoriesList);
            } else {
              const originalTournamentData = formFormik.values.tournamentData;
              const categoriesList = addTocategory(
                updatedValues.tournaments[0],
                originalTournamentData
              );
              formFormik.setFieldValue("tournamentData", categoriesList);
            }
            handleClose();
          }}
        >
          {(formik) => {
            const { values, setFieldValue, setFieldTouched } = formik;
            return (
              <Form>
                <VStack align="stretch" gap={2}>
                  <HStack align="stretch">
                    <SelectWithValidation
                      name="tournaments[0].sportsRefid"
                      label="Select Sport"
                      disabled={sportMode === "edit"}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue(
                          "tournaments[0].tournamentCategories[0].tournamentCategory",
                          ""
                        );
                      }}
                    >
                      <option selected hidden disabled value=""></option>
                      {sports?.map((sport) => (
                        <option
                          key={sport["sports_id"]}
                          value={sport["sports_id"]}
                        >
                          {sport["sports_name"]}
                        </option>
                      ))}
                    </SelectWithValidation>
                    <SelectWithValidation
                      name="tournaments[0].tournamentCategories[0].participantCategory"
                      label="Participant Category"
                      placeholder="Select a Participant Category"
                      // disabled={sportMode === "edit"}
                    >
                      <option selected hidden disabled value=""></option>
                      {participantCategories?.map((category) => (
                        <option
                          key={category["category_id"]}
                          value={category["category_id"]}
                        >
                          {category["category_name"]}
                        </option>
                      ))}
                    </SelectWithValidation>
                  </HStack>
                  <HStack align="stretch">
                    <SelectWithValidation
                      label="Select Category"
                      name="tournaments[0].tournamentCategories[0].tournamentCategory"
                      disabled={sportMode === "edit"}
                    >
                      <option selected hidden disabled value=""></option>
                      {values.tournaments[0].sportsRefid &&
                        sports
                          .find(
                            (sport) =>
                              sport["sports_id"] ==
                              values.tournaments[0].sportsRefid
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

                    <VStack w="full" align="flex-start">
                      <LabelText>Sub Category</LabelText>
                      <SubCatSelect />
                    </VStack>

                    {/* <SelectWithValidation
                      label="Select Sub Category"
                      name="tournaments[0].tournamentCategories[0].tournamentSubCategory"
                    >
                      <option selected hidden disabled value=""></option>
                      {values.tournaments[0].sportsRefid &&
                        sports
                          .find(
                            (sport) =>
                              sport["sports_id"] ==
                              values.tournaments[0].sportsRefid
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
                    </SelectWithValidation> */}
                  </HStack>
                  <CustomFormLabel>Age Criteria</CustomFormLabel>
                  <HStack w="full" align="stretch">
                    <SelectWithValidation
                      name="tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria.criteria_by"
                      placeholder="Age Criteria"
                      onChange={(e) => {
                        formik.handleChange(e);
                        if (e.target.value === "Open") {
                          formik.setFieldValue(
                            "tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria.age_value",
                            ""
                          );
                          formik.setFieldValue(
                            "tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria.age_from",
                            ""
                          );
                          formik.setFieldValue(
                            "tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria.age_to",
                            ""
                          );
                        }
                      }}
                    >
                      <option value="Under">Under</option>
                      <option value="Above">Above</option>
                      <option value="Open">Open</option>
                      <option value="Average">Average Age</option>
                    </SelectWithValidation>
                    <FormControl
                      isInvalid={Boolean(
                        formik.touched?.tournaments?.[0]
                          ?.tournamentCategories?.[0]?.tournamentConfig
                          ?.age_criteria?.age_value &&
                          formik.errors?.tournaments?.[0]
                            ?.tournamentCategories?.[0]?.tournamentConfig
                            ?.age_criteria?.age_value
                      )}
                    >
                      <NumberInput
                        value={
                          values.tournaments[0].tournamentCategories[0]
                            .tournamentConfig.age_criteria.age_value
                        }
                        min={1}
                        max={99}
                        onChange={(value) =>
                          setFieldValue(
                            "tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria.age_value",
                            value
                          )
                        }
                        onBlur={() =>
                          setFieldTouched(
                            "tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria.age_value",
                            true
                          )
                        }
                        disabled={
                          values.tournaments[0].tournamentCategories[0]
                            .tournamentConfig.age_criteria.criteria_by ===
                          "Open"
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {
                          formik.errors?.tournaments?.[0]
                            ?.tournamentCategories?.[0]?.tournamentConfig
                            ?.age_criteria?.age_value
                        }
                      </FormErrorMessage>
                    </FormControl>
                    <DatePicker
                      name="tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria.age_from"
                      placeholderText="From"
                      dateFormat="MM/dd/yyyy"
                      // disabled={
                      //   values.tournaments[0].tournamentCategories[0]
                      //     .tournamentConfig.age_criteria.criteria_by === "Open"
                      // }
                    />
                    <DatePicker
                      name="tournaments[0].tournamentCategories[0].tournamentConfig.age_criteria.age_to"
                      placeholderText="To"
                      dateFormat="MM/dd/yyyy"
                      // disabled={
                      //   values.tournaments[0].tournamentCategories[0]
                      //     .tournamentConfig.age_criteria.criteria_by === "Open"
                      // }
                    />
                  </HStack>

                  <HStack align="flex-start">
                    <SelectWithValidation
                      name="tournaments[0].tournamentCategories[0].tournamentFormat"
                      label="Select Format"
                    >
                      <option selected hidden disabled value=""></option>
                      {values.tournaments[0].sportsRefid &&
                        sports
                          .find(
                            (sport) =>
                              sport["sports_id"] ==
                              values.tournaments[0].sportsRefid
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
                    <CategoryNameInput sports={sports} />
                  </HStack>

                  {!isVirtualEvent && (
                    <VStack w="full" align="flex-start">
                      <LabelText>Venue</LabelText>
                      <TextBoxSearch />
                    </VStack>
                  )}

                  <CustomFormLabel>Participant Settings</CustomFormLabel>
                  <SimpleGrid columns={2} spacing={5}>
                    <TextSmall>
                      Overall minimum number of Players (In Case of Player
                      Registeration) or Teams (In Case of Teams)
                    </TextSmall>
                    <FormControl
                      isInvalid={Boolean(
                        formik.touched?.tournaments?.[0]
                          ?.tournamentCategories?.[0]?.tournamentConfig
                          ?.participant_criteria?.min_registrations &&
                          formik.errors?.tournaments?.[0]
                            ?.tournamentCategories?.[0]?.tournamentConfig
                            ?.participant_criteria?.min_registrations
                      )}
                    >
                      <NumberInput
                        maxW={20}
                        value={
                          values.tournaments[0].tournamentCategories[0]
                            .tournamentConfig.participant_criteria
                            .min_registrations
                        }
                        min={1}
                        max={99}
                        onChange={(value) =>
                          setFieldValue(
                            "tournaments[0].tournamentCategories[0].tournamentConfig.participant_criteria.min_registrations",
                            value
                          )
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {
                          formik.errors?.tournaments?.[0]
                            ?.tournamentCategories?.[0]?.tournamentConfig
                            ?.participant_criteria?.min_registrations
                        }
                      </FormErrorMessage>
                    </FormControl>

                    <TextSmall>
                      Overall maximum number of Players (In Case of Player
                      Registeration) or Teams (In Case of Teams)
                    </TextSmall>
                    <FormControl
                      isInvalid={Boolean(
                        formik.touched?.tournaments?.[0]
                          ?.tournamentCategories?.[0]?.tournamentConfig
                          ?.participant_criteria?.max_registrations &&
                          formik.errors?.tournaments?.[0]
                            ?.tournamentCategories?.[0]?.tournamentConfig
                            ?.participant_criteria?.max_registrations
                      )}
                    >
                      <NumberInput
                        maxW={20}
                        value={
                          values.tournaments[0].tournamentCategories[0]
                            .tournamentConfig.participant_criteria
                            .max_registrations
                        }
                        min={1}
                        max={99}
                        onChange={(value) =>
                          setFieldValue(
                            "tournaments[0].tournamentCategories[0].tournamentConfig.participant_criteria.max_registrations",
                            value
                          )
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {
                          formik.errors?.tournaments?.[0]
                            ?.tournamentCategories?.[0]?.tournamentConfig
                            ?.participant_criteria?.max_registrations
                        }
                      </FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  {/* {values.tournaments[0].tournamentCategories[0]
                    .tournamentCategory === "TEAMCA" && ( */}

                  {((values.tournaments[0].sportsRefid &&
                    sports
                      .find(
                        (sport) =>
                          sport["sports_id"] ==
                          values.tournaments[0].sportsRefid
                      )
                      ?.["sports_category"]?.every(
                        (category) => category.type === "Team"
                      )) ||
                    values.tournaments[0].tournamentCategories[0]
                      .tournamentCategory === "TEAMCA" ||
                    values.tournaments[0].tournamentCategories[0]
                      .tournamentCategory === "DIRSCP") && (
                    <>
                      <CustomFormLabel>Team Criteria</CustomFormLabel>
                      <SimpleGrid columns={4} spacing={5} w="100%">
                        <TextSmall>
                          Overall Minimum number of Players per Team
                        </TextSmall>
                        <FormControl
                          isInvalid={Boolean(
                            formik.touched?.tournaments?.[0]
                              ?.tournamentCategories?.[0]?.tournamentConfig
                              ?.team_criteria?.min_players_per_team &&
                              formik.errors?.tournaments?.[0]
                                ?.tournamentCategories?.[0]?.tournamentConfig
                                ?.team_criteria?.min_players_per_team
                          )}
                        >
                          <NumberInput
                            maxW={20}
                            value={
                              values.tournaments[0].tournamentCategories[0]
                                .tournamentConfig.team_criteria
                                .min_players_per_team
                            }
                            min={1}
                            max={99}
                            onChange={(value) =>
                              setFieldValue(
                                "tournaments[0].tournamentCategories[0].tournamentConfig.team_criteria.min_players_per_team",
                                value
                              )
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormErrorMessage>
                            {
                              formik.errors?.tournaments?.[0]
                                ?.tournamentCategories?.[0]?.tournamentConfig
                                ?.team_criteria?.min_players_per_team
                            }
                          </FormErrorMessage>
                        </FormControl>

                        <TextSmall>
                          Overall Maximum number of Players per Team
                        </TextSmall>
                        <FormControl
                          isInvalid={Boolean(
                            formik.touched?.tournaments?.[0]
                              ?.tournamentCategories?.[0]?.tournamentConfig
                              ?.team_criteria?.max_players_per_team &&
                              formik.errors?.tournaments?.[0]
                                ?.tournamentCategories?.[0]?.tournamentConfig
                                ?.team_criteria?.max_players_per_team
                          )}
                        >
                          <NumberInput
                            maxW={20}
                            value={
                              values.tournaments[0].tournamentCategories[0]
                                .tournamentConfig.team_criteria
                                .max_players_per_team
                            }
                            min={1}
                            max={99}
                            onChange={(value) =>
                              setFieldValue(
                                "tournaments[0].tournamentCategories[0].tournamentConfig.team_criteria.max_players_per_team",
                                value
                              )
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        {(values.tournaments[0].tournamentCategories[0]
                          .tournamentCategory === "TEAMCA" ||
                          values.tournaments[0].tournamentCategories[0]
                            .tournamentCategory === "DIRSCP") && (
                          <>
                            <TextSmall>Minimum Participants of Male</TextSmall>
                            <FormControl
                              isInvalid={Boolean(
                                formik.touched?.tournaments?.[0]
                                  ?.tournamentCategories?.[0]?.tournamentConfig
                                  ?.team_criteria?.min_male_players &&
                                  formik.errors?.tournaments?.[0]
                                    ?.tournamentCategories?.[0]
                                    ?.tournamentConfig?.team_criteria
                                    ?.min_male_players
                              )}
                            >
                              <NumberInput
                                maxW={20}
                                value={
                                  values.tournaments[0].tournamentCategories[0]
                                    .tournamentConfig.team_criteria
                                    .min_male_players
                                }
                                min={1}
                                max={99}
                                onChange={(value) =>
                                  setFieldValue(
                                    "tournaments[0].tournamentCategories[0].tournamentConfig.team_criteria.min_male_players",
                                    value
                                  )
                                }
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>

                            <TextSmall>
                              Minimum Participants of Female
                            </TextSmall>
                            <FormControl
                              isInvalid={Boolean(
                                formik.touched?.tournaments?.[0]
                                  ?.tournamentCategories?.[0]?.tournamentConfig
                                  ?.team_criteria?.min_female_players &&
                                  formik.errors?.tournaments?.[0]
                                    ?.tournamentCategories?.[0]
                                    ?.tournamentConfig?.team_criteria
                                    ?.min_female_players
                              )}
                            >
                              <NumberInput
                                maxW={20}
                                value={
                                  values.tournaments[0].tournamentCategories[0]
                                    .tournamentConfig.team_criteria
                                    .min_female_players
                                }
                                min={1}
                                max={99}
                                onChange={(value) =>
                                  setFieldValue(
                                    "tournaments[0].tournamentCategories[0].tournamentConfig.team_criteria.min_female_players",
                                    value
                                  )
                                }
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>

                            <TextSmall>Maximum Participants of Male</TextSmall>
                            <FormControl
                              isInvalid={Boolean(
                                formik.touched?.tournaments?.[0]
                                  ?.tournamentCategories?.[0]?.tournamentConfig
                                  ?.team_criteria?.max_male_players &&
                                  formik.errors?.tournaments?.[0]
                                    ?.tournamentCategories?.[0]
                                    ?.tournamentConfig?.team_criteria
                                    ?.max_male_players
                              )}
                            >
                              <NumberInput
                                maxW={20}
                                value={
                                  values.tournaments[0].tournamentCategories[0]
                                    .tournamentConfig.team_criteria
                                    .max_male_players
                                }
                                min={1}
                                max={99}
                                onChange={(value) =>
                                  setFieldValue(
                                    "tournaments[0].tournamentCategories[0].tournamentConfig.team_criteria.max_male_players",
                                    value
                                  )
                                }
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>

                            <TextSmall>
                              Maximum Participants of Female
                            </TextSmall>

                            <FormControl
                              isInvalid={Boolean(
                                formik.touched?.tournaments?.[0]
                                  ?.tournamentCategories?.[0]?.tournamentConfig
                                  ?.team_criteria?.max_female_players &&
                                  formik.errors?.tournaments?.[0]
                                    ?.tournamentCategories?.[0]
                                    ?.tournamentConfig?.team_criteria
                                    ?.max_female_players
                              )}
                            >
                              <NumberInput
                                maxW={20}
                                value={
                                  values.tournaments[0].tournamentCategories[0]
                                    .tournamentConfig.team_criteria
                                    .max_female_players
                                }
                                min={1}
                                max={99}
                                onChange={(value) =>
                                  setFieldValue(
                                    "tournaments[0].tournamentCategories[0].tournamentConfig.team_criteria.max_female_players",
                                    value
                                  )
                                }
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </FormControl>
                          </>
                        )}
                      </SimpleGrid>
                      {(values.tournaments[0].tournamentCategories[0]
                        .tournamentCategory === "TEAMCA" ||
                        values.tournaments[0].tournamentCategories[0]
                          .tournamentCategory === "DIRSCP") && (
                        <SimpleGrid
                          columns={4}
                          spacing="5"
                          pt={5}
                          alignItems="center"
                        >
                          <TextSmall>Players can play maximum of</TextSmall>
                          <FormControl
                            isInvalid={Boolean(
                              formik.touched?.tournaments?.[0]
                                ?.tournamentCategories?.[0]?.tournamentConfig
                                ?.team_criteria?.max_participation &&
                                formik.errors?.tournaments?.[0]
                                  ?.tournamentCategories?.[0]?.tournamentConfig
                                  ?.team_criteria?.max_participation
                            )}
                          >
                            <NumberInput
                              // maxW={20}
                              value={
                                values.tournaments[0].tournamentCategories[0]
                                  .tournamentConfig.team_criteria
                                  .max_participation
                              }
                              onChange={(value) =>
                                setFieldValue(
                                  "tournaments[0].tournamentCategories[0].tournamentConfig.team_criteria.max_participation",
                                  value
                                )
                              }
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>

                          <TextSmall>Rounds/Games</TextSmall>
                        </SimpleGrid>
                      )}
                    </>
                  )}
                  <VStack align="self-start" w="full" pt={3}>
                    <HStack>
                      <RegisterEvent size={30} />
                      <CustomFormLabel>
                        Registration/Participant Fee
                      </CustomFormLabel>
                    </HStack>
                    <HStack align="self-start">
                      <FormControl
                        isInvalid={Boolean(
                          formik.touched?.tournaments?.[0]
                            ?.tournamentCategories?.[0]?.regFee &&
                            formik.errors?.tournaments?.[0]
                              ?.tournamentCategories?.[0]?.regFee
                        )}
                      >
                        <NumberInput
                          value={
                            values.tournaments[0].tournamentCategories[0].regFee
                          }
                          onChange={(value) =>
                            setFieldValue(
                              "tournaments[0].tournamentCategories[0].regFee",
                              value
                            )
                          }
                          onBlur={() =>
                            setFieldTouched(
                              "tournaments[0].tournamentCategories[0].regFee",
                              true
                            )
                          }
                          isDisabled={
                            eventData?.collectPymtOnline === "N" &&
                            eventData?.collectPymtOffline === "N"
                          }
                          min={1}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>
                          {
                            formik.errors?.tournaments?.[0]
                              ?.tournamentCategories?.[0]?.regFee
                          }
                        </FormErrorMessage>
                      </FormControl>
                      {/* <SelectWithValidation
                        name="tournaments[0].tournamentCategories[0].regFeeCurrency"
                        placeholder="Select Currency"
                      >
                        <option value="INR">INR</option>
                        <option value="SGD">SGD</option>
                      </SelectWithValidation> */}
                      <TextBoxWithValidation
                        name="tournaments[0].tournamentCategories[0].regFeeCurrency"
                        placeholder="Currency"
                        disabled
                        // maxW="150px"
                      />
                    </HStack>
                  </VStack>
                  <VStack align="self-start" w="full" pt={3}>
                    <HStack>
                      <Prize size={30} />
                      <CustomFormLabel>Prize/Acknowledgement</CustomFormLabel>
                    </HStack>
                    <HStack align="self-start">
                      <MultiSelect
                        isMulti
                        placeholder="Select Prize"
                        id="tournaments[0].tournamentCategories[0].tournamentCategoryPrizes"
                        instanceId="tournaments[0].tournamentCategories[0].tournamentCategoryPrizes"
                        name="tournaments[0].tournamentCategories[0].tournamentCategoryPrizes"
                        options={multiPrizeOptions}
                      />
                    </HStack>
                  </VStack>
                  <VStack align="self-start" pt={3} spacing={5}>
                    <VStack w="full" align="flex-start">
                      <LabelText>Description</LabelText>
                      {/* <TextAreaWithValidation
                        name="tournaments[0].tournamentCategories[0].tournamentCategoryDesc"
                        placeholder="Description"
                      /> */}
                      <EventDraftEditor
                        formik={formik}
                        name="tournaments[0].tournamentCategories[0].tournamentCategoryDesc"
                        placeholder="Description"
                        value={
                          formik.values.tournaments[0].tournamentCategories[0]
                            .tournamentCategoryDesc
                        }
                        isError={
                          Boolean(
                            formik.touched?.tournaments?.[0]
                              ?.tournamentCategories?.[0]
                              ?.tournamentCategoryDesc
                          ) &&
                          Boolean(
                            formik.errors?.tournaments?.[0]
                              ?.tournamentCategories?.[0]
                              ?.tournamentCategoryDesc
                          )
                        }
                        errorMessage={
                          formik.errors?.tournaments?.[0]
                            ?.tournamentCategories?.[0]?.tournamentCategoryDesc
                        }
                      />
                    </VStack>
                    <VStack w="full" align="flex-start">
                      <LabelText>Playing Conditions</LabelText>
                      {/* <TextAreaWithValidation
                        name="tournaments[0].tournamentCategories[0].standardPlayingConditions"
                        placeholder="Playing Conditions"
                      /> */}
                      <EventDraftEditor
                        formik={formik}
                        name="tournaments[0].tournamentCategories[0].standardPlayingConditions"
                        placeholder="Playing Conditions"
                        value={
                          formik.values.tournaments[0].tournamentCategories[0]
                            .standardPlayingConditions
                        }
                        isError={
                          Boolean(
                            formik.touched?.tournaments?.[0]
                              ?.tournamentCategories?.[0]
                              ?.standardPlayingConditions
                          ) &&
                          Boolean(
                            formik.errors?.tournaments?.[0]
                              ?.tournamentCategories?.[0]
                              ?.standardPlayingConditions
                          )
                        }
                        errorMessage={
                          formik.errors?.tournaments?.[0]
                            ?.tournamentCategories?.[0]
                            ?.standardPlayingConditions
                        }
                      />
                    </VStack>
                    <FieldLayout label="Indemnity Form">
                      <Flex gap={2}>
                        <Button
                          colorScheme="blue"
                          variant="link"
                          onClick={onClauseOpen}
                        >
                          Indemnity Form
                        </Button>
                        {publish && <MdVerified size={20} color="green" />}
                      </Flex>
                      <EventIndemnityForm
                        isOpen={isClauseOpen}
                        onClose={onClauseClose}
                        setPublish={setPublish}
                        formik={formik}
                      />
                    </FieldLayout>
                    <FieldLayout label="Apparel Preference">
                      <CheckboxGroup
                        value={
                          values.tournaments[0].tournamentCategories[0]
                            .preferencesOffered?.apparel_preference
                        }
                        onChange={(value) =>
                          setFieldValue(
                            "tournaments[0].tournamentCategories[0].preferencesOffered.apparel_preference",
                            value
                          )
                        }
                      >
                        <Stack spacing={[2, 5]} direction={["column", "row"]}>
                          {apparelData?.map((app) => (
                            <Checkbox
                              key={app.lookup_key}
                              value={app.lookup_key}
                            >
                              {app.lookup_value}
                            </Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    </FieldLayout>

                    <FieldLayout label="Food Preference">
                      <CheckboxGroup
                        value={
                          values.tournaments[0].tournamentCategories[0]
                            .preferencesOffered?.food_preference
                        }
                        onChange={(value) =>
                          setFieldValue(
                            "tournaments[0].tournamentCategories[0].preferencesOffered.food_preference",
                            value
                          )
                        }
                      >
                        <Stack spacing={[2, 5]} direction={["column", "row"]}>
                          {foodData?.map((app) => (
                            <Checkbox
                              key={app.lookup_key}
                              value={app.lookup_key}
                            >
                              {app.lookup_value}
                            </Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    </FieldLayout>
                  </VStack>
                  {/* <VStack align="self-start" pt={3}>
                    <CustomFormLabel>Document Upload</CustomFormLabel>
                    <FieldArray
                      name="tournaments[0].tournamentCategories[0].docList"
                      render={(documentHelpers) => (
                        <>
                          {values.tournaments[0].tournamentCategories[0].docList?.map(
                            (doc, index) => (
                              <HStack key={index}>
                                <SelectWithValidation
                                  name={`tournaments[0].tournamentCategories[0].docList[${index}].type`}
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
                                              setFieldValue(
                                                `tournaments[0].tournamentCategories[0].docList[${index}]`,
                                                {
                                                  ...uploadedDoc,
                                                  type,
                                                }
                                              );
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
                            )
                          )}
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
                  </VStack> */}
                  {/* {isError && (
                    <TextMedium color="red.500">
                      Please check the uploaded document formate
                    </TextMedium>
                  )} */}
                </VStack>
                <ModalFooter>
                  <ButtonGroup>
                    <Button
                      colorScheme="primary"
                      variant="outline"
                      onClick={handleClose}
                      _focus={{ boxShadow: "none" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="primary"
                      mr={3}
                      _focus={{ boxShadow: "none" }}
                      type="submit"
                    >
                      Add
                    </Button>
                  </ButtonGroup>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Modal>
  );
}

export default PageEventSportsSelect;
