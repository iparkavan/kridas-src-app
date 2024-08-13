import { format } from "date-fns";

const errorMessages = {
  ENTER_TITLE: "Please enter the title",
  ENTER_DESCRIPTION: "Please enter the description",
  SELECT_SPORT: "Please select the sport",
  SELECT_CATEGORY: "Please select the category",
  ADD_FILE: "Please add the image",
  FILE_SIZE: "File size should be less than 5 MB",
  ENTER_VOUCHER_DATE: "Please enter the voucher validity date",
  ENTER_VALID_DATE: "Please enter a valid date",
  ENTER_NO_OF_VOUCHERS: "Please enter the no of vouchers",
  ENTER_COST: "Please enter the cost",
  SELECT_CURRENCY: "Please select the currency",
  ENTER_TERMS: "Please enter the terms and conditions",
  SELECT_SERVICE_TYPE: "Please select the service type",
  ENTER_INCLUSIONS: "Please enter the inclusions",
  SELECT_DURATION: "Please select the slot duration",
  SELECT_DAY: "Please select the days",
  SELECT_SLOT: "Please select the slots",
  // ENTER_NO_OF_USERS: "Please enter the no of users can avail the service",
  ENTER_SERVICE_DATE: "Please enter the service date",
  SELECT_SERVICE_TIME: "Please select the service time",
  SERVICE_UNAVAILABLE_DATE: "Service is not available on this date",
};

export const getAddProductYupSchema = (yup, isFileMandatory) => {
  return yup.object().shape({
    productName: yup.string().trim().required(errorMessages.ENTER_TITLE),
    productDesc: yup.string().trim().required(errorMessages.ENTER_DESCRIPTION),
    sportCategory: yup.string().trim().required(errorMessages.SELECT_SPORT),
    productCategory: yup
      .string()
      .trim()
      .required(errorMessages.SELECT_CATEGORY),
    ...(isFileMandatory && {
      file: yup
        .mixed()
        .required(errorMessages.ADD_FILE)
        .test("file", errorMessages.FILE_SIZE, (document) => {
          if (!document) return true;
          return document.size <= 5000000;
        }),
    }),
  });
};

export const getProductMarketPlaceYupSchema = (yup, isFileMandatory) => {
  return yup.object().shape({
    productName: yup.string().trim().required(errorMessages.ENTER_TITLE),
    productDesc: yup.string().trim().required(errorMessages.ENTER_DESCRIPTION),
    sportCategory: yup.string().trim().required(errorMessages.SELECT_SPORT),
    productCategory: yup
      .string()
      .trim()
      .required(errorMessages.SELECT_CATEGORY),
    redemptionTillDate: yup
      .date()
      .required(errorMessages.ENTER_VOUCHER_DATE)
      .typeError(errorMessages.ENTER_VALID_DATE)
      .min(new Date(), errorMessages.ENTER_VALID_DATE),
    quantity: yup
      .number()
      .required(errorMessages.ENTER_NO_OF_VOUCHERS)
      .min(1, errorMessages.ENTER_NO_OF_VOUCHERS),
    productBasePrice: yup.string().trim().required(errorMessages.ENTER_COST),
    productPriceCurrency: yup
      .string()
      .trim()
      .required(errorMessages.SELECT_CURRENCY),
    voucherTerms: yup
      .mixed()
      .test("terms", errorMessages.ENTER_TERMS, (voucherTerms) => {
        return voucherTerms.getCurrentContent().hasText();
      }),
    ...(isFileMandatory && {
      file: yup
        .mixed()
        .required(errorMessages.ADD_FILE)
        .test("file", errorMessages.FILE_SIZE, (document) => {
          if (!document) return true;
          return document.size <= 5000000;
        }),
    }),
  });
};

