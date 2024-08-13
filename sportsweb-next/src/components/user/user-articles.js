import { useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  HStack,
  VStack,
  // Tabs,
  // TabList,
  // TabPanels,
  // Tab,
  // TabPanel,
  SimpleGrid,
  Checkbox,
  Input,
  GridItem,
  CircularProgress,
  Flex,
  Box,
} from "@chakra-ui/react";
import UserLayout from "../layout/user-layout/user-layout";
import BreadcrumbList from "../ui/breadcrumb/breadcrumb-list";
import routes from "../../helper/constants/route-constants";
import { HeadingSmall } from "../ui/heading/heading";
import { TextSmall } from "../ui/text/text";
import { ArticleIcon, SearchBlueIcon } from "../ui/icons";
import { useInfiniteAllArticles } from "../../hooks/article-hooks";
import { useUser } from "../../hooks/user-hooks";
import Button from "../ui/button";
import { useIntersectionObserver } from "../../hooks/common-hooks";
import Skeleton from "../ui/skeleton";
import ArticleCard from "../common/article/article-card";
import EmptyContentDisplay from "../common/empty-content/empty-content-display";

const UserArticles = () => {
  const router = useRouter();
  const { data: userData = {} } = useUser();
  const [searchText, setSearchText] = useState("");
  const [myArticles, setMyArticles] = useState(false);

  const {
    data: articles = {},
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteAllArticles({
    searchText,
    ...(myArticles && { user_id: userData.user_id }),
  });

  const loadMoreRef = useRef();
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const handleCreateArticle = () => {
    router.push(routes.userArticleCreate);
  };

  const fetchedArticlesCount =
    (articles?.pages && articles?.pages[0]?.totalCount) || 0;

  return (
    <UserLayout>
      <VStack alignItems="flex-start" gap={3}>
        <BreadcrumbList
          rootRoute={routes.profile(userData["user_name"])}
          rootPageName={userData["full_name"]}
          currentPageName="Articles"
        />
        <HStack
          spacing={0}
          gap={10}
          bgColor="white"
          width="full"
          px={5}
          py={3}
          borderRadius={10}
          justifyContent="space-between"
        >
          <HStack spacing={3} display={{ base: "none", lg: "inherit" }}>
            <HeadingSmall>My Articles</HeadingSmall>
            <Checkbox
              value={myArticles}
              onChange={(e) => setMyArticles(e.target.checked)}
            />
          </HStack>

          <Flex gap={4}>
            <Button
              display={{ base: "none", lg: "initial" }}
              minW="auto"
              leftIcon={<ArticleIcon />}
              onClick={handleCreateArticle}
            >
              Create Article
            </Button>
            <Button
              display={{ lg: "none" }}
              minW="auto"
              colorScheme="primary"
              leftIcon={<ArticleIcon />}
              onClick={handleCreateArticle}
            >
              Create Article
            </Button>
            <Input
              type="search"
              placeholder="Search Articles"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Flex>
        </HStack>
        <SimpleGrid
          p={7}
          bg="white"
          borderRadius="lg"
          w="full"
          columns={{ base: 1, lg: 4 }}
          spacing={10}
        >
          <HStack display={{ lg: "none" }}>
            <Checkbox
              value={myArticles}
              onChange={(e) => setMyArticles(e.target.checked)}
            >
              My Articles
            </Checkbox>
          </HStack>

          {searchText && (
            <GridItem colSpan={4} justifySelf="center">
              <HStack>
                <SearchBlueIcon />
                {isLoading ? (
                  <TextSmall>Fetching..</TextSmall>
                ) : (
                  <TextSmall>
                    <strong>{fetchedArticlesCount + " "}</strong> results found
                  </TextSmall>
                )}
              </HStack>
            </GridItem>
          )}

          {isLoading ? (
            <GridItem colSpan={4}>
              <Skeleton />
            </GridItem>
          ) : error ? (
            "An error has occurred: " + error.message
          ) : fetchedArticlesCount === 0 ? (
            <GridItem colSpan={{ base: 1, lg: 4 }}>
              <EmptyContentDisplay p={0} displayText="No Articles to display" />
            </GridItem>
          ) : (
            articles?.pages?.map((page) => {
              return page?.content?.map((articleData) => {
                return (
                  <GridItem key={articleData.article_id} w="full">
                    <ArticleCard
                      articleData={articleData}
                      myArticles={myArticles}
                    />
                  </GridItem>
                );
              });
            })
          )}
          <GridItem colSpan={{ base: 1, lg: 4 }}>
            <span ref={loadMoreRef} />
          </GridItem>
          {isFetchingNextPage && (
            <GridItem colSpan={{ base: 1, lg: 4 }} justifySelf="center">
              <CircularProgress isIndeterminate size="28px" />
            </GridItem>
          )}
        </SimpleGrid>
        {/* <Tabs isLazy w="full" bgColor="white" borderRadius={10} p={3} defaultIndex={1}>
          <TabList mb="1em" gap={[2, 6, 12]}>
            <Tab
              w="max-content"
              fontWeight="500"
              color="#515365"
              fontSize="16"
              _selected={selectedTab}
              _focus={{ boxShadow: "none" }}
            >
              My Articles  {userArticlesCount>0 && `(${userArticlesCount})`}
            </Tab>
            <Tab
              w="max-content"
              fontWeight="500"
              color="#515365"
              fontSize="16"
              _selected={selectedTab}
              _focus={{ boxShadow: "none" }}
            >
              All Articles  {articlesCount && `(${articlesCount})`}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <UserArticlesInfinite />
            </TabPanel>
            <TabPanel p={0}>
              <PublishedArticles articleCount={articlesCount} />
              </TabPanel>
              </TabPanels>
            </Tabs> */}
      </VStack>
    </UserLayout>
  );
};

export default UserArticles;
