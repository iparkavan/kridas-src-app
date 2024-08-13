import { Box, Divider, HStack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getPageType } from "../../../../helper/constants/page-constants";
import { usePageStatistics } from "../../../../hooks/page-statistics-hooks";
import Button from "../../../ui/button";
import { HeadingMedium } from "../../../ui/heading/heading";
import { ArrowLeftIcon } from "../../../ui/icons";
import PageViewSportsProfile from "../sports-profile-components/user-pages-view-sports-profile";
import UserPageEditSocial from "../user-page-edit-socialMediaPreference";
import EditContactInformation from "../user-pages-edit-contact-information";
// import AboutPageEdit from "./user-pages-about-edit";
import ParentPageAboutEdit from "../user-pages-about-edit/parent-page-about-edit";
import ChildPageAboutEdit from "../user-pages-about-edit/child-page-about-edit";

function UserPageEdit({ pageData }) {
  const pageId = pageData["company_id"];
  const router = useRouter();
  const { isParentPage, isChildPage, isSubTeamPage } = getPageType(pageData);

  const { data: pageStatisticsData = [] } = usePageStatistics(pageId);
  // const isSportsProfilePresent = Boolean(
  //   pageData?.["category_arr"]?.find(
  //     (category) => category["category_type"] === "ACD"
  //   )
  // );
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

  // Venue Statistics
  // const venueStatisticsData = pageStatisticsData
  //   .filter(
  //     ({ categorywise_statistics }) =>
  //       categorywise_statistics?.category === "VEN"
  //   )
  //   .sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));

  // Academy Statistics
  const academyStatisticsData = pageStatisticsData
    .filter(
      ({ categorywise_statistics }) =>
        categorywise_statistics?.category === "ACD"
    )
    .sort((a, b) => Date.parse(a.created_date) - Date.parse(b.created_date));

  let AboutPageEdit;
  if (isParentPage) {
    AboutPageEdit = ParentPageAboutEdit;
  } else if (isChildPage || isSubTeamPage) {
    AboutPageEdit = ChildPageAboutEdit;
  }

  return (
    <Box>
      <HStack w="full" justify="space-between">
        <HeadingMedium>Edit Page</HeadingMedium>
        <Button
          variant="link"
          leftIcon={<ArrowLeftIcon />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </HStack>
      <Box bg="white" mt={4} p={6} borderRadius="xl">
        <VStack
          align="stretch"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          p={6}
          spacing={5}
        >
          <AboutPageEdit pageData={pageData} isSubTeamPage={isSubTeamPage} />
          <Divider borderColor="gray.300" />
          <EditContactInformation
            pageData={pageData}
            isSubTeamPage={isSubTeamPage}
          />
          <Divider borderColor="gray.300" />
          {!isSubTeamPage && (
            <>
              <UserPageEditSocial pageData={pageData} />
              <Divider borderColor="gray.300" />
            </>
          )}

          {isSportsProfilePresent && (
            <>
              <PageViewSportsProfile
                pageData={pageData}
                // venueStatisticsData={venueStatisticsData}
                academyStatisticsData={academyStatisticsData}
                type="private"
              />
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
}

export default UserPageEdit;
