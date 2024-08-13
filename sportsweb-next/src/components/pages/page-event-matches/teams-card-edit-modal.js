import React from "react";
import Modal from "../../ui/modal";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Image,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { TextMedium } from "../../ui/text/text";
import Button from "../../ui/button";
import ReactDatePicker from "react-datepicker";
// import Image from "next/image";
// import Vs from "../../../../public/images/VS.jpg";
// import vs from "../../../../public/images/vs.jpg";

const TeamsCardEditModal = ({
  isOpen,
  onClose,
  teams,
  matches,
  setMatches,
  index,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title={`Edit Match ${teams?.matchNo}`}
    >
      <HStack alignItems={"center"} justifyContent={"center"} gap={24}>
        <HStack justifyContent={"center"} gap={3}>
          <Avatar name={teams.firstTeamName} src="https://bit.ly/dan-abramov" />
          <TextMedium fontWeight={600}>{teams.firstTeamName}</TextMedium>
        </HStack>
        {/* <TextMedium fontWeight={600}>Vs</TextMedium> */}
        {/* <Image alt="#Vs" src={Vs} /> */}
        <Image alt="Vs" src="images/vs.jpg" />
        <HStack justify={"center"} gap={3}>
          <Avatar
            name={teams.secondTeamName}
            src="https://bit.ly/dan-abramov"
          />
          <TextMedium fontWeight={600}>{teams.secondTeamName}</TextMedium>
        </HStack>
      </HStack>
      <HStack alignItems={"center"} justifyItems={"center"} gap={2} mt={4}>
        <VStack alignItems={"left"}>
          <TextMedium color={"#2f80ed"}>Match Name</TextMedium>
          <Input
            borderColor="gray.300"
            bg="white"
            fontSize="sm"
            // value={teams?.matchName + teams?.matchNo}
            value={teams?.matchName}
            onChange={(e) => {
              const newMatchs = [...matches];
              newMatchs[index] = {
                ...matches[index],
                matchName: e.target.value,
              };
              setMatches(newMatchs);
            }}
          />
        </VStack>
        <VStack alignItems={"left"}>
          <TextMedium color={"#2f80ed"}>Date</TextMedium>
          {/* <Input borderColor="gray.300" bg="white" fontSize="sm" /> */}
          <ReactDatePicker
            dateFormat="MM/dd/yyyy"
            onChange={(value) => {
              const newMatchs = [...matches];

              newMatchs[index] = { ...matches[index], date: value };
              // newMatchs[index] = e.target.value;
              setMatches(newMatchs);
            }}
            selected={matches[index].date}
            // placeholderText="Date"
            customInput={
              <Input borderColor="gray.300" bg="white" fontSize="sm" />
            }
          />
        </VStack>
        <VStack alignItems={"left"}>
          <TextMedium color={"#2f80ed"}>Day</TextMedium>
          {/* <Input borderColor="gray.300" bg="white" fontSize="sm"> */}
          <Select
            placeholder="Select option"
            onChange={(e) => {
              const newMatchs = [...matches];
              newMatchs[index] = { ...matches[index], day: e.target.value };
              setMatches(newMatchs);
            }}
          >
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </Select>
          {/* </Input> */}
        </VStack>
      </HStack>
      <HStack alignItems={"center"} justifyItems={"center"} gap={2} mt={4}>
        <VStack alignItems={"left"}>
          <TextMedium color={"#2f80ed"}>Time</TextMedium>
          {/* <Input borderColor="gray.300" bg="white" fontSize="sm" /> */}
          <ReactDatePicker
            // selected={startDate}
            // onChange={(date) => setStartDate(date)}

            placeholderText="Time"
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            value={teams?.time}
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
        </VStack>
        <VStack alignItems={"left"}>
          <TextMedium size="md" color={"#2f80ed"}>
            Venue
          </TextMedium>
          {/* <Input borderColor="gray.300" bg="white" fontSize="sm" /> */}
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
            value={teams?.venue}
            placeholder="Venue Name"
          />
        </VStack>
      </HStack>
      <HStack mt={6} alignItems={"center"} justifyContent={"end"}>
        <Button>Save</Button>
      </HStack>
    </Modal>
  );
};

export default TeamsCardEditModal;
