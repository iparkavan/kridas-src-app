import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  HeadingMedium,
  HeadingSmall,
  HeadingXtraSmall,
} from "../../ui/heading/heading";
import {usePage} from "../../../hooks/page-hooks"
import { TextHighlight, TextSmall } from "../../ui/text/text";

export default function PageCard(props) {
  const router = useRouter();
  const { cardData } = props;
  const { name, avatar, id, type, banner } = cardData;
  const {data:pageData={}}=usePage(id);

  return (
    <Center py={6}>
      <Box
        maxW={"250px"}
        w={"250px"}
        h="250px"
        bg={useColorModeValue("white", "gray.800")}
        rounded={"md"}
        overflow={"hidden"}
        border={"1px solid #e8e8f7"}
        p={5}
      >
        <Stack spacing={2} align={"center"} mb={5}>
          <Avatar
            size={"xl"}
            src={avatar}
            name={name}
            alt={"Author"}
            css={{
              border: "2px solid white",
            }}
          />
          <HeadingXtraSmall
            wordBreak="break-word"
            textOverflow="ellipsis"
            isTruncated
            maxWidth="180px"
          >
            {name}
          </HeadingXtraSmall>
       <TextSmall color="#8f8fb1">{pageData?.parent_category_name}</TextSmall>
          {/* <Text color={"gray.500"}>Frontend Developer</Text> */}
        </Stack>

        {/* <Stack direction={"row"} justify={"center"} spacing={6}>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>23k</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Followers
              </Text>
            </Stack>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>23k</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Followers
              </Text>
            </Stack>
          </Stack> */}

        <Button
          variant="outline"
          colorScheme="primary"
          width="full"
          onClick={() => router.push(`/page/${id}`)}
        >
          View Page
        </Button>
      </Box>
    </Center>
  );
}
