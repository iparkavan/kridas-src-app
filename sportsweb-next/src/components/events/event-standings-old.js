import { Box, Image, VStack } from "@chakra-ui/react";
import { HeadingSmall } from "../ui/heading/heading";

const EventStandings = ({ eventData }) => {
  const sportsWithStandings = eventData?.["sport_list"]?.filter(
    (sport) => sport?.["tournament_config"]?.["standings_url"]?.length > 0
  );

  return (
    <VStack alignItems="flex-start" spacing={6}>
      {sportsWithStandings?.map((sport) => {
        const category =
          sport?.["sport_category"]?.find(
            (category) =>
              category["category_code"] === sport["tournament_category"]
          )?.["category_name"] || sport["tournament_category"];

        return (
          <Box key={sport["tournament_category_id"]}>
            <HeadingSmall mb={3}>
              {sport["sport_name"]} - {category}
            </HeadingSmall>
            <VStack alignItems="flex-start" spacing={3}>
              {sport["tournament_config"]["standings_url"]?.map((url) => (
                <Image key={url} src={url} alt="Standings" />
              ))}
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
};

export default EventStandings;
