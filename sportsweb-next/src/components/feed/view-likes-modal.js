import { useRef, useState } from "react";
import {
  Avatar,
  AvatarBadge,
  CircularProgress,
  HStack,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  getLikeColor,
  getLikeIcon,
} from "../../helper/constants/like-constants";
import { useIntersectionObserver } from "../../hooks/common-hooks";
import { useInfiniteFeedLikes } from "../../hooks/like-hooks";

const ViewLikesModal = ({ isOpen, onClose, feedId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const loadMoreRef = useRef();

  const [currentLikeType, setCurrentLikeType] = useState("all");

  const {
    data: likesData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteFeedLikes({
    feed_id: feedId,
    like_type: currentLikeType === "all" ? null : currentLikeType,
  });

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const getLikeLabel = (likeType, count = null) => {
    switch (likeType) {
      case "all":
        return "All";
      case "like":
      case "love":
        return (
          <>
            <Icon
              as={getLikeIcon(likeType)}
              rounded="full"
              bg={getLikeColor(likeType)}
              color="white"
              h={6}
              w={6}
              p={1}
            />
            {count && <Text ml={1}>{count}</Text>}
          </>
        );
      case "care":
      case "haha":
      case "wow":
      case "sad":
      case "angry":
        return (
          <Text>
            {getLikeIcon(likeType)} {count}
          </Text>
        );
    }
  };

  const sortedLikes =
    likesData &&
    Object.keys(likesData?.pages[0]?.count)
      ?.reduce((filtered, likeType) => {
        const count = likesData.pages[0].count[likeType];
        if (count > 0) {
          filtered.push({
            likeType,
            count,
          });
        }
        return filtered;
      }, [])
      .sort((a, b) => b.count - a.count);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Tabs
            index={tabIndex}
            onChange={(index) => {
              setTabIndex(index);
              setCurrentLikeType(sortedLikes[index].likeType);
            }}
          >
            <TabList>
              {isLoading
                ? "Loading..."
                : error
                ? "An error has occurred: " + error.message
                : sortedLikes?.map(({ likeType, count }) => {
                    return (
                      <Tab
                        key={likeType}
                        color={getLikeColor(likeType)}
                        _selected={{
                          borderBottomColor:
                            getLikeColor(likeType) || "primary.600",
                        }}
                        _focus={{ boxShadow: "none" }}
                      >
                        {getLikeLabel(likeType, count)}
                      </Tab>
                    );
                  })}
            </TabList>
          </Tabs>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={0}>
          <Tabs index={tabIndex}>
            <TabPanels>
              {sortedLikes?.map((sortedLike) => (
                <TabPanel key={sortedLike.likeType}>
                  <VStack alignItems="flex-start" spacing={4}>
                    {isLoading
                      ? "Loading..."
                      : error
                      ? "An error has occurred: " + error.message
                      : likesData?.pages?.map((page) => {
                          return page?.content?.map((like) => {
                            let href;
                            if (like.detail.type === "U") {
                              href = `/user/profile/${like.detail.id}`;
                            } else if (like.detail.type === "C") {
                              href = `/page/${like.detail.id}`;
                            } else {
                              href = `/events/${like.detail.id}`;
                            }
                            return (
                              <HStack key={like["like_id"]} spacing={5}>
                                <Avatar
                                  name={like.detail.name}
                                  src={like.detail.avatar}
                                >
                                  <AvatarBadge boxSize="1.25em" bg="white">
                                    {getLikeLabel(like["like_type"])}
                                  </AvatarBadge>
                                </Avatar>
                                <Link href={href}>{like.detail.name}</Link>
                              </HStack>
                            );
                          });
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
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewLikesModal;
