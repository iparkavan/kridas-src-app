import {
  Avatar,
  Box,
  Center,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
// import Button from "../../ui/button";
import { HeadingSmall } from "../../ui/heading/heading";
// import Modal from "../../ui/modal";
import { TextHighlight, TextSmall } from "../../ui/text/text";
import ViewPreferences from "../../events/preferences/view-preferences";
// import {
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
// } from "@chakra-ui/react";
// import EventPlayerList from "./event-player-list-modal";

function EventTeamsCard(props) {
  const { isLoading, eventTeamData, currentEvent, tournamentCategory } = props;
  if (isLoading) {
    return <Skeleton minH={"100vh"} w="full" />;
  }

  return (
    <>
      {eventTeamData.length > 0 ? (
        eventTeamData?.map((teamObj) => {
          const isUser = teamObj.type.type === "Individual";
          const isTeam = teamObj.type.type === "team";

          if (isUser) {
            const fullName = `${teamObj.first_name} ${teamObj.last_name}`;
            return (
              <Center px={2} py={3} key={teamObj.user_id}>
                <Box
                  maxW={["160px", "200px", "220px"]}
                  w={["160px", "200px", "220px"]}
                  bg={"white"}
                  boxShadow={"xl"}
                  borderRadius={"10px"}
                  overflow={"hidden"}
                  p={8}
                  pos="relative"
                >
                  {currentEvent && (
                    <ViewPreferences
                      players={[teamObj]}
                      tournamentCategory={tournamentCategory}
                    />
                  )}
                  <LinkBox>
                    <Stack spacing={3} align={"center"} justify="center">
                      <Avatar
                        size={"xl"}
                        name={fullName}
                        src={teamObj.user_profile_img}
                        alt={`${fullName} - Profile`}
                        css={{
                          border: "2px solid white",
                        }}
                      />
                      <NextLink href={`/${teamObj.user_name}`} passHref>
                        <LinkOverlay>
                          <HeadingSmall noOfLines={1}>{fullName}</HeadingSmall>
                        </LinkOverlay>
                      </NextLink>
                    </Stack>
                  </LinkBox>
                </Box>
              </Center>
            );
          } else if (isTeam) {
            return (
              <Center px={2} py={3} key={teamObj.team_id}>
                <Box
                  maxW={["160px", "200px", "220px"]}
                  w={["160px", "200px", "220px"]}
                  bg={"white"}
                  boxShadow={"xl"}
                  borderRadius={"10px"}
                  overflow={"hidden"}
                  p={8}
                  pos="relative"
                >
                  {currentEvent && (
                    <ViewPreferences
                      team={teamObj}
                      tournamentCategory={tournamentCategory}
                    />
                  )}
                  <LinkBox>
                    <Stack spacing={2} align={"center"} justify="center">
                      <Avatar
                        size={"xl"}
                        name={teamObj.company.company_name}
                        src={teamObj.company.company_profile_img}
                        alt={`${teamObj.company.company_name} - Page`}
                        css={{
                          border: "2px solid white",
                        }}
                      />
                      <NextLink href={`/page/${teamObj.company_id}`} passHref>
                        <LinkOverlay>
                          <HeadingSmall noOfLines={1}>
                            {teamObj.company.company_name}
                          </HeadingSmall>
                        </LinkOverlay>
                      </NextLink>
                      <TextHighlight>
                        {teamObj.company.category_arr[0].category_name}
                      </TextHighlight>
                      <TextSmall
                        color="#8f8fb1"
                        noOfLines={2}
                        // w="200px"
                        // textAlign={"center"}
                      >
                        {teamObj.company.parent_category_name}
                      </TextSmall>
                      {/* <Button onClick={onOpen}>Players</Button> */}
                      {/* <Button
                        onClick={() => {
                          setCurrentTeam(a);
                          onOpen();
                        }}
                      >
                        Players
                      </Button> */}
                    </Stack>
                  </LinkBox>
                </Box>
              </Center>
            );
          }
        })
      ) : (
        <Box w="full" bg="gray.100" p={5} borderRadius={5}>
          <Text>No Data</Text>
        </Box>
      )}

      {/* <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={"Players List"}
            closeOnOverlayClick={false}
            // size={{ base: "md", md: "md", lg: "md" }}
            size={"xl"}
          > */}
      {/* <EventPlayerList
        eventTeam={currentTeam}
        isOpen={isOpen}
        onClose={onClose}
      /> */}
      {/* </Modal> */}
    </>
  );
}

export default EventTeamsCard;
