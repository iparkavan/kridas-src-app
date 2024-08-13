import React from "react";
import {
  Text,
  Box,
  Flex,
  VStack,
  Avatar,
  StackDivider,
  Input,
} from "@chakra-ui/react";
import { BiLike, BiCommentDetail } from "react-icons/bi";
import {
  BsFillHandThumbsUpFill,
  BsFillHeartFill,
  BsShareFill,
} from "react-icons/bs";
import { formatDistance } from "date-fns";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

const UserPageFeedItem = ({ feed }) => {
  const contentState = convertFromRaw(JSON.parse(feed["feed_content"]));
  const feedHtml = stateToHTML(contentState);
  const { company, share_count, like_count, created_date } = feed;
  const postTime = formatDistance(new Date(created_date), new Date(), {
    addSuffix: true,
  });

  return (
    <Box w="100%" h="auto" bg="white" pb={10}>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={8}
        align="stretch"
      >
        <Box>
          <Flex gap={30} ml={5} mt={5}>
            <Box>
              <Avatar
                name={company?.["company_name"]}
                src={company?.["company_profile_img"]}
              />
            </Box>
            <Box>
              <VStack align="stretch">
                <Box>
                  <Text fontWeight="500" fontSize={20}>
                    {company?.["company_name"]}
                  </Text>
                  <Text fontSize={14}>{postTime}</Text>
                </Box>
                <Box
                  mt={5}
                  dangerouslySetInnerHTML={{ __html: feedHtml }}
                ></Box>
              </VStack>
            </Box>
          </Flex>
        </Box>
        <Box>
          <Flex ml={20}>
            <BsFillHandThumbsUpFill size={20} />
            <BsFillHeartFill size={20} />
            <Text fontSize="small" color="blackAlpha.500">
              Jayne Doyco, Katy Holly and 7 others
            </Text>
            <Text fontSize="small" pl={180} color="blackAlpha.500">
              9 comments,2Shares
            </Text>
          </Flex>
        </Box>
        <Box ml={20}>
          <Flex gap={38}>
            <Box>
              <Flex gap={2}>
                <Box>
                  <BiLike size={20} color="#2F80ED" cursor="pointer" />
                </Box>
                <Box>
                  <Text>likes</Text>
                </Box>
              </Flex>
            </Box>
            <Box>
              <Flex gap={2}>
                <Box>
                  <BiCommentDetail size={20} color="#2F80ED" cursor="pointer" />
                </Box>
                <Box>
                  <Text>comments</Text>
                </Box>
              </Flex>
            </Box>
            <Box>
              <Flex gap={2}>
                <Box>
                  <BsShareFill size={20} color="#2F80ED" cursor="pointer" />
                </Box>
                <Box>
                  <Text>Shares</Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>

        <Box ml={10}>
          <Input placeholder="Write a Comment" w={700} />
        </Box>
      </VStack>
    </Box>
  );
};

export default UserPageFeedItem;
