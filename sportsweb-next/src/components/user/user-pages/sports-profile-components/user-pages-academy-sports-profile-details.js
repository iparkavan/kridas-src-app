import { AccordionPanel, HStack, VStack } from "@chakra-ui/react";
import { useCategoriesByType } from "../../../../hooks/category-hooks";
import { useLookupTable } from "../../../../hooks/lookup-table-hooks";
import { useSports } from "../../../../hooks/sports-hooks";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
} from "../../../ui/accordion";
import LabelValuePair from "../../../ui/label-value-pair";
import { TextSmall } from "../../../ui/text/text";
import DeleteStatistic from "./user-pages-sports-profile-delete-statistic";
import EditAcademy from "./user-pages-sports-profile-edit-academy";

const AcademyStatisticsData = (props) => {
  const { pageData, academyStatisticsData, type } = props;
  const { data: sportsData = [] } = useSports();
  const { data: skillsData = [] } = useCategoriesByType("SKI");
  const { data: genderData = [] } = useLookupTable("GEN");

  return (
    <Accordion defaultIndex={[0]} allowToggle w="full">
      {academyStatisticsData?.map((statistic) => {
        const categorywiseStatistics = statistic.categorywise_statistics;
        const sport = sportsData?.find(
          (sport) => sport.sports_id == categorywiseStatistics.sports_id
        );
        const sportName = sport?.sports_name;
        const skillLevel = skillsData?.find(
          (skill) => skill.category_id == categorywiseStatistics.skill_level
        )?.category_name;
        const gender = genderData?.find(
          (gender) => gender.lookup_key == categorywiseStatistics.gender
        )?.lookup_value;
        const ageGroup = sport?.sports_age_group?.find(
          (ageGroup) =>
            ageGroup.age_group_code === categorywiseStatistics.age_group
        )?.age_group;

        return (
          <AccordionItem key={statistic.company_statistics_id}>
            <AccordionButton>
              <HStack w="full" justifyContent="space-between">
                <TextSmall fontWeight="medium">
                  {categorywiseStatistics?.academy_name ||
                    pageData?.company_name}
                </TextSmall>
                {type === "private" && (
                  <HStack>
                    <EditAcademy
                      statisticsId={statistic.company_statistics_id}
                    />
                    <DeleteStatistic
                      statisticsId={statistic.company_statistics_id}
                      category="Academy"
                    />
                  </HStack>
                )}
              </HStack>
            </AccordionButton>
            <AccordionPanel p={5}>
              <VStack spacing={4}>
                {categorywiseStatistics?.academy_name && (
                  <LabelValuePair label="Academy Name">
                    {categorywiseStatistics.academy_name}
                  </LabelValuePair>
                )}
                <LabelValuePair label="Sport">{sportName}</LabelValuePair>
                <LabelValuePair label="Skill Level">
                  {skillLevel}
                </LabelValuePair>
                <LabelValuePair label="Gender">{gender}</LabelValuePair>
                <LabelValuePair label="Age Group">{ageGroup}</LabelValuePair>
                {/* {categorywiseStatistics?.address && (
                  <LabelValuePair label="Address">
                    {categorywiseStatistics.address}
                  </LabelValuePair>
                )} */}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default AcademyStatisticsData;
