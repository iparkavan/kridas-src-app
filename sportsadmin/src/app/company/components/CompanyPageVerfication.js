import {
  Button,
  FormControl,
  Link,
  MenuItem,
  Select,
  makeStyles,
} from "@material-ui/core";
import CloudUpload from "@material-ui/icons/CloudUpload";
import AddIcon from "@material-ui/icons/Add";

import React, { useEffect, useState } from "react";
import * as yup from "yup";
import SaveIcon from "@material-ui/icons/Save";
import InputField from "../../../app/common/ui/components/InputField";

import Dropdown from "../../common/ui/components/Dropdown";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import CompanyConfig from "../config/CompanyConfig";
import useHttp from "../../../hooks/useHttp";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  flex: {
    width: "950px",

    justifyContent: "space-between",
    display: "flex",
    margin: "20px",
  },
  input: {
    width: "300px",
    // padding: "10px",
  },
  gst: {
    width: "300px",
    // padding: "10px",
    margin: "0 0px 0px 20px",
  },

  flexed: {
    width: "800px",
    // height: "40px",
    display: "flex",
    alignItems: "center",
    gap: "30px",
    marginLeft: "20px",
    marginTop: "10px",
  },

  status: {
    margin: "20px 0 0 22px",
  },
  drop: {
    border: "1px solid black",
    width: "150px",
  },
  save: {
    margin: "15px 0 10px 18px",
  },
  upload: {
    margin: "0px 0px 0 10px",
  },
  deleteButton: {
    border: "1px solid",
    color: "red",
  },
  deleteIcon: {
    color: "red",
  },
  buttonfield: {
    display: "flex",
    // justifyContent: "space-between"
    gap: "20px",
    marginLeft: "20px",
    marginTop: "20px",
  },
  fileInput: {
    display: "none",
  },
  select: {
    minWidth: 150,
  },
}));

