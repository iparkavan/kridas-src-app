import { ErrorMessage } from "formik";

const errorMessage = {
  PAGE_NAME: "Please enter the Page Name",
  REGISTER_NO: "Please enter the Register Number",
  ALTNAME: "Please enter the alternate Name"
};

export const putPageInformationYupSchema = (yup) => {
  return yup.object().shape({
    pageName: yup.string().trim().required(errorMessage.PAGE_NAME),
    regNo: yup.string().trim().required(errorMessage.REGISTER_NO),
    alternateName: yup.string().trim().required(errorMessage.ALTNAME),
  });
};
