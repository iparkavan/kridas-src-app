import { useEffect, useState } from "react";
import {
  Box,
  ButtonGroup,
  Input,
  ModalFooter,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import PhoneInput, { formatPhoneNumberIntl } from "react-phone-number-input";
import ReactDatePicker from "react-datepicker";
import Button from "../../ui/button";
import Modal from "../../ui/modal";
import { useSports } from "../../../hooks/sports-hooks";
import { useChildPages } from "../../../hooks/page-hooks";

function PlayersFilter(props) {
  const { isOpen, onClose, pageData, filters, setFilters, isParentPage } =
    props;
  const [localFilters, setLocalFilters] = useState(filters);

  const { data: childPages } = useChildPages({
    company_id: pageData?.["company_id"],
    type: "TEA",
  });

  const { data: sportsData = [] } = useSports({
    select: (data) => {
      return data.filter((sport) =>
        pageData?.["sports_interested"]?.includes(sport["sports_id"])
      );
    },
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleChange = (e) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactNo = (value) => {
    setLocalFilters({
      ...localFilters,
      contact_number: formatPhoneNumberIntl(value),
    });
  };

  const handleDob = (value) => {
    setLocalFilters({
      ...localFilters,
      user_dob: value,
    });
  };

  // const handleClose = () => {
  //   setFilters((prevFilters) => {
  //     Object.keys(prevFilters).forEach((key) => {
  //       if (
  //         key !== "parent_company_id" &&
  //         key !== "child_company_id" &&
  //         key !== "full_name"
  //       ) {
  //         prevFilters[key] = "";
  //       }
  //     });
  //     return prevFilters;
  //   });
  //   onClose();
  // };

  const handleFilter = () => {
    setFilters(localFilters);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Players" size="2xl">
      <SimpleGrid columns={2} spacing={10}>
        {isParentPage && (
          <Select
            placeholder="Sports"
            name="sports_id"
            value={localFilters.sports_id}
            onChange={handleChange}
          >
            {sportsData?.map((sport) => (
              <option key={sport["sports_id"]} value={sport["sports_id"]}>
                {sport["sports_name"]}
              </option>
            ))}
          </Select>
        )}
        <Input
          placeholder="Player ID"
          name="player_id"
          value={localFilters.player_id}
          onChange={handleChange}
        />
        <Input
          placeholder="First Name"
          name="first_name"
          value={localFilters.first_name}
          onChange={handleChange}
        />
        <Input
          placeholder="Last Name"
          name="last_name"
          value={localFilters.last_name}
          onChange={handleChange}
        />
        <Input
          type="email"
          placeholder="Email"
          name="email_id"
          value={localFilters.email_id}
          onChange={handleChange}
        />
        <PhoneInput
          placeholder="Contact Number"
          name="contact_number"
          value={localFilters.contact_number}
          onChange={handleContactNo}
          inputComponent={Input}
          international
        />
        <Box>
          <ReactDatePicker
            dateFormat="dd/MM/yyyy"
            customInput={<Input />}
            placeholderText="Date of Birth"
            name="user_dob"
            selected={localFilters.user_dob}
            onChange={handleDob}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </Box>
        {isParentPage && (
          <Select
            placeholder="Team Name"
            name="team_name"
            value={localFilters.team_name}
            onChange={handleChange}
          >
            {childPages
              // ?.filter((childPage) =>
              //   Boolean(
              //     childPage.category_arr.find(
              //       (cat) => cat.category_type === "TEA"
              //     )
              //   )
              // )
              ?.map((childPage) => (
                <option
                  key={childPage.company_id}
                  value={childPage.company_name}
                >
                  {childPage.company_name}
                </option>
              ))}
          </Select>
        )}
      </SimpleGrid>
      <ModalFooter p={0} mt={5}>
        <ButtonGroup spacing={3}>
          {/* <Button variant="outline" onClick={handleClose}>
            Clear Filters
          </Button> */}
          <Button onClick={handleFilter}>Apply Filters</Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
}

export default PlayersFilter;