function CompanyPageVerfication(props) {
  const classes = useStyles();
  const { companyId } = props;
  const { sendRequest } = useHttp();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackStatus, setSnackStatus] = useState("");
  const [snackMsg, setSnackMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [companyData, setCompanyData] = useState();
  const history = useHistory();

  const [company_contacts, setCompany_contacts] = useState({
    proprietor_name: "",
    proprietor_mobile: "",
    proprietor_email: "",
    primary_contact_name: "",
    primary_contact_mobile: "",
    primary_contact_email: "",
  });

  const [company_tax_info, setCompany_tax_info] = useState({
    gst_number: "",
  });

  // const [documents, setDocuments] = useState([
  //   {
  //     type: "GST Document",
  //     file: null,
  //   },
  //   {
  //     type: "Company License/Registration Document",
  //     file: null,
  //   },
  // ]);
  const [documents, setDocuments] = useState([
    {
      type: "",
      file: null,
    },
  ]);

  const [company_profile_verified, setCompany_profile_verified] =
    useState(false);

  useEffect(() => {
    const config = CompanyConfig.getCompanyById(companyId);
    const transformData = (data) => {
      setCompanyData(data.data);
      if (data.data.company_contacts) {
        setCompany_contacts(data.data.company_contacts);
      }
      if (data.data.company_tax_info) {
        setCompany_tax_info(data.data.company_tax_info);
      }
      if (
        data.data.company_identity_docs &&
        data.data.company_identity_docs.length > 0
      ) {
        setDocuments(data.data.company_identity_docs);
      }
      setCompany_profile_verified(data.data.company_profile_verified);
    };
    sendRequest(config, transformData);
  }, [sendRequest, companyId]);

  const handleUpdate = async () => {
    const schema = yup.object().shape({
      company_contacts: yup.object().shape({
        proprietor_name: yup
          .string()
          .trim()
          .required("Please enter the proprietor name"),
        proprietor_mobile: yup
          .string()
          .trim()
          .required("Please enter the proprietor mobile number"),
        proprietor_email: yup
          .string()
          .trim()
          .email("Please enter a valid email")
          .required("Please enter the proprietor email"),
        primary_contact_name: yup
          .string()
          .trim()
          .required("Please enter the primary contact name"),
        primary_contact_mobile: yup
          .string()
          .trim()
          .required("Please enter the primary contact mobile"),
        primary_contact_email: yup
          .string()
          .trim()
          .email("Please enter a valid email")
          .required("Please enter the primary contact email"),
      }),
      company_tax_info: yup.object().shape({
        // gst_number: yup.string().required("Please enter the GST number"),
      }),
      documents: yup
        .array()
        .of(
          yup.object().shape({
            type: yup
              .string()
              .trim()
              .required("Please enter the document type"),
            file: yup
              .mixed()
              .when("url", (url, schema) => {
                return url
                  ? schema.notRequired()
                  : schema.required("Please upload the document");
              })
              .test(
                "file",
                "The document size should be less than 5 MB",
                (document) => {
                  if (!document) return true;
                  return document.size <= 5000000;
                }
              ),
          })
        )
        .required(),
    });

    setErrors({});

    await schema
      .validate(
        { company_contacts, company_tax_info, documents },
        { abortEarly: false }
      )
      .then(() => {
        const editConfig = CompanyConfig.editCompanyData({
          ...companyData,
          company_contacts,
          company_tax_info,
          documents,
          company_profile_verified,
        });
        const transformData = (data) => {
          setCompanyData(data);
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

  const handleChange = (e) => {
    setCompany_contacts({
      ...company_contacts,
      [e.target.name]: e.target.value,
    });
  };

  const handleGSTChange = (e) => {
    setCompany_tax_info({
      ...company_tax_info,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, i) => {
    const file = e.target.files[0];
    if (file) {
      const newDocuments = [...documents];
      newDocuments[i] = { ...newDocuments[i], file };
      setDocuments(newDocuments);
    }
  };

  const handleFileTypeChange = (e, i) => {
    const newDocuments = [...documents];
    newDocuments[i] = { ...newDocuments[i], type: e.target.value };
    setDocuments(newDocuments);
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      {
        type: "",
        file: null,
      },
    ]);
  };

  const removeDocument = (index) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const handleCancel = () => {
    history.push(`/pages`);
  };

  return (
    <div>
      <div className={classes.flex}>
        <InputField
          className={classes.input}
          type="text"
          label="Proprietor Name"
          name="proprietor_name"
          onChange={(e) => handleChange(e)}
          value={company_contacts.proprietor_name}
          error={Boolean(errors?.["company_contacts.proprietor_name"])}
          helperText={errors?.["company_contacts.proprietor_name"]}
        />
        <InputField
          className={classes.input}
          type="text"
          label="Mobile Number"
          name="proprietor_mobile"
          onChange={(e) => handleChange(e)}
          value={company_contacts.proprietor_mobile}
          error={Boolean(errors?.["company_contacts.proprietor_mobile"])}
          helperText={errors?.["company_contacts.proprietor_mobile"]}
        />
        <InputField
          className={classes.input}
          type="text"
          label="Email"
          name="proprietor_email"
          onChange={(e) => handleChange(e)}
          value={company_contacts.proprietor_email}
          error={Boolean(errors?.["company_contacts.proprietor_email"])}
          helperText={errors?.["company_contacts.proprietor_email"]}
        />
      </div>

      <div className={classes.flex}>
        <InputField
          className={classes.input}
          type="text"
          label="Primary Contact Person"
          name="primary_contact_name"
          onChange={(e) => handleChange(e)}
          value={company_contacts.primary_contact_name}
          error={Boolean(errors?.["company_contacts.primary_contact_name"])}
          helperText={errors?.["company_contacts.primary_contact_name"]}
        />
        <InputField
          className={classes.input}
          type="text"
          label="Mobile Number"
          name="primary_contact_mobile"
          onChange={(e) => handleChange(e)}
          value={company_contacts.primary_contact_mobile}
          error={Boolean(errors?.["company_contacts.primary_contact_mobile"])}
          helperText={errors?.["company_contacts.primary_contact_mobile"]}
        />
        <InputField
          className={classes.input}
          type="text"
          label="Email"
          name="primary_contact_email"
          onChange={(e) => handleChange(e)}
          value={company_contacts.primary_contact_email}
          error={Boolean(errors?.["company_contacts.primary_contact_email"])}
          helperText={errors?.["company_contacts.primary_contact_email"]}
        />
      </div>

      <InputField
        className={classes.gst}
        type="text"
        label="GST Number"
        name="gst_number"
        onChange={(e) => handleGSTChange(e)}
        value={company_tax_info.gst_number}
        error={Boolean(errors?.["company_tax_info.gst_number"])}
        helperText={errors?.["company_tax_info.gst_number"]}
      />

      {documents.map((doc, i) => (
        <div className={classes.flexed} key={i}>
          <InputField
            className={classes.input}
            type="text"
            // label={doc.type}
            // placeholder={doc.type}
            placeholder="Document Type"
            value={doc.type}
            onChange={(e) => handleFileTypeChange(e, i)}
            // Disabled removes error border also
            // disabled={i < 2}
            // InputProps={{
            //   // First 2 fields are mandatory
            //   readOnly: i < 2,
            // }}
            error={
              Boolean(errors?.[`documents[${i}].type`]) ||
              Boolean(errors?.[`documents[${i}].file`])
            }
            helperText={
              errors?.[`documents[${i}].type`] ||
              errors?.[`documents[${i}].file`]
            }
          />

          <input
            className={classes.fileInput}
            id={`upload-file-${i}`}
            type="file"
            onChange={(e) => handleFileChange(e, i)}
          />
          {doc.file ? (
            <Link href={URL.createObjectURL(doc.file)} target="_blank">
              {doc.file.name}
            </Link>
          ) : (
            doc.url && (
              <Link href={doc.url} target="_blank">
                {doc.name}
              </Link>
            )
          )}
          <label htmlFor={`upload-file-${i}`}>
            <Button
              variant="contained"
              className={classes.upload}
              color="primary"
              component="span"
              startIcon={<CloudUpload />}
            >
              Upload
            </Button>
          </label>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => removeDocument(i)}
          >
            Delete
          </Button>
          {/* {doc.type !== "GST Document" &&
            doc.type !== "Company License/Registration Document" && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => removeDocument(i)}
              >
                Delete
              </Button>
            )} */}
        </div>
      ))}

      <Button
        className={classes.save}
        variant="contained"
        color="primary"
        onClick={addDocument}
        startIcon={<AddIcon />}
      >
        Add Document
      </Button>

      <div className={classes.status}>
        <h4>Status</h4>
        {/* <Dropdown className={classes.drop}></Dropdown>{" "} */}
        <FormControl>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            className={classes.select}
            value={company_profile_verified}
            onChange={(e) => setCompany_profile_verified(e.target.value)}
          >
            <MenuItem value={true}>Verified</MenuItem>
            <MenuItem value={false}>Unverified</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={classes.buttonfield}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleUpdate}
        >
          Update
        </Button>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default CompanyPageVerfication;
