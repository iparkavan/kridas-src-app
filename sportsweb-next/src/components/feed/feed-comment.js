import { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import { TextMedium } from "../ui/text/text";
import { MenuDots } from "../ui/icons";
import PostLikesPopover from "./post-likes-popover";
import { useDeleteComment } from "../../hooks/comment-hooks";
import CommentEditor from "./comment-editor";

const FeedComment = (props) => {
  const { comment, feed, type, id, queryKey } = props;
  const { mutate, isLoading } = useDeleteComment();
  const contentState = convertFromRaw(JSON.parse(comment.contents));
  const [mode, setMode] = useState("view");

  const options = {
    entityStyleFn: (entity) => {
      const entityType = entity.get("type");
      if (entityType === "mention") {
        const data = entity.getData();
        const href =
          data.mention.type === "U"
            ? `/user/profile/${data.mention.id}`
            : `/page/${data.mention.id}`;
        return {
          element: "a",
          attributes: {
            href: href,
          },
          style: {
            color: "var(--chakra-colors-primary-500)",
          },
        };
      }
    },
  };

  const commentHtml = stateToHTML(contentState, options);

  let href;
  if (comment.detail.type === "U") {
    href = `/user/profile/${comment.detail.id}`;
  } else if (comment.detail.type === "C") {
    href = `/page/${comment.detail.id}`;
  } else {
    href = `/events/${comment.detail.id}`;
  }

  const handleDelete = () => {
    mutate({
      commentId: comment["comment_id"],
      feedId: feed["feed_id"],
      type,
      queryKey,
    });
  };

  return (
    <HStack alignItems="flex-start" spacing={4}>
      <Avatar
        size="sm"
        name={comment.detail.name}
        src={comment.detail.avatar}
      />
      {mode === "view" ? (
        <Box
          px={4}
          py={2}
          bg="gray.100"
          borderRadius="10px"
          position="relative"
        >
          <Flex justifyContent="space-between">
            <Link href={href}>{comment.detail.name}</Link>
            {comment[`${type}_id`] === id && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MenuDots />}
                  isLoading={isLoading}
                  bg="none"
                  size="xs"
                  ml={5}
                />
                <MenuList zIndex={3}>
                  <MenuItem onClick={() => setMode("edit")}>
                    Edit Comment
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>Delete Comment</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
          <TextMedium
            color="gray.600"
            dangerouslySetInnerHTML={{ __html: commentHtml }}
          />
        </Box>
      ) : (
        <Box w="full">
          <CommentEditor
            mode={mode}
            setMode={setMode}
            feedId={feed["feed_id"]}
            queryKey={queryKey}
            comment={comment}
            type={type}
            id={id}
          />
        </Box>
      )}
    </HStack>
  );
};

export default FeedComment;
