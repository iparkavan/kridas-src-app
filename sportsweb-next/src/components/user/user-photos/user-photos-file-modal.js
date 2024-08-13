import { useEffect, useState } from "react";
import {
  useDisclosure,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Heading,
  Divider,
  ModalCloseButton,
  Image,
  Box,
  HStack,
  Avatar,
  VStack,
  Flex,
  // Textarea,
  AspectRatio,
  Icon,
  Link,
} from "@chakra-ui/react";
// import { Formik, Form } from "formik";
import { BsThreeDots, BsCamera } from "react-icons/bs";
import { formatDistance } from "date-fns";
// import { BiCommentDetail, BiHeart } from "react-icons/bi";
// import { RiShareForwardLine } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
// import { MenuOptions } from "./user-photos-menu-items";
import styles from "../user-photos.module.css";
import { useUser, useUserById } from "../../../hooks/user-hooks";
import { useFeedByMediaId } from "../../../hooks/media-hooks";
// import TextBoxWithValidation from "../../ui/textbox/textbox-with-validation";
// import * as yup from "yup";
// import { useUpdateMedia } from "../../../hooks/media-hooks";
// import { updateMediaValidationSchema } from "../../../helper/constants/media-constants";
import { convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
import { TextMedium, TextSmall } from "../../ui/text/text";
import ViewLikesModal from "../../feed/view-likes-modal";
import { CommentIcon, FillLikeIcon } from "../../ui/icons";
import PostLikesPopover from "../../feed/post-likes-popover";
import ViewComments from "../../feed/view-comments";
import SocialMediaSharePost from "../../common/social-media-share-post";
import PostModal from "../../feed/post-modal";
import CommentEditor from "../../feed/comment-editor";
import routes from "../../../helper/constants/route-constants";

export function FileDialog({ media, type, currentUser, taggedUser = null }) {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const SampleComments = [];
  const { data: userData = {} } = useUserById(media.media_creator_user_id);
  const { data: currentUserData = {} } = useUser();

  //Time formatter
  const timeFormatter = (date) =>
    formatDistance(new Date(date), new Date(), {
      addSuffix: true,
    });

  const { data: feedMediaData = undefined, isLoading } = useFeedByMediaId(
    media.media_id,
    "U",
    currentUserData["user_id"]
  );

  const [feedContent, setFeedContent] = useState(undefined);
  const [mediaData, setMediaData] = useState(undefined);

  // console.log(mediaData, "feed data");
  /*  const emptyContentState = convertFromRaw({
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
  ); */

  const [imageCount, setImageCount] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const {
    isOpen: isSharePostOpen,
    onOpen: onSharePostOpen,
    onClose: onSharePostClose,
  } = useDisclosure();
  const [mode, setMode] = useState("share");

  useEffect(() => {
    if (!isLoading && feedMediaData !== undefined) {
      const raw = JSON?.parse(feedMediaData[0]?.feed_content);
      setImageCount(
        +Object.values(
          JSON?.parse(feedMediaData[0]?.feed_content)?.entityMap
        )?.filter(({ type }) => type === "IMAGE")?.length
      );
      /*     console.log(imageCount); */
      for (let key in raw.blocks) {
        if (raw.blocks[key].type === "atomic") {
          /*  console.log("deleted atomic"); */
          raw.blocks.splice(key, 1);
        }
      }
      for (let key in raw.entityMap) {
        if (raw?.entityMap[key]?.type === "IMAGE") {
          /* console.log("deleted entitytype which are images"); */
          delete raw.entityMap[key];
        }
      }
      console.log("feedMediaData", feedMediaData[0]);
      setFeedContent(raw);
      setMediaData(feedMediaData[0]);
    }
  }, [feedMediaData, isLoading, imageCount]);

  let feedHtml;
  if (feedContent !== undefined) {
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

    feedHtml = stateToHTML(convertFromRaw(feedContent), options);
  }

  // const [edit, setEdit] = useState(false);
  // const { mutate, isLoading: updateMediaLoading } = useUpdateMedia("user");

  // console.log("mediaData", mediaData);

  /*   const onChange = (value) => {
    setEditorState(value);
  }; */

  return (
    <>
      {type === "image" ? (
        <Box className={styles.PhotoContainer} onClick={onModalOpen}>
          <Box className={styles.HoverContainer}>
            {/* {mediaData?.like_count > 0 && (
              <HStack mb={10} fontSize="18px" ml="auto" mr="18px">
                <BiHeart />
                <Text color="darkgray !important">{mediaData?.like_count}</Text>
              </HStack>
            )} */}
          </Box>

          <Image
            boxSize="240"
            w="full"
            objectFit="cover"
            src={media.media_url}
            borderRadius="5px"
            alt="Gallery"
            cursor="pointer"
          />
        </Box>
      ) : (
        <AspectRatio cursor="pointer" maxW="400px" maxH="240px" ratio={1}>
          <>
            <video src={media?.media_url} onClick={onModalOpen} />
          </>
        </AspectRatio>
      )}

      <Modal size="5xl" isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent bg="transparent" borderColor="none">
          <ModalCloseButton />
          <ModalBody bg="white" p={0}>
            <Flex
              direction={{ base: "column", lg: "row" }}
              align="center"
              /*   w={{ lg: type === "image" && "1000px" }} */
            >
              {type === "image" ? (
                <Image
                  bg="black"
                  boxSize={{ base: 380, lg: 550 }}
                  w={{ base: "full", lg: "60%" }}
                  objectFit="contain"
                  src={media.media_url}
                  // borderRadius="5px"
                  alt="Gallery"
                />
              ) : (
                // <video
                //   src={media.media_url}
                //   className={styles.video}
                //   controls
                // />
                <Box
                  as="video"
                  bg="black"
                  boxSize={{ base: 380, lg: 550 }}
                  w={{ base: "full", lg: "60%" }}
                  objectFit="contain"
                  src={media.media_url}
                  className={styles.video}
                  controls
                />
              )}

              <Box
                w={{ base: "full", lg: type === "image" ? "550px" : "630px" }}
                h={{ base: "full", lg: "550px" }}
                p={17}
                overflow="auto"
              >
                <HStack justify="space-between">
                  <Flex align="center" justify="center" direction="row">
                    <Avatar
                      name={userData["full_name"] || taggedUser?.name}
                      src={userData["user_profile_img"] || taggedUser?.avatar}
                    />
                    <VStack ml={3} align="flex-start" spacing={1}>
                      <Link
                        href={routes.userProfile(
                          userData["user_id"] || taggedUser?.id
                        )}
                      >
                        <Heading size="sm">{userData?.full_name}</Heading>
                      </Link>
                      <Text fontSize="14px" color="#888da8">
                        {timeFormatter(media.updated_date)}
                      </Text>
                    </VStack>
                  </Flex>
                  {/*     {currentUser && (
                    <MenuOptions type={media?.media_url_meta?.resource_type} />
                  )} */}
                </HStack>

                {/* {media.media_desc && !taggedUser && !edit && (
                  <>
                    <Text textAlign="left" mt={3}>
                      {media.media_desc}
                    </Text>
                  </>
                )} */}

                {/* {edit && (
                  <VStack my={3} w="full" align="flex-start">
                    <Formik
                      initialValues={{
                        media_desc: media.media_desc || "",
                      }}
                      validationSchema={updateMediaValidationSchema(yup)}
                      onSubmit={(values) => {
                        // console.log({ ...media, ...values });
                        mutate(
                          { ...media, ...values },
                          {
                            onSuccess: (res) => {
                              setEdit(false);
                            },
                          }
                        );
                      }}
                    >
                      {({ values }) => (
                        <Form>
                          <TextBoxWithValidation
                            width="sm"
                            placeholder={"Add a Photo Description"}
                            fontSize="sm"
                            name="media_desc"
                          />
                          <HStack mt={4}>
                            <Button
                              size="sm"
                              type="submit"
                              isLoading={updateMediaLoading}
                            >
                              Save
                            </Button>
                            <Button size="sm" onClick={() => setEdit(false)}>
                              Cancel
                            </Button>
                          </HStack>
                        </Form>
                      )}
                    </Formik>
                  </VStack>
                )} */}

                {/* {imageCount === 1 || taggedUser ? (
                  <Box pt={3} dangerouslySetInnerHTML={{ __html: feedHtml }} />
                ) : (
                  !edit &&
                  imageCount !== 0 &&
                  !taggedUser &&
                  currentUser && (
                    <Box my={3}>
                      {media.media_desc ? (
                        <Button size="sm" onClick={() => setEdit(true)}>
                          Edit Description
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => setEdit(true)}>
                          Add Description
                        </Button>
                      )}
                    </Box>
                  )
                )} */}

                <Box pt={3} dangerouslySetInnerHTML={{ __html: feedHtml }} />

                <Divider my={3} />
                <HStack
                  align="center"
                  justify="space-between"
                  rowGap="10px"
                  wrap="wrap"
                  mb={1}
                >
                  <HStack>
                    {/* <AiOutlineHeart fontSize="25px" />
                    <TextSmall size="sm">{mediaData?.like_count}</TextSmall>  */}
                    {mediaData?.like_count && (
                      <>
                        {isOpen && (
                          <ViewLikesModal
                            isOpen={isOpen}
                            onClose={onClose}
                            feedId={mediaData?.feed_id}
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
                            mb={2}
                          />
                          <TextMedium ml={2} mb={2}>
                            {mediaData?.like_count}
                          </TextMedium>
                        </Button>
                      </>
                    )}
                  </HStack>
                  <HStack>
                    {Boolean(
                      mediaData?.commentcount && Number(mediaData.commentcount)
                    ) && (
                      <Button
                        variant="link"
                        fontSize="sm"
                        fontWeight="normal"
                        color="gray.500"
                        onClick={() => setShowComments(!showComments)}
                      >
                        {mediaData.commentcount} comments
                      </Button>
                    )}
                    {Boolean(mediaData?.share_count) && (
                      <TextSmall color="gray.500">
                        {mediaData.share_count} shares
                      </TextSmall>
                    )}
                    {/* <BiCommentDetail fontSize="25px" />
                    <TextSmall>{mediaData?.commentcount}</TextSmall>
                    <RiShareForwardLine fontSize="25px" />
                    <TextSmall>{mediaData?.share_count}</TextSmall> */}
                  </HStack>
                </HStack>
                {/* {currentUser && (
                  <> */}
                <Divider my={2} />
                <HStack>
                  <PostLikesPopover
                    feedId={mediaData?.feed_id}
                    userLike={mediaData?.like}
                    queryKey={["user-feed-media", media?.media_id]}
                    type="user"
                    id={currentUserData.user_id}
                  />
                  <Button size="sm" variant="ghost">
                    <Icon as={CommentIcon} h={5} w={5} />
                    <TextSmall ml={2} fontWeight="normal">
                      Comment
                    </TextSmall>
                  </Button>

                  <SocialMediaSharePost
                    content={`${mediaData?.detail?.name}'s Post`}
                    fbHashtag={"#kridas"}
                    twitterHashtags={["kridas", "post", "social_media"]}
                    twitterMention="kridas_sports"
                    redirectPath={`/post/${mediaData?.feed_id}`}
                    handleShare={() => {
                      setMode("share");
                      onSharePostOpen();
                    }}
                  />
                  {mode === "share" && (
                    <PostModal
                      isOpen={isSharePostOpen}
                      onClose={onSharePostClose}
                      type="user"
                      id={currentUserData.user_id}
                      mode={mode}
                      setMode={setMode}
                      feed={mediaData}
                    />
                  )}
                </HStack>
                {/* </>
                )} */}

                <Divider my={3} />

                {Boolean(mediaData?.commentcount) && !showComments && (
                  <Button
                    fontWeight="normal"
                    variant="link"
                    colorScheme="primary"
                    onClick={() => setShowComments(true)}
                  >
                    View comments
                  </Button>
                )}
                {Boolean(mediaData?.commentcount) && showComments && (
                  <ViewComments
                    showComments={showComments}
                    setShowComments={setShowComments}
                    feed={mediaData}
                    type="user"
                    id={currentUserData.user_id}
                    queryKey={["user-photo", currentUserData.user_id]}
                  />
                )}
                <Divider mt={3} />
                <Box display="flex" alignItems="center" gap={4} mt={3}>
                  <Avatar
                    size="sm"
                    name={currentUserData["full_name"] || taggedUser?.name}
                    src={
                      currentUserData["user_profile_img"] || taggedUser?.avatar
                    }
                  />
                  <CommentEditor
                    feedId={mediaData?.feed_id}
                    userLike={mediaData?.like}
                    queryKey={["user-photo", userData.user_id]}
                    type="user"
                    id={currentUserData.user_id}
                  />
                </Box>

                <Divider mt={3} />

                {SampleComments.length > 0 && (
                  <Flex mt={10} h="250" overflowY="scroll">
                    <VStack align="flex-start" w="full">
                      {SampleComments.map(({ name, time, likes, comment }) => (
                        <>
                          <HStack justify="space-between" w="full">
                            <Flex
                              align="center"
                              justify="center"
                              direction="row"
                            >
                              <Image
                                src="https://1.bp.blogspot.com/-eVkXKJe88ag/YRTUASCFq9I/AAAAAAAAF8M/hfIPziOuLvkJMHlDOMjRL4CiOGsxs1zlQCLcBGAsYHQ/s846/05f812a504ace7bd3bfc635917e33b8f.jpg"
                                borderRadius="full"
                                boxSize={38}
                                objectFit="cover"
                                alt="user"
                              />
                              <VStack ml={3} align="flex-start">
                                <Heading size="sm">{name}</Heading>
                                <Text className={styles.FormText}>{time}</Text>
                              </VStack>
                            </Flex>
                            <BsThreeDots cursor="pointer" />
                          </HStack>
                          <Text className={styles.FormText}>{comment}</Text>
                          <HStack spacing={5}>
                            <HStack align="center">
                              <AiOutlineHeart className={styles.Icon} />
                              <Text className={styles.FormText}>{likes}</Text>
                            </HStack>
                            <Text
                              className={styles.FormText}
                              cursor="pointer"
                              _hover={{ color: "#3182CE" }}
                            >
                              Reply
                            </Text>
                          </HStack>

                          <Divider />
                        </>
                      ))}
                    </VStack>
                  </Flex>
                )}
                {/*Comment Box*/}
                {/* {currentUser && (
                  <HStack mt={3}>
                    <Avatar
                      size={"sm"}
                      name={currentUserData["full_name"]}
                      src={currentUserData["user_profile_img"]}
                    />
                    <Box position="relative" w="full">
                      <Textarea
                        placeholder="Please Enter to Post"
                        size="sm"
                        _focus={{ borderColor: "#3182CE" }}
                      />
                      <BsCamera
                        style={{
                          position: "absolute",
                          bottom: "10",
                          right: "10",
                          cursor: "pointer",
                        }}
                        className={styles.Icon}
                      />
                    </Box>
                  </HStack>
                )}*/}
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
{
  /* <Box h="min-content" my={3} backgroundColor="white">
                    <VStack alignItems="flex-start">
                      <div style={{ width: "100%" }}>
                        {editorState && (
                          <Box w="full">
                            <Editor
                              editorState={editorState}
                              plugins={[...plugins, hashtagPlugin]}
                              readOnly
                              onChange={onChange}
                            />
                          </Box>
                        )}
                      </div>
                    </VStack>
                  </Box> */
}
