import { useState } from "react";
import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import Button from "../../ui/button";
import CreateAcademyPage from "./create-academy-page";
import ChildPagesList from "../child-pages-list";
import { SearchIcon } from "../../ui/icons";
import { useSports } from "../../../hooks/sports-hooks";

function AcademyPages(props) {
  const { pageData, currentPage, isChildPage } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: sportsData = [] } = useSports({
    select: (data) => {
      return data.filter((sport) =>
        pageData?.["sports_interested"]?.includes(sport["sports_id"])
      );
    },
  });

  const [filters, setFilters] = useState({
    name: "",
    sports_id: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box bg="white" p={6} borderRadius="lg">
      <HStack mb={5} justifyContent="space-between">
        {currentPage && !isChildPage && (
          <>
            <Button onClick={onOpen}>Create Academy</Button>
            <CreateAcademyPage
              isOpen={isOpen}
              onClose={onClose}
              pageData={pageData}
            />
          </>
        )}

        <HStack ml="auto" spacing={3}>
          <InputGroup maxW="250px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input
              input
              type="search"
              placeholder="Search Academy"
              name="name"
              value={filters.name}
              onChange={handleChange}
            />
          </InputGroup>
          <Select
            placeholder="Sports"
            name="sports_id"
            value={filters.sports_id}
            onChange={handleChange}
          >
            {sportsData?.map((sport) => (
              <option key={sport["sports_id"]} value={sport["sports_id"]}>
                {sport["sports_name"]}
              </option>
            ))}
          </Select>
        </HStack>
      </HStack>
      <ChildPagesList pageData={pageData} type="academy" filters={filters} />
    </Box>
  );
}

export default AcademyPages;
