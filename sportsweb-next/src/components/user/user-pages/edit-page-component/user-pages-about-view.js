import React from "react";
import { VStack, Button, Icon, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { usePage } from "../../../../hooks/page-hooks";
import { useSports } from "../../../../hooks/sports-hooks";
import { HeadingMedium } from "../../../ui/heading/heading";
import LabelValuePair from "../../../ui/label-value-pair";
// import { AboutDetail } from "../../../ui/icons";
import { usePageStatistics } from "../../../../hooks/page-statistics-hooks";
import { useCategoriesByType } from "../../../../hooks/category-hooks";
import { useLookupTable } from "../../../../hooks/lookup-table-hooks";

function AboutPageView(props) {
  const { setShowText, type, isChildPage, isSubTeamPage } = props;
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  const { data: pageStatisticsData } = usePageStatistics(pageId);
  const { data: sportsData = [] } = useSports({}, true);
  const { data: skillsData = [] } = useCategoriesByType("SKI");
  const { data: genderData = [] } = useLookupTable("GEN");

  const subcat = pageData?.category_arr?.map(
    ({ category_name }) => category_name
  );
  const isSportingPage = pageData?.category_id === 0;
  const companyCategoryNames = pageData?.company_category_name?.flat();

  const sportsInterested = pageData?.sports_interested?.map((sportId) => {
    const sport = sportsData.find((s) => s["sports_id"] === sportId);
    return sport?.["sports_name"];
  });

  let isSubCatTeam,
    // isSubCatAcademy,
    pageStatistics,
    sportInterested,
    skillLevel,
    gender,
    ageGroup;

  if (isChildPage || isSubTeamPage) {
    isSubCatTeam = Boolean(
      pageData?.category_arr?.find(
        ({ category_type }) => category_type === "TEA"
      )
    );
    // isSubCatAcademy = Boolean(
    //   pageData?.category_arr?.find(
    //     ({ category_type }) => category_type === "ACD"
    //   )
    // );
    pageStatistics = pageStatisticsData?.find(
      (statistic) =>
        statistic["categorywise_statistics"]?.["category"] === "TEA"
    );
    sportInterested = sportsData.find(
      (s) =>
        s["sports_id"] ==
        pageStatistics?.["categorywise_statistics"]?.["sports_id"]
    );
    skillLevel = skillsData?.find(
      (skill) =>
        skill["category_id"] ==
        pageStatistics?.["categorywise_statistics"]?.["skill_level"]
    )?.["category_name"];

    gender = genderData?.find(
      (gender) =>
        gender["lookup_key"] ===
        pageStatistics?.["categorywise_statistics"]?.["gender"]
    )?.["lookup_value"];

    ageGroup = sportInterested?.["sports_age_group"]?.find(
      (ageGroup) =>
        ageGroup["age_group_code"] ===
        pageStatistics?.["categorywise_statistics"]?.["age_group"]
    )?.["age_group"];
  }

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
      <Flex>
        {/* <Icon as={AboutDetail} w="6" h="6" /> */}
        <HeadingMedium>About This Page</HeadingMedium>
      </Flex>
      <LabelValuePair label="Page Name">
        {pageData?.["company_name"]}
      </LabelValuePair>
      <LabelValuePair label="Category">
        {pageData?.["parent_category_name"]}
      </LabelValuePair>
      {subcat?.length > 0 && (
        <LabelValuePair label="Sub Categories">
          {subcat?.map((subCategory, index) => {
            const str = subCategory;
            if (index !== subcat?.length - 1) {
              str += ", ";
            }
            return str;
          })}
        </LabelValuePair>
      )}
      {/* {isChildPage && isSubCatTeam ? (
        <LabelValuePair label="Sports Associated">
          {sportInterested?.["sports_name"]}
        </LabelValuePair>
      ) : (
        <LabelValuePair label="Sports Associated">
          {sportsInterested?.map((sportName, index) => {
            const str = sportName;
            if (index !== sportsInterested?.length - 1) {
              str += ", ";
            }
            return str;
          })}
        </LabelValuePair>
      )} */}
      {isSportingPage ? (
        <LabelValuePair label="Sports Associated">
          {sportsInterested?.map((sportName, index) => {
            const str = sportName;
            return index !== sportsInterested?.length - 1 ? str + ", " : str;
          })}
        </LabelValuePair>
      ) : (
        <LabelValuePair label="Categories Associated">
          {companyCategoryNames?.map((categoryName, index) => {
            const str = categoryName;
            return index !== companyCategoryNames?.length - 1
              ? str + ", "
              : str;
          })}
        </LabelValuePair>
      )}
      {pageData?.["company_desc"] && (
        <LabelValuePair label="Introduction">
          {pageData["company_desc"]}
        </LabelValuePair>
      )}
      {((isChildPage && isSubCatTeam) || isSubTeamPage) && (
        <>
          {skillLevel && (
            <LabelValuePair label="Skill Level">{skillLevel}</LabelValuePair>
          )}
          {gender && <LabelValuePair label="Gender">{gender}</LabelValuePair>}
          {ageGroup && (
            <LabelValuePair label="Age Group">{ageGroup}</LabelValuePair>
          )}
        </>
      )}
    </VStack>
  );
}
export default AboutPageView;
