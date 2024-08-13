import React from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { putPageInformationYupSchema } from "../../../helper/constants/page-information-constants";
import TextBoxWithValidation from "../../UI/text-box/textbox-with-validation";
import { TextField } from "@mui/material";
import { VisibleIcon } from "../../UI/icon/icon";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import PhoneInputBox from "../../UI/text-box/phone-input-box";

const PageInformationEdit = (props) => {
  const { companyDetails } = props;
  console.log(companyDetails);

  const initialValues = {
    pageName: companyDetails?.company_name || "",
    regNo: companyDetails?.company_reg_no || "",
    alternateName: companyDetails?.alternate_name || "",
    createdDate: new Date(companyDetails?.created_date) || "",
    updatedDate: new Date(companyDetails?.updated_date) || "",
    phoneNo: companyDetails?.company_contact_no || "",
  };
  const onSubmit = (values) => {
    console.log(values);
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={putPageInformationYupSchema(yup)}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form>
            <div className="w-full space-y-5">
              <div className="mt-10 gap-5 flex flex-wrap">
                <TextBoxWithValidation name="pageName" label="Page Name" />

                <TextBoxWithValidation name="regNo" label="Register No" />

                <TextBoxWithValidation
                  name="alternateName"
                  label="Alternate Name"
                />
              </div>

              <div className="gap-5 flex flex-wrap">
                <TextBoxWithValidation
                  name="createdDate"
                  label="Created Date"
                  disabled
                />

                <TextBoxWithValidation
                  name="updatedDate"
                  label="Updated Date"
                  disabled
                />

                <PhoneInput
                  name="phoneNo"
                  inputComponent={PhoneInputBox}
                  label="Contact No"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PageInformationEdit;
