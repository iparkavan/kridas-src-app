import React, { useRef, useState } from "react";
import FeedPost from "../../feed/feed-post";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useFeedInfiniteByCompanyId } from "../../../hooks/feed-hooks";
import { CircularProgress, VStack } from "@chakra-ui/react";
import { useUser } from "../../../hooks/user-hooks";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";

function PageFeedList(props) {
  const { pageData } = props;
  const { data: userData } = useUser();
  const loadMoreRef = useRef();

  const isPageOwner = userData["user_id"] === pageData?.["created_by"];
  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useFeedInfiniteByCompanyId({
    company_id: pageData?.["company_id"],
    type: isPageOwner ? "C" : "U",
    login_id: isPageOwner ? pageData?.["company_id"] : userData["user_id"],
  });

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  return (
    <>
      <VStack align="flex-start" gap={3}>
        {isLoading
          ? "Loading..."
          : error
          ? "An error has occurred: " + error.message
          : feedData?.pages?.map((page) => {
              return page?.content?.map((feed) => (
                <FeedPost
                  key={feed["feed_id"]}
                  feed={feed}
                  queryKey={["company-posts"]}
                  type={isPageOwner ? "company" : "user"}
                  id={
                    isPageOwner ? pageData?.["company_id"] : userData["user_id"]
                  }
                />
              ));
            })}

        <span ref={loadMoreRef} />
        {isFetchingNextPage && (
          <CircularProgress alignSelf="center" isIndeterminate size="24px" />
        )}
      </VStack>
      {feedData?.pages[0]?.totalCount === 0 && (
        <EmptyContentDisplay displayText="No posts to display" />
      )}
    </>
  );
}

export default PageFeedList;
