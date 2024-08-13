import {
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import {
  getLikeColor,
  getLikeIcon,
} from "../../helper/constants/like-constants";
import {
  useCreateLike,
  useDeleteLike,
  useUpdateLike,
} from "../../hooks/like-hooks";
import { FillHeartIcon, FillLikeIcon, OutlineLikeIcon } from "../ui/icons";

const PostLikesPopover = (props) => {
  const { feedId, queryKey, userLike, type, id } = props;
  const { mutate: createMutate, isLoading: isCreateLoading } = useCreateLike();
  const { mutate: updateMutate, isLoading: isUpdateLoading } = useUpdateLike();
  const { mutate: deleteMutate, isLoading: isDeleteLoading } = useDeleteLike();

  const handleLike = (likeType = "like") => {
    if (userLike) {
      updateMutate({
        likeId: userLike?.["like_id"],
        feedId,
        likeType,
        queryKey,
        type,
        id,
      });
    } else {
      createMutate({
        feedId,
        likeType,
        queryKey,
        type,
        id,
      });
    }
  };

  const handleDeleteLike = () => {
    deleteMutate({ feedId, queryKey, likeId: userLike?.["like_id"] });
  };

  const LikeButtonContent = ({ userLike }) => {
    if (userLike && !userLike?.["is_delete"]) {
      const { like_type: userLikeType } = userLike;
      return (
        <>
          {userLikeType === "like" || userLikeType === "love" ? (
            <Icon as={getLikeIcon(userLikeType)} h={5} w={5} />
          ) : (
            <Text>{getLikeIcon(userLikeType)}</Text>
          )}

          <Text ml={2}>
            {userLikeType.charAt(0).toUpperCase() + userLikeType.slice(1)}
          </Text>
        </>
      );
    }
    return (
      <>
        <Icon as={OutlineLikeIcon} h={5} w={5} />
        <Text ml={2} fontWeight="normal">
          Like
        </Text>
      </>
    );
  };

  return (
    <Popover trigger="hover" openDelay={500} placement="top">
      <PopoverTrigger>
        <Button
          size="sm"
          variant="ghost"
          ml={-3}
          color={getLikeColor(
            userLike?.["is_delete"] || userLike?.["like_type"]
          )}
          isLoading={isCreateLoading || isUpdateLoading || isDeleteLoading}
          onClick={() =>
            userLike && !userLike?.["is_delete"]
              ? handleDeleteLike()
              : handleLike()
          }
        >
          <LikeButtonContent userLike={userLike} />
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverArrow />
        <PopoverBody>
          <Tooltip label="Like">
            <IconButton
              icon={
                <Icon
                  as={FillLikeIcon}
                  rounded="full"
                  bg="primary.500"
                  color="white"
                  h={7}
                  w={7}
                  p={1}
                />
              }
              bg="none"
              onClick={() => handleLike("like")}
            />
          </Tooltip>
          <Tooltip label="Love">
            <IconButton
              icon={
                <Icon
                  as={FillHeartIcon}
                  rounded="full"
                  bg="red.500"
                  color="white"
                  h={7}
                  w={7}
                  p={1}
                />
              }
              bg="none"
              onClick={() => handleLike("love")}
            />
          </Tooltip>
          <Tooltip label="Care">
            <Button bg="none" p="0" onClick={() => handleLike("care")}>
              <Text fontSize="24px">{getLikeIcon("care")}</Text>
            </Button>
          </Tooltip>
          <Tooltip label="Haha">
            <Button bg="none" p="0" onClick={() => handleLike("haha")}>
              <Text fontSize="24px">{getLikeIcon("haha")}</Text>
            </Button>
          </Tooltip>
          <Tooltip label="Wow">
            <Button bg="none" p="0" onClick={() => handleLike("wow")}>
              <Text fontSize="24px">{getLikeIcon("wow")}</Text>
            </Button>
          </Tooltip>
          <Tooltip label="Sad">
            <Button bg="none" p="0" onClick={() => handleLike("sad")}>
              <Text fontSize="24px">{getLikeIcon("sad")}</Text>
            </Button>
          </Tooltip>
          <Tooltip label="Angry">
            <Button bg="none" p="0" onClick={() => handleLike("angry")}>
              <Text fontSize="24px">{getLikeIcon("angry")}</Text>
            </Button>
          </Tooltip>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PostLikesPopover;
