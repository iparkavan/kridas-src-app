import { validateImage } from "./common-constants";

const errorMessages = {
  ENTER_SPONSOR_NAME: "Please enter the sponsor name",
  ENTER_SPONSOR_DESC: "Please enter the sponsor description",
  UPLOAD_SPONSOR_LOGO: "Please upload the sponsor logo",
  INVALID_SPONSOR_URL: "Please enter a valid sponsor link",
  ENTER_SPONSOR_TYPE: "Please enter the sponsor type",
  SELECT_CATEGORY: "Please select a category",
  SELECT_SUBCATEGORIES: "Please select the sub-categories",
  SELECT_SPORTS: "Please select the sports associated",
  SELECT_CATEGORY_ASSOCIATED: "Please select the category associated",
};

export const getSponsorsYupSchema = (yup, mode, type) => {
  return yup.object().shape({
    // sponsor_name: yup
    //   .string()
    //   .trim()
    //   .required(errorMessages.ENTER_SPONSOR_NAME),
    sponsor_name: yup
      .object()
      .required(errorMessages.ENTER_SPONSOR_NAME)
      .typeError(errorMessages.ENTER_SPONSOR_NAME),
    main_category_type: yup
      .string()
      .when("sponsor_name", (sponsor_name, schema) => {
        const isNewSponsor = Boolean(sponsor_name?.__isNew__);
        return isNewSponsor
          ? schema.required(errorMessages.SELECT_CATEGORY)
          : schema;
      }),
    company_type: yup
      .array()
      .when(
        ["sponsor_name", "main_category_type"],
        (sponsor_name, main_category_type, schema) => {
          const isNewSponsor = Boolean(sponsor_name?.__isNew__);
          if (!isNewSponsor) return schema;

          const categoryCode = main_category_type?.split(",")[1];
          if (categoryCode === "VEN" || categoryCode === "ACD") {
            return schema;
          }
          return schema.compact().min(1, errorMessages.SELECT_SUBCATEGORIES);
        }
      ),
    sports_interest: yup
      .array()
      .when(
        ["sponsor_name", "category_id"],
        (sponsor_name, category_id, schema) => {
          const isNewSponsor = Boolean(sponsor_name?.__isNew__);
          if (!isNewSponsor) return schema;

          return category_id === "1"
            ? schema
            : schema.compact().min(1, errorMessages.SELECT_SPORTS);
        }
      ),
    company_category: yup
      .array()
      .when(
        ["sponsor_name", "category_id"],
        (sponsor_name, category_id, schema) => {
          const isNewSponsor = Boolean(sponsor_name?.__isNew__);
          if (!isNewSponsor) return schema;

          return category_id === "1"
            ? schema.compact().min(1, errorMessages.SELECT_CATEGORY_ASSOCIATED)
            : schema;
        }
      ),
    sponsor_desc: yup
      .string()
      .trim()
      .required(errorMessages.ENTER_SPONSOR_DESC),
    sponsor_media_url: yup
      .mixed()
      .test("file", errorMessages.UPLOAD_SPONSOR_LOGO, function (document) {
        if (mode === "edit" && !(document instanceof File)) return true;
        if (!document) return false;
        const { isValid, message } = validateImage(document);
        if (isValid) {
          return true;
        } else {
          return this.createError({ message });
        }
      }),
    sponsor_click_url: yup
      .string()
      .trim()
      .url(errorMessages.INVALID_SPONSOR_URL)
      .required(errorMessages.INVALID_SPONSOR_URL),
    [`${type}_sponsor_type_name`]: yup
      .string()
      .trim()
      .required(errorMessages.ENTER_SPONSOR_TYPE),
  });
};
