import { useRef } from "react";
import { Box, CircularProgress, VStack } from "@chakra-ui/react";

import { useFeedInfiniteByUserId } from "../../../hooks/feed-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import FeedPost from "../../feed/feed-post";
import { useUser } from "../../../hooks/user-hooks";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";

const UserFeedList = (props) => {
  const { userData } = props;
  const loadMoreRef = useRef();
  const { data: currentUser } = useUser();

  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useFeedInfiniteByUserId({
    user_id: userData?.["user_id"],
    login_user: currentUser?.["user_id"],
  });

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const displayFeed = () => {
    if (isLoading) {
      return "Loading...";
    }

    if (error) {
      return "An error has occurred: " + error.message;
    }

    if (feedData?.pages[0]?.totalCount === 0) {
      return <EmptyContentDisplay displayText="No Posts to display" />;
    }

    return feedData?.pages?.map((page) => {
      return page?.content?.map((feed) => (
        <FeedPost
          key={feed["feed_id"]}
          feed={feed}
          queryKey={["user-posts"]}
          type="user"
          id={currentUser["user_id"]}
        />
      ));
    });
  };

  return (
    <VStack align="flex-start" gap={3}>
      {displayFeed()};
      <span ref={loadMoreRef} />
      {isFetchingNextPage && (
        <CircularProgress alignSelf="center" isIndeterminate size="24px" />
      )}
    </VStack>
  );
};

export default UserFeedList;
