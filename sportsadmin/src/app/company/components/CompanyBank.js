import { makeStyles } from "@material-ui/styles";
import React from "react";
import InputField from "../../../app/common/ui/components/InputField";
import * as yup from "yup";
import { useState } from "react";
import Button from "../../common/ui/components/Button";

import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons//Cancel";
import { useEffect } from "react";
import CompanyConfig from "../config/CompanyConfig";
import useHttp from "../../../hooks/useHttp";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  flex: {
    width: "850px",

    justifyContent: "space-between",
    display: "flex",
    margin: "20px",
  },
  input: {
    minWidth: "250px",
  },
  gst: {
    width: "250px",
    padding: "10px",
    margin: "0 0px 0px 20px",
  },
  flexed: {
    width: "390px",

    justifyContent: "space-between",
    display: "flex",
    margin: "20px",
  },
  button: {
    backgroundColor: "#43a370",
    height: "40px",

    width: "100px",
    border: "none",
  },
  h4: {
    margin: "0 0 0 22px",
  },
  drop: {
    border: "1px solid black",
    width: "150px",
  },
  save: {
    margin: "25px 0 0 22px",
  },
  buttonfield: {
    display: "flex",
    // justifyContent: "space-between"
    gap: "20px",
    marginLeft: "20px",
  },
}));

