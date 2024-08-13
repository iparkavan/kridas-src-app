import { isValidPhoneNumber } from "react-phone-number-input";
import clone from "just-clone";
import { differenceInYears, format } from "date-fns";
import teamService from "../../services/team-service";
import { RiFootballLine } from "react-icons/ri";
import { GiArcheryTarget, GiBoxingGlove } from "react-icons/gi";
import { FcSportsMode } from "react-icons/fc";
import { MdOutlineSports, MdOutlineSportsTennis } from "react-icons/md";
import { BiBasketball } from "react-icons/bi";

export const eventErrorMessage = {
  ENTER_EVENT: "Please enter the event name",
  EVENT_CATEGORY: "Please select the event category",

  EVENT_START_DATE: "Please pick the start date",
  EVENT_END_DATE: "Please pick the end date",

  EVENT_REG_START_DATE: "Please  pick the start date",
  EVENT_REG_END_DATE: "Please  pick the end date",

  INVALID_REG_FROM_DATE: "Please give current  or future date",
  INVALID_REG_TO_DATE: "Please give current or  future date",
  INVALID_REG_END_DATE: "Please enter a  valid date",
  REG_START_BEFORE_END: "Start date should be before the event end date",

  EVENT_DESCRIPTION: "Please enter the description",

  INVALID_FROM_DATE: "Please give current or future date",
  INVALID_TO_DATE: "Please give current or future date",
  INVALID_END_DATE: "End date should be before the event end date",

  EVENT_TERMS: "Please enter the Playing Conditions",
  EVENT_SPORT_LIST: "Please add aleast one sport",
  EVENT_VENUE_OTHERS: "Please enter the venue",
  EVENT_VIRTUAL_ID: "Please enter the virtual id",
  EVENT_VIRTUAL_ID_URL: "Please enter a valid URL",
  EVENT_SPORT_NAME: "Please select the sport",
  EVENT_SPORT_SELECT_CATEGORY: "Please select the category",
  EVENT_SPORT_ENTER_CATEGORY: "Please enter the category",
  EVENT_SPORT_FORMAT: "Please select the format",
  EVENT_SPORT_AGE: "Please select the age",
  EVENT_SPORT_DESCRIPTION: "Please enter the description",
  EVENT_SPORT_MAXAGE: "Please enter the maxage",
  EVENT_SPORT_MINAGE: "Please enter the minage",
  EVENT_SPORT_NUMBER_MAXAGE: "Age must be a number",
  EVENT_SPORT_NUMBER_MINAGE: "Age must be a number",

  EVENT_SPORT_REG_FEE: "Please enter the registration fee",
  EVENT_SPORT_REG_FEE_CURRENCY: "Please select the currency",

  EVENT_SPORT_NUMBER_MAXPLAYER: "Player must be a number",
  EVENT_SPORT_NUMBER_MINPLAYER: "Player must be a number",

  EVENT_SPORT_NUMBER_MAXPLAYER: "Team must be a number",
  EVENT_SPORT_NUMBER_MINPLAYER: "Team must be a number",
  EVENT_SPORT_NUMBER_INVALID_MINPLAYER: "Enter a valid value",
  EVENT_SPORT_PRIZE: "please select the Reward",

  EVENT_CONTACT_EMAIL: "Enter the Valid mail ID",
  EVENT_CONTACT_NAME_REQUIRED: "Please enter the name",
  // EVENT_CONTACT_SPORT_REQUIRED: "Please Select the Sport",
  EVENT_CONTACT_MAIL_REQUIRED: "Please enter the mail Id",
  EVENT_CONTACT_PHNUMBER_REQUIRED: "Please enter the Phone Number",
  EVENT_CONTACT_WANUMBER_REQUIRED: "Please enter the Whats app Number",
  EVENT_CONTACT_NUMBER: "Please enter the Valid Number",

  EVENT_SPORT_CHECK: "data requireed",
  EVENT_STREAM_DESC: "Please enter the Description",
  EVENT_STREAM_URL: "Please enter the Stream Url",
  EVENT_SPORT_NUMBER_INVALID_MINAGE: "Enter a valid age",
  ENTER_LINE_1: "Please enter your address line 1",
  ENTER_LINE_2: "Please enter your address line 2",
  ENTER_PINCODE: "Please enter your pincode",
  SELECT_COUNTRY: "Please select your country",
  SELECT_STATE: "Please select your state",
  ENTER_CITY: "Please enter your city",
  ENTER_TEAM_NAME: "Please enter the team name",
  ENTER_FIRST_NAME: "Please enter the first name",
  ENTER_LAST_NAME: "Please enter the last name",
  ENTER_EMAIL: "Please enter the email",
  ENTER_VALID_EMAIL: "Please enter a valid email",
  ENTER_CONTACT: "Please enter the contact number",
  ENTER_VALID_CONTACT: "Please enter a valid number",
  TEAM_NAME_EXISTS:
    "Team name already exists. Please enter a different team name",
  MAX_TEAMS_FULL: "Maximum teams have been filled for this sport",
  SELECT_TEAM: "Please select the team",
  ENTER_EVENT_TEAM_NAME: "Please enter the event team name",
  ENTER_PLAYER_ID: "Please enter the player ID",
  SELECT_GENDER: "Please select the gender",
  ENTER_DOB: "Please enter the dob",
  INVALID_DOB: "Please enter a valid dob",
  SELECT_PAGE: "Please select the page",
  SELECT_SIZE: "Please select the size",
  ENTER_NAME_PRINT: "Please enter the name to be printed",
  ENTER_NUMBER_PRINT: "Please enter the number to be printed",
  SELECT_FOOD: "Please select the food preference",
};

