import { AccordionPanel, HStack, VStack } from "@chakra-ui/react";
import { useSports } from "../../../../hooks/sports-hooks";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
} from "../../../ui/accordion";
import LabelValuePair from "../../../ui/label-value-pair";
import { TextSmall } from "../../../ui/text/text";
import EditVenue from "./user-pages-sports-profile-edit-venue";
import DeleteStatistic from "./user-pages-sports-profile-delete-statistic";

const VenueStatisticsData = (props) => {
  const { venueStatisticsData, type } = props;
  const { data: sportsData = [] } = useSports();

  return (
    <Accordion defaultIndex={[0]} allowToggle w="full">
      {venueStatisticsData?.map((statistic) => {
        const categorywiseStatistics = statistic.categorywise_statistics;
        const sportName = sportsData?.find(
          (sport) => sport.sports_id == categorywiseStatistics.sports_id
        )?.sports_name;

        return (
          <AccordionItem key={statistic.company_statistics_id}>
            <AccordionButton>
              <HStack w="full" justifyContent="space-between">
                <TextSmall fontWeight="medium">
                  {categorywiseStatistics.venue_name}
                </TextSmall>
                {type === "private" && (
                  <HStack>
                    <EditVenue statisticsId={statistic.company_statistics_id} />
                    <DeleteStatistic
                      statisticsId={statistic.company_statistics_id}
                      category="Venue"
                    />
                  </HStack>
                )}
              </HStack>
            </AccordionButton>
            <AccordionPanel p={5}>
              <VStack spacing={4}>
                <LabelValuePair label="Venue Name">
                  {categorywiseStatistics.venue_name}
                </LabelValuePair>
                <LabelValuePair label="Sport">{sportName}</LabelValuePair>
                {categorywiseStatistics?.address && (
                  <LabelValuePair label="Address">
                    {categorywiseStatistics.address}
                  </LabelValuePair>
                )}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default VenueStatisticsData;
