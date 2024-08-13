// import { useRouter } from "next/router";
import NextLink from "next/link";
import { format } from "date-fns";
import {
  Box,
  Image,
  // Stack,
  VStack,
  // HStack,
  useColorModeValue,
  // Tooltip,
  LinkOverlay,
  LinkBox,
} from "@chakra-ui/react";
// import { DateIcon, UserIcon } from "../../ui/icons";
import { TextMedium, TextSmall, TextXtraSmall } from "../../ui/text/text";

export default function ArticleCard({ articleData, myArticles }) {
  // const router = useRouter();
  const {
    cover_image_url,
    article_heading,
    detail,
    user,
    updated_date,
    article_id,
    article_publish_status,
  } = articleData;

  const creatorName = detail?.name || user?.name;
  const articleStatus =
    article_publish_status === "PUB" ? "Published" : "Draft";

  return (
    <LinkBox>
      <NextLink href={`/article/${article_id}`} passHref>
        <LinkOverlay>
          <Box
            // maxW={["200px", "200px", "220px"]}
            // w={["200px", "200px", "220px"]}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"xl"}
            rounded={"md"}
            overflow={"hidden"}
          >
            <Image
              h={"130px"}
              w={"full"}
              src={
                cover_image_url
                  ? cover_image_url
                  : "/images/no-banner-image-page.jpg"
              }
              objectFit={"cover"}
              alt="No-Banner"
              _active={{ transform: "scale(1.1)" }}
            />

            <VStack alignItems="flex-start" p={3} mb={3}>
              <TextMedium fontWeight="medium" noOfLines={1}>
                {article_heading}
              </TextMedium>
              <TextSmall fontWeight="medium" color="primary.500" noOfLines={1}>
                {creatorName}
              </TextSmall>
              <TextXtraSmall color="gray.500">
                {format(new Date(updated_date), "d-MMM-yyyy")}
              </TextXtraSmall>
              {myArticles && (
                <TextXtraSmall color="gray.500">
                  Status: {articleStatus}
                </TextXtraSmall>
              )}
            </VStack>
            {/* <Box p={3}>
              <Stack spacing={0} align={"align-start"} mb={5}>
                <Box cursor={"pointer"}>
                  <TextSmall noOfLines={2} fontWeight="600" color="primary.500">
                    <Tooltip label={article_heading} fontSize="md">
                      {article_heading}
                    </Tooltip>
                  </TextSmall>
                </Box>

                <VStack pt={3} align={"align-start"} spacing={2}>
                  <VStack align={"align-start"}>
                    <HStack>
                      <UserIcon />
                      <TextXtraSmall
                        onClick={() =>
                          router.push(`/user/profile/${detail.id}`)
                        }
                        maxW="180px"
                        isTruncated
                        cursor="pointer"
                      >
                        <Tooltip label={detail.name} fontSize="sm">
                          {detail.name}
                        </Tooltip>
                      </TextXtraSmall>
                    </HStack>
                  </VStack>
                  <HStack>
                    <DateIcon />
                    <TextXtraSmall>
                      {format(new Date(updated_date), "d-MMM-yyyy")}
                    </TextXtraSmall>
                  </HStack>
                </VStack>
              </Stack>
            </Box> */}
          </Box>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
}