export const getEventCreateYupSchemaFormOne = (yup) => {
  return yup.object().shape({
    eventName: yup
      .string(eventErrorMessage.ENTER_EVENT)
      .required(eventErrorMessage.ENTER_EVENT),
    eventCategoryId: yup
      .string(eventErrorMessage.EVENT_CATEGORY)
      .required(eventErrorMessage.EVENT_CATEGORY),
    eventStartdate: yup
      .date()
      .nullable()
      .required(eventErrorMessage.EVENT_START_DATE)
      .typeError(eventErrorMessage.EVENT_START_DATE),
    // .min(
    //   new Date(new Date().setHours(0, 0, 0, 0)),
    //   eventErrorMessage.INVALID_FROM_DATE
    // ),
    eventEnddate: yup
      .date()
      .required(eventErrorMessage.EVENT_END_DATE)
      .typeError(eventErrorMessage.EVENT_END_DATE)
      .min(new Date(), eventErrorMessage.INVALID_TO_DATE)
      .when(["eventStartdate"], (eventStartdate, schema) => {
        if (eventStartdate) return schema.notRequired();
        return eventStartdate
          ? schema.min(eventStartdate, eventErrorMessage.INVALID_END_DATE)
          : schema;
      }),

    // event_reg_startdate: yup
    //   .date()
    //   .nullable()
    //   .required(eventErrorMessage.EVENT_REG_START_DATE)
    //   .typeError(eventErrorMessage.EVENT_REG_START_DATE)
    //   .min(
    //     new Date(new Date().setHours(0, 0, 0, 0)),
    //     eventErrorMessage.INVALID_REG_FROM_DATE
    //   ),
    // event_reg_lastdate: yup
    //   .date()
    //   .required(eventErrorMessage.EVENT_REG_END_DATE)
    //   .typeError(eventErrorMessage.EVENT_REG_END_DATE)
    //   .min(new Date(), eventErrorMessage.INVALID_REG_TO_DATE)
    //   .when(["event_reg_startdate"], (event_reg_startdate, schema) => {
    //     if (event_reg_startdate) return schema.notRequired();
    //     return event_reg_startdate
    //       ? schema.min(
    //           event_reg_startdate,
    //           eventErrorMessage.INVALID_REG_END_DATE
    //         )
    //       : schema;
    //   }),

    eventRegStartdate: yup
      .date()
      .nullable()
      .required(eventErrorMessage.EVENT_REG_START_DATE)
      .typeError(eventErrorMessage.EVENT_REG_START_DATE)
      // .min(
      //   new Date(new Date().setHours(0, 0, 0, 0)),
      //   eventErrorMessage.INVALID_REG_FROM_DATE
      // )
      .when(["eventEnddate"], (eventEnddate, schema) => {
        return eventEnddate
          ? schema.max(eventEnddate, eventErrorMessage.REG_START_BEFORE_END)
          : schema;
      }),

    eventRegLastdate: yup
      .date()
      .required(eventErrorMessage.EVENT_REG_END_DATE)
      .typeError(eventErrorMessage.EVENT_REG_END_DATE)
      .min(new Date(), eventErrorMessage.INVALID_REG_TO_DATE)
      .when(["eventRegStartdate"], (eventRegStartdate, schema) => {
        return eventRegStartdate
          ? schema.min(
              eventRegStartdate,
              eventErrorMessage.INVALID_REG_END_DATE
            )
          : schema;
      })
      .when(["eventEnddate"], (eventEnddate, schema) => {
        return eventEnddate
          ? schema.max(eventEnddate, eventErrorMessage.INVALID_END_DATE)
          : schema;
      }),

    eventDesc: yup
      .mixed()
      .test("description", eventErrorMessage.EVENT_DESCRIPTION, (eventDesc) => {
        return eventDesc.getCurrentContent().hasText();
      }),
    // eventRegfee: yup
    //   .string(eventErrorMessage.EVENT_SPORT_REG_FEE)
    //   .typeError(eventErrorMessage.EVENT_SPORT_REG_FEE)
    //   .when(["collectPymtOnline"], (collectPymtOnline, schema) => {
    //     return collectPymtOnline !== "X"
    //       ? schema.required(eventErrorMessage.EVENT_SPORT_REG_FEE)
    //       : schema;
    //   }),
    // eventRegFeeCurrency: yup
    //   .string()
    //   .typeError(eventErrorMessage.EVENT_SPORT_REG_FEE_CURRENCY)
    //   .required(eventErrorMessage.EVENT_SPORT_REG_FEE_CURRENCY),
    eventContacts: yup.array().of(
      yup.object().shape({
        name: yup
          .string("string plz")
          .typeError()
          .required(eventErrorMessage.EVENT_CONTACT_NAME_REQUIRED),
        // sport: yup
        //   .number()
        //   .required(eventErrorMessage.EVENT_CONTACT_SPORT_REQUIRED),
        email: yup
          .string()
          .email(eventErrorMessage.EVENT_CONTACT_EMAIL)
          .required(eventErrorMessage.EVENT_CONTACT_MAIL_REQUIRED),
        phone_number: yup
          .string()
          .typeError(eventErrorMessage.EVENT_CONTACT_NUMBER)
          .required(eventErrorMessage.EVENT_CONTACT_PHNUMBER_REQUIRED)
          .test(
            "is-valid",
            eventErrorMessage.EVENT_CONTACT_NUMBER,
            (phone_number) => {
              return phone_number && isValidPhoneNumber(phone_number);
            }
          ),
        // whatsapp_number: yup
        //   .string()
        //   // .typeError(eventErrorMessage.EVENT_CONTACT_NUMBER)
        //   .test(
        //     "is-valid",
        //     eventErrorMessage.EVENT_CONTACT_NUMBER,
        //     (whatsapp_number) => {
        //       return whatsapp_number && isValidPhoneNumber(whatsapp_number);
        //     }
        //   ),
      })
    ),

    standardEventRules: yup
      .mixed()
      .test("terms", eventErrorMessage.EVENT_TERMS, (standardEventRules) => {
        return standardEventRules.getCurrentContent().hasText();
      }),
    // sports_list: yup
    //   .array()
    //   .compact()
    //   .min(1, "Please select atleast one sport"),
    // venue_type: yup.string().notRequired(),

    // event_venue_other: yup.object().when("venue_type", (venue_type, schema) => {
    //   if (venue_type === "VEN") {
    //     return schema.shape({
    //       country: yup
    //         .string()
    //         .typeError(eventErrorMessage.SELECT_COUNTRY)
    //         .required(eventErrorMessage.SELECT_COUNTRY),
    //       state: yup
    //         .string()
    //         .typeError(eventErrorMessage.SELECT_STATE)
    //         .required(eventErrorMessage.SELECT_STATE),
    //       pincode: yup
    //         .string()
    //         .typeError(eventErrorMessage.ENTER_PINCODE)
    //         .required(eventErrorMessage.ENTER_PINCODE),
    //       city: yup
    //         .string()
    //         .typeError(eventErrorMessage.ENTER_CITY)
    //         .required(eventErrorMessage.ENTER_CITY),
    //       line1: yup
    //         .string()
    //         .typeError(eventErrorMessage.ENTER_LINE_1)
    //         .required(eventErrorMessage.ENTER_LINE_1),
    //     });
    //   }
    //   return schema.nullable();
    // }),

    // virtual_venue_url: yup
    //   .string()
    //   .nullable()
    //   .when(["venue_type"], (venue_type, schema) => {
    //     return venue_type === "VIR"
    //       ? schema
    //           .url(eventErrorMessage.EVENT_VIRTUAL_ID_URL)
    //           .required(eventErrorMessage.EVENT_VIRTUAL_ID)
    //       : schema.notRequired();
    //   }),
    // event_contacts: yup.array().of(
    //   yup.object().shape({
    //     name: yup
    //       .string("string plz")
    //       .typeError()
    //       .required(eventErrorMessage.EVENT_CONTACT_NAME_REQUIRED),
    //     sport: yup
    //       .number()
    //       .required(eventErrorMessage.EVENT_CONTACT_SPORT_REQUIRED),
    //     email: yup
    //       .string()
    //       .email(eventErrorMessage.EVENT_CONTACT_EMAIL)
    //       .required(eventErrorMessage.EVENT_CONTACT_MAIL_REQUIRED),
    //     phone_number: yup
    //       .number()
    //       .typeError(eventErrorMessage.EVENT_CONTACT_NUMBER)
    //       .required(eventErrorMessage.EVENT_CONTACT_PHNUMBER_REQUIRED),
    //     whatsapp_number: yup
    //       .number()
    //       .typeError(eventErrorMessage.EVENT_CONTACT_NUMBER)
    //       .required(eventErrorMessage.EVENT_CONTACT_WANUMBER_REQUIRED),
    //   })
    // ),
  });
};

