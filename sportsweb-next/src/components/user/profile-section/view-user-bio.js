import { Divider, Link, Stack, VStack } from "@chakra-ui/react";
import { HeadingSmall, HeadingXtraSmall } from "../../ui/heading/heading";
import LabelValuePair from "../../ui/label-value-pair";

const ViewUserBio = ({ userData }) => {
  const { bio_details } = userData;
  let game_ids, streaming_profiles;
  if (bio_details) {
    game_ids = bio_details.game_ids;
    streaming_profiles = bio_details.streaming_profiles;
  }

  const areGameIdsPresent = Boolean(game_ids?.length > 0);
  const areStreamsPresent = Boolean(streaming_profiles?.length > 0);

  if (!areGameIdsPresent && !areStreamsPresent) {
    return null;
  }

  return (
    <VStack alignItems="flex-start" width="full" spacing={6}>
      <Divider borderColor="gray.300" mx={-6} px={6} />
      <HeadingSmall>BIO</HeadingSmall>
      {areGameIdsPresent && (
        <Stack>
          <HeadingXtraSmall>GAME IDS</HeadingXtraSmall>
          {game_ids.map((game, index) => {
            const label = game.type === "OTH" ? game.other_type : game.type;
            return (
              <LabelValuePair key={index} label={label}>
                {game.id}
              </LabelValuePair>
            );
          })}
        </Stack>
      )}
      {areStreamsPresent && (
        <Stack>
          <HeadingXtraSmall>STREAMING PROFILES</HeadingXtraSmall>
          {streaming_profiles.map((stream, index) => {
            const label =
              stream.type === "OTH" ? stream.other_type : stream.type;
            return (
              <LabelValuePair key={index} label={label}>
                <Link href={stream.url} isExternal>
                  {stream.url}
                </Link>
              </LabelValuePair>
            );
          })}
        </Stack>
      )}
    </VStack>
  );
};

export default ViewUserBio;
