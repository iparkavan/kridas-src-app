import {
  Button,
  VStack,
  Link,
  HStack,
  Icon,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { usePage } from "../../../hooks/page-hooks";
import LabelValuePair from "../../ui/label-value-pair";
import { HeadingMedium } from "../../ui/heading/heading";
import { ContactInfo } from "../../ui/icons";
import { TextSmall } from "../../ui/text/text";

const ContactInformation = ({ setShowText, type }) => {
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);

  return (
    <VStack alignItems="flex-start" w="full" spacing={4}>
      {/* {type === "private" && (
        <Button
          variant="outline"
          colorScheme="primary"
          onClick={() => setShowText(true)}
        >
          Edit
        </Button>
      )} */}
      <HStack spacing={4} mt={type === "public" && 3}>
        {/* <Icon as={ContactInfo} w="6" h="6" /> */}
        <HeadingMedium>Contact Information</HeadingMedium>
      </HStack>

      {pageData?.company_contact_no && (
        <LabelValuePair label="Contact Number">
          {pageData?.company_contact_no}
        </LabelValuePair>
      )}

      {pageData?.company_email && (
        <LabelValuePair label="Email ID">
          {pageData?.company_email}
        </LabelValuePair>
      )}
      {pageData?.company_website && (
        <LabelValuePair label="Website URL">
          <Link color="primary.500" href={pageData?.company_website} isExternal>
            {pageData?.company_website}
          </Link>
        </LabelValuePair>
      )}
      {pageData?.address?.country && (
        <>
          <LabelValuePair label="Address">
            {pageData.address?.line1 && (
              <>
                {pageData.address?.line1}
                <br />
              </>
            )}
            {pageData.address?.line2 && (
              <>
                {pageData.address?.line2}
                <br />
              </>
            )}
            {`${pageData.address?.city}, ${
              pageData.countryData &&
              JSON.parse(pageData.countryData)?.["country_states"]?.find(
                (state) => state["state_code"] === pageData.address?.state
              )?.["state_name"]
            }, ${
              pageData.countryData &&
              JSON.parse(pageData.countryData)["country_name"]
            }, ${pageData.address?.pincode}`}
          </LabelValuePair>
          {/* <LabelValuePair label="Full Address">
            {pageData?.address?.line1}
            {pageData?.address?.line2 && (
              <>
                {pageData?.address?.line1 && <br />}
                {pageData.address.line2}
              </>
            )}
          </LabelValuePair>
          <LabelValuePair label="Pincode / Zip">
            {pageData?.address?.pincode}
          </LabelValuePair>
          <LabelValuePair label="Country">
            {pageData.countryData &&
              JSON.parse(pageData.countryData)?.["country_name"]}
          </LabelValuePair>
          <LabelValuePair label="State">
            {pageData.countryData &&
              JSON.parse(pageData.countryData)?.["country_states"]?.find(
                (state) => state["state_code"] === pageData.address?.state
              )?.["state_name"]}
          </LabelValuePair>
          <LabelValuePair label="City">
            {pageData?.address?.city}
          </LabelValuePair> */}
        </>
      )}
    </VStack>
  );
};

export default ContactInformation;