export const getEventCreateYupSchemaFormTwo = (yup) => {
  return yup.object().shape({
    eventVenue: yup.array().of(
      yup.object().shape({
        venue_type: yup.string().required("Please select the venue type"),
        venueId: yup.object().when("venue_type", (venue_type, schema) => {
          return venue_type === "PV"
            ? schema.required("Please select the venue")
            : schema.nullable().notRequired();
        }),
        venue_name: yup
          .string()
          .trim()
          .when("venue_type", (venue_type, schema) => {
            return venue_type === "TV"
              ? schema.required("Please enter the venue name")
              : schema.notRequired();
          }),
        address: yup.object().when("venue_type", (venue_type, schema) => {
          return venue_type === "TV"
            ? schema.shape({
                line1: yup.string().trim().required("Please enter the address"),
                city: yup.string().trim().required("Please enter the city"),
                pincode: yup
                  .string()
                  .trim()
                  .required("Please enter the pincode"),
                state: yup.string().trim().required("Please select the state"),
                country: yup
                  .string()
                  .trim()
                  .required("Please select the country"),
              })
            : schema.notRequired();
        }),
      })
    ),
    virtualVenueUrl: yup.string().when("eventVenue", (eventVenue, schema) => {
      const isVirtualUrl = Boolean(
        eventVenue.find((ev) => ev.venue_type === "VU")
      );
      return isVirtualUrl
        ? schema
            .url("Please enter a valid URL")
            .required("Please enter the virual URL")
        : schema.notRequired();
    }),
  });
};

export const getEditAboutEventYupSchema = (yup) => {
  return yup.object().shape({
    event_name: yup
      .string(eventErrorMessage.ENTER_EVENT)
      .required(eventErrorMessage.ENTER_EVENT),
    event_category: yup
      .string(eventErrorMessage.EVENT_CATEGORY)
      .required(eventErrorMessage.EVENT_CATEGORY),

    event_startdate: yup
      .date()
      .nullable()
      .required(eventErrorMessage.EVENT_START_DATE)
      .typeError(eventErrorMessage.EVENT_START_DATE),
    // .min(
    //   new Date(new Date().setHours(0, 0, 0, 0)),
    //   eventErrorMessage.INVALID_FROM_DATE
    // ),

    event_enddate: yup
      .date()
      .required(eventErrorMessage.EVENT_END_DATE)
      .typeError(eventErrorMessage.EVENT_END_DATE)
      .min(new Date(), eventErrorMessage.INVALID_TO_DATE)
      .when(["event_startdate"], (event_startdate, schema) => {
        return event_startdate
          ? schema.min(event_startdate, eventErrorMessage.INVALID_END_DATE)
          : schema;
      }),

    event_reg_startdate: yup
      .date()
      .nullable()
      .required(eventErrorMessage.EVENT_REG_START_DATE)
      .typeError(eventErrorMessage.EVENT_REG_START_DATE)
      // .min(
      //   new Date(new Date().setHours(0, 0, 0, 0)),
      //   eventErrorMessage.INVALID_REG_FROM_DATE
      // )
      .when(["event_enddate"], (event_enddate, schema) => {
        return event_enddate
          ? schema.max(event_enddate, eventErrorMessage.REG_START_BEFORE_END)
          : schema;
      }),

    event_reg_lastdate: yup
      .date()
      .required(eventErrorMessage.EVENT_REG_END_DATE)
      .typeError(eventErrorMessage.EVENT_REG_END_DATE)
      .min(new Date(), eventErrorMessage.INVALID_REG_TO_DATE)
      .when(["event_reg_startdate"], (event_reg_startdate, schema) => {
        return event_reg_startdate
          ? schema.min(
              event_reg_startdate,
              eventErrorMessage.INVALID_REG_END_DATE
            )
          : schema;
      })
      .when(["event_enddate"], (event_enddate, schema) => {
        return event_enddate
          ? schema.max(event_enddate, eventErrorMessage.INVALID_END_DATE)
          : schema;
      }),
    event_desc: yup
      .mixed()
      .test(
        "description",
        eventErrorMessage.EVENT_DESCRIPTION,
        (event_desc) => {
          return event_desc.getCurrentContent().hasText();
        }
      ),
    venue_type: yup.string().notRequired(),

    event_venue_other: yup.object().when("venue_type", (venue_type, schema) => {
      if (venue_type === "VEN") {
        return schema.shape({
          country: yup
            .string()
            .typeError(eventErrorMessage.SELECT_COUNTRY)
            .required(eventErrorMessage.SELECT_COUNTRY),
          state: yup
            .string()
            .typeError(eventErrorMessage.SELECT_STATE)
            .required(eventErrorMessage.SELECT_STATE),
          pincode: yup
            .string()
            .typeError(eventErrorMessage.ENTER_PINCODE)
            .required(eventErrorMessage.ENTER_PINCODE),
          city: yup
            .string()
            .typeError(eventErrorMessage.ENTER_CITY)
            .required(eventErrorMessage.ENTER_CITY),
          line1: yup
            .string()
            .typeError(eventErrorMessage.ENTER_LINE_1)
            .required(eventErrorMessage.ENTER_LINE_1),
        });
      }
      return schema.nullable();
    }),
    virtual_venue_url: yup
      .string()
      .nullable()
      .when(["venue_type"], (venue_type, schema) => {
        return venue_type === "VIR"
          ? schema
              .url(eventErrorMessage.EVENT_VIRTUAL_ID_URL)
              .required(eventErrorMessage.EVENT_VIRTUAL_ID)
          : schema.notRequired();
      }),
    stream_url: yup.array().of(
      yup.object().shape({
        url: yup
          .string()
          .url(eventErrorMessage.EVENT_VIRTUAL_ID_URL)
          .when(["description"], (description, schema) => {
            return description
              ? schema.required(eventErrorMessage.EVENT_STREAM_URL)
              : schema;
          }),
        description: yup.string(),
      })
    ),
    event_rules: yup
      .mixed()
      .test("terms", eventErrorMessage.EVENT_TERMS, (event_rules) => {
        return event_rules.getCurrentContent().hasText();
      }),
    // event_contacts: yup.array().of(
    //   yup.object().shape({
    //     name: yup
    //       .string("string plz")
    //       .typeError()
    //       .required(eventErrorMessage.EVENT_CONTACT_NAME_REQUIRED),
    //     sport: yup
    //       .number()
    //       .required(eventErrorMessage.EVENT_CONTACT_SPORT_REQUIRED),
    //     email: yup
    //       .string()
    //       .email(eventErrorMessage.EVENT_CONTACT_EMAIL)
    //       .required(eventErrorMessage.EVENT_CONTACT_MAIL_REQUIRED),
    //     phone_number: yup
    //       .number()
    //       .typeError(eventErrorMessage.EVENT_CONTACT_NUMBER)
    //       .required(eventErrorMessage.EVENT_CONTACT_PHNUMBER_REQUIRED),
    //     whatsapp_number: yup
    //       .number()
    //       .typeError(eventErrorMessage.EVENT_CONTACT_NUMBER)
    //       .required(eventErrorMessage.EVENT_CONTACT_WANUMBER_REQUIRED),
    //   })
    // ),
  });
};

