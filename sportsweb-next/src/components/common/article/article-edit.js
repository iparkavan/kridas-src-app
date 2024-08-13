import {
  Text,
  Box,
  Image,
  VStack,
  HStack,
  Flex,
  Avatar,
  Container,
  Heading,
  Input,
  useDisclosure,
  Skeleton,
  Tooltip,
  CircularProgress,
} from "@chakra-ui/react";
import HeadlinesButton from "./article-headlines-button";
import ArticleFeedEditor from "./article-feed-editor";
import Modal from "../../ui/modal/index";
import Button from "../../ui/button";
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  AtomicBlockUtils,
} from "draft-js";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from "@draft-js-plugins/buttons";
import { useState, useRef, useEffect, useMemo } from "react";
import Editor from "@draft-js-plugins/editor";
import "draft-js/dist/Draft.css";
import createToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/static-toolbar";
import editorStyles from "./static-toolbar-editor.module.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import routes from "../../../helper/constants/route-constants";
import { AddImageIcon, AddVideoIcon, EditIcon } from "../../ui/icons";
import { useEditArticle, useGetArticle } from "../../../hooks/article-hooks";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import * as yup from "yup";
import { createArticleYupSchema } from "../../../helper/constants/article-constants";
import { useCloudinaryUpload } from "../../../hooks/upload-hooks";
import createImagePlugin from "@draft-js-plugins/image";
import createVideoPlugin from "@draft-js-plugins/video";
import "@draft-js-plugins/image/lib/plugin.css";
import IconButton from "../../ui/icon-button";
import LabelText from "../../ui/text/label-text";
import CoverImageHandler from "../image-crop-functions/crop-pic-mutate";
import EmptyCoverImage from "../empty-cover-image";
import CoverImage from "../cover-image";

