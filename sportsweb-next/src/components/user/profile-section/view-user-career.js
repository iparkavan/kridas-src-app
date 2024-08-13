import { AccordionPanel, Divider, Link, VStack } from "@chakra-ui/react";
import { format } from "date-fns";

import { HeadingSmall } from "../../ui/heading/heading";
import { TextSmall } from "../../ui/text/text";
import { Accordion, AccordionItem, AccordionButton } from "../../ui/accordion";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import { useUserStatistics } from "../../../hooks/user-statistics-hooks";

const formatDate = (date) => format(new Date(date), "MMM yyyy");

const ViewUserCareer = (props) => {
  const { userData } = props;
  const { data: professionData = [] } = useLookupTable("PRF");
  const { data: statisticsData = [] } = useUserStatistics(
    userData?.["user_id"]
  );
  const isSportsCareerPresent = statisticsData?.some(
    (statistic) => statistic?.["sport_career"]?.length > 0
  );

  const getProfile = (code, index) => {
    return statisticsData?.[index]?.["sports_profile"]?.find(
      (value) => value["profile_code"] === code
    )?.["profile_name"];
  };

  const getRole = (profile, roleCode, index) => {
    if (profile === "PLAYER") {
      return statisticsData?.[index]?.["sports_role"]?.find(
        (value) => value["role_code"] === roleCode
      )?.["role_name"];
    } else {
      return professionData.find(
        (profession) => profession["lookup_key"] === roleCode
      )?.["lookup_value"];
    }
  };

  const SportCareer = ({ career, statisticIndex, index, careerArray }) => {
    return (
      <>
        <VStack align="flex-start">
          <TextSmall color="primary.500" fontWeight="medium">
            {career?.name}
          </TextSmall>
          <TextSmall>
            {getProfile(career?.profiles, statisticIndex)} -{" "}
            {career?.roles?.map((role, index) => {
              let rolesList = getRole(career?.profiles, role, statisticIndex);
              if (index !== career?.roles?.length - 1) {
                rolesList += ", ";
              }
              return rolesList;
            })}
          </TextSmall>
          <TextSmall>
            {`${formatDate(career?.from)} - ${
              career.isCurrent ? "Current" : formatDate(career?.to)
            }`}
          </TextSmall>
          {career?.url && (
            <Link fontSize="sm" href={career.url} isExternal>
              {career.url}
            </Link>
          )}
          {career?.achievements && (
            <TextSmall fontStyle="italic">{career.achievements}</TextSmall>
          )}
        </VStack>
        {index !== careerArray.length - 1 && (
          <Divider borderColor="gray.300" my={4} />
        )}
      </>
    );
  };

  if (!isSportsCareerPresent) {
    return null;
  }

  return (
    <VStack alignItems="flex-start" width="full" spacing={6}>
      <Divider borderColor="gray.300" mx={-6} px={6} />
      <HeadingSmall textTransform="uppercase">Sports Career</HeadingSmall>
      <Accordion defaultIndex={[0]} allowToggle w="full">
        {statisticsData?.map(
          (statistic, statisticIndex) =>
            statistic?.["sport_career"]?.length > 0 && (
              <AccordionItem key={statistic["user_statistics_id"]}>
                <AccordionButton>
                  <TextSmall fontWeight="medium">
                    {statistic?.["sports_name"]}
                  </TextSmall>
                </AccordionButton>

                <AccordionPanel p={5}>
                  {statistic?.["sport_career"]?.length > 0 &&
                    statistic?.["sport_career"]
                      ?.sort((a, b) => {
                        return new Date(a.from) - new Date(b.to);
                      })
                      .map((career, index, array) => (
                        <SportCareer
                          key={index}
                          career={career}
                          statisticIndex={statisticIndex}
                          index={index}
                          careerArray={array}
                        />
                      ))}
                </AccordionPanel>
              </AccordionItem>
            )
        )}
      </Accordion>
    </VStack>
  );
};

export default ViewUserCareer;
