import { isValidPhoneNumber } from "react-phone-number-input";

export const pageErrorMessages = {
  ENTER_VALID_EMAIL: "Please enter a valid email",
  ENTER_CONTACT_NO: "Please enter the page contact number",
  ENTER_ADDRESS: "Please enter the address",
  ENTER_WEBSITE_URL: "Please enter a valid URL",
  ENTER_PINCODE: "Please enter the pincode",
  ENTER_COUNTRY: "Please select a country",
  ENTER_STATE: "Please select a state",
  ENTER_CITY: "Please enter the city",
  ENTER_MANDATORY: "Please enter the values",
  ENTER_PAGE: "Please enter the page name",
  ENTER_CATEGORY: "Please select a category",
  ENTER_SUBCATEGORIES: "Please select the sub-categories",
  ENTER_INTRODUCTION: "Please enter the introduction",
  ENTER_VALID_CONTACT: "Please enter a valid contact number",
  SELECT_SPORTS: "Please select atleast one sport",
  SELECT_SPORT: "Please select the sport",
  SELECT_SKILL_LEVEL: "Please select the skill level",
  SELECT_GENDER: "Please select the gender",
  SELECT_AGE_GROUP: "Please select the age group",
  SELECT_CATEGORY_ASSOCIATED: "Please select the category associated",
};

const checkAddressFilled = (address) =>
  Boolean(
    address.line1 ||
      address.line2 ||
      address.country ||
      address.state ||
      address.city ||
      address.pincode
  );

export const getPageContactInfoDetailsYupSchema = (yup) => {
  return yup.object().shape({
    company_contact_no: yup
      .string()
      .test(
        "is-valid",
        pageErrorMessages.ENTER_VALID_CONTACT,
        (company_contact_no) => {
          if (company_contact_no) {
            return isValidPhoneNumber(company_contact_no);
          }
          return true;
        }
      ),
    company_email: yup
      .string()
      .trim()
      .typeError(pageErrorMessages.ENTER_VALID_EMAIL)
      .email(pageErrorMessages.ENTER_VALID_EMAIL),
    company_website: yup
      .string()
      .typeError(pageErrorMessages.ENTER_WEBSITE_URL)
      .url(pageErrorMessages.ENTER_WEBSITE_URL),
    address: yup.object({
      pincode: yup
        .string()
        .test("pincode", pageErrorMessages.ENTER_PINCODE, function (pincode) {
          const isFilled = checkAddressFilled(this.options.parent);
          if (isFilled && !pincode) return false;
          return true;
        }),
      country: yup
        .string()
        .test("country", pageErrorMessages.ENTER_COUNTRY, function (country) {
          const isFilled = checkAddressFilled(this.options.parent);
          if (isFilled && !country) return false;
          return true;
        }),
      state: yup
        .string()
        .test("state", pageErrorMessages.ENTER_STATE, function (state) {
          const isFilled = checkAddressFilled(this.options.parent);
          if (isFilled && !state) return false;
          return true;
        }),
      city: yup
        .string()
        .test("city", pageErrorMessages.ENTER_CITY, function (city) {
          const isFilled = checkAddressFilled(this.options.parent);
          if (isFilled && !city) return false;
          return true;
        }),
    }),
  });
};

export const getCreatePageYupSchema = (yup) => {
  return yup.object().shape({
    company_name: yup.string().trim().required(pageErrorMessages.ENTER_PAGE),
    main_category_type: yup.string().required(pageErrorMessages.ENTER_CATEGORY),
    company_type: yup
      .array()
      .when("main_category_type", (main_category_type, schema) => {
        const categoryCode = main_category_type?.split(",")[1];
        if (categoryCode === "VEN" || categoryCode === "ACD") {
          return schema;
        }
        return schema.compact().min(1, pageErrorMessages.ENTER_SUBCATEGORIES);
      }),
    sports_interest: yup.array().when("category_id", (category_id, schema) => {
      return category_id === "1"
        ? schema
        : schema.compact().min(1, pageErrorMessages.SELECT_SPORTS);
    }),
    company_category: yup.array().when("category_id", (category_id, schema) => {
      return category_id === "1"
        ? schema.compact().min(1, pageErrorMessages.SELECT_CATEGORY_ASSOCIATED)
        : schema;
    }),
    company_desc: yup
      .string()
      .trim()
      .required(pageErrorMessages.ENTER_INTRODUCTION),
  });
};

