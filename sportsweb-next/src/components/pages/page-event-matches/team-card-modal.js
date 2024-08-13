import React from "react";

import Modal from "../../ui/modal";
import { Avatar, HStack, Image, Input, Select, VStack } from "@chakra-ui/react";
import { TextMedium } from "../../ui/text/text";
import Button from "../../ui/button";
// import Image from "next/image";
import ReactDatePicker from "react-datepicker";

import { useState } from "react";

const TeamsCardModal = ({
  eventData,
  isOpen,
  onClose,
  teams,
  matches,
  setMatches,
  index,
  setModalData,
  modalData,
}) => {
  const [inputValues, setInputValues] = useState({
    matchName: teams?.matchNo,
    date: null,
    day: "",
    time: null,
    venue: "",
  });

  // Function to handle changes for input fields
  const handleInputChange = (field, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setModalData(inputValues);
    onClose();
  };

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
        <Image alt="#Vs" src="images/vs.jpg" />
        <HStack justify={"center"} gap={3}>
          <Avatar
            name={teams.secondTeamName}
            src="https://bit.ly/dan-abramov"
          />
          <TextMedium fontWeight={600}>{teams.secondTeamName}</TextMedium>
        </HStack>
      </HStack>

      <HStack alignItems={"center"} justifyItems={"center"} gap={2} mt={4}>
        <VStack alignItems="left">
          <TextMedium color="#2f80ed">Match Name</TextMedium>
          <Input
            borderColor="gray.300"
            bg="white"
            fontSize="sm"
            value={inputValues.matchName}
            onChange={(e) => handleInputChange("matchName", e.target.value)}
          />
        </VStack>

        <VStack alignItems="left">
          <TextMedium color="#2f80ed">Date</TextMedium>
          <ReactDatePicker
            // placeholderText="To"
            dateFormat="MM/dd/yyyy"
            selected={inputValues.date}
            onChange={(date) => handleInputChange("date", date)}
            customInput={
              <Input borderColor="gray.300" bg="white" fontSize="sm" />
            }
          />
        </VStack>

        <VStack alignItems="left">
          <TextMedium color="#2f80ed">Day</TextMedium>
          <Select
            placeholder="Select Day"
            value={inputValues.day}
            onChange={(e) => handleInputChange("day", e.target.value)}
          >
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </Select>
        </VStack>
      </HStack>
      <HStack alignItems={"center"} justifyItems={"center"} gap={2} mt={4}>
        <VStack alignItems="left">
          <TextMedium color="#2f80ed">Time</TextMedium>
          <ReactDatePicker
            // placeholderText="Time"
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            customInput={
              <Input borderColor="gray.300" bg="white" fontSize="sm" />
            }
            dateFormat="h:mm aa"
            selected={inputValues.time}
            onChange={(time) => handleInputChange("time", time)}
          />
        </VStack>

        <VStack alignItems="left" w="full">
          <TextMedium color="#2f80ed">Venue</TextMedium>
          <Input
            borderColor="gray.300"
            bg="white"
            fontSize="sm"
            size="md"
            value={inputValues.venue}
            onChange={(e) => handleInputChange("venue", e.target.value)}
            placeholder="Venue Name"
          />
        </VStack>
      </HStack>

      <HStack mt={6} alignItems="center" justifyContent="end">
        <Button
          isDisabled={
            inputValues.date &&
            inputValues.day &&
            inputValues.time &&
            inputValues.venue
              ? false
              : true
          }
          onClick={handleSubmit}
        >
          Save
        </Button>
      </HStack>
    </Modal>
  );
};

export default TeamsCardModal;
