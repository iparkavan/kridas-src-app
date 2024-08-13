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
// import editorStyles from '../post/MyEditor.module.css';
import editorStyles from "./static-toolbar-editor.module.css";
import "@draft-js-plugins/mention/lib/plugin.css";
import "@draft-js-plugins/image/lib/plugin.css";
import "@draft-js-plugins/hashtag/lib/plugin.css";
import {
  Button,
  HStack,
  Box,
  Avatar,
  IconButton,
  Input,
  ButtonGroup,
} from "@chakra-ui/react";
import { useSearchByName, useUser } from "../../../hooks/user-hooks";
import { AddImageIcon, AddVideoIcon, AttachmentIcon } from "../../ui/icons";
import { useCloudinaryUpload } from "../../../hooks/upload-hooks";
import { usePage } from "../../../hooks/page-hooks";
import {
  useCreateArticle,
  useCreateArticleFeed,
} from "../../../hooks/article-hooks";
import { useRouter } from "next/router";
import routes from "../../../helper/constants/route-constants";
import { useToast } from "@chakra-ui/react";
import { MdElectricalServices } from "react-icons/md";

const ArticleFeedEditor = (props) => {
  const router = useRouter();
  const {
    type,
    id,
    feedContent = null,
    onClose,
    articleData,
    coverImage,
    coverImageMetaData = null,
    articleId = null,
    request = null,
  } = props;

  const toast = useToast();
  const { article_content, ...articleValues } = articleData;
  const { data: userData = {} } = useUser();
  const { data: pageData = {} } = usePage(type === "company" && id);
  const { mutate: createFeedMutate, isLoading: isCreateFeedLoading } =
    useCreateArticleFeed();
  const { mutate: createDraftMutate, isLoading: isCreateDraftLoading } =
    useCreateArticle();
  const { mutate: searchMutate } = useSearchByName();
  const { mutate: uploadMutate, isLoading: isUploadLoading } =
    useCloudinaryUpload();

  const ref = useRef(null);
  const articleFeedState = {
    entityMap: {
      0: {
        type: "LINK",
        mutability: "MUTABLE",
        data: {
          url: `/article/${articleId}`,
        },
      },
      1: {
        type: "IMAGE",
        mutability: "IMMUTABLE",
        data: {
          ...coverImageMetaData,
          src: coverImageMetaData?.url,
        },
      },
    },
    blocks: [
      {
        key: "9gm3s",
        text: articleData?.article_heading,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: articleData?.article_heading?.length,
            style: "BOLD",
          },
        ],
        entityRanges: [
          { offset: 0, length: articleData?.article_heading?.length, key: 0 },
        ],
        data: {},
      },
      {
        key: "ov7r",
        text: " ",
        type: "atomic",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [
          {
            offset: 0,
            length: 1,
            key: 1,
          },
        ],
        data: {},
      },
      {
        key: "foo",
        text: "",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
  };

  if (!coverImageMetaData || coverImage instanceof FileList) {
    delete articleFeedState.entityMap[1];
    articleFeedState.blocks.splice(1);
  }

  const defaultContentState = convertFromRaw(articleFeedState);
  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(defaultContentState)
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

  //for the video,hash,image plugin
  const imagePlugin = createImagePlugin();
  const videoPlugin = createVideoPlugin();
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

  /* const handleImage = (e) => {
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
        },
      }
    );
  };
 */
  const handleCoverImage = useCallback(
    (cover) => {
      uploadMutate(
        { files: cover },
        {
          onSuccess: (data) => {
            const image = Object.values(data)[0];
            const newEditorState = insertImageOrVideo(
              { ...image, src: image.url },
              "IMAGE"
            );
            /*   const rawData=convertToRaw(newEditorState.getCurrentContent());
            console.log(rawData) */
            /*  rawData.blocks[2]=rawData.blocks[0];
            rawData.blocks[0]=rawData.blocks[2]
            const newnewEditorState=convertFromRaw(rawData);
            console.log(newnewEditorState) */
            setEditorState(newEditorState);
          },
        }
      );
    },
    [insertImageOrVideo, uploadMutate]
  );
  useEffect(() => {
    if (coverImage instanceof FileList) {
      handleCoverImage(coverImage);
    }
  }, [coverImage, handleCoverImage]);

  /*   const handleVideo = (e) => {
    const { types } = videoPlugin;
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
  }; */

  const insertImageOrVideo = useCallback(
    (data, type) => {
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
    },
    [editorState]
  );

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

    if (request === "POST") {
      articleData.article_publish_status = "PUB";
      createDraftMutate(
        { ...articleData },
        {
          onSuccess: (response) => {
            for (let key in raw.entityMap) {
              if (raw.entityMap[key].type === "LINK")
                raw.entityMap[key].data.url = `/article/${response.article_id}`;
            }
            const feed = {
              feedData: raw,
              mentions: mentionedUsersPages,
              pics: postPhotos,
              videos: postVideos,
              hashTags: hastTags,
            };
            articleValues.article_id = response.article_id;
            createFeedMutate(
              { ...feed, type, id, articleValues, coverImage, article_content },
              {
                onSuccess: () => {
                  onClose();
                  toast({
                    title: `Your article "${articleValues.article_heading}" has been published successfully`,
                    position: "top",
                    status: "success",
                    duration: 8000,
                    isClosable: true,
                  });
                  router.push(routes.home);
                },
              }
            );
          },
        }
      );
    } else {
      const feed = {
        feedData: raw,
        mentions: mentionedUsersPages,
        pics: postPhotos,
        videos: postVideos,
        hashTags: hastTags,
      };
      createFeedMutate(
        { ...feed, type, id, articleValues, coverImage, article_content },
        {
          onSuccess: () => {
            onClose();
            toast({
              title: `Your article "${articleValues.article_heading}" has been published successfully`,
              position: "top",
              status: "success",
              duration: 8000,
              isClosable: true,
            });
            router.push(routes.home);
          },
        }
      );
    }
  };

  return (
    <Box w="full" h="min-content" bg="white" p={6} borderRadius="10px">
      <HStack align="flex-start">
        <Avatar
          size="sm"
          name={
            type === "user" ? userData["full_name"] : pageData["company_name"]
          }
          src={
            type === "user"
              ? userData["user_profile_img"]
              : pageData["company_profile_img"]
          }
        />
        <Box
          className={editorStyles.feed_editor}
          onClick={() => {
            ref.current.focus();
          }}
          w="100%"
          h="36"
          overflow="scroll"
        >
          <Editor
            editorKey={"editor"}
            editorState={editorState}
            onChange={setEditorState}
            plugins={[...plugins, imagePlugin, hashtagPlugin]}
            ref={ref}
            // placeholder={`Whats on your mind,${userData["full_name"]}?`}
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
      </HStack>
      {/*    <Input
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
      /> */}
      <HStack mt={2} ml={10} spacing={2}>
        {/*   <IconButton
          icon={<AddImageIcon fontSize="22px" />}
          bg="none"
          color="primary.500"
          onClick={() => imageRef.current.click()}
        />
        <IconButton
          icon={<AddVideoIcon fontSize="22px" />}
          bg="none"
          color="primary.500"
          onClick={() => videoRef.current.click()}
        /> */}
      </HStack>
      <Button
        width="full"
        variant="solid"
        onClick={handlePost}
        _hover={{ bg: "linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)" }}
        isLoading={
          isCreateFeedLoading || isUploadLoading || isCreateDraftLoading
        }
        mt={2}
        disabled={!editorState.getCurrentContent().hasText()}
      >
        Publish
      </Button>
    </Box>
  );
};

export default ArticleFeedEditor;
