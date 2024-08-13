import UserPageViewFollowerHeader from "./user-page-view-follower-header";
import React from "react";

// import UserLayout from "../layout/user-layout/user-layout";
import { useUser } from "../../hooks/user-hooks";
import { useRouter } from "next/router";

import {
  Text,
  Box,
  Flex,
  Image,
  VStack,
  Button,
  Avatar,
  HStack,
  Textarea,
  Spacer,
  SimpleGrid,
  GridItem,
  Progress,
  Heading,
  StackDivider,
  Center,
  Radio,
  Link,
  Input,
  AvatarGroup,
} from "@chakra-ui/react";
import {
  BiChevronLeftCircle,
  BiChevronRightCircle,
  BiLike,
  BiCommentDetail,
} from "react-icons/bi";
import {
  BsFillHandThumbsUpFill,
  BsFillHeartFill,
  BsShareFill,
} from "react-icons/bs";
import { SamplePhotos } from "../user/user-photos/sampledata";
import { vd_t } from "../user/user-video/User-video-sample-data";
import { usePage } from "../../hooks/page-hooks";
import MyEditor from "../user/user-feeds/user-feed-Editor";
function UserPageViewFollowerHomePage() {
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  return (
    <>
      <UserPageViewFollowerHeader />
      <Flex gap={2} mt="1">
        <Box p={5} w={{ base: "full", lg: "65%" }}>
          <Text>
            <span style={{ color: "#2F80ED" }}>{pageData["company_name"]}</span>
            {"> Home"}
          </Text>
          <Box my={3} w="100%" h="56" bg="white">
            <Flex gap={2} align="center">
              <Box mt={15}>
                <BiChevronLeftCircle
                  size={30}
                  color="#2F80ED"
                  cursor="pointer"
                />
              </Box>
              <VStack align="stretch" ml={5} mt={5} gap={5}>
                <Heading fontSize={20} w="160">
                  Who is the Best batsman?
                </Heading>

                <Radio size="md" name="1" colorScheme="green">
                  Radio
                </Radio>
                <Radio size="md" name="1" colorScheme="green">
                  Radio
                </Radio>

                <Flex gap={5}>
                  <Box>
                    <AvatarGroup size="sm" max={3}>
                      <Avatar
                        name="Ryan Florence"
                        src="https://bit.ly/ryan-florence"
                      />
                      <Avatar
                        name="Segun Adebayo"
                        src="https://bit.ly/sage-adebayo"
                      />
                      <Avatar
                        name="Kent Dodds"
                        src="https://bit.ly/kent-c-dodds"
                      />
                      <Avatar
                        name="Prosper Otemuyiwa"
                        src="https://bit.ly/prosper-baba"
                      />
                      <Avatar
                        name="Christian Nwamba"
                        src="https://bit.ly/code-beast"
                      />
                    </AvatarGroup>
                  </Box>
                  <Box>Participated</Box>
                </Flex>
              </VStack>

              <Box mt={15} ml={340}>
                <BiChevronRightCircle
                  size={30}
                  color="#2F80ED"
                  cursor="pointer"
                />
              </Box>
            </Flex>
          </Box>
          <MyEditor />
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
                      name="Dan Abrahmov"
                      src="https://bit.ly/dan-abramov"
                    />
                  </Box>
                  <Box>
                    <VStack align="stretch">
                      <Box>
                        <Text fontWeight="500" fontSize={20}>
                          {pageData["company_name"]}
                        </Text>
                        <Text fontSize={14}>2days ago</Text>
                      </Box>
                      <Box mt={5}>
                        <Text fontSize="md" color="blackAlpha.600">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempo incididunt ut labore et
                          dolore magna aliqua
                        </Text>
                      </Box>
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
                <Flex gap={20}>
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
                        <BiCommentDetail
                          size={20}
                          color="#2F80ED"
                          cursor="pointer"
                        />
                      </Box>
                      <Box>
                        <Text>comments</Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Box>
                    <Flex gap={2}>
                      <Box>
                        <BsShareFill
                          size={20}
                          color="#2F80ED"
                          cursor="pointer"
                        />
                      </Box>
                      <Box>
                        <Text>Shares</Text>
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
              <Flex gap={5} ml="5">
                <Box>
                  {" "}
                  <Avatar
                    name="Dan Abrahmov"
                    src="https://bit.ly/dan-abramov"
                  />
                </Box>
                <Box ml={10}>
                  <Input placeholder="Write a Comment" w={500} />
                </Box>
              </Flex>
            </VStack>
            <Box ml={5} mt={5}>
              <Flex>
                <Box>
                  {" "}
                  <Avatar
                    name="Dan Abrahmov"
                    src="https://bit.ly/dan-abramov"
                  />
                </Box>
                <Box ml={10}>
                  <VStack align="stretch">
                    <Box
                      bg="gray.100"
                      h="100%"
                      w="100%"
                      p={5}
                      borderRadius={10}
                    >
                      <Text>Userone</Text>
                      <Text color="blackAlpha.300">
                        user comment appear here
                      </Text>
                    </Box>
                    <Box></Box>
                    <Box>
                      <Flex gap={10} ml={15}>
                        <Text color="#2F80ED">Like</Text>
                        <Text color="#2F80ED">share</Text>
                      </Flex>
                    </Box>
                  </VStack>
                </Box>
              </Flex>
            </Box>
            <Box ml={10} mt={5}>
              <Flex>
                <Box>
                  {" "}
                  <Avatar
                    name="Dan Abrahmov"
                    src="https://bit.ly/dan-abramov"
                  />
                </Box>
                <Box ml={20}>
                  <VStack align="stretch">
                    <Box
                      bg="gray.100"
                      h="100%"
                      w="100%"
                      p={5}
                      borderRadius={10}
                    >
                      <Text>Userone</Text>
                      <Text color="blackAlpha.300">
                        user comment appear here
                      </Text>
                    </Box>
                    <Box></Box>
                    <Box>
                      <Flex gap={10} ml={15}>
                        <Text color="#2F80ED">Like</Text>
                        <Text color="#2F80ED">share</Text>
                      </Flex>
                    </Box>
                  </VStack>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>

        <Flex
          gap={3}
          direction="column"
          w="35%"
          display={{ base: "none", lg: "flex" }}
          mt={5}
        >
          <VStack
            bg="white"
            w="full"
            h="max-content"
            align="flex-start"
            p={4}
            borderRadius={10}
            mt={10}
          >
            <Text fontWeight="500" fontSize="14px" textAlign="left">
              Upcoming Events
            </Text>
            <Box>
              <VStack
                divider={<StackDivider borderColor="gray.200" />}
                spacing={4}
                align="stretch"
              >
                <Box>
                  <Flex gap={10}>
                    <Image
                      boxSize="80px"
                      objectFit="cover"
                      src="https://bit.ly/dan-abramov"
                      alt="Dan Abramov"
                      borderRadius={10}
                    />
                    <VStack>
                      <Heading size={10}>Description Goes Here</Heading>
                      <Text fontSize={14}>09:00 AM to 03:00 PM</Text>
                      <Button colorScheme="blue" w="32" borderRadius="none">
                        Enroll
                      </Button>
                    </VStack>
                  </Flex>
                </Box>

                <Box>
                  <Flex gap={10}>
                    <Image
                      boxSize="80px"
                      objectFit="cover"
                      src="https://bit.ly/dan-abramov"
                      alt="Dan Abramov"
                      borderRadius={10}
                    />
                    <VStack>
                      <Heading size={10}>Description Goes Here</Heading>
                      <Text fontSize={14}>09:00 AM to 03:00 PM</Text>
                      <Button colorScheme="blue" w="32" borderRadius="none">
                        Enroll
                      </Button>
                    </VStack>
                  </Flex>
                </Box>
              </VStack>
            </Box>
          </VStack>
          <VStack
            bg="white"
            align="flex-start"
            h="min-content"
            p={3}
            borderRadius={10}
          >
            <Text>Latest Photos</Text>
            <Text>{SamplePhotos.length} Photos</Text>
            <Flex w="full">
              <SimpleGrid columns={3}>
                {SamplePhotos.map(({ image }, idx) => (
                  <GridItem colSpan={1} key={idx}>
                    <Image
                      src={image}
                      boxSize={110}
                      alt="user_photo"
                      objectFit="fill"
                    />
                  </GridItem>
                ))}
              </SimpleGrid>
            </Flex>
          </VStack>
          <VStack
            bg="white"
            align="flex-start"
            h="min-content"
            p={4}
            w="full"
            borderRadius={10}
          >
            <Text>Latest Videos</Text>
            <Text>{vd_t.length} Videos</Text>
            <Flex w="full">
              <SimpleGrid columns={3}>
                {vd_t.map(({ tumbnail }, idx) => (
                  <GridItem colSpan={1} key={idx}>
                    <Box>
                      <Image
                        src={tumbnail}
                        boxSize={110}
                        alt="user_photo"
                        objectFit="fill"
                      />
                    </Box>
                  </GridItem>
                ))}
              </SimpleGrid>
            </Flex>
          </VStack>
        </Flex>
      </Flex>
    </>
  );
}

export default UserPageViewFollowerHomePage;
