import { Box, CircularProgress, Flex, HStack } from "@chakra-ui/react";
import Skeleton from "../ui/skeleton/index";
import { useRef } from "react";
import { useFeaturedArticles } from "../../hooks/article-hooks";
import { useIntersectionObserver } from "../../hooks/common-hooks";
import { TextHighlight } from "../ui/text/text";
import ArticleItem from "../user/user-index/user-index-article-item";

const PromotedArticles = () => {
  const loadMoreRef = useRef();
  const {
    data: featuredArticles = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useFeaturedArticles();
  let count = 0;
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  return featuredArticles && isLoading ? (
    <Skeleton></Skeleton>
  ) : error ? (
    "An error has occurred: " + error.message
  ) : (
    <Box my={2}>
      <TextHighlight>Promoted Articles</TextHighlight>
      <Flex gap={4} my={3} direction={{ base: "column", sm: "row" }}>
        {featuredArticles?.pages?.map((page) => {
          return page?.content?.map(
            ({
              article_heading,
              cover_image_url,
              updated_date,
              article_id,
            }) => {
              count++;
              if (count <= 3)
                return (
                  <ArticleItem
                    key={article_id}
                    coverImage={cover_image_url}
                    articleHeading={article_heading}
                    updatedDate={updated_date}
                    articleId={article_id}
                  >
                    <span ref={loadMoreRef} />
                  </ArticleItem>
                );
              else return;
            }
          );
        })}
        {isFetchingNextPage && (
          <CircularProgress alignSelf="center" isIndeterminate size="28px" />
        )}
      </Flex>
    </Box>
  );
};

export default PromotedArticles;