export default function CompanyTerms(props) {
  const classes = useStyles();

  const { companyId } = props;
  const [userDetails, setUserDetails] = useState();
  const { sendRequest } = useHttp();
  const history = useHistory();

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackStatus, setSnackStatus] = useState("");
  const [snackMsg, setSnackMsg] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const config = CompanyConfig.getCompanyById(companyId);
    const transformDate = (data) => {
      setUserDetails(data.data);
    };
    sendRequest(config, transformDate);
  }, [sendRequest, companyId]);

  const editBankDetails = async () => {
    const schema = yup.object().shape({
      company_bank_details: yup
        .object()
        .shape({
          primary: yup.object().shape({
            account_name: yup
              .string()
              .trim()
              .required("Please enter the account name"),
            mobile_no: yup
              .string()
              .trim()
              .required("Please enter the mobile number"),
            bank_name: yup
              .string()
              .trim()
              .required("Please enter the bank name"),
            account_no: yup
              .string()
              .trim()
              .required("Please enter the account number"),
            ifsc_code: yup
              .string()
              .trim()
              .required("Please enter the IFSC code"),
          }),
          // secondary: yup.object().shape({
          //   account_name: yup
          //     .string()
          //     .required("Please enter the account name"),
          //   mobile_no: yup.string().required("Please enter the mobile number"),
          //   bank_name: yup.string().required("Please enter the bank name"),
          //   account_no: yup
          //     .string()
          //     .required("Please enter the account number"),
          //   ifsc_code: yup.string().required("Please enter the IFSC code"),
          // }),
        })
        .nullable(),
    });

    await schema
      .validate(userDetails, { abortEarly: false })
      .then(() => {
        const editConfig = CompanyConfig.editCompanyData(userDetails);
        const transformData = (data) => {
          setUserDetails(data);
          history.push(`/pages`);
        };
        sendRequest(editConfig, transformData);
        setSnackStatus("success");
        setSnackMsg("Company Updated Successfully");
        setSnackOpen(true);
      })
      .catch((e) => {
        let errorObj = {};
        e.inner.map((error) => {
          errorObj[error.path] = error.message;
          if (error) {
            setSnackStatus("warning");
            setSnackMsg(`${error.message}`);
            setSnackOpen(true);
          }
          return null;
        });
        setErrors({
          ...errorObj,
        });
      });
  };

  const handleChange = (e, type) => {
    setUserDetails({
      ...userDetails,
      company_bank_details: {
        ...(userDetails.company_bank_details || {}),
        [type]: {
          ...(userDetails.company_bank_details?.[type] || {}),
          [e.target.name]: e.target.value,
        },
      },
    });
  };

  const handleCancel = async (e) => {
    history.push(`/pages`);
  };

  return (
    <div>
      <div>
        <h4 className={classes.h4}>Primary Account</h4>

        <div className={classes.flex}>
          <InputField
            className={classes.input}
            type="text"
            label="Name of the Account Holder"
            name="account_name"
            value={
              userDetails?.company_bank_details?.primary?.account_name || ""
            }
            onChange={(e) => handleChange(e, "primary")}
            error={Boolean(
              errors?.["company_bank_details.primary.account_name"]
            )}
            helperText={errors?.["company_bank_details.primary.account_name"]}
          />
          <InputField
            className={classes.input}
            type="text"
            label="Mobile Number"
            name="mobile_no"
            value={userDetails?.company_bank_details?.primary?.mobile_no || ""}
            onChange={(e) => handleChange(e, "primary")}
            error={Boolean(errors?.["company_bank_details.primary.mobile_no"])}
            helperText={errors?.["company_bank_details.primary.mobile_no"]}
          />
          <InputField
            className={classes.input}
            type="text"
            label="Name of the Bank"
            name="bank_name"
            value={userDetails?.company_bank_details?.primary?.bank_name || ""}
            onChange={(e) => handleChange(e, "primary")}
            error={Boolean(errors?.["company_bank_details.primary.bank_name"])}
            helperText={errors?.["company_bank_details.primary.bank_name"]}
          />
        </div>
        <div className={classes.flex}>
          <InputField
            className={classes.input}
            type="text"
            label="Account Number"
            name="account_no"
            value={userDetails?.company_bank_details?.primary?.account_no || ""}
            onChange={(e) => handleChange(e, "primary")}
            error={Boolean(errors?.["company_bank_details.primary.account_no"])}
            helperText={errors?.["company_bank_details.primary.account_no"]}
          />
          <InputField
            className={classes.input}
            type="text"
            label="Swift Code"
            name="swift_code"
            value={userDetails?.company_bank_details?.primary?.swift_code || ""}
            onChange={(e) => handleChange(e, "primary")}
          />
          <InputField
            className={classes.input}
            type="text"
            label="IFSC Code"
            name="ifsc_code"
            value={userDetails?.company_bank_details?.primary?.ifsc_code || ""}
            onChange={(e) => handleChange(e, "primary")}
            error={Boolean(errors?.["company_bank_details.primary.ifsc_code"])}
            helperText={errors?.["company_bank_details.primary.ifsc_code"]}
          />
        </div>
      </div>

      <div>
        <h4 className={classes.h4}>Secondary Account</h4>

        <div className={classes.flex}>
          <InputField
            className={classes.input}
            type="text"
            label="Name of the Account Holder"
            name="account_name"
            value={
              userDetails?.company_bank_details?.secondary?.account_name || ""
            }
            onChange={(e) => handleChange(e, "secondary")}
            error={Boolean(
              errors?.["company_bank_details.secondary.account_name"]
            )}
            helperText={errors?.["company_bank_details.secondary.account_name"]}
          />
          <InputField
            className={classes.input}
            type="text"
            label="Mobile Number"
            name="mobile_no"
            value={
              userDetails?.company_bank_details?.secondary?.mobile_no || ""
            }
            onChange={(e) => handleChange(e, "secondary")}
            error={Boolean(
              errors?.["company_bank_details.secondary.mobile_no"]
            )}
            helperText={errors?.["company_bank_details.secondary.mobile_no"]}
          />
          <InputField
            className={classes.input}
            type="text"
            label="Name of the Bank"
            name="bank_name"
            value={
              userDetails?.company_bank_details?.secondary?.bank_name || ""
            }
            onChange={(e) => handleChange(e, "secondary")}
            error={Boolean(
              errors?.["company_bank_details.secondary.bank_name"]
            )}
            helperText={errors?.["company_bank_details.secondary.bank_name"]}
          />
        </div>
        <div className={classes.flex}>
          <InputField
            className={classes.input}
            type="text"
            label="Account Number"
            name="account_no"
            value={
              userDetails?.company_bank_details?.secondary?.account_no || ""
            }
            onChange={(e) => handleChange(e, "secondary")}
            error={Boolean(
              errors?.["company_bank_details.secondary.account_no"]
            )}
            helperText={errors?.["company_bank_details.secondary.account_no"]}
          />
          <InputField
            className={classes.input}
            type="text"
            label="Swift Code"
            name="swift_code"
            value={
              userDetails?.company_bank_details?.secondary?.swift_code || ""
            }
            onChange={(e) => handleChange(e, "secondary")}
          />
          <InputField
            className={classes.input}
            type="text"
            label="IFSC Code"
            name="ifsc_code"
            value={
              userDetails?.company_bank_details?.secondary?.ifsc_code || ""
            }
            onChange={(e) => handleChange(e, "secondary")}
            error={Boolean(
              errors?.["company_bank_details.secondary.ifsc_code"]
            )}
            helperText={errors?.["company_bank_details.secondary.ifsc_code"]}
          />
        </div>
      </div>
      <div className={classes.buttonfield}>
        <Button
          className={classes.btn}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={(e) => editBankDetails(e)}
        >
          Update
        </Button>
        <Button
          className={classes.btn}
          type="submit"
          startIcon={<CancelIcon />}
          onClick={handleCancel}
        >
          {" "}
          Cancel{" "}
        </Button>
      </div>
    </div>
  );
}
