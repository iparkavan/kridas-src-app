import { isValidPhoneNumber } from "react-phone-number-input";
import userService from "../../services/user-service";

export const userErrorMessages = {
  ENTER_EMAIL: "Please enter your email",
  ENTER_PASSWORD: "Please enter your password",
  ENTER_VALID_EMAIL: "Please enter valid email",
  ENTER_FIRST_NAME: "Please enter your first name",
  ENTER_LAST_NAME: "Please enter your last name",
  MIN_PASSWORD_LENGTH: "Password should be atleast 6 characters",
  INVALID_LOGIN: "Invalid username or password",
  ENTER_PHONE: "Please enter your phone or mobile number",
  ENTER_VALID_PHONE: "Please enter a valid phone or mobile number",
  ENTER_ADDRESS: "Please enter all the address fields",
  EMAIL_NOT_FOUND: "This email doesn't exist. Please register to continue",
  RESET_FAILED: "Unable to reset password. Please try again later",
  PASSWORD_MATCH: "Please enter the same passwords",
  SELECT_SPORT: "Please select any sport",
  SELECT_SKILL: "Please select your skill level",
  SELECT_ACTIVE: "Please select if are actively playing",
  ENTER_ORG_NAME: "Please enter your organization name",
  INVALID_LINK: "Please enter a valid link",
  SELECT_PROFILE: "Please select your profile",
  SELECT_ROLE: "Please select your roles",
  ENTER_FROM_DATE: "Please enter the from date",
  ENTER_TO_DATE: "Please enter the to date",
  SELECT_GENDER: "Please select your gender",
  ENTER_DOB: "Please enter your date of birth",
  ENTER_LINE_1: "Please enter your address line 1",
  ENTER_LINE_2: "Please enter your address line 2",
  ENTER_PINCODE: "Please enter your pincode",
  SELECT_COUNTRY: "Please select your country",
  SELECT_STATE: "Please select your state",
  ENTER_CITY: "Please enter your city",
  ENTER_VERIFICATION_CODE: "Please enter your verification code",
  INVALID_DOB: "Date of Birth cannot be a future date",
  INVALID_END_DATE: "To date cannot be before from date",
  INVALID_FROM_DATE: "From date cannot be a future date",
  INVALID_TO_DATE: "To date cannot be a future date",
  SELECT_PROFESSION: "Please select your profession",
  ENTER_DESC: "Please enter the description",
  INVALID_REFERRAL_CODE: "Please enter a valid referral code",
  SPORT_CAREER_EXISTS: "Career already exists for this sport",
  SPORT_STATISTICS_EXISTS: "Statistics already exists for this sport",
  SELECT_PLATFORM: "Please select the platform",
  ENTER_PLATFORM: "Please enter the platform",
  ENTER_GAME_ID: "Please enter the game ID",
  ENTER_STREAM_URL: "Please enter the stream URL",
};

export const getGender = {
  F: "Female",
  M: "Male",
  O: "Others",
};

export const getLoginYupSchema = (yup) => {
  return yup.object().shape({
    email: yup
      .string()
      .trim()
      .typeError(userErrorMessages.ENTER_EMAIL)
      .required(userErrorMessages.ENTER_EMAIL)
      .email(userErrorMessages.ENTER_VALID_EMAIL),
    password: yup
      .string()
      .typeError(userErrorMessages.ENTER_PASSWORD)
      .required(userErrorMessages.ENTER_PASSWORD),
  });
};

