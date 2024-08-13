import { useRef, useState, useEffect } from "react";
import {
  Text,
  Box,
  Flex,
  Image,
  VStack,
  Button,
  SimpleGrid,
  GridItem,
  Progress,
  CircularProgress,
  Skeleton,
  AspectRatio,
} from "@chakra-ui/react";

import UserLayout from "../layout/user-layout/user-layout";
import FeedPost from "../feed/feed-post";
import { useUser } from "../../hooks/user-hooks";
import { useInfiniteFeed } from "../../hooks/hash-tag-hook";
import { useIntersectionObserver } from "../../hooks/common-hooks";
import { TextHighlight } from "../ui/text/text";
import { useRouter } from "next/router";


const UserSearch = () => {
  const { data: userData = {} } = useUser();
  const router = useRouter();
  const { hashtag } = router.query;
  const [tag, setTag] = useState(hashtag)
  const loadMoreRef = useRef();
  // const {
  //   data: feedData,
  //   hasNextPage,
  //   fetchNextPage,
  //   isFetchingNextPage,
  //   error,
  //   isLoading,
  // } = useInfiniteFeed(tag, userData.user_id);

  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
    refetch,
  } = useInfiniteFeed(hashtag, userData.user_id);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  useEffect(() => {
    refetch();
  }, [hashtag, refetch]);

  return (
    <UserLayout>
      <Flex gap={3} mt="0" >
        <Box p={0} w={{ base: "full", lg: "80%" }}>
          <TextHighlight>Your Feed</TextHighlight>
          <VStack my={3} align="flex-start" gap={4}>
            {isLoading ? (
              <Skeleton width="full" />
            ) : error ? (
              "An error has occurred: " + error.message
            ) : (
              feedData?.pages?.map((page) => {
                return page?.content?.map((feed) => (
                  <FeedPost
                    key={feed["feed_id"]}
                    feed={feed}
                    queryKey={["hash-feeds"]}
                    type="user"
                    id={userData["user_id"]}
                  />
                ));
              })
            )}

            <span ref={loadMoreRef} />
            {isFetchingNextPage && (
              <CircularProgress
                alignSelf="center"
                isIndeterminate
                size="24px"
              />
            )}
          </VStack>
        </Box>
        <Flex
          gap={3}
          direction="column"
          w="35%"
          display={{ base: "none", lg: "flex" }}
        >
        </Flex>
      </Flex>
    </UserLayout>
  );
};

export default UserSearch;
