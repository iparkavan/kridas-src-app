import { VStack } from "@chakra-ui/react";
import { format } from "date-fns";

import { HeadingSmall } from "../../ui/heading/heading";
import LabelValuePair from "../../ui/label-value-pair";
import {
  getGender,
  referralToPlayerId,
} from "../../../helper/constants/user-contants";

const ViewUserDetails = ({ userData, type }) => {
  const formatDate = (date) => format(new Date(date), "dd MMM yyyy");

  return (
    <VStack
      alignItems="flex-start"
      w="full"
      spacing={4}
      // border="1px solid"
      // borderColor="gray.200"
      // borderRadius="lg"
      // p={6}
    >
      <HeadingSmall textTransform="uppercase">
        Personal Information
      </HeadingSmall>

      <LabelValuePair label="First Name">
        {userData["first_name"]}
      </LabelValuePair>
      <LabelValuePair label="Last Name">{userData["last_name"]}</LabelValuePair>
      <LabelValuePair label="Username">{userData["user_name"]}</LabelValuePair>

      {type === "private" && (
        <>
          <LabelValuePair label="Email ID">
            {userData["user_email"]}
          </LabelValuePair>
          {userData["user_phone"] && (
            <LabelValuePair label="Phone / Mobile Number">
              {userData["user_phone"]}
            </LabelValuePair>
          )}
        </>
      )}

      <LabelValuePair label="Player ID">
        {referralToPlayerId(userData["referral_code"])}
      </LabelValuePair>

      {userData["user_gender"] && (
        <LabelValuePair label="Gender">
          {getGender[userData["user_gender"]]}
        </LabelValuePair>
      )}

      {type === "private" && (
        <>
          {userData["user_dob"] && (
            <LabelValuePair label="Date of Birth">
              {userData["user_dob"] && formatDate(userData["user_dob"])}
            </LabelValuePair>
          )}
          {userData["address"]?.["country"] && (
            <LabelValuePair label="Address">
              {userData["address"]?.["line1"] && (
                <>
                  {userData["address"]?.["line1"]}
                  <br />
                </>
              )}
              {userData["address"]?.["line2"] && (
                <>
                  {userData["address"]?.["line2"]}
                  <br />
                </>
              )}
              {`${userData["address"]?.["city"]}, ${
                userData["countryData"] &&
                JSON.parse(userData["countryData"])?.["country_states"]?.find(
                  (state) =>
                    state["state_code"] === userData["address"]?.["state"]
                )?.["state_name"]
              }, ${
                userData["countryData"] &&
                JSON.parse(userData["countryData"])["country_name"]
              }, ${userData["address"]?.["pincode"]}`}
            </LabelValuePair>
          )}
          <LabelValuePair label="Referral Code">
            {userData["referral_code"]}
          </LabelValuePair>
        </>
      )}
    </VStack>
  );
};

export default ViewUserDetails;
