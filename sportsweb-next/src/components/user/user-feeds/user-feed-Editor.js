import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import createVideoPlugin from "@draft-js-plugins/video";
import createLinkifyPlugin from "@draft-js-plugins/linkify";
import createLinkDetectionPlugin from "draft-js-link-detection-plugin";
// import editorStyles from '../post/MyEditor.module.css';
import editorStyles from "../user-feeds/MyEditor.module.css";
import "@draft-js-plugins/mention/lib/plugin.css";
import "@draft-js-plugins/image/lib/plugin.css";
import "@draft-js-plugins/hashtag/lib/plugin.css";
import "@draft-js-plugins/linkify/lib/plugin.css";
import {
  Button,
  HStack,
  Box,
  Avatar,
  IconButton,
  Input,
  ButtonGroup,
  VStack,
  useToast,
} from "@chakra-ui/react";

import { useSearchByName, useUser } from "../../../hooks/user-hooks";
import { useCreateFeed, useUpdateFeed } from "../../../hooks/feed-hooks";
import { AddImageIcon, AddVideoIcon } from "../../ui/icons";
import { useCloudinaryUpload } from "../../../hooks/upload-hooks";
import { usePage } from "../../../hooks/page-hooks";
import { TextMedium } from "../../ui/text/text";
import {
  validateImage,
  validateVideo,
} from "../../../helper/constants/common-constants";
import SharedPost from "../../feed/shared-post";
// import mentions from "./mention";

