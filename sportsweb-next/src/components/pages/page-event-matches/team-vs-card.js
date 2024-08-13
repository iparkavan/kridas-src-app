import {
  Avatar,
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useChildPagesSearch } from "../../../hooks/page-hooks";
import { HeadingSmall } from "../../ui/heading/heading";
import { TextMedium } from "../../ui/text/text";
import Button from "../../ui/button";
import TeamsCardEditModal from "./teams-card-edit-modal";
import TeamsCardModal from "./team-card-modal";

function TeamVsCard({
  eventData,
  matches,
  setMatches,
  teams,
  type,
  doublesType,
  index,
  typeValid,
}) {
  const [modalData, setModalData] = useState(null); //matches

  const { isOpen, onOpen, onClose } = useDisclosure();

  const formatDate = (date) => format(new Date(date), "dd-MMM-yyyy");
  const formatTime = (date) => format(new Date(date), "h:mm aa");
  var chunksFirst = teams.firstTeamName?.split("/");
  console.log(chunksFirst);
  var firstTeamNames = [chunksFirst?.shift(), chunksFirst?.join(" ")];

  var chunksSecond = teams.secondTeamName?.split("/");
  var secondTeamNames = [chunksSecond?.shift(), chunksSecond?.join(" ")];

  console.log(modalData, "modalData");

  return (
    <Box
      w="full"
      h="max-content"
      border={"1px"}
      borderRadius={"xl"}
      borderColor={"#2f80ed"}
      mt={15}
      _hover={{ bgColor: "#e1f6fa" }}
      onClick={onOpen}
    >
      <Box gap={6} p={5}>
        <HStack alignItems={"center"} justifyContent={"space-between"} w="55%">
          <TextMedium color="gray.700">
            {teams?.matchName} Match {modalData?.matchNo}
          </TextMedium>
          {modalData && <TextMedium>{modalData?.venue}</TextMedium>}
        </HStack>
        <Divider mt={2} borderColor={"#2f80ed"} />
        {/* <Box w="100%">
          {type === "view" ? (
            <ReactDatePicker
              dateFormat="MM/dd/yyyy"
              onChange={(value) => {
                const newMatchs = [...matches];

                newMatchs[index] = { ...matches[index], date: value };
                // newMatchs[index] = e.target.value;
                setMatches(newMatchs);
              }}
              selected={matches[index].date}
              placeholderText="Date"
              customInput={
                <Input borderColor="gray.300" bg="white" fontSize="sm" />
              }
            />
          ) : (
            <Text>{teams?.date && formatDate(new Date(teams?.date))}</Text>
          )}
        </Box>
        <GridItem w="100%">
          {type === "view" ? (
            <Box w="auto" px={20}>
              <ReactDatePicker
                // selected={startDate}
                // onChange={(date) => setStartDate(date)}

                placeholderText="Time"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                onChange={(value) => {
                  const newMatchs = [...matches];
                  newMatchs[index] = { ...matches[index], time: value };
                  // newMatchs[index] = e.target.value;
                  setMatches(newMatchs);
                }}
                selected={matches[index].time}
                customInput={
                  <Input borderColor="gray.300" bg="white" fontSize="sm" />
                }
                dateFormat="h:mm aa"
              />
            </Box>
          ) : (
            <Text>{teams?.time && formatTime(new Date(teams?.time))}</Text>
          )}
        </GridItem>
        <GridItem w="100%">
          {type === "view" ? (
            <Input
              borderColor="gray.300"
              bg="white"
              fontSize="sm"
              onChange={(e) => {
                const newMatchs = [...matches];
                newMatchs[index] = { ...matches[index], venue: e.target.value };
                // newMatchs[index] = e.target.value;
                setMatches(newMatchs);
              }}
              placeholder="Venue Name"
            />
          ) : (
            <Text>{teams?.venue}</Text>
          )}
        </GridItem>
        <GridItem w="100%">
          <TextMedium>Match {index + 1}</TextMedium>
        </GridItem> */}
        {typeValid ? (
          <>
            {/* <GridItem w="100%">
              <VStack p={3} align="flex-start">
                <HStack>
                  <Avatar
                    name={firstTeamNames[0]}
                    src="https://bit.ly/dan-abramov"
                  />
                  <HeadingSmall noOfLines={2}>{firstTeamNames[0]}</HeadingSmall>
                </HStack>
                <HStack>
                  <Avatar
                    name={firstTeamNames[1]}
                    src="https://bit.ly/dan-abramov"
                  />
                  <HeadingSmall noOfLines={2}>{firstTeamNames[1]}</HeadingSmall>
                </HStack>
              </VStack>
            </GridItem>
            <GridItem
              alignSelf="center"
              textAlign="center"
              w="auto"
              px={20}
            >
              <TextMedium>Vs</TextMedium>
            </GridItem>
            <GridItem w="100%">
              <VStack p={3} align="flex-start">
                <HStack>
                  <Avatar
                    name={secondTeamNames[0]}
                    src="https://bit.ly/dan-abramov"
                  />
                  <HeadingSmall noOfLines={2}>
                    {secondTeamNames[0]}
                  </HeadingSmall>
                </HStack>
                <HStack>
                  <Avatar
                    name={secondTeamNames[1]}
                    src="https://bit.ly/dan-abramov"
                  />
                  <HeadingSmall noOfLines={2}>
                    {secondTeamNames[1]}
                  </HeadingSmall>
                </HStack>
              </VStack>
            </GridItem> */}
          </>
        ) : (
          // <></>
          <Grid
            templateColumns="repeat(5, 1fr)"
            gap={6}
            mt={5}
            alignItems={"center"}
          >
            <GridItem>
              {type === "fixtures" && (
                <Box>
                  {modalData && (
                    <Text color={"gray.400"}>
                      {modalData?.time && formatTime(new Date(modalData?.time))}
                    </Text>
                  )}
                  {modalData && (
                    <>
                      <Text fontWeight={600}>
                        {modalData?.date &&
                          formatDate(new Date(modalData?.date))}
                      </Text>
                      <Text color={"gray.400"}>{modalData?.day}</Text>
                    </>
                  )}
                </Box>
              )}
            </GridItem>
            <GridItem textAlign={"center"}>
              <HStack justifyContent={"center"} gap={3}>
                <Avatar
                  name={teams.firstTeamName}
                  src="https://bit.ly/dan-abramov"
                />
                <TextMedium fontWeight={600}>{teams.firstTeamName}</TextMedium>
              </HStack>
            </GridItem>
            <GridItem textAlign={"center"}>
              <TextMedium fontWeight={600}>Vs</TextMedium>
            </GridItem>
            <GridItem textAlign={"center"}>
              <HStack justify={"center"} gap={3}>
                <Avatar
                  name={teams.secondTeamName}
                  src="https://bit.ly/dan-abramov"
                />
                <TextMedium fontWeight={600}>{teams.secondTeamName}</TextMedium>
              </HStack>
            </GridItem>
            <GridItem></GridItem>
          </Grid>
        )}
      </Box>

      {/* bhjkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb */}
      {/* 
      <HStack
        alignItems={"center"}
        justifyContent={"flex-start"}
        w={"full"}
        mx={5}
        mb={6}
      >
        <VStack w={"10%"}>
          {type === "fixtures" && (
            <Box>
              <Text color={"gray.400"}>
                {teams?.time && formatTime(new Date(teams?.time))}
              </Text>
              <Text fontWeight={600}>
                {teams?.date && formatDate(new Date(teams?.date))}
              </Text>
              <Text color={"gray.400"}>{teams?.day}</Text>
            </Box>
          )}
        </VStack>
        <HStack
          w={"full"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={40}
          mx={5}
          mb={4}
        >
          <HStack justifyContent={"center"} gap={3}>
            <Avatar
              name={teams.firstTeamName}
              src="https://bit.ly/dan-abramov"
            />
            <TextMedium fontWeight={600}>{teams.firstTeamName}</TextMedium>
          </HStack>
          <TextMedium fontWeight={600}>Vs</TextMedium>
          <HStack justify={"center"} gap={3}>
            <Avatar
              name={teams.secondTeamName}
              src="https://bit.ly/dan-abramov"
            />
            <TextMedium fontWeight={600}>{teams.secondTeamName}</TextMedium>
          </HStack>
        </HStack>
      </HStack> */}

      {/* bhjkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb */}

      {/* <TeamsCardEditModal
        eventData={eventData}
        isOpen={isOpen}
        onClose={onClose}
        teams={teams}
        matches={matches}
        setMatches={setMatches}
        index={index}
        setModalData={setModalData}
        modalData={modalData}
        // show={show}
        // teams={teams}
      /> */}
      <TeamsCardModal
        eventData={eventData}
        isOpen={isOpen}
        onClose={onClose}
        teams={teams}
        matches={matches}
        setMatches={setMatches}
        index={index}
        setModalData={setModalData}
        modalData={modalData}
      />
    </Box>
  );
}

export default TeamVsCard;
