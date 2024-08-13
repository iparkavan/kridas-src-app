import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  HStack,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { Fragment } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Modal from "../../ui/modal";
import { HeadingMedium, HeadingSmall } from "../../ui/heading/heading";
import { useUser } from "../../../hooks/user-hooks";
import { useTeamByCompanyId, useTeamByTeamId } from "../../../hooks/team-hooks";
import { useRouter } from "next/router";

function EventPlayerList() {
  const router = useRouter();
  const { pageId } = router.query;
  const { data: eventTeam = [], isLoading } = useTeamByCompanyId(pageId);
  const { data: teamUser = [] } = useTeamByTeamId(eventTeam[0]?.team_id);

  console.log(eventTeam[0]?.team_id, "team data");

  if (isLoading) {
    return <Skeleton minH={"100vh"} w="full" />;
  }
  return (
    // <Modal isOpen={isOpen} onClose={onClose} title={"Players List"} size="2xl">
    <>
      {eventTeam[0]?.team_id ? (
        <>
          <Box w="full" bg="white" h="14" p={4} borderRadius={5}>
            <HeadingMedium>Players List</HeadingMedium>
          </Box>
          <Box w="full" bg="white" mt={3} p={10}>
            <HStack align={"flex-start"} flexWrap={"wrap"} spacing={0} gap={10}>
              {teamUser?.map((a) => (
                <Fragment key={a?.team_id}>
                  {a?.user?.user_id ? (
                    <LinkBox>
                      <Box
                        w={{ base: "240px", md: "260px" }}
                        h={{ base: "90px", md: "90px" }}
                        bg="white"
                        rounded={"xl"}
                        overflow={"hidden"}
                        border={"2px solid #e8e8f7"}
                        p={4}
                        cursor="pointer"
                      >
                        <Flex>
                          <Avatar
                            size={"md"}
                            name={a?.user?.first_name}
                            src={a?.user?.user_profile_img}
                            alt={`${a?.user?.first_name} - User`}
                            css={{
                              border: "2px solid white",
                            }}
                          />
                          <NextLink
                            href={`/user/profile/${a?.user?.user_id}`}
                            passHref
                          >
                            <LinkOverlay>
                              <HeadingSmall
                                wordBreak="break-word"
                                textOverflow="ellipsis"
                                maxWidth="180px"
                                p={3}
                                fontWeight="medium"
                                color="primary.500"
                              >
                                {`${a?.user?.first_name} ${a?.user?.last_name}`}
                                {/* {`${b.first_name} ${b.last_name}`} */}
                              </HeadingSmall>
                            </LinkOverlay>
                          </NextLink>
                        </Flex>
                      </Box>
                    </LinkBox>
                  ) : (
                    <Box
                      w={{ base: "240px", md: "260px" }}
                      h={{ base: "90px", md: "90px" }}
                      bg="white"
                      rounded={"xl"}
                      overflow={"hidden"}
                      border={"2px solid #e8e8f7"}
                      p={4}
                    >
                      <HeadingSmall
                        wordBreak="break-word"
                        textOverflow="ellipsis"
                        maxWidth="180px"
                        p={3}
                        fontWeight="medium"
                      >
                        {`${a?.detail?.first_name} ${a?.detail?.last_name}`}
                      </HeadingSmall>
                    </Box>
                  )}
                </Fragment>
              ))}
            </HStack>
          </Box>
        </>
      ) : (
        <Box w="full" bg="white" h="14" p={4} borderRadius={5}>
          <HeadingMedium>No players to display</HeadingMedium>
        </Box>
      )}
    </>
    // </Modal>
  );
}

export default EventPlayerList;