const UserFeedEditor = (props) => {
  const {
    type,
    id,
    data: eventData,
    mode = "view",
    setMode,
    feed = null,
    pageId = null,
    onClose,
    addPhoto = null,
    addOnClose,
  } = props;
  const toast = useToast();
  const { data: userData = {} } = useUser();
  const { data: pageData = {} } = usePage(type === "company" && id);
  const { mutate: createMutate, isLoading: isCreateLoading } = useCreateFeed();
  const { mutate: updateMutate, isLoading: isUpdateLoading } = useUpdateFeed();
  const { mutate: searchMutate } = useSearchByName();
  const { mutate: uploadMutate, isLoading: isUploadLoading } =
    useCloudinaryUpload();
  const imageRef = useRef();
  const videoRef = useRef();

  const ref = useRef(null);

  useEffect(() => {
    if (addPhoto) {
      const insertImageForAddPhoto = (data, type) => {
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
        return AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          " "
        );
      };

      const handleImageForAddPhoto = (e) => {
        uploadMutate(
          { files: e.target.files },
          {
            onSuccess: (data) => {
              const image = Object.values(data)[0];
              const newEditorState = insertImageForAddPhoto(
                { ...image, src: image.url },
                "IMAGE"
              );
              setEditorState(newEditorState);
            },
          }
        );
      };

      handleImageForAddPhoto(addPhoto);
    }
  }, [addPhoto, editorState, uploadMutate]);

  const emptyContentState =
    mode === "edit"
      ? convertFromRaw(JSON.parse(feed["feed_content"]))
      : convertFromRaw({
          entityMap: {},
          blocks: [
            {
              text: "",
              key: "foo",
              type: "unstyled",
              entityRanges: [],
            },
          ],
        });

  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(emptyContentState)
    // EditorState.createEmpty()
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

  // For the video,hash,image,link plugin
  const imagePlugin = createImagePlugin();
  const hashtagPlugin = createHashtagPlugin();
  const videoPlugin = createVideoPlugin();
  const linkifyPlugin = createLinkifyPlugin();
  const linkDetectionPlugin = createLinkDetectionPlugin();

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(
    ({ value }) => {
      searchMutate(
        { search_text: value },
        {
          onSuccess: (data) => {
            // To link user or company in the mention
            // data = data.map((value) => ({
            //   ...value,
            //   link:
            //     value.type === "U" ? `/user/${value.id}` : `/pages/${value.id}`,
            // }));
            setSuggestions(defaultSuggestionsFilter(value, data));
          },
        }
      );
    },
    [searchMutate]
  );

  const handleImage = (e) => {
    const file = e.target.files[0];
    const { isValid, message } = validateImage(file);
    if (isValid)
      uploadMutate(
        { files: e.target.files },
        {
          onSuccess: (data) => {
            const image = Object.values(data)[0];
            const newEditorState = insertImageOrVideo(
              { ...image, src: image.url },
              "IMAGE"
            );
            setEditorState(newEditorState);
            // Object.values(data).map((image) => {
            //   const newEditorState = insertImage(image, "IMAGE");
            //   setEditorState(newEditorState);
            // });
          },
        }
      );
    else
      toast({
        title: "Your file can't be uploaded",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
  };

  const handleVideo = (e) => {
    const { types } = videoPlugin;
    const file = e.target.files[0];
    let accountTypes;
    if (type === "user") {
      accountTypes = userData.user_type;
    } else if (type === "company") {
      accountTypes = pageData.company_type_b;
    }

    const { isValid, message } = validateVideo(file, accountTypes);
    if (isValid)
      uploadMutate(
        { files: e.target.files },
        {
          onSuccess: (data) => {
            const video = Object.values(data)[0];
            const newEditorState = insertImageOrVideo(
              { ...video, src: video.url },
              types.VIDEOTYPE
            );
            setEditorState(newEditorState);
          },
        }
      );
    else
      toast({
        title: "Your file can't be uploaded",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
  };

  const insertImageOrVideo = (data, type) => {
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

  const handlePost = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    const mentionedUsersPages = [];
    const postPhotos = [];
    const postVideos = [];
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

      if (ent.type === videoPlugin.types.VIDEOTYPE) {
        const { src, ...data } = ent.data;
        postVideos.push(data);
      }
    }

    const newFeed = {
      feedData: raw,
      mentions: mentionedUsersPages,
      pics: postPhotos,
      videos: postVideos,
      hashTags: hastTags,
    };

    if (mode === "edit") {
      updateMutate(
        { ...newFeed, feedId: feed["feed_id"], type, id, pageId },
        {
          onSuccess: () => {
            onClose();
            setMode("view");
            toast({
              title: "Your post has been updated.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          },
        }
      );
    } else {
      const feedId = feed?.["feed_share"]?.["feed_id"] || feed?.["feed_id"];
      const isSharedFeed = Boolean(feedId);

      createMutate(
        {
          ...newFeed,
          type,
          id,
          pageId,
          feedId,
        },
        {
          onSuccess: () => {
            // setEditorState(EditorState.createEmpty());
            onClose();
            if (addPhoto) addOnClose();
            toast({
              title: `Your post has been ${
                isSharedFeed ? "shared" : "created"
              }.`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          },
        }
      );
    }
  };

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
      name: eventData.eventName,
      profileImage: eventData.eventLogo,
    };
  }

  return (
    <Box w="full" h="min-content" bg="white" borderRadius="10px">
      <VStack align="flex-start" spacing={5}>
        <HStack>
          <Avatar
            size="sm"
            name={feedContext.name}
            src={feedContext.profileImage}
          />
          <TextMedium>{feedContext.name}</TextMedium>
        </HStack>
        <Box
          className={editorStyles.editor}
          onClick={() => {
            ref.current.focus();
          }}
          w="100%"
          h={
            (mode === "view" || (mode === "edit" && !feed?.["feed_share"])) &&
            36
          }
          overflow="scroll"
        >
          <Editor
            editorKey={"editor"}
            editorState={editorState}
            onChange={setEditorState}
            plugins={[
              ...plugins,
              imagePlugin,
              linkifyPlugin,
              linkDetectionPlugin,
              hashtagPlugin,
              videoPlugin,
            ]}
            ref={ref}
            placeholder={`What's on your mind, ${feedContext.name}?`}
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
        </Box>
        {(mode === "view" || (mode === "edit" && !feed?.["feed_share"])) && (
          <>
            <Input
              type="file"
              display="none"
              // multiple
              ref={imageRef}
              onChange={handleImage}
            />
            <Input
              type="file"
              display="none"
              // multiple
              ref={videoRef}
              onChange={handleVideo}
            />
            <ButtonGroup variant="ghost" colorScheme="primary" spacing={2}>
              <IconButton
                icon={<AddImageIcon fontSize="22px" />}
                onClick={() => imageRef.current.click()}
              />

              {!addPhoto && (
                <IconButton
                  icon={<AddVideoIcon fontSize="22px" />}
                  onClick={() => videoRef.current.click()}
                />
              )}
            </ButtonGroup>
          </>
        )}

        {mode === "edit" && feed?.["feed_share"] && (
          <SharedPost feed={feed["feed_share"]} />
        )}
        {mode === "share" && feed && (
          <SharedPost feed={feed?.["feed_share"] || feed} />
        )}

        {(mode === "view" || mode === "share") && (
          <Button
            width="full"
            colorScheme="primary"
            onClick={handlePost}
            isLoading={isCreateLoading || isUploadLoading}
            disabled={
              mode === "share"
                ? isCreateLoading || isUploadLoading
                : isCreateLoading ||
                  isUploadLoading ||
                  !editorState.getCurrentContent().hasText()
            }
          >
            Post
          </Button>
        )}

        {mode === "edit" && (
          <Button
            width="full"
            colorScheme="primary"
            onClick={handlePost}
            isLoading={isUploadLoading || isUpdateLoading}
            disabled={
              feed?.["feed_share"]
                ? isUploadLoading || isUpdateLoading
                : isUploadLoading ||
                  isUpdateLoading ||
                  !editorState.getCurrentContent().hasText()
            }
          >
            Save
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default UserFeedEditor;