export const getServiceMarketPlaceYupSchema = (yup, isFileMandatory) => {
  return yup.object().shape({
    serviceType: yup
      .string()
      .trim()
      .required(errorMessages.SELECT_SERVICE_TYPE),
    productName: yup.string().trim().required(errorMessages.ENTER_TITLE),
    productDesc: yup.string().trim().required(errorMessages.ENTER_DESCRIPTION),
    sportCategory: yup.string().trim().required(errorMessages.SELECT_SPORT),
    productCategory: yup
      .string()
      .trim()
      .required(errorMessages.SELECT_CATEGORY),
    serviceWeeklySchedules: yup
      .array()
      .when("serviceType", (serviceType, schema) => {
        if (serviceType === "CT") {
          return schema.of(
            yup.object().shape({
              duration: yup
                .string()
                .trim()
                .required(errorMessages.SELECT_DURATION),
              days: yup.array().min(1, errorMessages.SELECT_DAY),
              slots: yup.array().min(1, errorMessages.SELECT_SLOT),
            })
          );
        }
        return schema;
      }),
    productBasePrice: yup.string().trim().required(errorMessages.ENTER_COST),
    productPriceCurrency: yup
      .string()
      .trim()
      .required(errorMessages.SELECT_CURRENCY),
    // quantity: yup
    //   .number()
    //   .required(errorMessages.ENTER_NO_OF_USERS)
    //   .min(1, errorMessages.ENTER_NO_OF_USERS),
    inclusions: yup
      .mixed()
      .test("inclusions", errorMessages.ENTER_INCLUSIONS, (inclusions) => {
        return inclusions.getCurrentContent().hasText();
      }),
    serviceTerms: yup
      .mixed()
      .test("terms", errorMessages.ENTER_TERMS, (serviceTerms) => {
        return serviceTerms.getCurrentContent().hasText();
      }),
    ...(isFileMandatory && {
      file: yup
        .mixed()
        .required(errorMessages.ADD_FILE)
        .test("file", errorMessages.FILE_SIZE, (document) => {
          if (!document) return true;
          return document.size <= 5000000;
        }),
    }),
  });
};

export const getVoucherMarketPlaceYupSchema = (yup, isFileMandatory) => {
  return yup.object().shape({
    productBasePrice: yup.string().trim().required(errorMessages.ENTER_COST),
    productPriceCurrency: yup
      .string()
      .trim()
      .required(errorMessages.SELECT_CURRENCY),
    productDesc: yup.string().trim().required(errorMessages.ENTER_DESCRIPTION),
    redemptionTillDate: yup
      .date()
      .required(errorMessages.ENTER_VOUCHER_DATE)
      .typeError(errorMessages.ENTER_VALID_DATE)
      .min(new Date(), errorMessages.ENTER_VALID_DATE),
    sportCategory: yup.string().trim().required(errorMessages.SELECT_SPORT),
    voucherTerms: yup
      .mixed()
      .test("terms", errorMessages.ENTER_TERMS, (voucherTerms) => {
        return voucherTerms.getCurrentContent().hasText();
      }),
    quantity: yup
      .number()
      .required(errorMessages.ENTER_NO_OF_VOUCHERS)
      .min(1, errorMessages.ENTER_NO_OF_VOUCHERS),
    ...(isFileMandatory && {
      file: yup
        .mixed()
        .required(errorMessages.ADD_FILE)
        .test("file", errorMessages.FILE_SIZE, (document) => {
          if (!document) return true;
          return document.size <= 5000000;
        }),
    }),
  });
};

export const getCalendarServiceYupSchema = (yup, serviceData) => {
  return yup.object().shape({
    isServiceCalendarType: yup.boolean(),
    date: yup
      .date()
      .when("isServiceCalendarType", (isServiceCalendarType, schema) => {
        if (!isServiceCalendarType) return schema;
        return schema
          .required(errorMessages.ENTER_SERVICE_DATE)
          .typeError(errorMessages.ENTER_SERVICE_DATE)
          .min(
            new Date(new Date().setHours(0, 0, 0, 0)),
            errorMessages.ENTER_VALID_DATE
          )
          .test(
            "isServiceDate",
            errorMessages.SERVICE_UNAVAILABLE_DATE,
            (date) => {
              if (!date) return false;
              const selectedDay = format(date, "EEE").toUpperCase();
              const serviceOnSelectedDay =
                serviceData.services.serviceWeeklySchedules.find(
                  (schedule) => schedule.weekDay === selectedDay
                );
              const isSlotPresentForDay = Boolean(
                serviceOnSelectedDay?.weeklyScheduleDetails.length > 0
              );
              return isSlotPresentForDay;
            }
          );
      }),
    // time: yup
    //   .string()
    //   .when("isServiceCalendarType", (isServiceCalendarType, schema) => {
    //     if (!isServiceCalendarType) return schema;
    //     return schema.required(errorMessages.SELECT_SERVICE_TIME);
    //   }),
  });
};

export const days = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};
