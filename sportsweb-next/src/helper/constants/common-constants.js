export const errorMessages = {
  SELECT_PLATFORM: "Please select a platform",
  INVALID_PLATFORM: "Please select a valid platform",
  ENTER_SOCIAL_LINK: "Please enter your social platform link",
  INVALID_SOCIAL_LINK: "Please enter a valid social platform link",
  SELECT_ID_PROOF: "Please select the ID proof type",
  UPLOAD_ID_PROOF: "Please upload the ID proof",
  SELECT_ADDRESS_PROOF: "Please select the address proof type",
  UPLOAD_ADDRESS_PROOF: "Please upload the address proof",
  INVALID_FILE_SIZE: "Please upload a document less than 5 MB",
};

export const getSocialsYupSchema = (yup) => {
  return yup.object().shape({
    social: yup.array().of(
      yup.object().shape({
        type: yup
          .string(errorMessages.INVALID_PLATFORM)
          .required(errorMessages.SELECT_PLATFORM),
        link: yup
          .string(errorMessages.INVALID_SOCIAL_LINK)
          .url(errorMessages.INVALID_SOCIAL_LINK),
      })
    ),
  });
};

export const getDocumentDetailsYupSchema = (yup) => {
  return yup.object().shape({
    id_proof_type: yup.string().required(errorMessages.SELECT_ID_PROOF),
    id_proof: yup
      .mixed()
      .test("file", errorMessages.UPLOAD_ID_PROOF, (document) => {
        if (document && document.size <= 5000000) {
          return true;
        }
        return false;
      }),
    is_proof_same: yup.boolean(),
    address_proof_type: yup
      .string()
      .when("is_proof_same", (is_proof_same, schema) => {
        return is_proof_same
          ? schema.notRequired()
          : schema.required(errorMessages.SELECT_ADDRESS_PROOF);
      }),
    address_proof: yup
      .mixed()
      .when("is_proof_same", (is_proof_same, schema) => {
        return is_proof_same
          ? schema.notRequired()
          : schema
              .required(errorMessages.UPLOAD_ADDRESS_PROOF)
              .test("file", errorMessages.INVALID_FILE_SIZE, (document) => {
                if (document && document.size <= 5000000) {
                  return true;
                }
                return false;
              });
      }),
  });
};

export const getUserRoiOptionYupSchema = (yup) => {
  return yup.object().shape({
    roi_options: yup.array().compact().min(1, "Please select atleast one "),
  });
};

export const validateImage = (file) => {
  if (
    file &&
    !(
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp"
    )
  ) {
    return {
      isValid: false,
      message: "Please upload an valid image file (JPG or PNG or WEBP)",
    };
  }
  if (file && file.size > 5000000) {
    return {
      isValid: false,
      message: "Please upload an image with size less than 5 MB",
    };
  }
  return { isValid: true };
};

export const validateVideo = (file, accountTypes = []) => {
  if (file && !file.type.split("/").includes("video")) {
    return {
      isValid: false,
      message: "Please upload a video file",
    };
  }
  if (file) {
    const isPremiumUser = Boolean(accountTypes?.find((type) => type === "PRM"));
    const maxSize = isPremiumUser ? 100000000 : 5000000;
    const message = `Please upload a video with size less than ${
      isPremiumUser ? "100 MB" : "5 MB"
    }`;
    if (file && file.size > maxSize) {
      return {
        isValid: false,
        message,
      };
    }
  }
  return { isValid: true };
};

export const validateImageOrVideo = (file) => {
  if (
    file &&
    !(
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp" ||
      file.type.split("/").includes("video")
    )
  ) {
    return {
      isValid: false,
      message: "Please upload an valid image/video file",
    };
  }
  if (file && file.size > 5000000) {
    return {
      isValid: false,
      message: "Please upload an image/video with size less than 5 MB",
    };
  }
  return { isValid: true };
};

export const convertToPascalCase = (string) => {
  const words = string?.trim().split(" ");
  const capitalizedWords = words?.map((word) => {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  });
  return capitalizedWords.join(" ");
};

export const covertTimeToUTCDate = (timeStr) => {
  const timeSplit = timeStr.split(":");
  const date = new Date();
  date.setUTCHours(...timeSplit);
  return date;
};

const getTwoCharTime = (time) => ("0" + time).slice(-2);

export const convertDateToUTCString = (date) => {
  const hours = getTwoCharTime(date.getUTCHours());
  const minutes = getTwoCharTime(date.getUTCMinutes());
  const seconds = getTwoCharTime(date.getUTCSeconds());
  return `${hours}:${minutes}:${seconds}`;
};