export const getRegisterYupSchema = (yup) => {
  return yup.object().shape({
    firstName: yup
      .string()
      .trim()
      .typeError(userErrorMessages.ENTER_FIRST_NAME)
      .required(userErrorMessages.ENTER_FIRST_NAME),
    lastName: yup
      .string()
      .trim()
      .typeError(userErrorMessages.ENTER_LAST_NAME)
      .required(userErrorMessages.ENTER_LAST_NAME),
    userEmail: yup
      .string()
      .trim()
      .typeError(userErrorMessages.ENTER_EMAIL)
      .required(userErrorMessages.ENTER_EMAIL)
      .email(userErrorMessages.ENTER_VALID_EMAIL),
    password: yup
      .string()
      .min(6, userErrorMessages.MIN_PASSWORD_LENGTH)
      .typeError(userErrorMessages.ENTER_PASSWORD)
      .required(userErrorMessages.ENTER_PASSWORD),
    userDob: yup
      .date()
      .required(userErrorMessages.ENTER_DOB)
      .typeError(userErrorMessages.ENTER_DOB)
      .max(new Date(), userErrorMessages.INVALID_DOB),
    registeredReferralCode: yup
      .string()
      .trim()
      .test(
        "is-valid-referral",
        userErrorMessages.INVALID_REFERRAL_CODE,
        async (registeredReferralCode) => {
          if (registeredReferralCode) {
            const response = await userService.verifyReferralCode(
              registeredReferralCode
            );
            return response.Status;
          }
          return true;
        }
      ),
    // userPhone: yup
    //   .string()
    //   .typeError(userErrorMessages.ENTER_PHONE)
    //   .required(userErrorMessages.ENTER_PHONE),
  });
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

export const getUserDetailsYupSchema = (yup) => {
  return yup.object().shape({
    first_name: yup
      .string(userErrorMessages.ENTER_FIRST_NAME)
      .trim()
      .required(userErrorMessages.ENTER_FIRST_NAME),
    last_name: yup
      .string(userErrorMessages.ENTER_LAST_NAME)
      .trim()
      .required(userErrorMessages.ENTER_LAST_NAME),
    user_email: yup
      .string(userErrorMessages.ENTER_EMAIL)
      .trim()
      .required(userErrorMessages.ENTER_EMAIL)
      .email(userErrorMessages.ENTER_VALID_EMAIL),
    user_phone: yup
      .string(userErrorMessages.ENTER_PHONE)
      .typeError(userErrorMessages.ENTER_PHONE)
      .required(userErrorMessages.ENTER_PHONE)
      .test("is-valid", userErrorMessages.ENTER_VALID_PHONE, (user_phone) => {
        return user_phone && isValidPhoneNumber(user_phone);
      }),
    user_gender: yup
      .string(userErrorMessages.SELECT_GENDER)
      .required(userErrorMessages.SELECT_GENDER)
      .typeError(userErrorMessages.SELECT_GENDER),
    user_dob: yup
      .date()
      .required(userErrorMessages.ENTER_DOB)
      .typeError(userErrorMessages.ENTER_DOB)
      .max(new Date(), userErrorMessages.INVALID_DOB),
    address: yup.object().shape({
      // line1: yup.string().required(userErrorMessages.ENTER_LINE_1),
      // line2: yup.string(userErrorMessages.ENTER_LINE_2),
      pincode: yup
        .string()
        .trim()
        .test("pincode", userErrorMessages.ENTER_PINCODE, function (pincode) {
          const isFilled = checkAddressFilled(this.options.parent);
          if (isFilled && !pincode) return false;
          return true;
        }),
      country: yup
        .string()
        .test("country", userErrorMessages.SELECT_COUNTRY, function (country) {
          const isFilled = checkAddressFilled(this.options.parent);
          if (isFilled && !country) return false;
          return true;
        }),
      state: yup
        .string()
        .test("state", userErrorMessages.SELECT_STATE, function (state) {
          const isFilled = checkAddressFilled(this.options.parent);
          if (isFilled && !state) return false;
          return true;
        }),
      city: yup
        .string()
        .trim()
        .test("city", userErrorMessages.ENTER_CITY, function (city) {
          const isFilled = checkAddressFilled(this.options.parent);
          if (isFilled && !city) return false;
          return true;
        }),
    }),
  });
};

export const getUserInterestsYupSchema = (yup) => {
  return yup.object().shape({
    sports_interested: yup
      .array()
      .compact()
      .min(1, "Please select atleast one sport"),
  });
};

export const getForgotPasswordYupSchema = (yup) => {
  return yup.object().shape({
    email: yup
      .string(userErrorMessages.ENTER_EMAIL)
      .trim()
      .required(userErrorMessages.ENTER_EMAIL)
      .email(userErrorMessages.ENTER_VALID_EMAIL),
  });
};

export const getNewUserInterestsYupSchema = (yup) => {
  return yup.object().shape({
    sports_interested: yup
      .array()
      .compact()
      .min(1, "Please select atleast one sport"),
  });
};

export const getUserPasswordYupSchema = (yup) => {
  return yup.object().shape({
    password: yup
      .string()
      .min(6, userErrorMessages.MIN_PASSWORD_LENGTH)
      .required(userErrorMessages.ENTER_PASSWORD),
    confirmPassword: yup
      .string()
      .required(userErrorMessages.ENTER_PASSWORD)
      .test(
        "passwords-match",
        userErrorMessages.PASSWORD_MATCH,
        function (value) {
          return this.parent.password === value;
        }
      ),
  });
};

export const verifyUser = (userData) => {
  let isProfileComplete = false;
  let percentage = 0;

  if (userData.user_profile_img) {
    percentage += 10;
  }

  if (userData.user_img) {
    percentage += 10;
  }

  if (
    userData.first_name &&
    userData.last_name &&
    userData.user_email &&
    userData.user_gender &&
    userData.user_dob &&
    userData.address?.pincode &&
    userData.address?.country &&
    userData.address?.state &&
    userData.address?.city
  ) {
    percentage += 40;
  }

  if (
    userData.bio_details?.sports_id &&
    userData.bio_details?.profession &&
    userData.bio_details?.description
  ) {
    percentage += 20;
  }

  if (userData.social?.some((soc) => soc?.link)) {
    percentage += 10;
  }

  if (userData.sports_interested?.length >= 1) {
    percentage += 10;
  }

  // let isStatisticsValid = false;
  // for (let statistic of userStatisticsData) {
  //   if (
  //     !(
  //       statistic.sports_name &&
  //       statistic.category_name &&
  //       statistic.playing_status &&
  //       statistic.sport_career?.name &&
  //       statistic.sport_career?.profiles &&
  //       statistic.sport_career?.roles &&
  //       statistic.sport_career?.from &&
  //       statistic.sport_career?.to &&
  //       statistic.sport_career?.url
  //     ) &&
  //     ((statistic.statistics_links && statistic.statistics_links.length >= 1) ||
  //       (statistic.statistics_docs && statistic.statistics_docs.length >= 1))
  //   ) {
  //     isStatisticsValid = true;
  //   } else {
  //     isStatisticsValid = false;
  //     break;
  //   }
  // }

  // if (isStatisticsValid) {
  //   percentage += 40;
  // }

  isProfileComplete = percentage === 100;
  return { isProfileComplete, percentage };
};

export const getUserStatisticsYupSchema = (yup) => {
  return yup.object().shape({
    sports_statistics: yup.array().of(
      yup.object().shape({
        sports_id: yup.string().required(userErrorMessages.SELECT_SPORT),
        skill_level: yup.string().required(userErrorMessages.SELECT_SKILL),
        playing_status: yup.string().required(userErrorMessages.SELECT_ACTIVE),
        statistics_links: yup
          .array()
          .of(yup.string().url(userErrorMessages.INVALID_LINK)),
      })
    ),
  });
};

export const getUserCareerYupSchema = (yup) => {
  return yup.object().shape({
    sports_careers: yup.array().of(
      yup.object().shape({
        sports_id: yup.string().required(userErrorMessages.SELECT_SPORT),
        sport_career: yup.array().of(
          yup.object().shape({
            name: yup.string().required(userErrorMessages.ENTER_ORG_NAME),
            url: yup.string().url(userErrorMessages.INVALID_LINK),
            profiles: yup
              .object()
              .required(userErrorMessages.SELECT_PROFILE)
              .typeError(userErrorMessages.SELECT_PROFILE),
            roles: yup.array().compact().min(1, userErrorMessages.SELECT_ROLE),
            from: yup
              .date()
              .nullable()
              .required(userErrorMessages.ENTER_FROM_DATE)
              .typeError(userErrorMessages.ENTER_FROM_DATE)
              .max(new Date(), userErrorMessages.INVALID_FROM_DATE),
            to: yup
              .date()
              .nullable()
              .required(userErrorMessages.ENTER_TO_DATE)
              .typeError(userErrorMessages.ENTER_TO_DATE)
              .max(new Date(), userErrorMessages.INVALID_TO_DATE)
              .when(["from", "isCurrent"], (from, isCurrent, schema) => {
                if (isCurrent) return schema.notRequired();
                return from
                  ? schema.min(from, userErrorMessages.INVALID_END_DATE)
                  : schema;
              }),
          })
        ),
      })
    ),
  });
};

export const getBioYupSchema = (yup, sportsData) => {
  return yup.object().shape({
    sports_id: yup.string().required(userErrorMessages.SELECT_SPORT),
    profession: yup
      .object()
      .shape({
        value: yup.string().required(userErrorMessages.SELECT_PROFESSION),
      })
      .typeError(userErrorMessages.SELECT_PROFESSION),
    description: yup.string().trim().required(userErrorMessages.ENTER_DESC),
    game_ids: yup.array().when("sports_id", (sports_id, schema) => {
      if (!sports_id) return schema.notRequired();
      const isESports = Boolean(
        sportsData.find((sport) => sport.sports_id == sports_id)
          ?.sports_code === "SPOR33"
      );
      return isESports
        ? schema.of(
            yup.object().shape({
              type: yup.string().required(userErrorMessages.SELECT_PLATFORM),
              other_type: yup
                .string()
                .trim()
                .when("type", (type, schema) => {
                  return type === "OTH"
                    ? schema.required(userErrorMessages.ENTER_PLATFORM)
                    : schema.notRequired();
                }),
              id: yup.string().trim().required(userErrorMessages.ENTER_GAME_ID),
            })
          )
        : schema.notRequired();
    }),
    streaming_profiles: yup.array().when("sports_id", (sports_id, schema) => {
      if (!sports_id) return schema.notRequired();
      const isESports = Boolean(
        sportsData.find((sport) => sport.sports_id == sports_id)
          ?.sports_code === "SPOR33"
      );
      return isESports
        ? schema.of(
            yup.object().shape({
              type: yup.string().required(userErrorMessages.SELECT_PLATFORM),
              other_type: yup
                .string()
                .trim()
                .when("type", (type, schema) => {
                  return type === "OTH"
                    ? schema.required(userErrorMessages.ENTER_PLATFORM)
                    : schema.notRequired();
                }),
              url: yup
                .string()
                .url(userErrorMessages.INVALID_LINK)
                .required(userErrorMessages.ENTER_STREAM_URL),
            })
          )
        : schema.notRequired();
    }),
  });
};

export const getActivationYupSchema = (yup) => {
  return yup.object().shape({
    email: yup
      .string()
      .trim()
      .required(userErrorMessages.ENTER_EMAIL)
      .email(userErrorMessages.ENTER_VALID_EMAIL),
    token: yup
      .string()
      .required(userErrorMessages.ENTER_VERIFICATION_CODE)
      .length(6, userErrorMessages.ENTER_VERIFICATION_CODE),
  });
};

export const getAccountDeletionYupSchema = (yup) => {
  return yup.object().shape({
    password: yup.string().trim().required(userErrorMessages.ENTER_PASSWORD),
  });
};

export const verificationDocs = {
  IND: ["Aadhar", "Driving License", "Passport", "PAN Card", "Voter ID"],
  MYR: ["MyKad", "MyPr", "MyKas", "Driving License", "Passport"],
  SGP: ["National Registration Identity Card", "Passport", "Driving License"],
  NZL: [
    "Passport",
    "Driving License",
    "SuperGold Card",
    "Citizenship Certificate",
  ],
  USA: ["U.S Passport Card", "Driving License"],
  UK: ["Passport", "Driving License"],
  AUS: ["Photo Identification Card", "Driving License", "Passport"],
};

export const referralToPlayerId = (referralCode) => {
  return "PID" + referralCode.slice(3);
};