export const getDraftCreateYupSchema = (yup) => {
  return yup.object().shape({
    event_name: yup
      .string(eventErrorMessage.ENTER_EVENT)
      .required(eventErrorMessage.ENTER_EVENT),
    event_category: yup
      .string(eventErrorMessage.EVENT_CATEGORY)
      .required(eventErrorMessage.EVENT_CATEGORY),

    event_startdate: yup
      .date()
      .nullable()
      .required(eventErrorMessage.EVENT_START_DATE)
      .typeError(eventErrorMessage.EVENT_START_DATE)
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        eventErrorMessage.INVALID_FROM_DATE
      ),

    event_enddate: yup
      .date()
      .required(eventErrorMessage.EVENT_END_DATE)
      .typeError(eventErrorMessage.EVENT_END_DATE)
      .min(new Date(), eventErrorMessage.INVALID_TO_DATE)
      .when(["event_startdate"], (event_startdate, schema) => {
        return event_startdate
          ? schema.min(event_startdate, eventErrorMessage.INVALID_END_DATE)
          : schema;
      }),
    // event_reg_startdate: yup
    //   .date()
    //   .nullable()
    //   .required(eventErrorMessage.EVENT_REG_START_DATE)
    //   .typeError(eventErrorMessage.EVENT_REG_START_DATE)
    //   .min(
    //     new Date(new Date().setHours(0, 0, 0, 0)),
    //     eventErrorMessage.INVALID_REG_FROM_DATE
    //   ),
    // event_reg_lastdate: yup
    //   .date()
    //   .required(eventErrorMessage.EVENT_REG_END_DATE)
    //   .typeError(eventErrorMessage.EVENT_REG_END_DATE)
    //   .min(new Date(), eventErrorMessage.INVALID_REG_TO_DATE)
    //   .when(["event_reg_startdate"], (event_reg_startdate, schema) => {
    //     if (event_reg_startdate) return schema.notRequired();
    //     return event_reg_startdate
    //       ? schema.min(
    //           event_reg_startdate,
    //           eventErrorMessage.INVALID_REG_END_DATE
    //         )
    //       : schema;
    //   }),

    event_reg_startdate: yup
      .date()
      .nullable()
      .required(eventErrorMessage.EVENT_REG_START_DATE)
      .typeError(eventErrorMessage.EVENT_REG_START_DATE)
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        eventErrorMessage.INVALID_REG_FROM_DATE
      )
      .when(["event_enddate"], (event_enddate, schema) => {
        return event_enddate
          ? schema.max(event_enddate, eventErrorMessage.REG_START_BEFORE_END)
          : schema;
      }),

    event_reg_lastdate: yup
      .date()
      .required(eventErrorMessage.EVENT_REG_END_DATE)
      .typeError(eventErrorMessage.EVENT_REG_END_DATE)
      .min(new Date(), eventErrorMessage.INVALID_REG_TO_DATE)
      .when(["event_reg_startdate"], (event_reg_startdate, schema) => {
        return event_reg_startdate
          ? schema.min(
              event_reg_startdate,
              eventErrorMessage.INVALID_REG_END_DATE
            )
          : schema;
      })
      .when(["event_enddate"], (event_enddate, schema) => {
        return event_enddate
          ? schema.max(event_enddate, eventErrorMessage.INVALID_END_DATE)
          : schema;
      }),
    event_desc: yup
      .mixed()
      .test(
        "description",
        eventErrorMessage.EVENT_DESCRIPTION,
        (event_desc) => {
          return event_desc.getCurrentContent().hasText();
        }
      ),
    venue_type: yup.string().notRequired(),

    event_venue_other: yup.object().when("venue_type", (venue_type, schema) => {
      if (venue_type === "VEN") {
        return schema.shape({
          country: yup
            .string()
            .typeError(eventErrorMessage.SELECT_COUNTRY)
            .required(eventErrorMessage.SELECT_COUNTRY),
          state: yup
            .string()
            .typeError(eventErrorMessage.SELECT_STATE)
            .required(eventErrorMessage.SELECT_STATE),
          pincode: yup
            .string()
            .typeError(eventErrorMessage.ENTER_PINCODE)
            .required(eventErrorMessage.ENTER_PINCODE),
          city: yup
            .string()
            .typeError(eventErrorMessage.ENTER_CITY)
            .required(eventErrorMessage.ENTER_CITY),
          line1: yup
            .string()
            .typeError(eventErrorMessage.ENTER_LINE_1)
            .required(eventErrorMessage.ENTER_LINE_1),
        });
      }
      return schema.nullable();
    }),
    virtual_venue_url: yup
      .string()
      .nullable()
      .when(["venue_type"], (venue_type, schema) => {
        return venue_type === "VIR"
          ? schema
              .url(eventErrorMessage.EVENT_VIRTUAL_ID_URL)
              .required(eventErrorMessage.EVENT_VIRTUAL_ID)
          : schema.notRequired();
      }),
    event_rules: yup
      .mixed()
      .test("terms", eventErrorMessage.EVENT_TERMS, (event_rules) => {
        return event_rules.getCurrentContent().hasText();
      }),
    // event_contacts: yup.array().of(
    //   yup.object().shape({
    //     name: yup
    //       .string("string plz")
    //       .typeError()
    //       .required(eventErrorMessage.EVENT_CONTACT_NAME_REQUIRED),
    //     sport: yup
    //       .number()
    //       .required(eventErrorMessage.EVENT_CONTACT_SPORT_REQUIRED),
    //     email: yup
    //       .string()
    //       .email(eventErrorMessage.EVENT_CONTACT_EMAIL)
    //       .required(eventErrorMessage.EVENT_CONTACT_MAIL_REQUIRED),
    //     phone_number: yup
    //       .number()
    //       .typeError(eventErrorMessage.EVENT_CONTACT_NUMBER)
    //       .required(eventErrorMessage.EVENT_CONTACT_PHNUMBER_REQUIRED),
    //     whatsapp_number: yup
    //       .number()
    //       .typeError(eventErrorMessage.EVENT_CONTACT_NUMBER)
    //       .required(eventErrorMessage.EVENT_CONTACT_WANUMBER_REQUIRED),
    //   })
    // ),
  });
};

export const DateSchema = (yup) => {
  return yup.object().shape({
    start_date: yup.date().typeError("").required(""),
    end_date: yup.date().typeError("").required(""),
  });
};

