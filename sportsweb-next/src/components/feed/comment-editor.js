import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  AtomicBlockUtils,
} from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import createImagePlugin from "@draft-js-plugins/image";
import createHashtagPlugin, {
  extractHashtagsWithIndices,
} from "@draft-js-plugins/hashtag";
import editorStyles from "./comment-editor.module.css";
import "draft-js/dist/Draft.css";
import "@draft-js-plugins/mention/lib/plugin.css";
import "@draft-js-plugins/image/lib/plugin.css";
import "@draft-js-plugins/hashtag/lib/plugin.css";
import {
  Box,
  Button,
  IconButton,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";

import { useSearchByName } from "../../hooks/user-hooks";
import { AddImageIcon, SubmitIcon } from "../ui/icons";
import { useCloudinaryUpload } from "../../hooks/upload-hooks";
import { useCreateComment, useUpdateComment } from "../../hooks/comment-hooks";
// import mentions from "./mention";

const CommentEditor = (props) => {
  const { mode = "view", setMode, comment, feedId, queryKey, type, id } = props;
  const { mutate: createMutate, isLoading: isCreateLoading } =
    useCreateComment();
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdateComment();
  const { mutate: searchMutate } = useSearchByName();
  const { mutate: uploadMutate, isLoading: isUploadLoading } =
    useCloudinaryUpload();
  const imageRef = useRef();

  const submitButtonSize = useBreakpointValue({
    base: "sm",
    md: "md",
  });

  const ref = useRef(null);
  const [editorState, setEditorState] = useState(() =>
    mode === "view"
      ? EditorState.createEmpty()
      : EditorState.createWithContent(
          convertFromRaw(JSON.parse(comment.contents))
        )
  );
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      supportWhitespace: true,
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  // For the hashtag & image plugin
  const imagePlugin = createImagePlugin();
  const hashtagPlugin = createHashtagPlugin();

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(
    ({ value }) => {
      searchMutate(
        { search_text: value },
        {
          onSuccess: (data) => {
            setSuggestions(defaultSuggestionsFilter(value, data));
          },
        }
      );
    },
    [searchMutate]
  );

  const handleImage = (e) => {
    uploadMutate(
      { files: e.target.files },
      {
        onSuccess: (data) => {
          const image = Object.values(data)[0];
          const newEditorState = insertImage(
            { ...image, src: image.url },
            "IMAGE"
          );
          setEditorState(newEditorState);
        },
      }
    );
  };

  const insertImage = (data, type) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      type,
      "IMMUTABLE",
      { ...data }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  };

  const handleComment = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    const mentionedUsersPages = [];
    const postPhotos = [];
    let hastTags = [];

    for (let key in raw.blocks) {
      const block = raw.blocks[key];
      hastTags = [...hastTags, ...extractHashtagsWithIndices(block.text)];
    }

    for (let key in raw.entityMap) {
      const ent = raw.entityMap[key];
      if (ent.type === "mention") {
        mentionedUsersPages.push(ent.data.mention);
      }

      if (ent.type === "IMAGE") {
        const { src, ...data } = ent.data;
        postPhotos.push(data);
      }
    }

    const feed = {
      commentData: raw,
      mentions: mentionedUsersPages,
      pics: postPhotos,
      hashTags: hastTags,
    };

    if (mode === "edit") {
      updateMutate(
        {
          ...feed,
          commentId: comment["comment_id"],
          feedId,
          queryKey,
          type,
          id,
        },
        {
          onSuccess: () => setMode("view"),
        }
      );
    } else {
      createMutate(
        { ...feed, feedId, queryKey, type, id },
        {
          onSuccess: () => setEditorState(EditorState.createEmpty()),
        }
      );
    }
  };
  return (
    <>
      <Box
        w="full"
        h="min-content"
        bg="white"
        display="flex"
        alignItems="center"
        gap={5}
      >
        <Box
          className={editorStyles.editor}
          onClick={() => {
            ref.current.focus();
          }}
          w="100%"
          overflow="scroll"
          position="relative"
        >
          <Editor
            editorKey={"editor"}
            editorState={editorState}
            onChange={setEditorState}
            plugins={[...plugins, imagePlugin, hashtagPlugin]}
            ref={ref}
            placeholder="Write a comment"
          />
          <MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions}
            onSearchChange={onSearchChange}
            onAddMention={() => {
              // get the mention object selected
            }}
          />
          <Input
            type="file"
            display="none"
            ref={imageRef}
            onChange={handleImage}
          />
          <IconButton
            size="sm"
            icon={<AddImageIcon fontSize="16px" />}
            position="absolute"
            bottom="2px"
            right={0}
            variant="ghost"
            colorScheme="primary"
            zIndex={2}
            onClick={() => imageRef.current.click()}
          />
        </Box>

        <IconButton
          size={submitButtonSize}
          icon={<SubmitIcon fontSize="22px" />}
          colorScheme="primary"
          variant="outline"
          isLoading={isCreateLoading || isUploadLoading || isUpdateLoading}
          onClick={handleComment}
          disabled={!editorState.getCurrentContent().hasText()}
        />
      </Box>
      {mode === "edit" && (
        <Button
          variant="link"
          size="xs"
          fontWeight="normal"
          color="revert"
          onClick={() => setMode("view")}
          disabled={isUploadLoading}
        >
          Cancel
        </Button>
      )}
    </>
  );
};

export default CommentEditor;
