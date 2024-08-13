import { useInfiniteUserArticles } from "../../../hooks/article-hooks";
import { useRouter } from "next/router";
import { EditIcon } from "../../ui/icons";
import {
  Box,
  HStack,
  VStack,
  Button,
  Image,
  CircularProgress,
  Flex,
} from "@chakra-ui/react";
import Skeleton from "../../ui/skeleton";
import { HeadingMedium } from "../../ui/heading/heading";
import { TextSmall } from "../../ui/text/text";
import { format } from "date-fns";
import { useRef } from "react";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useUser } from "../../../hooks/user-hooks";
import EmptyContentDisplay from "../../common/empty-content/empty-content-display";

function UserArticlesInfinite() {
  const router = useRouter();
  const { data: userData = {} } = useUser();
  const {
    data: userArticles = {},
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteUserArticles(userData?.user_id);
  const loadMoreRef = useRef();
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  const userArticlesCount =
    userArticles?.pages && userArticles?.pages?.[0]?.totalCount;
  return (
    <VStack
      w="full"
      mt={userArticlesCount > 0 ? 7 : 0}
      spacing={8}
      p={userArticlesCount > 0 ? 4 : 0}
      align="flex-start"
      minH="100vh"
    >
      {userArticles && isLoading ? (
       <Skeleton></Skeleton>
      ) : error ? (
        "An error has occurred: " + error.message
      ) : (
        <>
          {userArticles?.pages?.map((page, idx) => {
            return page?.content?.map(
              ({
                article_publish_status,
                cover_image_url_meta,
                article_id,
                article_heading,
                updated_date,
              }) => {
                return (
                  <Box w="full" key={article_id}>
                    <Box
                      backgroundColor="white"
                      borderRadius="10px"
                      position="relative"
                    >
                      {cover_image_url_meta ? (
                        <Image
                          h="120px"
                          w="full"
                          src={cover_image_url_meta?.url}
                          objectFit="cover"
                          alt="article-cover-image"
                          borderTopRadius="10px"
                        />
                      ) : (
                        <Box
                          h="120px"
                          w="full"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          bgColor="gray.300"
                          borderTopRadius="10px"
                        ></Box>
                      )}
                      <Button
                        variant="outline"
                        colorScheme="primary"
                        backgroundColor="white"
                        position="absolute"
                        top="20px"
                        right="20px"
                        leftIcon={<EditIcon s />}
                        onClick={() =>
                          router.push(`/user/articles/${article_id}`)
                        }
                      >
                        Edit
                      </Button>
                    </Box>

                    <VStack
                      align="flex-start"
                      bg="white"
                      p={5}
                      border="1px solid gray"
                      borderBottomRadius={10}
                    >
                      <HeadingMedium
                        cursor="pointer"
                        onClick={() => router.push(`/article/${article_id}`)}
                      >
                        {article_heading}
                      </HeadingMedium>
                      <HStack width="full" justifyContent="space-between">
                        <TextSmall>
                          Status:
                          {article_publish_status === "DRT"
                            ? " Draft"
                            : " Published"}
                        </TextSmall>
                        <TextSmall>
                          Last Updated:{" "}
                          {format(new Date(updated_date), "d-MMM-yyyy")}
                        </TextSmall>
                      </HStack>
                    </VStack>
                  </Box>
                );
              }
            );
          })}
          <span ref={loadMoreRef} />
          {isFetchingNextPage && (
            <CircularProgress alignSelf="center" isIndeterminate size="28px" />
          )}
        </>
      )}
      {userArticles?.pages && userArticles?.pages[0]?.totalCount === 0 && (
        <Box bgColor="white" px={5} py={3} borderRadius={10}>
          <EmptyContentDisplay displayText="No Articles to Display" />
        </Box>
      )}
    </VStack>
  );
}

export default UserArticlesInfinite;