export const SportListModalScema = (yup, isVirtualEvent, hasPayment) => {
  return yup.object().shape({
    tournaments: yup.array().of(
      yup.object().shape({
        sportsRefid: yup.string().required("Please select the Sports"),
        tournamentCategories: yup.array().of(
          yup.object().shape({
            participantCategory: yup
              .number()
              .required("Please select participantCategory"),
            tournamentCategory: yup
              .string()
              .required("Please Enter the Category"),
            // tournamentSubCategory:yup.array().of(
            //   yup.string()
            //   .required("Please select ")
            // )
            regFee: yup.string().when([], (schema) => {
              return hasPayment
                ? schema.required("Please enter the fee")
                : schema;
            }),
            tournamentFormat: yup.string().required("Please enter the Format"),
            tournamentCategoryName: yup
              .string()
              .required("Please enter the Category Name"),
            tournamentConfig: yup.object().shape({
              age_criteria: yup.object().shape({
                criteria_by: yup
                  .string()
                  .required("Please Select the Age Criteria"),
                // age_value: yup.string().required("Please Enter the Age Value"),
                age_value: yup
                  .string()
                  .required()
                  .when("criteria_by", (criteria_by, schema) => {
                    return criteria_by && criteria_by !== "Open"
                      ? schema.required("Please Enter the Age Value")
                      : schema.notRequired();
                  }),
                age_from: yup
                  .date()
                  .typeError("Error")
                  .required("Please pick the DOB"),
                age_to: yup
                  .date()
                  .typeError("Error")
                  .required("Please pick the DOB"),
              }),
              participant_criteria: yup.object().shape({
                max_registrations: yup
                  .number(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
                  // .nullable()
                  .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
                  .required(eventErrorMessage.EVENT_SPORT_MAXAGE)
                  .when(["min_registrations"], (min_registrations, schema) => {
                    return min_registrations
                      ? schema.min(
                          min_registrations,
                          "Max Team value should be more than min Team"
                        )
                      : schema;
                  })
                  .max(99, "Max Team should be less than 100"),

                min_registrations: yup
                  .number(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
                  .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
                  .required(eventErrorMessage.EVENT_SPORT_MINAGE)
                  .min(1, "Min Team should be more than 1")
                  .max(99, "Min Team should be less than max teams"),
              }),
              team_criteria: yup.object().shape({
                max_players_per_team: yup
                  .number(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
                  .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
                  // .required(eventErrorMessage.EVENT_SPORT_MAXAGE)
                  .when(
                    ["min_players_per_team"],
                    (min_players_per_team, schema) => {
                      return min_players_per_team
                        ? schema.min(
                            min_players_per_team,
                            "Max Players value should be more than min Players"
                          )
                        : schema;
                    }
                  )
                  .max(25, "Max Player should be less than 25"),

                min_players_per_team: yup
                  .number(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
                  .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
                  // .required(eventErrorMessage.EVENT_SPORT_MINAGE)
                  .min(1, "Min Player should be more than 1")
                  .max(25, "Min Player should be less than max players"),

                max_male_players: yup
                  .number(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
                  .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
                  // .required(eventErrorMessage.EVENT_SPORT_MAXAGE)
                  .when(["min_male_players"], (min_male_players, schema) => {
                    return min_male_players
                      ? schema.min(
                          min_male_players,
                          "Max Players value should be more than min Players"
                        )
                      : schema;
                  })
                  .max(25, "Max Player should be less than 25"),

                min_male_players: yup
                  .number(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
                  .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
                  // .required(eventErrorMessage.EVENT_SPORT_MINAGE)
                  .min(1, "Min Player should be more than 1")
                  .max(25, "Min Player should be less than max players"),
                max_female_players: yup
                  .number(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
                  .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
                  // .required(eventErrorMessage.EVENT_SPORT_MAXAGE)
                  .when(
                    ["min_female_players"],
                    (min_female_players, schema) => {
                      return min_female_players
                        ? schema.min(
                            min_female_players,
                            "Max Players value should be more than min Players"
                          )
                        : schema;
                    }
                  )
                  .max(25, "Max Player should be less than 25"),

                min_female_players: yup
                  .number(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
                  .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
                  // .required(eventErrorMessage.EVENT_SPORT_MINAGE)
                  .min(1, "Min Player should be more than 1")
                  .max(25, "Min Player should be less than max players"),
              }),
            }),

            // tournamentCategoryVenue: yup
            //   .string()
            //   .required("Please Select the Venue"),
            tournamentCategoryPrizes: yup
              .array()
              .compact()
              .min(1, "Please select the Prize"),
            tournamentCategoryVenue: yup.array().when([], (schema) => {
              return isVirtualEvent
                ? schema
                : schema.compact().min(1, "Please select the Event Venue");
            }),
            tournamentCategoryDesc: yup
              .mixed()
              .test(
                "desc",
                eventErrorMessage.EVENT_DESCRIPTION,
                (tournamentCategoryDesc) => {
                  return tournamentCategoryDesc.getCurrentContent().hasText();
                }
              )
              .required("Please Enter the Description"),
            standardPlayingConditions: yup
              // .typeError()
              .mixed()
              .test(
                "rules",
                eventErrorMessage.EVENT_TERMS,
                (standardPlayingConditions) => {
                  return standardPlayingConditions
                    .getCurrentContent()
                    .hasText();
                }
              )
              .required("Please Enter the Rules"),
          })
        ),
      })
    ),
  });
};

//arrray of /ob/arra/oject/obece object

export const SportListAboutModalSchema = (otherFormik, yup) => {
  return yup?.object().shape({
    sport_id: yup
      .string(eventErrorMessage.EVENT_SPORT_NAME)
      .required(eventErrorMessage.EVENT_SPORT_NAME),
    tournament_category: yup
      .string(eventErrorMessage.EVENT_SPORT_SELECT_CATEGORY)
      .required(eventErrorMessage.EVENT_SPORT_SELECT_CATEGORY),
    // tournament_format: yup
    //   .string()
    //   .required(eventErrorMessage.EVENT_SPORT_FORMAT),
    tournament_format: yup
      .string()
      .test(
        "is-tournament",
        eventErrorMessage.EVENT_SPORT_FORMAT,
        (tournament_format) => {
          if (otherFormik?.values?.event_category?.split(",")[1] === "TOU") {
            return tournament_format;
          }
          return true;
        }
      ),
    max_age: yup
      .number(eventErrorMessage.EVENT_SPORT_NUMBER_MAXAGE)
      .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MAXAGE)
      .required(eventErrorMessage.EVENT_SPORT_MAXAGE)
      .when(["min_age"], (min_age, schema) => {
        return min_age
          ? schema.min(min_age, "Max age should be more than min age")
          : schema;
      })
      .max(99, "Max age should be less than 100"),
    min_age: yup
      .number(eventErrorMessage.EVENT_SPORT_NUMBER_MINAGE)
      .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MINAGE)
      .required(eventErrorMessage.EVENT_SPORT_MINAGE)
      .min(1, "Min age should be more than 1")
      .max(99, "Min age should be less than 100"),

    max_players_per_team: yup
      .number(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
      .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
      .required(eventErrorMessage.EVENT_SPORT_MAXAGE)
      .when(["minimum_players"], (minimum_players, schema) => {
        return minimum_players
          ? schema.min(
              minimum_players,
              "Max Players value should be more than min Players"
            )
          : schema;
      })
      .max(25, "Max Player should be less than 25"),

    minimum_players: yup
      .number(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
      .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
      .required(eventErrorMessage.EVENT_SPORT_MINAGE)
      .min(1, "Min Player should be more than 1")
      .max(25, "Min Player should be less than max players"),

    max_reg_count: yup
      .number(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
      .nullable()
      .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MAXPLAYER)
      .required(eventErrorMessage.EVENT_SPORT_MAXAGE)
      .when(["min_reg_count"], (min_reg_count, schema) => {
        return min_reg_count
          ? schema.min(
              min_reg_count,
              "Max Team value should be more than min Team"
            )
          : schema;
      })
      .max(99, "Max Team should be less than 100"),
    tournament_category_prizes: yup
      .array()
      .compact()
      .min(1, "Please select any one reward"),
    min_reg_count: yup
      .number(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
      .typeError(eventErrorMessage.EVENT_SPORT_NUMBER_MINPLAYER)
      .required(eventErrorMessage.EVENT_SPORT_MINAGE)
      .min(1, "Min Team should be more than 1")
      .max(99, "Min Team should be less than max teams"),

    sport_desc: yup
      .string(eventErrorMessage.EVENT_SPORT_DESCRIPTION)
      .required(eventErrorMessage.EVENT_SPORT_DESCRIPTION),
  });
};

export const getRegisterTeamSchema = (yup, sportList) => {
  return yup.object().shape({
    tournament_category_id: yup
      .string()
      .required(eventErrorMessage.EVENT_SPORT_NAME)
      .test(
        "maximum-teams",
        eventErrorMessage.MAX_TEAMS_FULL,
        async function (tournament_category_id) {
          try {
            if (tournament_category_id) {
              const sport = sportList.find(
                (sport) =>
                  sport["tournament_category_id"] == tournament_category_id
              );
              if (sport?.["max_reg_count"]) {
                const teams = await teamService.getTeam(tournament_category_id);
                return Boolean(teams?.length < Number(sport["max_reg_count"]));
              }
            }
            return true;
          } catch (e) {
            console.log(e);
            return false;
          }
        }
      ),
    team_name: yup
      .string()
      .trim()
      .required(eventErrorMessage.ENTER_TEAM_NAME)
      .test(
        "is-duplicate-team",
        eventErrorMessage.TEAM_NAME_EXISTS,
        async function (team_name) {
          try {
            const tournament_category_id = this.parent.tournament_category_id;
            if (team_name && tournament_category_id) {
              const response = await teamService.verifyTeamName(
                tournament_category_id,
                team_name
              );
              return !response.status;
            }
            return true;
          } catch (e) {
            console.log(e);
            return false;
          }
        }
      ),
    team_members: yup.array().of(
      yup.object().shape({
        first_name: yup
          .string()
          .trim()
          .required(eventErrorMessage.ENTER_FIRST_NAME),
        last_name: yup
          .string()
          .trim()
          .required(eventErrorMessage.ENTER_LAST_NAME),
        email_id: yup
          .string()
          .trim()
          .required(eventErrorMessage.ENTER_EMAIL)
          .email(eventErrorMessage.ENTER_VALID_EMAIL),
        contact_number: yup
          .string()
          .typeError(eventErrorMessage.ENTER_CONTACT)
          .required(eventErrorMessage.ENTER_CONTACT)
          .test(
            "is-valid",
            eventErrorMessage.ENTER_VALID_CONTACT,
            (contact_number) => {
              return contact_number && isValidPhoneNumber(contact_number);
            }
          ),
      })
    ),
    // page_category_id: yup.string().required("Please select the page category"),
  });
};

export const getEventRegisterTeamSchema = (
  yup,
  minPlayers,
  maxPlayers,
  minDob,
  maxDob,
  averageAge,
  minMale,
  maxMale,
  minFemale,
  maxFemale,
  arePreferencesPresent
) => {
  return yup.object().shape({
    selected_team_id: yup.string().required(eventErrorMessage.SELECT_TEAM),
    new_team_name: yup
      .string()
      .trim()
      .when("selected_team_id", (selected_team_id, schema) => {
        return selected_team_id === "NEWTEAM" ||
          selected_team_id === "EXISTINGTEAM"
          ? schema.required(eventErrorMessage.ENTER_TEAM_NAME)
          : schema.notRequired();
      }),
    parent_company_id: yup
      .string()
      .when("selected_team_id", (selected_team_id, schema) => {
        return selected_team_id === "EXISTINGTEAM"
          ? schema.required(eventErrorMessage.SELECT_PAGE)
          : schema.notRequired();
      }),
    team_name: yup
      .string()
      .trim()
      .required(eventErrorMessage.ENTER_EVENT_TEAM_NAME),
    team_members: yup
      .array()
      .of(
        yup.object().shape({
          // player_id: yup
          //   .string()
          //   .trim()
          //   .required(eventErrorMessage.ENTER_PLAYER_ID),
          first_name: yup
            .string()
            .trim()
            .required(eventErrorMessage.ENTER_FIRST_NAME),
          last_name: yup
            .string()
            .trim()
            .required(eventErrorMessage.ENTER_LAST_NAME),
          email_id: yup
            .string()
            .trim()
            .required(eventErrorMessage.ENTER_EMAIL)
            .email(eventErrorMessage.ENTER_VALID_EMAIL),
          contact_number: yup
            .string()
            .typeError(eventErrorMessage.ENTER_CONTACT)
            .required(eventErrorMessage.ENTER_CONTACT)
            .test(
              "is-valid",
              eventErrorMessage.ENTER_VALID_CONTACT,
              (contact_number) => {
                return contact_number && isValidPhoneNumber(contact_number);
              }
            ),
          gender: yup.string().trim().required(eventErrorMessage.SELECT_GENDER),
          dob: yup
            .date()
            .required(eventErrorMessage.ENTER_DOB)
            .typeError(eventErrorMessage.ENTER_DOB)
            .min(
              minDob,
              `Player should have a date of birth after ${format(
                minDob,
                "dd/MM/yyyy"
              )}`
            )
            .max(
              maxDob,
              `Player should have a date of birth before ${format(
                maxDob,
                "dd/MM/yyyy"
              )}`
            ),
          // .max(new Date(), eventErrorMessage.INVALID_DOB),
          ...(arePreferencesPresent && {
            preferences_opted: yup
              .object()
              .typeError("Please select the prefernces")
              .required("Please select the prefernces"),
          }),
        })
      )
      .min(
        minPlayers,
        `Minimum of ${minPlayers} players per team should be present for this sport`
      )
      .max(
        maxPlayers,
        `Maximum of ${maxPlayers} players per team should be present for this sport`
      )
      .test(
        "average-age",
        `The average age of players should be ${averageAge}`,
        (team_members) => {
          if (!averageAge) return true;
          const ageTotal = team_members.reduce((total, member) => {
            const age = differenceInYears(new Date(), member.dob);
            return total + age;
          }, 0);
          const average = ageTotal / team_members.length;
          return average >= Number(averageAge);
        }
      )
      .test(
        "min-male",
        `Minimum of ${minMale} male players should be present`,
        (team_members) => {
          if (!minMale || !Number(minMale)) return true;
          const noOfMale = team_members.filter(
            (member) => member.gender === "M"
          )?.length;
          return noOfMale >= Number(minMale);
        }
      )
      .test(
        "max-male",
        `Maximum of ${maxMale} male players should be present`,
        (team_members) => {
          if (!maxMale || !Number(maxMale)) return true;
          const noOfMale = team_members.filter(
            (member) => member.gender === "M"
          )?.length;
          return noOfMale <= Number(maxMale);
        }
      )
      .test(
        "min-female",
        `Minimum of ${minFemale} female players should be present`,
        (team_members) => {
          if (!minFemale || !Number(minFemale)) return true;
          const noOfFemale = team_members.filter(
            (member) => member.gender === "F"
          )?.length;
          return noOfFemale >= Number(minFemale);
        }
      )
      .test(
        "max-female",
        `Maximum of ${maxFemale} female players should be present`,
        (team_members) => {
          if (!maxFemale || !Number(maxFemale)) return true;
          const noOfFemale = team_members.filter(
            (member) => member.gender === "F"
          )?.length;
          return noOfFemale <= Number(maxFemale);
        }
      ),
  });
};

export const getEventRegisterPlayersSchema = (
  yup,
  minDob,
  maxDob,
  averageAge,
  arePreferencesPresent
) => {
  return yup.object().shape({
    players: yup
      .array()
      .of(
        yup.object().shape({
          // player_id: yup
          //   .string()
          //   .trim()
          //   .required(eventErrorMessage.ENTER_PLAYER_ID),
          first_name: yup
            .string()
            .trim()
            .required(eventErrorMessage.ENTER_FIRST_NAME),
          last_name: yup
            .string()
            .trim()
            .required(eventErrorMessage.ENTER_LAST_NAME),
          email_id: yup
            .string()
            .trim()
            .required(eventErrorMessage.ENTER_EMAIL)
            .email(eventErrorMessage.ENTER_VALID_EMAIL),
          contact_number: yup
            .string()
            .typeError(eventErrorMessage.ENTER_CONTACT)
            .required(eventErrorMessage.ENTER_CONTACT)
            .test(
              "is-valid",
              eventErrorMessage.ENTER_VALID_CONTACT,
              (contact_number) => {
                return contact_number && isValidPhoneNumber(contact_number);
              }
            ),
          gender: yup.string().trim().required(eventErrorMessage.SELECT_GENDER),
          dob: yup
            .date()
            .required(eventErrorMessage.ENTER_DOB)
            .typeError(eventErrorMessage.ENTER_DOB)
            .min(
              minDob,
              `Player should have a date of birth after ${format(
                minDob,
                "dd/MM/yyyy"
              )}`
            )
            .max(
              maxDob,
              `Player should have a date of birth before ${format(
                maxDob,
                "dd/MM/yyyy"
              )}`
            ),
          // .max(new Date(), eventErrorMessage.INVALID_DOB),
          ...(arePreferencesPresent && {
            preferences_opted: yup
              .object()
              .typeError("Please select the prefernces")
              .required("Please select the prefernces"),
          }),
        })
      )
      .test(
        "average-age",
        `The average age of players should be ${averageAge}`,
        (players) => {
          if (!averageAge) return true;
          const ageTotal = players.reduce((total, player) => {
            const age = differenceInYears(new Date(), player.dob);
            return total + age;
          }, 0);
          const average = ageTotal / players.length;
          return average >= Number(averageAge);
        }
      ),
  });
};

export const getPlayerPreferencesSchema = (
  yup,
  preferencesOffered,
  isApparelPresent,
  isFoodPresent
) => {
  const objShape = {};
  if (isApparelPresent) {
    const apparelShape = {};
    preferencesOffered.apparel_preference.forEach((apparel) => {
      if (apparel === "TST") {
        apparelShape[apparel] = yup.object().shape({
          size: yup.string().required(eventErrorMessage.SELECT_SIZE),
          nameToPrint: yup
            .string()
            .required(eventErrorMessage.ENTER_NAME_PRINT),
          numberToPrint: yup
            .string()
            .required(eventErrorMessage.ENTER_NUMBER_PRINT),
        });
      } else {
        apparelShape[apparel] = yup.object().shape({
          size: yup.string().required(eventErrorMessage.SELECT_SIZE),
        });
      }
      objShape.apparel_preference = yup.object().shape(apparelShape);
    });
  }
  if (isFoodPresent) {
    objShape.food_preference = yup
      .string()
      .required(eventErrorMessage.SELECT_FOOD);
  }

  return yup.object().shape(objShape);
};

export const DateValues = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "tomorrow",
    label: "Tomorrow",
  },
  {
    value: "week",
    label: "This Week",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "year",
    label: "This Year",
  },
];

const isSportExists = (array, sportId) => {
  const checkValue = (x) => x.sportsRefid === sportId;
  return array.findIndex(checkValue) === -1 ? false : true;
};

const getSportTournament = (array, sportId) => {
  const checkValue = (x) => x.sportsRefid === sportId;
  return array.find(checkValue);
};

const isCategoryExists = (array, categoryType) => {
  const checkValue = (x) => x.tournamentCategory === categoryType;
  return array.findIndex(checkValue) === -1 ? false : true;
};

export const addTocategory = (newCategory, categoriesList) => {
  //copy the existing state object
  const newTournamentCategories = [...categoriesList];
  const sportId = newCategory.sportsRefid;
  const tournamentCategory = { ...newCategory.tournamentCategories[0] };

  if (newTournamentCategories.length === 0) {
    newTournamentCategories.push(newCategory);
  } else {
    if (!isSportExists(newTournamentCategories, sportId)) {
      newTournamentCategories.push(newCategory);
    } else {
      //get the sport tournament
      const sportCategory = getSportTournament(
        newTournamentCategories,
        sportId
      );

      //Check if category exists already
      if (
        !isCategoryExists(
          sportCategory.tournamentCategories,
          tournamentCategory.categoryType
        )
      ) {
        sportCategory.tournamentCategories.push(tournamentCategory);
      } else {
        console.log("category already exists");
      }
    }
  }
  return newTournamentCategories;
};

export const removeCategory = (sportId, categoryType, categoriesList) => {
  console.log(sportId, categoryType, categoriesList);
  const tournamentCategories = [...categoriesList];
  //get the sport tournament
  const sportCategory = getSportTournament(tournamentCategories, sportId);

  if (!sportCategory) {
    return;
  }

  //check if only one category exists in that sport
  if (sportCategory.tournamentCategories.length === 1) {
    tournamentCategories.splice(
      tournamentCategories.findIndex((x) => x.sportsRefid === sportId),
      1
    );
  } else {
    sportCategory.tournamentCategories.splice(
      sportCategory.tournamentCategories.findIndex(
        (x) => x.tournamentCategory === categoryType
      ),
      1
    );
  }
  return tournamentCategories;
};

export const editCategory = (updatedCategory, sportCategoriesList) => {
  const tournamentCategories = [...sportCategoriesList];
  const sportId = updatedCategory.sportsRefid;
  const editedCategory = updatedCategory.tournamentCategories[0];

  const sportTournament = getSportTournament(tournamentCategories, sportId);
  const existingCategory = sportTournament.tournamentCategories.find(
    (x) => x.tournamentCategory === editedCategory.tournamentCategory
  );
  //update the fields
  for (const property in editedCategory) {
    existingCategory[property] = editedCategory[property];
  }
  return tournamentCategories;
};

export const processForSending = (
  sportCategoriesListOrginal,
  sportCategoriesList
) => {
  const originalDBTournaments = clone(sportCategoriesListOrginal);
  const newTournaments = [...sportCategoriesList];
  //loop through new sport tournaments
  newTournaments.map((tournament) => {
    //Check if that sport tournament exists in the db copy
    if (isSportExists(originalDBTournaments, tournament.sportsRefid)) {
      const sportTournamentExisitng = getSportTournament(
        originalDBTournaments,
        tournament.sportsRefid
      );
      sportTournamentExisitng.status = "UPDATE";
      //tournament category looping
      tournament.tournamentCategories.map((tournamentCategory) => {
        //Check if new tournament category exists
        if (
          sportTournamentExisitng.tournamentCategories.findIndex(
            (x) =>
              x.tournamentCategory === tournamentCategory.tournamentCategory
          ) >= 0
        ) {
          const tournamentCategoryExisting =
            sportTournamentExisitng.tournamentCategories.find(
              (x) =>
                x.tournamentCategory === tournamentCategory.tournamentCategory
            );
          for (const property in tournamentCategory) {
            tournamentCategoryExisting[property] = tournamentCategory[property];
          }
          tournamentCategoryExisting.status = "UPDATE";
        } else {
          //add tournament category
          sportTournamentExisitng.tournamentCategories.push(tournamentCategory);
        }
      });
    } else {
      //Add the tournament
      originalDBTournaments.push({ ...tournament });
    }
  });
  //Loop through and update null status to delete
  originalDBTournaments.map((tournament) => {
    if (tournament.status === null) {
      tournament.status = "DELETE";
    }
    tournament.tournamentCategories.map((tournamentCategory) => {
      if (tournamentCategory.status === null) {
        tournamentCategory.status = "DELETE";
      }
    });
  });
  return originalDBTournaments;
};

export const addProductsForEvent = async (
  mutateAsync,
  userId,
  eventName,
  tournaments,
  sports,
  companyId,
  countryData,
  toast
) => {
  const mutations = [];
  tournaments.forEach((tournament) => {
    const sport = sports.find((s) => s.sports_id === tournament.sportsRefid);
    const sportName = sport?.sports_name;
    tournament.tournamentCategories.forEach((tournamentCategory) => {
      const categoryName = sport?.sports_category.find(
        (cat) => cat.category_code === tournamentCategory.tournamentCategory
      )?.category_name;

      const product = {
        productName: `${eventName} (${sportName} - ${categoryName})`,
        productDesc: eventName,
        productTypeId: "EPRD",
        productCategories: [],
        // Handle quantity?
        quantity: 1,
        createdBy: userId,
        availabilityStatus: "AVL",
        productLocation: countryData?.country_code,
        productPricing: {
          productBasePrice: tournamentCategory.regFee,
          productPriceCurrency: tournamentCategory.regFeeCurrency,
          isActive: true,
          taxRateId: null,
        },
        companyId: companyId,
        productEvent: {
          tournamentCategoryId: tournamentCategory.tournamentCategoryId,
        },
      };
      const mutationPromise = mutateAsync(product);
      mutations.push(mutationPromise);
    });
  });

  try {
    return await Promise.all(mutations);
  } catch (e) {
    toast({
      title: "Failed to add the products",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    throw e;
  }
};

export const updateProductsForEvent = async (
  searchProductsMutateAsync,
  addProductMutateAsync,
  updateProductMutateAsync,
  getProductMutateAsync,
  tournaments,
  eventName,
  userId,
  companyId,
  sports,
  countryData,
  isPaymentOnline,
  toast
) => {
  const searchProductsMutations = [];
  const tournamentCategories = [];
  tournaments.forEach((tournament) => {
    tournament.tournamentCategories.forEach((tournamentCategory) => {
      tournamentCategories.push({
        ...tournamentCategory,
        sportsRefid: tournament.sportsRefid,
      });
      const data = {
        productType: "EPRD",
        tournamentCategoryId: tournamentCategory.tournamentCategoryId,
        limit: 1,
      };
      const mutationPromise = searchProductsMutateAsync(data);
      searchProductsMutations.push(mutationPromise);
    });
  });

  try {
    const productsArr = await Promise.all(searchProductsMutations);
    const newTournaments = [];
    const updateProductMutations = [];

    for (const [index, products] of productsArr.entries()) {
      // For adding new products if the product is not present
      if (!products) {
        newTournaments.push({
          sportsRefid: tournamentCategories[index].sportsRefid,
          tournamentCategories: [tournamentCategories[index]],
        });
        continue;
      }

      // Fetch product data using the product id to get the productPricingId
      const searchProduct = products[0];
      const product = await getProductMutateAsync(searchProduct.productId);

      // Call update API only if price is updated
      if (
        product.productPricing.productSplPrice !==
        tournamentCategories[index].regFee
      ) {
        const availabilityStatus =
          tournamentCategories[index].status === "DELETE"
            ? "NAV"
            : product.availabilityStatus;
        const productData = {
          productId: product.productId,
          productName: product.productName,
          productDesc: product.productDesc,
          productTypeId: product.productTypeId,
          productCategories: product.productCategories,
          quantity: 1,
          createdBy: userId,
          availabilityStatus: availabilityStatus,
          productLocation: countryData?.country_code,
          productPricing: {
            productPricingId: product.productPricing.productPricingId,
            productId: product.productId,
            productBasePrice: tournamentCategories[index].regFee,
            productSplPrice: tournamentCategories[index].regFee,
            productPriceCurrency: tournamentCategories[index].regFeeCurrency,
            isActive: true,
            taxRateId: product.productPricing.taxRateId,
          },
          productEvent: {
            tournamentCategoryId:
              tournamentCategories[index].tournamentCategoryId,
          },
        };
        const mutationPromise = updateProductMutateAsync(productData);
        updateProductMutations.push(mutationPromise);
      }
    }

    if (isPaymentOnline) {
      await addProductsForEvent(
        addProductMutateAsync,
        userId,
        eventName,
        newTournaments,
        sports,
        companyId,
        countryData,
        toast
      );
    }

    await Promise.all(updateProductMutations);
  } catch (e) {
    toast({
      title: "Failed to update the products",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    throw e;
  }
};
