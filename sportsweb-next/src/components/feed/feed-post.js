import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { formatDistance } from "date-fns";

import { CommentIcon, FillLikeIcon, MenuDots, ShareIcon } from "../ui/icons";
import { useUser } from "../../hooks/user-hooks";
import { usePage } from "../../hooks/page-hooks";
import PostLikesPopover from "./post-likes-popover";
import ViewLikesModal from "./view-likes-modal";
import CommentEditor from "./comment-editor";
import ViewComments from "./view-comments";
import PostModal from "./post-modal";
import { TextMedium, TextSmall, TextXtraSmall } from "../ui/text/text";
import DeletePostModal from "./delete-post-modal";
import SharedPost from "./shared-post";
import {
  feedOptions,
  getFeedCaption,
} from "../../helper/constants/feed-constants";
import SocialMediaSharePost from "../common/social-media-share-post";
import styles from "./feed-post.module.css";

const FeedPost = (props) => {
  const {
    feed,
    queryKey,
    visibility = "private",
    type,
    id,
    pageId,
    data: eventData,
  } = props;
  let feedHtml;
  if (feed["feed_content"]) {
    const contentState = convertFromRaw(JSON.parse(feed["feed_content"]));
    feedHtml = stateToHTML(contentState, feedOptions);
  } else {
    feedHtml = feed["feed_content_html"];
  }

  // const raw = JSON.parse(feed["feed_content"]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditPostOpen,
    onOpen: onEditPostOpen,
    onClose: onEditPostClose,
  } = useDisclosure();
  const {
    isOpen: isSharePostOpen,
    onOpen: onSharePostOpen,
    onClose: onSharePostClose,
  } = useDisclosure();
  const {
    isOpen: isDeletePostOpen,
    onOpen: onDeletePostOpen,
    onClose: onDeletePostClose,
  } = useDisclosure();
  const { data: userData = {} } = useUser();
  const { data: pageData = {} } = usePage(type === "company" && id);

  const [showComments, setShowComments] = useState(false);
  const {
    share_count,
    like_count,
    comment_count,
    user,
    company,
    event,
    updated_date,
  } = feed;
  const postTime = formatDistance(new Date(updated_date), new Date(), {
    addSuffix: true,
  });
  const [mode, setMode] = useState("view");

  let feedCreator;
  if (user) {
    feedCreator = {
      ...user,
      name: `${user["first_name"]} ${user["last_name"]}`,
      profileImage: user["user_profile_img"],
      url: `/user/profile/${user["user_id"]}`,
    };
  } else if (event) {
    feedCreator = {
      ...event,
      name: event["event_name"],
      profileImage: event["event_logo"],
      url: `/events/${event["event_id"]}`,
    };
  } else {
    feedCreator = {
      ...company,
      name: company["company_name"],
      profileImage: company["company_profile_img"],
      url: `/page/${company["company_id"]}`,
    };
  }

  /* const findArticle = (raw) => {
    for (let key in raw.entityMap) {
      if (raw.entityMap[key].type === "LINK") {
        if (raw.entityMap[key].data.url.split("/").includes("article"))
          return true;
      }
    }
    return false;
  };
  const findEvent = (raw) => {
    for (let key in raw.entityMap) {
      if (raw.entityMap[key].type === "LINK") {
        if (raw.entityMap[key].data.url.split("/").includes("events"))
          return true;
      }
    }
    return false;
  }; */

  const isFeedCreator =
    type === "event"
      ? feed["event_id"] === id
      : feed[`feed_creator_${type}_id`] === id;

  let feedContext;
  if (type === "user") {
    feedContext = {
      name: userData["full_name"],
      profileImage: userData["user_profile_img"],
    };
  } else if (type === "company") {
    feedContext = {
      name: pageData["company_name"],
      profileImage: pageData["company_profile_img"],
    };
  } else {
    feedContext = {
      name: eventData["event_name"],
      profileImage: eventData["event_logo"],
    };
  }

  return (
    <Box
      p={5}
      bg="white"
      w="full"
      borderRadius="10px"
      border="1px solid"
      borderColor="gray.200"
    >
      <Grid templateColumns="max-content 1fr" rowGap={3} columnGap={4}>
        <GridItem alignSelf="center">
          <Avatar
            size="sm"
            name={feedCreator.name}
            src={feedCreator.profileImage}
          />
        </GridItem>
        <GridItem>
          <HStack justify="space-between" align="flex-start">
            <Box>
              <TextSmall>
                <Link href={feedCreator.url}>{feedCreator.name}</Link>
                {getFeedCaption(feed)}
              </TextSmall>
              {/* {feed["feed_type"] === "AL" && (
                  <TextSmall>
                    added photos to album {`"${feed["search_tags"][0]}"`}
                  </TextSmall>
              )} */}
              <TextXtraSmall color="gray.500">{postTime}</TextXtraSmall>
            </Box>
            {isFeedCreator && (
              <>
                <Menu placement="bottom-end">
                  <MenuButton
                    as={IconButton}
                    icon={<MenuDots />}
                    bg="none"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setMode("edit");
                        onEditPostOpen();
                      }}
                    >
                      Edit Post
                    </MenuItem>
                    <MenuItem onClick={onDeletePostOpen}>Delete Post</MenuItem>
                  </MenuList>
                </Menu>
                <DeletePostModal
                  isOpen={isDeletePostOpen}
                  onClose={onDeletePostClose}
                  feedId={feed["feed_id"]}
                  type={type}
                />
              </>
            )}
          </HStack>
        </GridItem>
        <GridItem display={{ base: "none", md: "revert" }} />
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Box
            py={2}
            className={styles.box}
            dangerouslySetInnerHTML={{ __html: feedHtml }}
          />
          {feed["feed_share"] && <SharedPost feed={feed["feed_share"]} />}
          {mode === "edit" && (
            <PostModal
              isOpen={isEditPostOpen}
              onClose={onEditPostClose}
              type={type}
              id={id}
              mode={mode}
              setMode={setMode}
              feed={feed}
              pageId={pageId}
              data={eventData}
            />
          )}
          {mode === "share" && (
            <PostModal
              isOpen={isSharePostOpen}
              onClose={onSharePostClose}
              type={type}
              id={id}
              mode={mode}
              setMode={setMode}
              feed={feed}
              pageId={pageId}
              data={eventData}
            />
          )}
        </GridItem>
        {Boolean(like_count || comment_count || share_count) && (
          <>
            <GridItem colSpan={2}>
              <Divider ml={-5} mr={-5} w="auto" />
            </GridItem>
            <GridItem display={{ base: "none", md: "revert" }} />
            <GridItem
              display="flex"
              alignItems="center"
              colSpan={{ base: 2, md: 1 }}
            >
              {Boolean(like_count) && (
                <>
                  {isOpen && (
                    <ViewLikesModal
                      isOpen={isOpen}
                      onClose={onClose}
                      feedId={feed["feed_id"]}
                    />
                  )}
                  <Button
                    variant="link"
                    fontSize="sm"
                    fontWeight="normal"
                    color="gray.500"
                    onClick={onOpen}
                    minW={0}
                  >
                    <Icon
                      as={FillLikeIcon}
                      rounded="full"
                      bg="primary.500"
                      color="white"
                      h={6}
                      w={6}
                      p={1}
                    />
                    <TextMedium ml={2}>{like_count}</TextMedium>
                  </Button>
                </>
              )}

              <Flex gap={5} ml="auto">
                {Boolean(comment_count) && (
                  <Button
                    variant="link"
                    fontSize="sm"
                    fontWeight="normal"
                    color="gray.500"
                    onClick={() => setShowComments(!showComments)}
                  >
                    {comment_count} comments
                  </Button>
                )}
                {Boolean(share_count) && (
                  <TextSmall color="gray.500">{share_count} shares</TextSmall>
                )}
              </Flex>
            </GridItem>
          </>
        )}

        {visibility === "private" && (
          <>
            <GridItem colSpan={2}>
              <Divider ml={-5} mr={-5} w="auto" />
            </GridItem>
            <GridItem display={{ base: "none", md: "revert" }} />
            <GridItem display="flex" gap={[2, 10]} colSpan={{ base: 2, md: 1 }}>
              <PostLikesPopover
                feedId={feed["feed_id"]}
                userLike={feed["like"]}
                queryKey={queryKey}
                type={type}
                id={id}
              />

              <Button size="sm" variant="ghost">
                <Icon as={CommentIcon} h={5} w={5} />
                <TextSmall ml={2} fontWeight="normal">
                  Comment
                </TextSmall>
              </Button>
              <SocialMediaSharePost
                content={`${feedCreator.name}'s Post`}
                fbHashtag={"#kridas"}
                twitterHashtags={["kridas", "post", "social_media"]}
                twitterMention="kridas_sports"
                redirectPath={`/post/${feed["feed_id"]}`}
                handleShare={() => {
                  setMode("share");
                  onSharePostOpen();
                }}
              />
            </GridItem>
            <GridItem colSpan={2}>
              <Divider ml={-5} mr={-5} w="auto" />
            </GridItem>
            <GridItem display={{ base: "none", md: "revert" }} />
            <GridItem colSpan={{ base: 2, md: 1 }}>
              {Boolean(comment_count) && showComments && (
                <ViewComments
                  showComments={showComments}
                  setShowComments={setShowComments}
                  feed={feed}
                  type={type}
                  id={id}
                  queryKey={queryKey}
                />
              )}
              {Boolean(comment_count) && !showComments && (
                <Button
                  fontWeight="normal"
                  variant="link"
                  colorScheme="primary"
                  onClick={() => setShowComments(true)}
                >
                  View comments
                </Button>
              )}
              <Box display="flex" alignItems="center" gap={4} mt={3}>
                <Avatar
                  size="sm"
                  name={feedContext.name}
                  src={feedContext.profileImage}
                />
                <CommentEditor
                  feedId={feed["feed_id"]}
                  queryKey={queryKey}
                  type={type}
                  id={id}
                />
              </Box>
            </GridItem>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default FeedPost;
