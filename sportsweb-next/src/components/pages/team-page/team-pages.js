import { useState } from "react";
import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from "@chakra-ui/react";
import Button from "../../ui/button";
import CreateTeamPage from "./create-team-page";
import ChildPagesList from "../child-pages-list";
import { SearchIcon, FilterIcon } from "../../ui/icons";
import TeamsFilter from "./teams-filter";

function TeamPages(props) {
  const { pageData, currentPage, isParentPage, isChildPage } = props;
  const {
    isOpen: isCreateTeamOpen,
    onOpen: onCreateTeamOpen,
    onClose: onCreateTeamClose,
  } = useDisclosure();
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  const initialFilters = {
    sports_id: "",
    gender: "",
    age_group: "",
    skill_level: "",
    name: "",
    ...(isParentPage && { parent_company_id: pageData?.company_id }),
    // ...(isChildPage && { child_company_id: pageData?.company_id }),
  };

  const [filters, setFilters] = useState(initialFilters);

  const areFiltersApplied = Object.keys(filters).some(
    (key) =>
      key !== "parent_company_id" &&
      key !== "child_company_id" &&
      key !== "name" &&
      filters[key]
  );

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <Box bg="white" p={6} borderRadius="lg">
      <HStack mb={5} justifyContent="space-between">
        {currentPage && !isChildPage && (
          <>
            <Button onClick={onCreateTeamOpen}>Create Team</Button>
            <CreateTeamPage
              isOpen={isCreateTeamOpen}
              onClose={onCreateTeamClose}
              pageData={pageData}
            />
          </>
        )}

        <TeamsFilter
          isOpen={isFilterOpen}
          onClose={onFilterClose}
          pageData={pageData}
          filters={filters}
          setFilters={setFilters}
        />

        <HStack ml="auto" spacing={3}>
          <InputGroup maxW="250px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input
              input
              type="search"
              placeholder="Search Team"
              name="name"
              value={filters.name}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  name: e.target.value,
                });
              }}
            />
          </InputGroup>
          <Button
            leftIcon={<FilterIcon />}
            variant={areFiltersApplied ? "solid" : "outline"}
            onClick={onFilterOpen}
          >
            Filter
          </Button>
          {areFiltersApplied && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </HStack>
      </HStack>
      <ChildPagesList pageData={pageData} type="team" filters={filters} />
    </Box>
  );
}

export default TeamPages;
