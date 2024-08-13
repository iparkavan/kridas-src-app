import { isValidPhoneNumber } from "react-phone-number-input";

const errorMessages = {
  ENTER_FIRST_NAME: "Please enter the first name",
  ENTER_LAST_NAME: "Please enter the last name",
  ENTER_EMAIL: "Please enter the email",
  ENTER_VALID_EMAIL: "Please enter a valid email",
  ENTER_CONTACT_NO: "Please enter the contact number",
  ENTER_VALID_CONTACT: "Please enter a valid contact number",
  ENTER_DOB: "Please enter the date of birth",
  INVALID_DOB: "Date of Birth cannot be a future date",
  ID_PROOF_SIZE: "File size should be less than 5 MB",
};

export const getAddPlayerYupSchema = (yup) => {
  return yup.object().shape({
    player: yup.object().shape({
      first_name: yup.string().trim().required(errorMessages.ENTER_FIRST_NAME),
      last_name: yup.string().trim().required(errorMessages.ENTER_LAST_NAME),
      email_id: yup
        .string()
        .trim()
        .required(errorMessages.ENTER_EMAIL)
        .email(errorMessages.ENTER_VALID_EMAIL),
      contact_number: yup
        .string()
        // .typeError(errorMessages.ENTER_CONTACT_NO)
        // .required(errorMessages.ENTER_CONTACT_NO)
        .test(
          "is-valid",
          errorMessages.ENTER_VALID_CONTACT,
          (contact_number) => {
            if (contact_number) {
              return isValidPhoneNumber(contact_number);
            }
            return true;
          }
        ),
      player_dob: yup
        .date()
        .required(errorMessages.ENTER_DOB)
        .typeError(errorMessages.ENTER_DOB)
        .max(new Date(), errorMessages.INVALID_DOB),
    }),
    document: yup
      .mixed()
      .test("file", errorMessages.ID_PROOF_SIZE, (document) => {
        if (!document) return true;
        return document.size <= 5000000;
      }),
  });
};
