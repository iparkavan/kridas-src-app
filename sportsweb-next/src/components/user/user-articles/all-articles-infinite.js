import ArticleCard from "../../common/article/article-card";
import {
  Box,
  HStack,
  VStack,
  Button,
  Image,
  Flex,
  SimpleGrid,
  GridItem,
  CircularProgress,
  Input,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";
import Skeleton from "../../ui/skeleton";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";
import { useInfiniteAllArticles } from "../../../hooks/article-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useState, useCallback } from "react";
import { HeadingSmall } from "../../ui/heading/heading";
import { TextMedium, TextSmall } from "../../ui/text/text";
import { useQueryClient } from "react-query";
import { SearchBlueIcon } from "../../ui/icons";

function PublishedArticles({ articleCount }) {
  const [searchText, setSearchText] = useState("");
  const {
    data: articles = {},
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteAllArticles(searchText);
  const loadMoreRef = useRef();
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  const queryClient = useQueryClient();
  const handleChange = useCallback(
    (e) => {
      setSearchText(e.target.value);
      refetch({
        refetchPage: () => {
          queryClient.invalidateQueries(["all-published-articles", searchText]);

          return true;
        },
      });
    },
    [refetch, queryClient, searchText]
  );
  const fetchedArticlesCount =
    articles?.pages && articles?.pages[0]?.totalCount;
  return (
    <Flex
      align={["center", "flex-start"]}
      justify={["center", "flex-start"]}
      direction={["column", "row"]}
    >
      {articleCount > 0 && (
        <VStack align="flex-start" spacing={4} p={[2, 3, 4]}>
          <HeadingSmall>FILTERS</HeadingSmall>
          <Box h="min-content">
            <Input
              type="search"
              placeholder="Search Articles"
              bg="#f9f9f9"
              transition="0.5s ease-out"
              borderRadius={"5px"}
              variant="outline"
              _focus={{ boxShadow: "none" }}
              color="black"
              onInput={(e) => handleChange(e)}
            ></Input>
          </Box>
        </VStack>
      )}
      <VStack w={"full"}>
        <Box>
          {" "}
          {isLoading ? (
            <HStack>
              <SearchBlueIcon />
              <TextSmall>Fetching..</TextSmall>
            </HStack>
          ) : (
            searchText &&
            <HStack>
              <SearchBlueIcon />
              <TextMedium>
                <b>{fetchedArticlesCount}</b> results found
              </TextMedium>
            </HStack>
          )}
        </Box>
        <HStack
          align={["center", "flex-start"]}
          justify={["center", "flex-start"]}
          flexWrap={"wrap"}
          px={[2, 3, 8]}
          w="full"
          minH="100vh"
        >
          {articles && isLoading ? (
            <Skeleton></Skeleton>
          ) : error ? (
            "An error has occurred: " + error.message
          ) : (
            <>
              {articles?.pages?.map((page, idx) => {
                return page?.content?.map((articleData) => {
                  return (
                    <>
                      <ArticleCard articleData={articleData} />
                    </>
                  );
                });
              })}
                   <span ref={loadMoreRef} />
              {isFetchingNextPage && (
                <CircularProgress
                  alignSelf="center"
                  isIndeterminate
                  size="28px"
                />
              )}
            </>
          )}
          {articleCount === 0 && (
            <EmptyContentDisplay
              align="flex-start"
              displayText="No Articles to Display"
            />
          )}
        </HStack>
      </VStack>
    </Flex>
  );
}

export default PublishedArticles;
