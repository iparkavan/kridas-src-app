import { Alert, AlertDescription, AlertIcon, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/router";

import SessionHelper from "../../src/helper/session";
import FeedPost from "../../src/components/feed/feed-post";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import { useFeed } from "../../src/hooks/feed-hooks";
import { useUser } from "../../src/hooks/user-hooks";

const PostIndex = () => {
  const router = useRouter();
  const { postId } = router.query;
  const { data: userData, isLoading: isUserLoading } = useUser();
  const {
    data: initialFeedData,
    isLoading: isInitialFeedLoading,
    isSuccess: isInitialFeedSuccess,
  } = useFeed(postId, userData?.["user_id"], "U", true, [
    "initialFeed",
    postId,
  ]);

  let context;
  // let isPageOwner = false;
  let isEventOwner = false;
  if (initialFeedData?.["feed_creator_user_id"]) {
    context = {
      type: "U",
      fullType: "user",
      id: userData?.["user_id"],
    };
  } else if (initialFeedData?.["event_id"]) {
    isEventOwner =
      initialFeedData.company["created_by"] === userData?.["user_id"];
    context = isEventOwner
      ? {
          type: "E",
          fullType: "event",
          id: initialFeedData.event["event_id"],
          data: initialFeedData.event,
        }
      : {
          type: "U",
          fullType: "user",
          id: userData?.["user_id"],
        };
  } else if (initialFeedData?.["feed_creator_company_id"]) {
    context = {
      type: "U",
      fullType: "user",
      id: userData?.["user_id"],
    };
    // isPageOwner =
    //   initialFeedData.company["created_by"] === userData?.["user_id"];
    // context = isPageOwner
    //   ? {
    //       type: "C",
    //       fullType: "company",
    //       id: initialFeedData.company["company_id"],
    //     }
    //   : {
    //       type: "U",
    //       fullType: "user",
    //       id: userData?.["user_id"],
    //     };
  }

  const {
    data: feedData,
    isFetching: isFeedFetching,
    isSuccess: isFeedSuccess,
  } = useFeed(
    postId,
    context?.id,
    context?.type,
    isInitialFeedSuccess && context
  );

  return (
    <UserLayout>
      <Skeleton
        isLoaded={!isUserLoading && !isInitialFeedLoading && !isFeedFetching}
      >
        {userData && feedData && isFeedSuccess ? (
          <FeedPost
            feed={feedData}
            queryKey={["feed", postId]}
            type={context.fullType}
            id={context.id}
            data={context.data}
          />
        ) : (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>This post is not available.</AlertDescription>
          </Alert>
        )}
      </Skeleton>
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default PostIndex;