export const getEditChildPageYupSchema = (yup) => {
  return yup.object().shape({
    company_name: yup.string().trim().required(pageErrorMessages.ENTER_PAGE),
    main_category_type: yup.string().required(pageErrorMessages.ENTER_CATEGORY),
    company_type: yup
      .array()
      .when("main_category_type", (main_category_type, schema) => {
        const categoryCode = main_category_type?.split(",")[1];
        if (categoryCode === "VEN" || categoryCode === "ACD") {
          return schema;
        }
        return schema.compact().min(1, pageErrorMessages.ENTER_SUBCATEGORIES);
      }),
    company_desc: yup
      .string()
      .trim()
      .required(pageErrorMessages.ENTER_INTRODUCTION),
    sports_interest: yup
      .array()
      .when("company_type", (company_type, schema) => {
        const subCatType = company_type?.[0].category_type;
        return subCatType === "VEN" || subCatType === "ACD"
          ? schema.compact().min(1, pageErrorMessages.SELECT_SPORTS)
          : schema;
      }),
    sports_id: yup.string().when("company_type", (company_type, schema) => {
      const subCatType = company_type?.[0].category_type;
      return subCatType === "TEA"
        ? schema.required(pageErrorMessages.SELECT_SPORT)
        : schema.notRequired();
    }),
    skill_level: yup.string().when("company_type", (company_type, schema) => {
      const subCatType = company_type?.[0].category_type;
      return subCatType === "TEA"
        ? schema.required(pageErrorMessages.SELECT_SKILL_LEVEL)
        : schema.notRequired();
    }),
    gender: yup.string().when("company_type", (company_type, schema) => {
      const subCatType = company_type?.[0].category_type;
      return subCatType === "TEA"
        ? schema.required(pageErrorMessages.SELECT_GENDER)
        : schema.notRequired();
    }),
    age_group: yup.string().when("company_type", (company_type, schema) => {
      const subCatType = company_type?.[0].category_type;
      return subCatType === "TEA"
        ? schema.required(pageErrorMessages.SELECT_AGE_GROUP)
        : schema.notRequired();
    }),
  });
};

export const verifyPage = (pageData) => {
  let isProfileComplete = false;
  let percentage = 0;

  if (pageData.company_profile_img) {
    percentage += 10;
  }

  if (pageData.company_img) {
    percentage += 10;
  }

  if (
    pageData.company_name &&
    pageData.main_category_type &&
    pageData.company_type?.length > 0 &&
    pageData.sports_interested?.length > 0 &&
    pageData.company_desc
  ) {
    percentage += 30;
  }

  if (
    pageData.address?.pincode &&
    pageData.address?.country &&
    pageData.address?.state &&
    pageData.address?.city
  ) {
    percentage += 30;
  }

  if (pageData.social?.some((soc) => soc?.link)) {
    percentage += 20;
  }

  // let isStatisticsValid = false;
  // for (let statistic of pageStatisticsData) {
  //   if (statistic.categorywise_statistics.category === "team") {
  //     if (
  //       statistic.categorywise_statistics.sports_id &&
  //       statistic.categorywise_statistics.skill_level &&
  //       statistic.categorywise_statistics.gender &&
  //       statistic.categorywise_statistics.age_group &&
  //       ((statistic.statistics_links &&
  //         statistic.statistics_links.length >= 1) ||
  //         (statistic.statistics_docs && statistic.statistics_docs.length >= 1))
  //     ) {
  //       isStatisticsValid = true;
  //     } else {
  //       isStatisticsValid = false;
  //       break;
  //     }
  //   } else if (statistic.categorywise_statistics.category === "venue") {
  //     if (
  //       statistic.categorywise_statistics.sports_id &&
  //       statistic.categorywise_statistics.venue &&
  //       statistic.categorywise_statistics.address
  //     ) {
  //       isStatisticsValid = true;
  //     } else {
  //       isStatisticsValid = false;
  //       break;
  //     }
  //   } else if (statistic.categorywise_statistics.category === "academy") {
  //     if (
  //       statistic.categorywise_statistics.sports_id &&
  //       statistic.categorywise_statistics.academy_name &&
  //       statistic.categorywise_statistics.skill_level &&
  //       statistic.categorywise_statistics.gender &&
  //       statistic.categorywise_statistics.age_group &&
  //       statistic.categorywise_statistics.address
  //     ) {
  //       isStatisticsValid = true;
  //     } else {
  //       isStatisticsValid = false;
  //       break;
  //     }
  //   }
  // }

  // if (isStatisticsValid) {
  //   percentage += 30;
  // }

  isProfileComplete = percentage === 100;
  return { isProfileComplete, percentage };
};

export const getPageType = (pageData) => {
  let pageType;
  switch (pageData?.["company_type_name"]?.["company_type"]) {
    case "Parent Page":
      pageType = "parent";
      break;
    case "Child Page":
      pageType = "child";
      break;
    case "SubTeam Page":
      pageType = "subteam";
      break;
  }

  const isParentPage = pageType === "parent";
  const isChildPage = pageType === "child";
  const isSubTeamPage = pageType === "subteam";

  return { pageType, isParentPage, isChildPage, isSubTeamPage };
};
