import { useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  VStack,
  Center,
  CircularProgress,
  HStack,
  Avatar,
  Input,
  useDisclosure,
} from "@chakra-ui/react";

import FeedPost from "../../../feed/feed-post";
import { useIntersectionObserver } from "../../../../hooks/common-hooks";
import { useInfiniteFeed } from "../../../../hooks/feed-hooks";
import { usePage } from "../../../../hooks/page-hooks";
import { verifyPage } from "../../../../helper/constants/page-constants";
import ProfilePercentage from "../../../common/profile-percentage/profile-percentage";
import {
  useInfinitePageVideo,
  useInfinitePagePhoto,
} from "../../../../hooks/media-hooks";
import LatestPhotos from "../../../common/latest-photos";
import LatestVideos from "../../../common/latest-videos";
import PostModal from "../../../feed/post-modal";
import EmptyContentDisplay from "../../../common/empty-content/empty-content-display";

function UserHomepageview({ setTabIndex }) {
  const router = useRouter();
  const { pageId } = router.query;
  const loadMoreRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    data: feedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteFeed("company", pageId);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const { data: pageData = {} } = usePage(pageId);

  const { data: userPhoto = [] } = useInfinitePagePhoto(
    pageData?.["company_id"]
  );
  const { data: userVideo = [] } = useInfinitePageVideo(
    pageData?.["company_id"]
  );
  const latestVideosCount = userVideo?.pages && userVideo?.pages[0]?.totalCount;
  const { percentage } = verifyPage(pageData);

  return (
    <>
      <Center>
        <Flex gap={2} w="100%">
          <Box w={{ base: "full", lg: "65%" }}>
            {/* <Box w="100%" h="56" bg="white">
              <Flex gap={2} align="center">
                <Box>
                  <BiChevronLeftCircle
                    size={30}
                    color="#2F80ED"
                    cursor="pointer"
                  />
                </Box>
                <VStack align="stretch" ml={5} mt={5} gap={4}>
                  <Heading fontSize={20} w="80">
                    Who is the Best batsman?
                  </Heading>
                  <Radio size="md" name="1" colorScheme="green">
                    Radio
                  </Radio>
                  <Radio size="md" name="1" colorScheme="green">
                    Radio
                  </Radio>
                  <Link color="blue.400">Edit Poll</Link>
                </VStack>
                <Box mt={15} ml={370}>
                  <BiChevronRightCircle
                    size={30}
                    color="#2F80ED"
                    cursor="pointer"
                  />
                </Box>
              </Flex>
            </Box> */}

            <HStack w="full" bg="white" p={5} borderRadius="10px" spacing={4}>
              <Avatar
                size="sm"
                name={pageData["company_name"]}
                src={pageData["company_profile_img"]}
              />
              <Input
                variant="filled"
                borderRadius="10px"
                placeholder={`What's on your mind, ${pageData["company_name"]}?`}
                readOnly
                cursor="pointer"
                onClick={onOpen}
                _focus={{ bg: "gray.100", borderColor: "primary.500" }}
              />
            </HStack>
            <PostModal
              isOpen={isOpen}
              onClose={onClose}
              type="company"
              id={pageId}
            />

            <VStack mt={3} spacing={5}>
              {isLoading
                ? "Loading..."
                : error
                ? "An error has occurred: " + error.message
                : feedData?.pages?.map((page) => {
                    return page?.content?.map((feed) => (
                      <FeedPost
                        key={feed["feed_id"]}
                        feed={feed}
                        queryKey={["company-feeds"]}
                        type="company"
                        id={pageData?.["company_id"]}
                      />
                    ));
                  })}

              <span ref={loadMoreRef} />
              {isFetchingNextPage && (
                <CircularProgress
                  alignSelf="center"
                  isIndeterminate
                  size="24px"
                />
              )}
            </VStack>

            {feedData?.pages[0]?.totalCount === 0 && (
              <EmptyContentDisplay displayText="No posts to display" />
            )}
          </Box>
          <Flex
            gap={3}
            direction="column"
            w="35%"
            display={{ base: "none", lg: "flex" }}
            // mt={4}
          >
            {/* <VStack
              bg="white"
              w="full"
              h="max-content"
              align="flex-start"
              p={4}
              borderRadius={10}
            >
              <Text fontWeight="500" fontSize="14px" textAlign="left">
                Upcoming Events
              </Text>
              <Box>
                <VStack
                  divider={<StackDivider borderColor="gray.200" />}
                  spacing={4}
                  align="stretch"
                >
                  <Box>
                    <Flex gap={10}>
                      <Image
                        boxSize="80px"
                        objectFit="cover"
                        src="https://bit.ly/dan-abramov"
                        alt="Dan Abramov"
                        borderRadius={10}
                      />
                      <VStack>
                        <Heading size={10}>Description Goes Here</Heading>
                        <Text fontSize={14}>09:00 AM to 03:00 PM</Text>
                        <Button colorScheme="blue" w="32" borderRadius="none">
                          Enroll
                        </Button>
                      </VStack>
                    </Flex>
                  </Box>
                  <Box>
                    <Flex gap={10}>
                      <Image
                        boxSize="80px"
                        objectFit="cover"
                        src="https://bit.ly/dan-abramov"
                        alt="Dan Abramov"
                        borderRadius={10}
                      />
                      <VStack>
                        <Heading size={10}>Description Goes Here</Heading>
                        <Text fontSize={14}>09:00 AM to 03:00 PM</Text>
                        <Button colorScheme="blue" w="32" borderRadius="none">
                          Enroll
                        </Button>
                      </VStack>
                    </Flex>
                  </Box>
                </VStack>
              </Box>
            </VStack> */}
            {/*  <VStack
              bg="white"
              w="full"
              h="min-content"
              p={10}
              align="flex-start"
              borderRadius={10}
            >
              <Text fontWeight="bold" fontSize={16}>
                Are you interested to sponsor?
              </Text>
              <Button
                colorScheme="blue"
                variant="outline"
                borderRadius="none"
                w="28"
              >
                yes
              </Button>
            </VStack> */}
            <ProfilePercentage
              percentage={percentage}
              type="page"
              pageId={pageId}
              setTabIndex={setTabIndex}
            />
            <LatestPhotos
              media={userPhoto}
              type="page"
              setTabIndex={setTabIndex}
            />
            {latestVideosCount > 0 && (
              <LatestVideos
                media={userVideo}
                type="page"
                setTabIndex={setTabIndex}
              />
            )}
          </Flex>
        </Flex>
      </Center>
    </>
  );
}

export default UserHomepageview;
