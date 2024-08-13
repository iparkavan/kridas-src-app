import React from "react";
import { makeStyles } from "@material-ui/styles";
// import Dropdown from "../../common/ui/components/Dropdown";
import InputField from "../../../app/common/ui/components/InputField";
import moment from "moment";
import { FormGroup, FormControlLabel, FormControl } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CustomPhone from "../../../../src/app/common/ui/components/CustomPhone";

const CompanyInfomation = (props) => {
  const useStyles = makeStyles((theme) => ({
    field: {
      width: "250px",
      margin: "16px",
    },

    color: {
      color: "red",
    },

    Lable: {
      marginLeft: "50px",
    },
    feildLable: {
      width: "250px",
      margin: "16px",
    },
    fieldAlign: {
      marginTop: "20px",
    },
    fieldDesc: {
      width: "810px",
      margin: "16px",
    },
    fieldWebsite: {
      width: "810px",
      margin: "16px",
    },
    radioBtnAlign: {
      marginLeft: "80px",
    },
    btnAlign: {
      display: "flex",
      marginLeft: "5px",
    },
    statusGrid: {
      paddingLeft: "8px",
      display: "grid",
      gridTemplateColumns: "auto auto",
    },
    heading: {
      margin: "10px",
      fontSize: "20px",
    },
    container: {
      display: "flex",
    },
  }));
  console.log("props in company", props);
  const classes = useStyles();
  let phone = "company_contact_no";
  const { companyDetails, setCompanyDetails, errors } = props;
  const {
    company_name,
    company_reg_no,
    company_contact_no,
    company_status,
    company_email,
    company_desc,
    alternate_name,
    company_website,
    company_type,
    updated_date,
    created_date,
    company_profile_verified,
  } = props.companyDetails;
  let companyTypeValue =
    company_type !== undefined && companyDetails !== undefined
      ? company_type
      : "";

  // const companyTypes = [
  //   {
  //     id: 1,
  //     value: "BRAND",
  //   },
  //   {
  //     id: 2,
  //     value: "VENUE",
  //   },
  // ];

  let companyTypeAltr = "company_type";

  const formatDate = (date) => {
    return moment(new Date(date)).format("YYYY-MM-DD h:mm a");
  };

  const handleChange = (e) => {
    let companyType = [];
    if ("company_type" === e.target.name) {
      companyType = [...companyType, e.target.value];
      setCompanyDetails({ ...companyDetails, [companyTypeAltr]: companyType });
    } else if ("company_reg_no" === e.target.name) {
      setCompanyDetails({
        ...companyDetails,
        [e.target.name]: e.target.value.toUpperCase(),
      });
    } else {
      setCompanyDetails({ ...companyDetails, [e.target.name]: e.target.value });
    }
  };

  const handlePhone = (e) => {
    setCompanyDetails({ ...companyDetails, [phone]: e });
  };

  const handleStatus = (e) => {
    if (company_status === "AC") e.target.value = "IN";
    else e.target.value = "AC";
    setCompanyDetails({ ...companyDetails, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className={classes.fieldAlign}>
        <InputField
          className={classes.field}
          required
          id="outlined-name"
          variant="outlined"
          label="Page Name"
          name="company_name"
          value={company_name || ""}
          inputlabelprops={{ shrink: true }}
          onChange={(e) => handleChange(e)}
          error={Boolean(errors.company_name)}
          helperText={errors.company_name}
        />

        <InputField
          className={classes.field}
          id="outlined-name"
          variant="outlined"
          label="Register No"
          name="company_reg_no"
          value={company_reg_no || ""}
          inputlabelprops={{ shrink: true }}
          onChange={(e) => handleChange(e)}
          error={Boolean(errors.company_reg_no)}
          helperText={errors.company_reg_no}
        />

        <InputField
          className={classes.field}
          id="outlined-name"
          variant="outlined"
          label="Alternate Name"
          name="alternate_name"
          value={alternate_name || ""}
          inputlabelprops={{ shrink: true }}
          onChange={(e) => handleChange(e)}
        />

        <div className={classes.container}>
          <InputField
            className={classes.field}
            label="Created Date"
            name="created_date"
            format="dd/MM/yyyy"
            value={formatDate(created_date) || ""}
            onChange={(e) => handleChange(e)}
            error={Boolean(errors?.created_date)}
            helperText={errors?.created_date}
            disabled={true}
          />

          <InputField
            className={classes.field}
            label="Updated Date"
            name="updated_date"
            format="dd/MM/yyyy"
            value={formatDate(updated_date) || ""}
            onChange={(e) => handleChange(e)}
            error={Boolean(errors?.updated_date)}
            helperText={errors?.updated_date}
            disabled={true}
          />

          <div className={classes.phoneDisplay}>
            <PhoneInput
              className={classes.field}
              label="Contact No"
              name="company_contact_no"
              value={company_contact_no || ""}
              onChange={(e) => handlePhone(e)}
              inputComponent={CustomPhone}
              error={Boolean(errors?.company_contact_no)}
              helperText={errors?.company_contact_no}
            />
          </div>
        </div>

        <InputField
          className={classes.field}
          id="outlined-name"
          variant="outlined"
          label="Email"
          name="company_email"
          value={company_email || ""}
          inputlabelprops={{ shrink: true }}
          onChange={(e) => handleChange(e)}
          error={Boolean(errors.company_email)}
          helperText={errors.company_email}
          // disabled={true}
        />

        {/* <Dropdown
          label="Company Type"
          name="company_type"
          value={companyTypeValue}
          List={companyTypes}
          onSelectChange={handleChange}
        ></Dropdown> */}

        <InputField
          className={classes.fieldDesc}
          id="outlined-name"
          variant="outlined"
          label="Description"
          name="company_desc"
          InputProps={{ classes: { input: classes.input1 } }}
          rows={3}
          rowsMax={10}
          multiline={true}
          value={company_desc || ""}
          onChange={(e) => handleChange(e)}
        />

        <InputField
          className={classes.fieldWebsite}
          id="outlined-name"
          variant="outlined"
          label="Website"
          name="company_website"
          placeholder="URL must contain .com at the end"
          rowsMax={4}
          value={company_website || ""}
          inputlabelprops={{ shrink: true }}
          onChange={(e) => handleChange(e)}
          error={Boolean(errors.company_website)}
          helperText={errors.company_website}
        />

        <div className={classes.btnAlign}>
          <div>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <Typography className={classes.heading}>Status </Typography>
              <FormGroup>
                <div className={classes.statusGrid}>
                  <FormControlLabel
                    label={company_status !== "AC" ? "Inactive" : "Active"}
                    control={
                      <Checkbox
                        name="company_status"
                        checked={company_status === "AC" ? true : false}
                        onChange={(e) => handleStatus(e)}
                      />
                    }
                  />
                </div>
              </FormGroup>
            </FormControl>
          </div>

          <div className={classes.Lable}>
            <Typography className={classes.heading}>
              {" "}
              Verification Status{" "}
            </Typography>
            <div className={classes.feildLable}>
              {" "}
              {company_profile_verified === true ? "Verified" : "Not Verified"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyInfomation;