function EditArticle({ type, Id }) {
  //toolbar plugins
  const { plugins, Toolbar } = useMemo(() => {
    const staticToolbarPlugin = createToolbarPlugin();
    const { Toolbar } = staticToolbarPlugin;
    const plugins = [staticToolbarPlugin];
    return { plugins, Toolbar };
  }, []);
  //for the video,image plugin
  const imagePlugin = createImagePlugin();
  const videoPlugin = createVideoPlugin();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const emptyContentState = convertFromRaw({
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
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(emptyContentState)
  );

  const { articleId } = router.query;
  const { data: articleData = undefined, isLoading: articleDataLoading } =
    useGetArticle(articleId);
  const [coverImage, setCoverImage] = useState(null);
  const [editedState, setEditedState] = useState(
    () => EditorState.createWithContent(emptyContentState)
    // EditorState.createEmpty()
  );
  const editor = useRef();
  const { mutate, isLoading } = useEditArticle();

  useEffect(() => {
    if (articleData !== undefined) {
      const contentState = convertFromRaw(
        JSON.parse(articleData?.article_content)
      );
      setEditorState(() => EditorState.createWithContent(contentState));
      let articleFeedState = {
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
              ...articleData?.cover_image_url_meta,
              src: articleData?.cover_image_url_meta?.url,
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
              {
                offset: 0,
                length: articleData?.article_heading?.length,
                key: 0,
              },
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
            key: "e23a9",
            text: "",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
      };
      if (
        !articleData?.cover_image_url_meta ||
        coverImage instanceof FileList
      ) {
        for (let key in articleFeedState.entityMap) {
          if (articleFeedState.entityMap[key].type === "IMAGE")
            delete articleFeedState.entityMap[key];
        }
        for (let key in articleFeedState.blocks) {
          if (articleFeedState.blocks[key].type === "atomic")
            articleFeedState.blocks.splice(key);
        }
      }

      let defaultFeedState = convertFromRaw(articleFeedState);
      setEditedState(() => EditorState.createWithContent(defaultFeedState));
    }
  }, [articleData, articleData?.article_heading, articleId, coverImage]);

  const focus = () => {
    editor.current.focus();
  };
  /* if (articleData !== undefined) {
  } */
  const handleArticleContent = (editorState) => {
    const contentState = editorState.getCurrentContent();
    return convertToRaw(contentState);
  };

  //article submit function
  const handleArticleSubmit = (values) => {
    values.article_content = editorState && handleArticleContent(editorState);
    values.article_id = articleId;
    if (type === "user") values.user_id = Id;
    else values.company_id = Id;
    values.type = type;
    if (articleData.feed) {
      let raw = editedState && handleArticleContent(editedState);
      raw.blocks[0] = {
        key: "9gm3s",
        text: values.article_heading,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: values.article_heading.length,
            style: "BOLD",
          },
        ],
        entityRanges: [
          {
            offset: 0,
            length: values.article_heading.length,
            key: 0,
          },
        ],
        data: {},
      };

      if (values.cover_image_url instanceof File) {
        raw.blocks[0] = {
          key: "9gm3s",
          text: values.article_heading,
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [
            {
              offset: 0,
              length: values.article_heading.length,
              style: "BOLD",
            },
          ],
          entityRanges: [
            {
              offset: 0,
              length: values.article_heading.length,
              key: 1,
            },
          ],
          data: {},
        };
        raw.entityMap[1] = {
          type: "LINK",
          mutability: "MUTABLE",
          data: {
            url: `/article/${articleId}`,
          },
        };
        raw.blocks.splice(2);
      }

      let feed = {
        feedData: raw,
        type,
        id: Id,
      };
      mutate(
        { articleData, values, feed },
        {
          onSuccess: () => {
            router.push("/user/articles");
          },
        }
      );
    } else {
      if (
        values?.article_publish_status === "DRT" ||
        articleData?.article_publish_status === "PUB"
      )
        mutate(
          { articleData, values },
          {
            onSuccess: () => {
              router.push("/user/articles");
            },
          }
        );
      else onOpen();
    }
  };
  const coverRef = useRef();
  const handleImage = (e) => {
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
  const handleCoverImage = (e) => {
    uploadMutate(
      { files: e.target.files },
      {
        onSuccess: (data) => {
          const image = Object.values(data)[0];
          const newEditorState = insertImageOrVideo(
            { ...image, src: image.url },
            "IMAGE"
          );
          setEditedState(newEditorState);
        },
      }
    );
  };
  const handleVideo = (e) => {
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
  const imageRef = useRef();
  const videoRef = useRef();
  const { mutate: uploadMutate, isLoading: isUploadLoading } =
    useCloudinaryUpload();

  const [cropped, setCropped] = useState(null);
  //render
  if (articleDataLoading)
    return (
      <Skeleton minH="100vh">
        <Text>Loading..</Text>
      </Skeleton>
    );
  else
    return (
      <VStack align="stretch">
        <Formik
          initialValues={{
            article_heading: articleData?.article_heading,
            article_content: "",
            article_publish_status: articleData?.article_publish_status,
            cover_image_url: articleData?.cover_image_url_meta?.url,
          }}
          validationSchema={createArticleYupSchema(yup)}
          onSubmit={(values) => handleArticleSubmit(values)}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Box mb={10}>
                <Heading fontSize="2xl" fontWeight="normal" mb={5}>
                  Edit Article
                </Heading>
                <Input
                  display="none"
                  ref={coverRef}
                  onChange={(e) => {
                    setFieldValue("cover_image_url", e.target.files[0]);
                    setCoverImage(e.target.files);
                    if (articleData?.article_publish_status === "PUB")
                      handleCoverImage(e);
                  }}
                  type="file"
                  values={values.cover_image_url}
                />

                <Box w="full" position="relative">
                {!values?.cover_image_url ? (
                    <EmptyCoverImage bgColor={"gray.300"}>
                      Article Cover Image
                    </EmptyCoverImage>
                  ) : values?.cover_image_url instanceof File ? (
                    <CoverImage
                      coverimage={URL.createObjectURL(
                        values?.cover_image_url
                      )}
                    />
                  ) : (
                    <CoverImage coverimage={values?.cover_image_url} />
                  )}
                  {/* <IconButton
                    aria-label="upload cover picture"
                    icon={<EditIcon color="white" fontSize="18px" />}
                    variant="solid"
                    size="sm"
                    colorScheme="primary"
                    tooltipLabel="Edit Cover Picture"
                    borderRadius="base"
                    position="absolute"
                    top="-10px"
                    right="-10px"
                    onClick={() => coverRef.current.click()}
                  /> */}
                  <CoverImageHandler
                    type="article"
                    coverImage={values?.cover_image_url}
                    onCropped={(cropped) => setCropped(cropped)}
                    setFieldValue={setFieldValue}
                    setCoverImage={setCoverImage}
                  />
                </Box>
              </Box>
              <Box
                h="min-content"
                p={8}
                backgroundColor="white"
                borderRadius="10px"
              >
                <VStack alignItems="flex-start" spacing={10}>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    w="full"
                    gap={{ base: "1", md: "2", sm: "1" }}
                  >
                    <LabelText
                      p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                      minW="250px"
                    >
                      Article Heading
                    </LabelText>
                    <TextBoxWithValidation
                      variant="unstyled"
                      p="3"
                      _placeholder={{ color: "rgba(0, 0, 0, 0.9)" }}
                      fontWeight={500}
                      fontSize={25}
                      border={"2px solid black"}
                      height={"60px"}
                      /*  _focus={{ border: "2px solid black", height: "60px" }} */
                      /*   placeholder="Heading" */
                      size="lg"
                      name="article_heading"
                    />
                  </Flex>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    w="full"
                    gap={{ base: "1", md: "2", sm: "1" }}
                    // bg="red"
                  >
                    <LabelText
                      p={{ base: "1", md: "2", sm: "1", lg: "3" }}
                      minW="250px"
                    >
                      Article Content
                    </LabelText>
                    <Box
                      className={editorStyles.editor}
                      onClick={focus}
                      style={{ width: "100%" }}
                      /*  overflow="scroll" */
                    >
                      {editorState && (
                        <Box w="full">
                          <Editor
                            ref={editor}
                            editorState={editorState}
                            editorKey={"editor"}
                            plugins={[...plugins, imagePlugin, videoPlugin]}
                            onChange={setEditorState}
                          />
                          <Box style={{ marginLeft: "18px" }}>
                            <Toolbar>
                              {
                                // may be use React.Fragment instead of div to improve perfomance after React 16
                                (externalProps) => (
                                  <div>
                                    <BoldButton {...externalProps} />
                                    <ItalicButton {...externalProps} />
                                    <UnderlineButton {...externalProps} />
                                    <CodeButton {...externalProps} />
                                    <Separator {...externalProps} />
                                    <HeadlinesButton {...externalProps} />
                                    <UnorderedListButton {...externalProps} />
                                    <OrderedListButton {...externalProps} />
                                    <BlockquoteButton {...externalProps} />
                                    <CodeBlockButton {...externalProps} />
                                  </div>
                                )
                              }
                            </Toolbar>
                          </Box>
                          <HStack spacing={2} align="flex-start" ml={2}>
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
                            <IconButton
                              tooltipLabel={"Add Image"}
                              icon={
                                <AddImageIcon fontSize="22px" color="#888" />
                              }
                              bg="none"
                              color="primary.500"
                              onClick={() => imageRef.current.click()}
                            />
                            <IconButton
                              tooltipLabel={"Add Video"}
                              icon={
                                <AddVideoIcon fontSize="22px" color="#888" />
                              }
                              bg="none"
                              color="primary.500"
                              onClick={() => videoRef.current.click()}
                            />

                            {/*  {isUploadLoading && (
                            <CircularProgress
                              alignSelf="center"
                              isIndeterminate
                              size="20px"
                            />
                          )} */}
                          </HStack>
                        </Box>
                      )}
                    </Box>
                  </Flex>
                </VStack>
                <HStack
                  pt={10}
                  wrap="wrap"
                  gap="5"
                  align="flex-start"
                  justify="flex-start"
                  spacing={[1, 2, 5]}
                >
                  {articleData?.article_publish_status === "DRT" && (
                    <Button
                      colorScheme="blue"
                      type="submit"
                      onClick={() =>
                        setFieldValue("article_publish_status", "DRT")
                      }
                      isLoading={isLoading || isUploadLoading}
                      disabled={!editorState?.getCurrentContent()?.hasText()}
                    >
                      Save as Draft
                    </Button>
                  )}
                  {articleData?.article_publish_status === "PUB" ? (
                    <Button
                      colorScheme="blue"
                      type="submit"
                      disabled={!editorState?.getCurrentContent()?.hasText()}
                      isLoading={isLoading || isUploadLoading}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      colorScheme="blue"
                      type="submit"
                      onClick={() => {
                        setFieldValue("article_publish_status", "PUB");
                      }}
                      disabled={!editorState?.getCurrentContent()?.hasText()}
                    >
                      Save & Publish
                    </Button>
                  )}

                  <Button
                    colorScheme="red"
                    onClick={() =>
                      type === "user" && router.push(routes.userArticles)
                    }
                  >
                    Go to Articles
                  </Button>
                </HStack>
              </Box>
              <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={"Publish Article"}
                size={"2xl"}
              >
                <ArticleFeedEditor
                  type={type}
                  id={Id}
                  feedContent={editorState && handleArticleContent(editorState)}
                  articleData={values}
                  onClose={onClose}
                  coverImage={coverImage}
                  coverImageMetaData={articleData?.cover_image_url_meta}
                  articleId={articleId}
                />
              </Modal>
            </Form>
          )}
        </Formik>
      </VStack>
    );
}

export default EditArticle;
