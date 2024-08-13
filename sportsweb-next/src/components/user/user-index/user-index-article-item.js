import { Box, Flex, Heading, HStack, Image } from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { HeadingSmall, HeadingXtraSmall } from "../../ui/heading/heading";
import { DateIcon } from "../../ui/icons";
import { TextSmall, TextXtraSmall } from "../../ui/text/text";

function ArticleItem({ articleHeading, coverImage, updatedDate, articleId }) {
  const router = useRouter();
  return (
    <Flex
      w="full"
      cursor="pointer"
      direction="column"
      borderRadius="10px"
      overflow="hidden"
      onClick={() => router.push(`/article/${articleId}`)}
    >
      <Image
        src={coverImage || "/images/no-banner-image-page.jpg"}
        alt="event"
        w="full"
        height="190"
        objectFit="cover"
      />
      <Flex
        p={4}
        align="center"
        justify="center"
        bg="white"
        w="full"
        gap={2}
        direction="column"
        fontWeight="500"
      >
        <Box h="35px">
          <HeadingSmall noOfLines={2} color="primary.500">
            {articleHeading}
          </HeadingSmall>
        </Box>
        <HStack>
          <DateIcon />
          <TextSmall isTruncated color="#f16d75">
            {format(new Date(updatedDate), "d-MMM-yyyy")}
          </TextSmall>
        </HStack>
      </Flex>
    </Flex>
  );
}

export default ArticleItem;
