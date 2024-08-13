import { Box, Typography } from "@mui/material";
import React from "react";
import GuyShoppingImage from "../../../assets/guy-shopping-online.png";
import CreditCardImage from "../../../assets/credit-cards.png";
import { makeStyles } from "@material-ui/styles";
import { useEffect } from "react";
import CompanyConfig from "../config/CompanyConfig";
import { useState } from "react";
import useHttp from "../../../hooks/useHttp";

const useStyles = makeStyles((theme) => ({
  cardHolder: {
    position: "fixed",
  },
}));

const CompanyBankDetailsView = (props) => {
  const classes = useStyles();
  const { isLoading, sendRequest } = useHttp();

  const [bankDetails, setbankDetails] = useState({});
  console.log(bankDetails);

  const { companyId } = props;

  useEffect(() => {
    const config = CompanyConfig.getCompanyById(companyId);

    const transformDate = (data) => {
      setbankDetails(data.data);
    };

    sendRequest(config, transformDate);
  }, [sendRequest, companyId]);

  // console.log(pageInfo)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!bankDetails?.company_bank_details) {
    return "No bank details found";
  }

  const isSecondaryDetailsPresent =
    bankDetails?.company_bank_details?.secondary &&
    Object.values(bankDetails.company_bank_details.secondary).some(
      (val) => val
    );

  return (
    <Box display="flex" justifyContent="space-between">
      <Box>
        <Typography fontWeight={700} fontSize={20}>
          Primary Account Details
        </Typography>
        <Box display="flex" gap={2} pt={3}>
          <Typography fontWeight={500} fontSize={18} color="#97BFB4">
            Account Number :
          </Typography>
          <Typography>
            {bankDetails.company_bank_details.primary.account_no}
          </Typography>
        </Box>
        <Box display="flex" gap={2} pt={3}>
          <Typography fontWeight={500} fontSize={18} color="#97BFB4">
            Account Holder Name :
          </Typography>
          <Typography>
            {bankDetails.company_bank_details.primary.account_name}
          </Typography>
        </Box>
        <Box display="flex" gap={2} pt={3}>
          <Typography fontWeight={500} fontSize={18} color="#97BFB4">
            Name of the Bank :
          </Typography>
          <Typography>
            {bankDetails.company_bank_details.primary.bank_name}
          </Typography>
        </Box>
        <Box display="flex" gap={2} pt={3}>
          <Typography fontWeight={500} fontSize={18} color="#97BFB4">
            Mobile Number :
          </Typography>
          <Typography>
            {bankDetails.company_bank_details.primary.mobile_no}
          </Typography>
        </Box>
        <Box display="flex" gap={2} pt={3}>
          <Typography fontWeight={500} fontSize={18} color="#97BFB4">
            IFSC Code :
          </Typography>
          <Typography>
            {bankDetails.company_bank_details.primary.ifsc_code}
          </Typography>
        </Box>
        <Box display="flex" gap={2} pt={3}>
          <Typography fontWeight={500} fontSize={18} color="#97BFB4">
            Swift Code :
          </Typography>
          <Typography>
            {bankDetails.company_bank_details.primary.swift_code}
          </Typography>
        </Box>

        {isSecondaryDetailsPresent && (
          <>
            <Typography fontWeight={700} fontSize={20} mt={3}>
              Secondary Account Details
            </Typography>
            <Box display="flex" gap={2} pt={3}>
              <Typography fontWeight={500} fontSize={18} color="#97BFB4">
                Account Number :
              </Typography>
              <Typography>
                {bankDetails.company_bank_details.secondary.account_no}
              </Typography>
            </Box>
            <Box display="flex" gap={2} pt={3}>
              <Typography fontWeight={500} fontSize={18} color="#97BFB4">
                Account Holder Name :
              </Typography>
              <Typography>
                {bankDetails.company_bank_details.secondary.account_name}
              </Typography>
            </Box>
            <Box display="flex" gap={2} pt={3}>
              <Typography fontWeight={500} fontSize={18} color="#97BFB4">
                Name of the Bank :
              </Typography>
              <Typography>
                {bankDetails.company_bank_details.secondary.bank_name}
              </Typography>
            </Box>
            <Box display="flex" gap={2} pt={3}>
              <Typography fontWeight={500} fontSize={18} color="#97BFB4">
                Mobile Number :
              </Typography>
              <Typography>
                {bankDetails.company_bank_details.secondary.mobile_no}
              </Typography>
            </Box>
            <Box display="flex" gap={2} pt={3}>
              <Typography fontWeight={500} fontSize={18} color="#97BFB4">
                IFSC Code :
              </Typography>
              <Typography>
                {bankDetails.company_bank_details.secondary.ifsc_code}
              </Typography>
            </Box>
            <Box display="flex" gap={2} pt={3}>
              <Typography fontWeight={500} fontSize={18} color="#97BFB4">
                Swift Code :
              </Typography>
              <Typography>
                {bankDetails.company_bank_details.secondary.swift_code}
              </Typography>
            </Box>
          </>
        )}
      </Box>

      <Box>
        <img
          className={classes.cardHolder}
          src={GuyShoppingImage}
          alt="Bank Details"
        />
        <img src={CreditCardImage} alt="Credit Card" />
      </Box>
    </Box>
  );
};

export default CompanyBankDetailsView;
