import { useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Select,
  Spacer,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import ReactDatePicker from "react-datepicker";
import ReactSelect from "react-select";

import Button from "../../ui/button";
import { HeadingSmall } from "../../ui/heading/heading";
import LabelText from "../../ui/text/label-text";

export default function MobileResponceFilter(props) {
  const {
    sportsData,
    setSportIds,
    participantCategories,
    setParticipantCategory,
    setStartDate,
    setEndDate,
    DatePickerInput,
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sportsIdFilter, setSportsIdFilter] = useState();
  const [participantCategoryFilter, setParticipantCategoryFilter] = useState();
  const [startDateFilter, setStartDateFilter] = useState();
  const [endDateFilter, setEndDateFilter] = useState();

  const MultiSelectSports = (props) => {
    return (
      <ReactSelect
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 999 }),
        }}
        {...props}
        options={sportsData}
      />
    );
  };

  const clearFilters = () => {
    setSportsIdFilter(null);
    setParticipantCategoryFilter("");
    setStartDateFilter(null);
    setEndDateFilter(null);
    setSportIds(null);
    setParticipantCategory(null);
    setStartDate(null);
    setEndDate(null);
  };

  const applyFilters = () => {
    setSportIds(sportsIdFilter);
    setParticipantCategory(participantCategoryFilter);
    setStartDate(startDateFilter);
    setEndDate(endDateFilter);
    onClose();
  };

  return (
    <>
      <Button variant="outline" onClick={onOpen}>
        Filter
      </Button>
      <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex align="flex-start" w="full">
              <HeadingSmall>Filters</HeadingSmall>
              <Spacer />
              <Tooltip label="Clear Filters">
                <CloseIcon
                  onClick={onClose}
                  fontSize="10px"
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="flex-start" spacing={4} w="full">
              <Box w="full">
                <LabelText mb={1}>Sports</LabelText>
                <MultiSelectSports
                  fontSize="sm"
                  placeholder="Select Sport"
                  value={sportsIdFilter}
                  options={sportsData}
                  onChange={(value) => {
                    setSportsIdFilter(value);
                  }}
                />
              </Box>

              <Box w="full">
                <LabelText mb={1}>Participant Category</LabelText>
                <Select
                  fontSize="sm"
                  placeholder="Select Participant Category"
                  colorScheme="primary.600"
                  maxW="xs"
                  value={participantCategoryFilter}
                  onChange={(e) => setParticipantCategoryFilter(e.target.value)}
                >
                  {participantCategories?.map((category) => (
                    <option
                      key={category["category_id"]}
                      value={category["category_id"]}
                    >
                      {category["category_name"]}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <LabelText mb={1}>Custom Date</LabelText>
                <HStack spacing={5}>
                  <ReactDatePicker
                    dateFormat="dd/MM/yyyy"
                    customInput={<DatePickerInput />}
                    placeholderText="Start Date"
                    name="start Date"
                    selected={startDateFilter}
                    onChange={(val) => setStartDateFilter(val)}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                  <ReactDatePicker
                    dateFormat="dd/MM/yyyy"
                    customInput={<DatePickerInput />}
                    placeholderText="End Date"
                    name="end Date"
                    selected={endDateFilter}
                    onChange={(val) => setEndDateFilter(val)}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </HStack>
              </Box>
              <ButtonGroup alignSelf="flex-end" spacing={4}>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </ButtonGroup>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
