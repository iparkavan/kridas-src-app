import {
  Box,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  Stack,
} from "@chakra-ui/react";
import ReactDatePicker from "react-datepicker";

import { FilterIcon } from "../../ui/icons";
import LabelText from "../../ui/text/label-text";

const FixturesFilterPopover = ({
  fixturesFilter,
  handleFixturesFilter,
  participantList,
  areFiltersApplied,
}) => {
  const { fixtureDate, teamName } = fixturesFilter;

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          colorScheme={areFiltersApplied ? "primary" : "gray"}
          icon={<FilterIcon />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Stack p={4}>
            <Box>
              <LabelText mb={1}>Date</LabelText>
              <ReactDatePicker
                dateFormat="dd/MM/yyyy"
                customInput={<Input borderColor="gray.300" />}
                placeholderText="Date"
                selected={fixtureDate}
                onChange={(val) => handleFixturesFilter("fixtureDate", val)}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </Box>
            <Box>
              <LabelText mb={1}>Team Name</LabelText>
              <Select
                placeholder="Select Team"
                value={teamName}
                onChange={(e) =>
                  handleFixturesFilter("teamName", e.target.value)
                }
              >
                {participantList.map((participant) => (
                  <option
                    key={participant.reg_id}
                    value={participant.participant_name}
                  >
                    {participant.participant_name}
                  </option>
                ))}
              </Select>
            </Box>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FixturesFilterPopover;
