import {
  Flex,
  Avatar,
  Text,
  HStack,
  VStack,
  Box,
  Textarea,
  Link,
} from "@chakra-ui/react";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { formatDistance } from "date-fns";

import styles from "./user-index.module.css";

function FeedItem({ feed }) {
  const contentState = convertFromRaw(JSON.parse(feed["feed_content"]));
  const feedHtml = stateToHTML(contentState);
  const { share_count, like_count, user, created_date } = feed;
  const postTime = formatDistance(new Date(created_date), new Date(), {
    addSuffix: true,
  });
  const fullName = `${user["first_name"]} ${user["last_name"]}`;

  return (
    <VStack
      align="flex-start"
      bg="white"
      h="min-content"
      w="full"
      borderRadius="10px"
      p={5}
    >
      <HStack align="center" justify="flex-start" gap={1}>
        <Avatar
          size="sm"
          name={fullName}
          src={user?.["user_profile_img"]}
          objectFit="cover"
        />
        <Flex align="flex-start" direction="column">
          <Link href={`/user/profile/${user["user_id"]}`} fontWeight="500">
            {fullName}
          </Link>
          <Text className={styles.smallText}>{postTime}</Text>
        </Flex>
      </HStack>
      <Box px={9} w="full">
        <Box dangerouslySetInnerHTML={{ __html: feedHtml }} />
        <HStack gap={5} my={5}>
          <HStack>
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              cursor="pointer"
            >
              <path
                d="M5.00065 1.66669C2.97565 1.66669 1.33398 3.30835 1.33398 5.33335C1.33398 9.00002 5.66732 12.3334 8.00065 13.1087C10.334 12.3334 14.6673 9.00002 14.6673 5.33335C14.6673 3.30835 13.0257 1.66669 11.0007 1.66669C9.76065 1.66669 8.66398 2.28235 8.00065 3.22469C7.66255 2.74309 7.21337 2.35005 6.69116 2.07885C6.16895 1.80765 5.58908 1.66627 5.00065 1.66669Z"
                stroke="#555555"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Text>{like_count}</Text>
          </HStack>
          <HStack>
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.75 9.375C9.30469 9.375 8.89375 9.53125 8.57187 9.79219L5.33437 7.45C5.38859 7.15245 5.38859 6.84755 5.33437 6.55L8.57187 4.20781C8.89375 4.46875 9.30469 4.625 9.75 4.625C10.7844 4.625 11.625 3.78437 11.625 2.75C11.625 1.71563 10.7844 0.875 9.75 0.875C8.71562 0.875 7.875 1.71563 7.875 2.75C7.875 2.93125 7.9 3.10469 7.94844 3.27031L4.87344 5.49687C4.41719 4.89219 3.69219 4.5 2.875 4.5C1.49375 4.5 0.375 5.61875 0.375 7C0.375 8.38125 1.49375 9.5 2.875 9.5C3.69219 9.5 4.41719 9.10781 4.87344 8.50313L7.94844 10.7297C7.9 10.8953 7.875 11.0703 7.875 11.25C7.875 12.2844 8.71562 13.125 9.75 13.125C10.7844 13.125 11.625 12.2844 11.625 11.25C11.625 10.2156 10.7844 9.375 9.75 9.375ZM9.75 1.9375C10.1984 1.9375 10.5625 2.30156 10.5625 2.75C10.5625 3.19844 10.1984 3.5625 9.75 3.5625C9.30156 3.5625 8.9375 3.19844 8.9375 2.75C8.9375 2.30156 9.30156 1.9375 9.75 1.9375ZM2.875 8.375C2.11719 8.375 1.5 7.75781 1.5 7C1.5 6.24219 2.11719 5.625 2.875 5.625C3.63281 5.625 4.25 6.24219 4.25 7C4.25 7.75781 3.63281 8.375 2.875 8.375ZM9.75 12.0625C9.30156 12.0625 8.9375 11.6984 8.9375 11.25C8.9375 10.8016 9.30156 10.4375 9.75 10.4375C10.1984 10.4375 10.5625 10.8016 10.5625 11.25C10.5625 11.6984 10.1984 12.0625 9.75 12.0625Z"
                fill="#555555"
              />
            </svg>
            <Text>{share_count}</Text>
          </HStack>
        </HStack>
        <Textarea
          minW="100px"
          minH="40px"
          resize="none"
          borderRadius="2px"
          focusBorderColor="blue.500"
          placeholder={`Reply`}
          borderColor="#2F80ED"
        ></Textarea>
      </Box>
    </VStack>
  );
}

export default FeedItem;
