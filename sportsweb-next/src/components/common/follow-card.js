import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Stack,
  useColorModeValue,
  VStack,
  LinkOverlay,
  LinkBox,
} from "@chakra-ui/react";
import Button from "../ui/button";
import {
  HeadingMedium,
  HeadingSmall,
  HeadingXtraSmall,
} from "../ui/heading/heading";
import { TextHighlight, TextSmall } from "../ui/text/text";
import { useLookupTable } from "../../hooks/lookup-table-hooks";
import NextLink from "next/link";

export default function UserCard(props) {
  const router = useRouter();
  const { cardData } = props;
  const {
    name,
    avatar,
    id,
    type,
    banner,
    bio,
    category_name,
    description,
    sub_categories,
  } = cardData;

  const subCategoryNames = sub_categories?.map(
    ({ category_name }) => category_name
  );
  const { data: professionData = [] } = useLookupTable("PRF");

  return (
    <Center p={3}>
      <LinkBox as="followers">
        <NextLink
          href={
            type === "U"
              ? `/user/profile/${id}`
              : type === "C"
              ? `/page/${id}`
              : `/events/${id}`
          }
          passHref
        >
          <LinkOverlay>
            <Box
              maxW={{ base: "240px", md: "200px" }}
              w={{ base: "240px", md: "200px" }}
              h={{ base: "240px", md: "200px" }}
              bg={useColorModeValue("white", "gray.800")}
              rounded={"xl"}
              overflow={"hidden"}
              border={"2px solid #e8e8f7"}
              p={3}
              onClick={() =>
                type === "U"
                  ? router.push(`/user/profile/${id}`)
                  : type === "C"
                  ? router.push(`/page/${id}`)
                  : router.push(`/events/${id}`)
              }
              cursor="pointer"
            >
              <Stack spacing={2} align={"center"} justify="center" mb={3}>
                <Avatar
                  size={"xl"}
                  src={avatar}
                  alt={"Author"}
                  name={name}
                  css={{
                    border: "2px solid white",
                  }}
                />
                <HeadingSmall
                  wordBreak="break-word"
                  textOverflow="ellipsis"
                  isTruncated
                  maxWidth="180px"
                >
                  {name}
                </HeadingSmall>
                {type === "U" && (
                  <VStack h={"87px"}>
                    {bio?.profession && (
                      <TextHighlight
                        noOfLines={2}
                        w="200px"
                        textAlign={"center"}
                      >
                        {
                          professionData.find(
                            (profession) =>
                              profession["lookup_key"] === bio?.profession
                          )?.["lookup_value"]
                        }
                      </TextHighlight>
                    )}
                    {bio?.description && (
                      <TextSmall
                        color="#8f8fb1"
                        noOfLines={2}
                        w="200px"
                        textAlign={"center"}
                      >
                        {bio?.description}
                      </TextSmall>
                    )}
                  </VStack>
                )}
                {(type === "C" || type === "E") && (
                  <TextHighlight>{category_name}</TextHighlight>
                )}
                <Box h={description || subCategoryNames ? "45px" : 0}>
                  {(type === "C" || type === "E") && (
                    <TextSmall
                      color="#8f8fb1"
                      noOfLines={2}
                      w="200px"
                      textAlign={"center"}
                    >
                      {type === "C" &&
                        subCategoryNames &&
                        subCategoryNames.join(", ")}
                      {/* {type === "C"
                        ? subCategoryNames && subCategoryNames.join(",")
                        : description} */}
                    </TextSmall>
                  )}
                </Box>
              </Stack>
            </Box>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    </Center>
  );
}
