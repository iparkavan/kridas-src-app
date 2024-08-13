import { Avatar, Box, Grid, GridItem, Link } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import {
  feedOptions,
  getFeedCaption,
} from "../../helper/constants/feed-constants";
import { TextSmall, TextXtraSmall } from "../ui/text/text";

const SharedPost = ({ feed: feed_share }) => {
  const postTime = formatDistance(
    new Date(feed_share["updated_date"]),
    new Date(),
    {
      addSuffix: true,
    }
  );
  const sharedContentState = convertFromRaw(
    JSON.parse(feed_share["feed_content"])
  );
  const sharedFeedHtml = stateToHTML(sharedContentState, feedOptions);

  let sharedFeedCreator;
  if (feed_share.user) {
    sharedFeedCreator = {
      name: `${feed_share.user["first_name"]} ${feed_share.user["last_name"]}`,
      profileImage: feed_share.user["user_profile_img"],
      url: `/user/profile/${feed_share.user["user_id"]}`,
    };
  } else if (feed_share.event) {
    sharedFeedCreator = {
      name: feed_share.event["event_name"],
      profileImage: feed_share.event["event_logo"],
      url: `/events/${feed_share.event["event_id"]}`,
    };
  } else {
    sharedFeedCreator = {
      name: feed_share.company["company_name"],
      profileImage: feed_share.company["company_profile_img"],
      url: `/page/${feed_share.company["company_id"]}`,
    };
  }

  return (
    <Box
      border="1px solid"
      borderColor="gray.300"
      borderRadius="10px"
      p={4}
      w="full"
    >
      <Grid templateColumns="max-content 1fr" rowGap={4} columnGap={4}>
        <GridItem alignSelf="center">
          <Avatar
            size="sm"
            name={sharedFeedCreator.name}
            src={sharedFeedCreator.profileImage}
          />
        </GridItem>
        <GridItem>
          <TextSmall>
            <Link href={sharedFeedCreator.url} fontSize="sm">
              {sharedFeedCreator.name}
            </Link>
            {getFeedCaption(feed_share)}
          </TextSmall>
          <TextXtraSmall color="gray.500">{postTime}</TextXtraSmall>
        </GridItem>
        <GridItem colSpan={2}>
          <Box dangerouslySetInnerHTML={{ __html: sharedFeedHtml }} />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default SharedPost;
