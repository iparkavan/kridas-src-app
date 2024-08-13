import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import PageVerificationImage from "../../../assets/Page-under-construction.png";
import CompanyConfig from "../config/CompanyConfig";
import useHttp from "../../../hooks/useHttp";
import { Button, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: "revert",
  },
}));

const CompanyPageVerificationView = ({ companyId }) => {
  const classes = useStyles();
  const [companyData, setCompanyData] = useState({});
  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    const config = CompanyConfig.getCompanyById(companyId);
    const transformDate = (data) => {
      setCompanyData(data.data);
    };
    sendRequest(config, transformDate);
  }, [sendRequest, companyId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isVerificationDetailsPresent =
    companyData.company_contacts &&
    companyData.company_tax_info &&
    companyData.company_identity_docs;

  if (!isVerificationDetailsPresent) {
    return "No verification details found";
  }

  return (
    <Box>
      {companyData.company_tax_info.gst_number && (
        <Box display="flex" justifyContent="end" alignItems="baseline" gap={1}>
          <Typography fontWeight={700} fontSize={20} color="#97BFB4">
            GST Number :
          </Typography>
          <Typography fontSize={20}>
            {companyData.company_tax_info.gst_number}
          </Typography>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography fontWeight={700} fontSize={20}>
            Proprietor Details
          </Typography>
          <Box display="flex" gap={10} mt={2} mb={3}>
            <Typography display="flex" gap={1}>
              <AccountCircleOutlinedIcon />
              {companyData.company_contacts.proprietor_name}
            </Typography>
            <Typography display="flex" gap={1}>
              <EmailOutlinedIcon />
              {companyData.company_contacts.proprietor_email}
            </Typography>
            <Typography display="flex" gap={1}>
              <CallOutlinedIcon />
              {companyData.company_contacts.proprietor_mobile}
            </Typography>
          </Box>
          <Typography fontWeight={700} fontSize={20}>
            Primary Contact Person Details
          </Typography>
          <Box display="flex" gap={10} mt={2} mb={3}>
            <Typography display="flex" gap={1}>
              <AccountCircleOutlinedIcon />
              {companyData.company_contacts.primary_contact_name}
            </Typography>
            <Typography display="flex" gap={1}>
              <EmailOutlinedIcon />
              {companyData.company_contacts.primary_contact_email}
            </Typography>
            <Typography display="flex" gap={1}>
              <CallOutlinedIcon />
              {companyData.company_contacts.primary_contact_mobile}
            </Typography>
          </Box>

          {companyData.company_identity_docs.map((doc) => (
            <Box mt={2}>
              <Typography fontWeight={700} fontSize={20} mb={1}>
                {doc.type}
              </Typography>
              <Link href={doc.url}>
                <Button
                  variant="outlined"
                  className={classes.button}
                  startIcon={<ImageOutlinedIcon />}
                >
                  {doc.name}
                </Button>
              </Link>
            </Box>
          ))}

          <Box mt={3} display="flex" gap={1} alignItems="center">
            <Typography fontWeight={700} fontSize={20} color="#97BFB4">
              Status:
            </Typography>
            <Typography fontWeight={700} fontSize={20}>
              {companyData.company_profile_verified ? "Verified" : "Unverified"}
            </Typography>
            {companyData.company_profile_verified ? (
              <VerifiedIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}
          </Box>
        </Box>
        <Box>
          <img src={PageVerificationImage} alt="Page Verification" />
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyPageVerificationView;
