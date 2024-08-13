import { Divider, VStack } from "@chakra-ui/react";
// import { useRouter } from "next/router";
import { getPageType } from "../../../../helper/constants/page-constants";
import { usePageStatistics } from "../../../../hooks/page-statistics-hooks";
import PageViewSportsProfile from "../sports-profile-components/user-pages-view-sports-profile";
import ContactInformation from "../user-pages-about-contact-information";
import Socialmediapreference from "../user-pages-view-socialmediapreference";
import AboutPageView from "./user-pages-about-view";

function UserPageAbout(props) {
  const { pageData, currentPage } = props;
  // const router = useRouter();
  // const { pageId } = router.query;

  const { data: pageStatisticsData = [] } = usePageStatistics(
    pageData?.company_id
  );

  const { isParentPage, isChildPage, isSubTeamPage } = getPageType(pageData);

  const isContactInfoPresent =
    pageData?.["company_contact_no"] ||
    pageData?.["company_email"] ||
    pageData?.["company_website"] ||
    pageData?.["address"]?.["country"];

  const isSocialsPresent = pageData?.social?.some((social) => social?.link);

  // const isSportsProfilePresent =
  //   isParentPage &&
  //   (pageData?.parent_category_type === "VEN" ||
  //     pageData?.parent_category_type === "ACD");

  let isSportsProfilePresent = false;
  if (isParentPage) {
    isSportsProfilePresent = pageData?.parent_category_type === "ACD";
  } else if (isChildPage) {
    isSportsProfilePresent = Boolean(
      pageData?.["category_arr"]?.find(
        (category) => category["category_type"] === "ACD"
      )
    );
  }

  // Team Statistics
  // const pageTeamStatisticsData = pageStatisticsData
  //   .filter(
  //     ({ categorywise_statistics }) =>
  //       categorywise_statistics.category === "team"
  //   )
  //   .sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));

  //Venue Statistics
  const venueStatisticsData = pageStatisticsData
    .filter(
      ({ categorywise_statistics }) =>
        categorywise_statistics?.category === "VEN"
    )
    .sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));

  //Academy Statistics
  const academyStatisticsData = pageStatisticsData
    .filter(
      ({ categorywise_statistics }) =>
        categorywise_statistics?.category === "ACD"
    )
    .sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));

  return (
    <VStack
      spacing={6}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={5}
    >
      <AboutPageView
        type={currentPage ? "private" : "public"}
        isChildPage={isChildPage}
        isSubTeamPage={isSubTeamPage}
      />

      {isContactInfoPresent && (
        <>
          <Divider borderColor="gray.300" mx={-6} px={5} />
          <ContactInformation type={currentPage ? "private" : "public"} />
        </>
      )}

      {isSocialsPresent && (
        <>
          <Divider borderColor="gray.300" mx={-6} px={5} />
          <Socialmediapreference type={currentPage ? "private" : "public"} />
        </>
      )}

      {isSportsProfilePresent && pageStatisticsData?.length > 0 && (
        <>
          <Divider borderColor="gray.300" mx={-6} px={5} />
          <PageViewSportsProfile
            pageData={pageData}
            venueStatisticsData={venueStatisticsData}
            academyStatisticsData={academyStatisticsData}
            type="public"
          />
        </>
      )}
    </VStack>
  );
}

export default UserPageAbout;
