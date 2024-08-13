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
  CircularProgress,
  Tooltip,
} from "@chakra-ui/react";
import HeadlinesButton from "./article-headlines-button";
import Button from "../../ui/button";
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
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
import { useState, useRef, useMemo } from "react";
import ArticleFeedEditor from "./article-feed-editor";
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
import { EditIcon } from "../../ui/icons";
import { useCreateArticle } from "../../../hooks/article-hooks";
import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
import * as yup from "yup";
import { createArticleYupSchema } from "../../../helper/constants/article-constants";
import createImagePlugin from "@draft-js-plugins/image";
import createVideoPlugin from "@draft-js-plugins/video";
import { AddImageIcon, AddVideoIcon } from "../../ui/icons";
import { useCloudinaryUpload } from "../../../hooks/upload-hooks";
import "@draft-js-plugins/image/lib/plugin.css";
import LabelText from "../../ui/text/label-text";
import IconButton from "../../ui/icon-button";
import CoverImageHandler from "../image-crop-functions/crop-pic-mutate";
import Modal from "../../ui/modal/index";
import CoverImage from "../cover-image";
import EmptyCoverImage from "../empty-cover-image";

function CreateArticle({ type, Id }) {
  //for the video,image plugin
  const imagePlugin = createImagePlugin();
  const videoPlugin = createVideoPlugin();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
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
  const [coverImage, setCoverImage] = useState(null);
  const editor = useRef();
  /*   const onChange = (value) => {
    setEditorState(value);
  };
 */
  //toolbar plugins

  const { plugins, Toolbar } = useMemo(() => {
    const staticToolbarPlugin = createToolbarPlugin();
    const { Toolbar } = staticToolbarPlugin;
    const plugins = [staticToolbarPlugin];
    return { plugins, Toolbar };
  }, []);

  const focus = () => {
    editor.current.focus();
  };
  const handleArticleContent = () => {
    const contentState = editorState.getCurrentContent();
    return convertToRaw(contentState);
  };
  const feedContent = editorState && handleArticleContent();
  const { mutate, isLoading } = useCreateArticle();
  const handleArticleSubmit = (values) => {
    values.article_content = editorState && handleArticleContent();
    if (type === "user") values.user_id = Id;
    else values.company_id = Id;
    values.type = type;
    if (values?.article_publish_status === "DRT")
      mutate(
        { ...values },
        {
          onSuccess: (response) => {
            router.push("/user/articles");
          },
        }
      );
    else onOpen();
  };
  const coverRef = useRef();
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

  const imageRef = useRef();
  const videoRef = useRef();
  const { mutate: uploadMutate, isLoading: isUploadLoading } =
    useCloudinaryUpload();
  /*   const [cropped, setCropped] = useState(null); */
  return (
    <VStack align="stretch">
      <Formik
        initialValues={{
          article_heading: "",
          article_content: "",
          article_publish_status: "",
          cover_image_url: null,
        }}
        validationSchema={createArticleYupSchema(yup)}
        onSubmit={(values) => handleArticleSubmit(values)}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Box mb={10}>
              <Heading fontSize="2xl" fontWeight="normal" mb={5}>
                Create Article
              </Heading>
              {/*  <Input
                display="none"
                ref={coverRef}
                onChange={(e) => {
                  setFieldValue("cover_image_url", cropped);
                  setCoverImage(e.target.files);
                }}
                type="file"
                values={values.cover_image_url}
              /> */}

              <Box w="full" position="relative">
                {values.cover_image_url ? (
                  <CoverImage
                    coverimage={URL.createObjectURL(values.cover_image_url)}
                  />
                ) : (
                  <EmptyCoverImage bgColor={"gray.300"}>
                    Article Cover Image
                  </EmptyCoverImage>
                )}
                {/* <IconButton
                  aria-label="upload cover picture"
                  icon={<EditIcon color="white" fontSize="18px" />}
                  variant="solid"
                  size="sm"
                  colorScheme="primary"
                  tooltipLabel="Add Cover Picture"
                  borderRadius="base"
                  position="absolute"
                  top="-10px"
                  right="-10px"
                  onClick={() => coverRef.current.click()}
                /> */}
                <CoverImageHandler
                  type="article"
                  /*      onCropped={(cropped) => setCropped(cropped)} */
                  setFieldValue={setFieldValue}
                  setCoverImage={setCoverImage}
                />
              </Box>
            </Box>
            <Box
              h="min-content"
              p={[4, 5, 8]}
              backgroundColor="white"
              borderRadius="10px"
            >
              <VStack alignItems="flex-start" spacing={10}>
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
                    Article Heading
                  </LabelText>
                  <TextBoxWithValidation
                    variant="unstyled"
                    p="3"
                    _placeholder={{ color: "rgba(0, 0, 0, 0.9)" }}
                    fontWeight={500}
                    fontSize={25}
                    /*   _focus={{ border: "2px solid black", height: "60px" }} */
                    border={"2px solid black"}
                    height={"60px"}
                    /*    placeholder="Heading" */
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
                  <div
                    className={editorStyles.editor}
                    onClick={focus}
                    style={{ width: "100%" }}
                    /* overflow="scroll" */
                  >
                    {editorState && (
                      <Box w="full">
                        <Editor
                          ref={editor}
                          editorKey={"editor"}
                          editorState={editorState}
                          plugins={[...plugins, imagePlugin, videoPlugin]}
                          onChange={setEditorState}
                          placeholder="Start typing right away.."
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
                            icon={<AddImageIcon fontSize="22px" color="#888" />}
                            bg="none"
                            color="primary.500"
                            onClick={() => imageRef.current.click()}
                          />
                          <IconButton
                            tooltipLabel={"Add Video"}
                            icon={<AddVideoIcon fontSize="22px" color="#888" />}
                            bg="none"
                            color="primary.500"
                            onClick={() => videoRef.current.click()}
                          />
                          {isUploadLoading && (
                            <CircularProgress
                              alignSelf="center"
                              isIndeterminate
                              size="20px"
                            />
                          )}
                        </HStack>
                      </Box>
                    )}
                  </div>
                </Flex>
              </VStack>
              <HStack
                pt={10}
                spacing={[1, 2, 5]}
                wrap="wrap"
                gap="5"
                align="flex-start"
                justify="flex-start"
              >
                <Button
                  colorScheme="blue"
                  type="submit"
                  onClick={() => setFieldValue("article_publish_status", "DRT")}
                  isLoading={
                    values.article_publish_status === "DRT" && isLoading
                  }
                  disabled={!editorState?.getCurrentContent()?.hasText()}
                >
                  Save as Draft
                </Button>
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
                <Button
                  colorScheme="red"
                  onClick={() =>
                    type === "user" && router.push(routes.userArticles)
                  }
                >
                  Discard Article
                </Button>
              </HStack>
            </Box>
            <Modal
              size="2xl"
              isOpen={isOpen}
              onClose={onClose}
              title={"Publish Article"}
            >
              <ArticleFeedEditor
                type={type}
                id={Id}
                feedContent={feedContent}
                articleData={values}
                onClose={onClose}
                coverImage={coverImage}
                request={"POST"}
              />
            </Modal>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}

export default CreateArticle;
